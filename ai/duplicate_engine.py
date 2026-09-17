"""
duplicate_engine.py

Persistent, composite duplicate/similar-problem detection for the submission
pipeline. Text similarity alone misses real duplicates ("citizens can't
dispose of garbage" vs "Ward 23 waste bins overflowing" don't share many
words) and false-flags unrelated ones that happen to use similar phrasing --
so this combines five independent signals into one composite score:

    semantic         45%   cosine similarity of sentence embeddings
    location         20%   district/block/village or geographic proximity
    domain           15%   same problem category
    affected_area    10%   overlap in who/where is affected
    characteristics  10%   overlap in required capabilities + problem nature

Three tiers, matching the product decision that AI recommends but does not
make the final call:
    >= BLOCK_THRESHOLD (0.90)    "block"   -- created, but routed to
                                              DUPLICATE_REJECTED, never enters
                                              the government review queue
    >= WARNING_THRESHOLD (0.60)  "warning" -- created normally, flagged
                                              POTENTIAL_DUPLICATE for a human
                                              (government) to resolve
    below WARNING_THRESHOLD      "normal"  -- created normally, no flag

Embeddings are cached per-problem in SQLite (problem_embeddings) so repeat
checks don't re-embed the whole corpus -- this is the "persistent similarity
database" the pipeline needs, sized for this app's actual data volume (tens
to low thousands of problems), where brute-force cosine over the cached
vectors is simpler and just as fast as standing up a vector index.

Connects to:
    - embeddings.py (shared sentence-transformer model)
    - problem_storage.py (problem_embeddings / problem_similarities tables)
    - api.py (POST /problems/check-duplicates, POST /problems)
"""

import logging
import math
import re
import threading
from typing import Any, Dict, List, Optional

import numpy as np

from embeddings import EMBEDDING_MODEL_NAME, get_embedding
from problem_storage import (
    DUPLICATE_CHECK_EXCLUDED_STATUSES,
    ProblemInDB,
    get_problem_embedding,
    list_problems,
    save_problem_embedding,
    save_problem_similarity,
)

logger = logging.getLogger(__name__)

BLOCK_THRESHOLD = 0.90
WARNING_THRESHOLD = 0.60

WEIGHTS = {
    "semantic": 0.45,
    "location": 0.20,
    "domain": 0.15,
    "affected_area": 0.10,
    "characteristics": 0.10,
}

# Guards the "search existing problems, then decide, then create" sequence in
# api.py's create_problem_endpoint so two near-simultaneous submissions can't
# both see "no duplicate" and both get created. This is a single-process
# guard (fine for this app's one-worker deployment) -- a multi-process
# deployment would need a real DB-level lock (e.g. a Postgres advisory lock)
# instead, per the same principle.
SUBMISSION_LOCK = threading.Lock()


def _tokenize(text: str) -> set:
    return set(re.findall(r"[a-z0-9]+", (text or "").lower()))


def _normalize_location_text(text: str) -> str:
    """Strips everything but letters/digits, so "Shivaji Nagar" and "Shivajinagar" --
    the same place, just formatted differently -- compare equal."""
    return re.sub(r"[^a-z0-9]", "", (text or "").lower())


# problem_structurer.py fills the "Affected Area / Location" field with these when it can't
# actually find a place in the report (and always does when the Gemini key is unusable and it
# falls back to heuristics). They name no real location, so treating them as one would score
# a genuine match as a confirmed *mismatch* -- worse than having no location at all.
_PLACEHOLDER_LOCATIONS = {
    _normalize_location_text(text)
    for text in (
        "Local community / area mentioned in report",
        "Locality as reported",
        "Location not specified",
        "Not specified",
        "Unknown",
    )
}

# Words that name a kind of place rather than a specific one -- "Road"/"Nagar" alone can't
# confirm two reports mean the same spot, so they're ignored when matching loosely.
_GENERIC_LOCATION_WORDS = {
    "road", "ward", "area", "near", "village", "locality", "nagar", "street", "lane",
    "colony", "sector", "block", "district", "city", "town", "local", "community",
    "region", "zone", "society", "market", "station", "junction", "chowk",
}


def _meaningful_location(text: Optional[str]) -> str:
    """The free-text location, or "" when it's blank or one of the structurer's placeholders."""
    cleaned = (text or "").strip()
    return "" if _normalize_location_text(cleaned) in _PLACEHOLDER_LOCATIONS else cleaned


