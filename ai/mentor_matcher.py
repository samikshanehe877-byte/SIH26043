"""
mentor_matcher.py

Hybrid faculty mentor matcher for SIH26043.
Mirrors the strategy used in university_matcher.py / industry_matcher.py,
with one addition: an availability signal based on current project load,
so the pipeline doesn't keep recommending the same overloaded mentor.

Public function:
    match_mentors(problem_text, domain=None, subdomain=None,
                   university_id=None, top_k=3)

Behavior:
    - If university_id is given, mentors are scoped to that university first.
    - If that university has no mentors on file (demo data only covers a
      subset of institutions), it automatically falls back to matching
      across all mentors and flags this in the result via "scope".
    - If university_id is None, matches across all mentors.

Connects to:
    - data/mentors.json
    - university_matcher.py (supplies the university_id to scope to)
    - ai_pipeline.py
    - app.py
"""

import json
import logging
import os
from typing import List, Dict, Optional

from sentence_transformers import SentenceTransformer, util

logger = logging.getLogger(__name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "mentors.json")

WEIGHTS = {
    "expertise": 0.35,
    "semantic": 0.25,
    "research": 0.15,
    "domain": 0.10,
    "availability": 0.15,
}

_model = None
_mentors_cache = None
_embedding_cache = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def _load_mentors() -> List[Dict]:
    global _mentors_cache
    if _mentors_cache is None:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            raw = json.load(f)
        _mentors_cache = raw.get("mentors", [])
    return _mentors_cache


def _build_profile_text(m: Dict) -> str:
    parts = [
        m.get("department", ""),
        m.get("designation", ""),
        " ".join(m.get("expertise", [])),
        " ".join(m.get("research_areas", [])),
    ]
    return ". ".join(p for p in parts if p)


def _get_embeddings(mentors: List[Dict]):
    # Keyed by id list identity via module-level cache; safe here because
    # we only ever embed the full mentor roster (filtering happens after).
    global _embedding_cache
    if _embedding_cache is None:
        model = _get_model()
        texts = [_build_profile_text(m) for m in mentors]
        _embedding_cache = model.encode(texts, convert_to_tensor=True)
    return _embedding_cache


def _keyword_overlap_score(problem_text: str, keywords: List[str]):
    if not keywords:
        return 0.0, []
    text_lower = problem_text.lower()
    matched = [kw for kw in keywords if kw.lower() in text_lower]
    return min(len(matched) / len(keywords), 1.0), matched


def _domain_score(m: Dict, domain: str, subdomain: str) -> float:
    domain_l = (domain or "").lower()
    subdomain_l = (subdomain or "").lower()
    combined = f"{m.get('department', '')} {' '.join(m.get('expertise', []))} {' '.join(m.get('research_areas', []))}".lower()

    score = 0.0
    if domain_l and domain_l in combined:
        score += 0.6
    elif domain_l and any(w in combined for w in domain_l.split()):
        score += 0.3
    if subdomain_l and subdomain_l in combined:
        score += 0.4
    elif subdomain_l and any(w in combined for w in subdomain_l.split()):
        score += 0.2
    return min(score, 1.0)


def _availability_score(m: Dict) -> float:
    capacity = m.get("max_capacity")
    load = m.get("current_load")
    if capacity is None or load is None or capacity <= 0:
        return 0.5  # unknown -> neutral, don't penalize or favor
    remaining = capacity - load
    if remaining <= 0:
        return 0.0
    return min(1.0, remaining / capacity)


def _match_level(score: float) -> str:
    if score >= 0.70:
        return "HIGH"
    if score >= 0.50:
        return "MEDIUM"
    return "LOW"