def _location_named_in_text(location: str, fields: Dict[str, Any]) -> float:
    """How strongly `location` is named in the other report's own text (0..1).

    Citizens don't fill these forms consistently: one writes "Shivaji Nagar" in the location
    field, the other only says it in the description. Same place either way, so a location
    only has to appear *somewhere* on the other side to count.
    """
    normalized = _normalize_location_text(location)
    if len(normalized) < 4:
        return 0.0
    haystack = _normalize_location_text(
        " ".join(str(fields.get(key) or "") for key in ("title", "problem_text", "description"))
    )
    if not haystack:
        return 0.0
    if normalized in haystack:
        return 1.0
    distinctive = [t for t in _tokenize(location) if len(t) >= 4 and t not in _GENERIC_LOCATION_WORDS]
    if not distinctive:
        return 0.0
    return sum(1 for token in distinctive if token in haystack) / len(distinctive)


def _jaccard(a: set, b: set) -> float:
    if not a and not b:
        return 0.0
    union = a | b
    return len(a & b) / len(union) if union else 0.0


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(min(1.0, math.sqrt(a)))


def _build_text(fields: Dict[str, Any]) -> str:
    # `location` is the free-text field the citizen-facing form actually collects (e.g.
    # "MG Road near the bus stop") -- district/block/village below are structured fields
    # that form never populates, so a shared street/landmark name would otherwise be
    # completely invisible to the detector unless it's folded into the embedded text too.
    parts = [
        fields.get("title") or "",
        fields.get("problem_text") or fields.get("description") or "",
        fields.get("location") or "",
    ]
    return ". ".join(p for p in parts if p) or "untitled problem"


def _problem_fields(problem: ProblemInDB) -> Dict[str, Any]:
    """Adapts a stored ProblemInDB to the same plain-dict shape duplicate_check()
    takes for a not-yet-created submission, so both sides of a comparison
    are scored identically."""
    return {
        "title": problem.title,
        "problem_text": problem.problem_text,
        "description": problem.description,
        "category": problem.category,
        "location": problem.location,
        "district": problem.district,
        "block": problem.block,
        "village": problem.village,
        "latitude": problem.latitude,
        "longitude": problem.longitude,
        "affected_population": problem.affected_population,
        "required_capabilities": problem.required_capabilities,
        "problem_nature": problem.problem_nature,
    }


def _location_score(a: Dict[str, Any], b: Dict[str, Any]) -> tuple:
    """Returns (score, reasons, available). `available` is False only when there's no
    comparable location data on BOTH sides -- a missing field means "we don't know",
    not "confirmed different", so it must not drag the composite score down (see
    compute_similarity, which excludes and reweights unavailable components rather
    than silently scoring them 0 -- otherwise an ordinary duplicate whose form simply
    left a field blank could never be caught)."""
    lat_a, lon_a, lat_b, lon_b = a.get("latitude"), a.get("longitude"), b.get("latitude"), b.get("longitude")
    if None not in (lat_a, lon_a, lat_b, lon_b):
        distance_km = _haversine_km(lat_a, lon_a, lat_b, lon_b)
        score = max(0.0, 1.0 - min(distance_km / 5.0, 1.0))  # ~5km treated as "not the same place"
        return score, ([f"~{distance_km:.1f} km apart"] if score > 0 else []), True

    village_a, village_b = (a.get("village") or "").strip().lower(), (b.get("village") or "").strip().lower()
    if village_a and village_b:
        return (1.0, [f"Same village/area: {a.get('village')}"], True) if village_a == village_b else (0.0, [], True)

    block_a, block_b = (a.get("block") or "").strip().lower(), (b.get("block") or "").strip().lower()
    if block_a and block_b:
        return (0.7, [f"Same block: {a.get('block')}"], True) if block_a == block_b else (0.0, [], True)

    district_a, district_b = (a.get("district") or "").strip().lower(), (b.get("district") or "").strip().lower()
    if district_a and district_b:
        return (0.4, [f"Same district: {a.get('district')}"], True) if district_a == district_b else (0.0, [], True)

    # Fallback: the citizen-facing form never populates village/block/district -- it only
    # ever collects one free-text "Affected Area / Location" field (Problem.location). Without
    # this, two reports naming the exact same place (just formatted differently, e.g.
    # "Shivaji Nagar" vs "Shivajinagar") would count as "no location data available" and
    # silently lose the entire 20% location weight -- even though a human reading both would
    # call the shared place the single strongest confirming signal.
    loc_a, loc_b = _meaningful_location(a.get("location")), _meaningful_location(b.get("location"))

    if loc_a and loc_b:
        if _normalize_location_text(loc_a) == _normalize_location_text(loc_b):
            return 1.0, [f"Same area: {loc_a}"], True
        # Either report may spell the place differently, or name the other's place only in its
        # text, so take the strongest evidence any of those comparisons gives.
        score = max(
            _jaccard(_tokenize(loc_a), _tokenize(loc_b)),
            _location_named_in_text(loc_a, b),
            _location_named_in_text(loc_b, a),
        )
        if score >= 0.99:
            return score, [f"Same area: {loc_a}"], True
        return score, ([f"Overlapping area: {loc_a} / {loc_b}"] if score >= 0.3 else []), True

    # Only one side named a place. It still counts if the other report says it in its own
    # text -- but if it doesn't, that's "we don't know", not "different place", so the whole
    # location component is left out rather than scored zero (see the docstring above).
    lone_location = loc_a or loc_b
    if lone_location:
        score = _location_named_in_text(lone_location, b if loc_a else a)
        if score >= 0.99:
            return score, [f"Same area: {lone_location} (named in both reports)"], True
        if score >= 0.3:
            return score, [f"Overlapping area: {lone_location} (partly named in both reports)"], True
        return 0.0, [], False

    return 0.0, [], False


def _domain_score(a: Dict[str, Any], b: Dict[str, Any]) -> tuple:
    cat_a, cat_b = (a.get("category") or "").strip().lower(), (b.get("category") or "").strip().lower()
    if not cat_a or not cat_b:
        return 0.0, [], False
    return (1.0, [f"Same category: {a.get('category')}"], True) if cat_a == cat_b else (0.0, [], True)


def _affected_area_score(a: Dict[str, Any], b: Dict[str, Any]) -> tuple:
    tokens_a, tokens_b = _tokenize(a.get("affected_population")), _tokenize(b.get("affected_population"))
    if not tokens_a or not tokens_b:
        return 0.0, [], False
    score = _jaccard(tokens_a, tokens_b)
    return score, (["Overlapping description of who/where is affected"] if score >= 0.3 else []), True


def _characteristics_score(a: Dict[str, Any], b: Dict[str, Any]) -> tuple:
    caps_a = {c.strip().lower() for c in (a.get("required_capabilities") or []) if c and c.strip()}
    caps_b = {c.strip().lower() for c in (b.get("required_capabilities") or []) if c and c.strip()}
    nature_a, nature_b = a.get("problem_nature"), b.get("problem_nature")

    has_caps = bool(caps_a and caps_b)
    has_nature = bool(nature_a and nature_b)
    if not has_caps and not has_nature:
        return 0.0, [], False

    cap_score = _jaccard(caps_a, caps_b) if has_caps else None
    nature_score = (1.0 if nature_a == nature_b else 0.0) if has_nature else None
    if cap_score is not None and nature_score is not None:
        score = 0.7 * cap_score + 0.3 * nature_score
    else:
        score = cap_score if cap_score is not None else nature_score

    reasons = []
    if cap_score is not None and cap_score >= 0.3:
        reasons.append(f"Similar required capabilities: {', '.join(sorted(caps_a & caps_b))}")
    if nature_score:
        reasons.append(f"Same problem nature: {nature_a}")
    return score, reasons, True