def _score_mentors(
    mentors: List[Dict],
    all_mentors: List[Dict],
    problem_text: str,
    domain: Optional[str],
    subdomain: Optional[str],
) -> List[Dict]:
    """Scores `mentors` (a subset or the full list), using embeddings
    computed over `all_mentors` so cache indices stay valid."""
    embeddings = _get_embeddings(all_mentors)
    model = _get_model()
    problem_embedding = model.encode(problem_text, convert_to_tensor=True)
    semantic_scores = util.cos_sim(problem_embedding, embeddings)[0].tolist()

    id_to_index = {m.get("id"): idx for idx, m in enumerate(all_mentors)}

    results = []
    for m in mentors:
        idx = id_to_index.get(m.get("id"))
        semantic_s = max(0.0, min(1.0, semantic_scores[idx])) if idx is not None else 0.0

        expertise_s, expertise_hits = _keyword_overlap_score(problem_text, m.get("expertise", []))
        research_s, research_hits = _keyword_overlap_score(problem_text, m.get("research_areas", []))
        domain_s = _domain_score(m, domain, subdomain)
        availability_s = _availability_score(m)

        composite = (
            WEIGHTS["expertise"] * expertise_s
            + WEIGHTS["semantic"] * semantic_s
            + WEIGHTS["research"] * research_s
            + WEIGHTS["domain"] * domain_s
            + WEIGHTS["availability"] * availability_s
        )
        composite = round(min(1.0, max(0.0, composite)), 3)

        reasons = []
        if expertise_hits:
            reasons.append(f"Expertise overlap: {', '.join(expertise_hits)}")
        if research_hits:
            reasons.append(f"Research area overlap: {', '.join(research_hits)}")
        if domain_s > 0:
            reasons.append(f"Departmental relevance to '{domain}'" if domain else "Departmental relevance")
        if availability_s == 0.0:
            reasons.append("⚠️ At full project capacity")
        elif availability_s >= 0.66:
            reasons.append("Good current availability")
        if not reasons:
            reasons.append("Weak overall match; based mainly on general semantic similarity")

        capacity = m.get("max_capacity")
        load = m.get("current_load")
        availability_status = "unknown"
        if capacity is not None and load is not None:
            availability_status = "full" if load >= capacity else (
                "light" if load <= capacity / 2 else "moderate"
            )

        results.append({
            "id": m.get("id"),
            "name": m.get("name"),
            "university_id": m.get("university_id"),
            "department": m.get("department"),
            "designation": m.get("designation"),
            "score": composite,
            "match_level": _match_level(composite),
            "reasons": reasons,
            "expertise": m.get("expertise", []),
            "research_areas": m.get("research_areas", []),
            "current_load": load,
            "max_capacity": capacity,
            "availability_status": availability_status,
            "data_status": m.get("data_status", "demo"),
        })

    results.sort(key=lambda r: r["score"], reverse=True)
    return results


def match_mentors(
    problem_text: str,
    domain: Optional[str] = None,
    subdomain: Optional[str] = None,
    university_id: Optional[str] = None,
    top_k: int = 3,
) -> Dict:
    """
    Returns:
        {
            "scope": "university" | "all_mentors" | "university_fallback",
            "university_id": <the university_id actually used to scope, or None>,
            "mentors": [ ... top_k mentor match dicts ... ]
        }
    """
    try:
        all_mentors = _load_mentors()
        if not all_mentors:
            return {"scope": "all_mentors", "university_id": None, "mentors": []}

        scope = "all_mentors"
        candidates = all_mentors

        if university_id:
            scoped = [m for m in all_mentors if m.get("university_id") == university_id]
            if scoped:
                candidates = scoped
                scope = "university"
            else:
                scope = "university_fallback"  # no mentors on file for this uni yet

        scored = _score_mentors(candidates, all_mentors, problem_text, domain, subdomain)
        return {
            "scope": scope,
            "university_id": university_id,
            "mentors": scored[:top_k],
        }

    except Exception as e:
        logger.exception("Mentor matching failed: %s", e)
        return {"scope": "error", "university_id": university_id, "mentors": []}