def compute_similarity(a: Dict[str, Any], b: Dict[str, Any], embedding_a: np.ndarray, embedding_b: np.ndarray) -> Dict[str, Any]:
    """Composite score for one pair, both sides given as plain dicts (see _problem_fields).

    Semantic similarity always counts (there's always text). The other four signals are
    weighted in only when there's actually something to compare on both sides -- a
    component with no data isn't scored as "0% match", it's left out and the remaining
    signals' weights are renormalized to fill the gap. Without this, two genuinely
    identical submissions that both simply left an optional field blank (very common --
    affected_population and required_capabilities aren't always filled in) would be
    structurally incapable of ever reaching the block threshold, no matter how obviously
    duplicate the actual text is.
    """
    semantic = max(0.0, min(1.0, float(np.dot(embedding_a, embedding_b))))
    location, location_reasons, location_avail = _location_score(a, b)
    domain, domain_reasons, domain_avail = _domain_score(a, b)
    affected_area, affected_reasons, affected_avail = _affected_area_score(a, b)
    characteristics, characteristics_reasons, characteristics_avail = _characteristics_score(a, b)

    weighted_sum = WEIGHTS["semantic"] * semantic
    weight_total = WEIGHTS["semantic"]
    for value, available, key in (
        (location, location_avail, "location"),
        (domain, domain_avail, "domain"),
        (affected_area, affected_avail, "affected_area"),
        (characteristics, characteristics_avail, "characteristics"),
    ):
        if available:
            weighted_sum += WEIGHTS[key] * value
            weight_total += WEIGHTS[key]
    overall = round(min(1.0, max(0.0, weighted_sum / weight_total)), 4)

    reasons = []
    if semantic >= 0.75:
        reasons.append(f"High semantic similarity ({semantic * 100:.0f}%)")
    elif semantic >= 0.5:
        reasons.append(f"Moderate semantic similarity ({semantic * 100:.0f}%)")
    reasons += domain_reasons + location_reasons + affected_reasons + characteristics_reasons
    if not reasons:
        reasons.append("Weak overall match; only marginal similarity found")

    # Per-component scores stay plain floats (0.0, never None) so they persist cleanly into the
    # NOT NULL similarity-audit columns; `unavailable` separately tells a reader (e.g. the
    # government dashboard) which of those 0.0s mean "confirmed no match" vs. "not compared,
    # because one or both reports didn't provide that information".
    unavailable = [
        key for key, available in (
            ("location", location_avail), ("domain", domain_avail),
            ("affected_area", affected_avail), ("characteristics", characteristics_avail),
        ) if not available
    ]

    return {
        "semantic": round(semantic, 4),
        "location": round(location, 4),
        "domain": round(domain, 4),
        "affected_area": round(affected_area, 4),
        "characteristics": round(characteristics, 4),
        "overall": overall,
        "reasons": reasons,
        "unavailable": unavailable,
    }


def classify_tier(score: float) -> str:
    if score >= BLOCK_THRESHOLD:
        return "block"
    if score >= WARNING_THRESHOLD:
        return "warning"
    return "normal"


def _ensure_embedding(problem: ProblemInDB) -> np.ndarray:
    """Cached per-problem embedding; computed and persisted once, then reused by
    every future check. Backfills problems created before this pipeline existed."""
    cached = get_problem_embedding(problem.id)
    if cached is not None:
        return np.asarray(cached, dtype=np.float32)
    vector = get_embedding(_build_text(_problem_fields(problem)))
    save_problem_embedding(problem.id, vector.tolist(), EMBEDDING_MODEL_NAME)
    return vector


def duplicate_check(
    fields: Dict[str, Any],
    exclude_problem_id: Optional[str] = None,
    top_n: int = 5,
    persist_similarities_for: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Runs the full pipeline for one (not-yet-decided) submission against every
    eligible existing problem: `fields` is a plain dict with the same keys as
    _problem_fields() produces (title, problem_text, category, district,
    block, village, latitude, longitude, affected_population,
    required_capabilities, problem_nature).

    `persist_similarities_for`: if given (an already-created problem's id),
    every comparison made is written to problem_similarities as an audit
    trail -- used at actual creation time, not for the advisory pre-check.

    Returns {"tier": "block"|"warning"|"normal", "best_match": {...} | None,
    "candidates": [...]} where each candidate carries the full score
    breakdown and the target problem's id/title/status.
    """
    try:
        new_text = _build_text(fields)
        if not new_text.strip():
            return {"tier": "normal", "best_match": None, "candidates": []}
        new_embedding = get_embedding(new_text)

        candidates = [
            p for p in list_problems(limit=2000)
            if p.id != exclude_problem_id and p.status not in DUPLICATE_CHECK_EXCLUDED_STATUSES
        ]

        scored = []
        for candidate in candidates:
            candidate_embedding = _ensure_embedding(candidate)
            breakdown = compute_similarity(fields, _problem_fields(candidate), new_embedding, candidate_embedding)
            tier = classify_tier(breakdown["overall"])
            if persist_similarities_for:
                save_problem_similarity(persist_similarities_for, candidate.id, breakdown, tier)
            scored.append({
                "problem_id": candidate.id,
                "title": candidate.title or candidate.problem_text,
                "status": candidate.status,
                "citizen_name": candidate.citizen_name,
                "supporters": candidate.supporters,
                **breakdown,
            })

        scored.sort(key=lambda r: r["overall"], reverse=True)
        top = scored[:top_n]
        best = top[0] if top else None
        tier = classify_tier(best["overall"]) if best else "normal"

        return {"tier": tier, "best_match": best, "candidates": top}

    except Exception as e:
        logger.exception("Duplicate check failed: %s", e)
        # Fail open: never let a broken similarity check block a real submission.
        return {"tier": "normal", "best_match": None, "candidates": [], "error": str(e)}
