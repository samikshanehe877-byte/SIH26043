"""
university_matcher.py

Hybrid university matcher for SIH26043.

Combines:
    1. Domain relevance
    2. Subdomain relevance
    3. Semantic similarity (all-MiniLM-L6-v2)
    4. Expertise keyword overlap
    5. Capability keyword overlap
    6. Optional facilities overlap
    7. Optional geographic proximity

IMPORTANT:
    Cosine similarity is treated as ONE signal, not a probability.
    Final "score" is a weighted composite in [0, 1], with qualitative
    match_level labels (HIGH / MEDIUM / LOW).

Public function:
    match_universities(problem_text, domain, subdomain, top_k=3,
                        latitude=None, longitude=None)

Connects to:
    - data/universities.json
    - ai_pipeline.py
    - app.py
"""

import json
import logging
import math
import os
from typing import List, Dict, Optional

from sentence_transformers import SentenceTransformer, util

logger = logging.getLogger(__name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "universities.json")

WEIGHTS = {
    "domain": 0.30,
    "subdomain": 0.20,
    "semantic": 0.20,
    "expertise": 0.15,
    "capabilities": 0.10,
    "facilities": 0.03,
    "geo": 0.02,
}

_model = None
_institutions_cache = None
_embedding_cache = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def _load_institutions() -> List[Dict]:
    global _institutions_cache
    if _institutions_cache is None:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            raw = json.load(f)
        _institutions_cache = raw.get("institutions", [])
    return _institutions_cache


def _build_profile_text(inst: Dict) -> str:
    parts = [
        inst.get("name", ""),
        inst.get("type", ""),
        " ".join(inst.get("expertise", [])),
        " ".join(inst.get("departments", [])),
        " ".join(inst.get("research_areas", [])),
        " ".join(inst.get("capabilities", [])),
    ]
    return ". ".join(p for p in parts if p)


def _get_embeddings(institutions: List[Dict]):
    global _embedding_cache
    if _embedding_cache is None:
        model = _get_model()
        texts = [_build_profile_text(inst) for inst in institutions]
        _embedding_cache = model.encode(texts, convert_to_tensor=True)
    return _embedding_cache


def _keyword_overlap_score(problem_text: str, keywords: List[str]):
    if not keywords:
        return 0.0, []
    text_lower = problem_text.lower()
    matched = [kw for kw in keywords if kw.lower() in text_lower]
    score = len(matched) / len(keywords)
    return min(score, 1.0), matched


def _domain_score(inst: Dict, domain: str, subdomain: str):
    domain_l = (domain or "").lower()
    subdomain_l = (subdomain or "").lower()

    expertise_text = " ".join(inst.get("expertise", [])).lower()
    dept_text = " ".join(inst.get("departments", [])).lower()
    research_text = " ".join(inst.get("research_areas", [])).lower()
    combined = f"{expertise_text} {dept_text} {research_text}"

    domain_score = 1.0 if domain_l and domain_l in combined else (
        0.5 if domain_l and any(word in combined for word in domain_l.split()) else 0.0
    )
    subdomain_score = 1.0 if subdomain_l and subdomain_l in combined else (
        0.5 if subdomain_l and any(word in combined for word in subdomain_l.split()) else 0.0
    )
    return domain_score, subdomain_score


def _geo_score(inst: Dict, latitude: Optional[float], longitude: Optional[float]) -> float:
    if latitude is None or longitude is None:
        return 0.0
    inst_lat = inst.get("latitude")
    inst_lon = inst.get("longitude")
    if inst_lat is None or inst_lon is None:
        return 0.0
    dist = math.sqrt((inst_lat - latitude) ** 2 + (inst_lon - longitude) ** 2)
    return max(0.0, 1.0 - min(dist / 2.0, 1.0))


def _match_level(score: float) -> str:
    if score >= 0.70:
        return "HIGH"
    if score >= 0.50:
        return "MEDIUM"
    return "LOW"


def match_universities(
    problem_text: str,
    domain: str,
    subdomain: str,
    top_k: int = 3,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
) -> List[Dict]:
    try:
        institutions = _load_institutions()
        if not institutions:
            return []

        embeddings = _get_embeddings(institutions)
        model = _get_model()
        problem_embedding = model.encode(problem_text, convert_to_tensor=True)
        semantic_scores = util.cos_sim(problem_embedding, embeddings)[0].tolist()

        results = []
        for idx, inst in enumerate(institutions):
            domain_s, subdomain_s = _domain_score(inst, domain, subdomain)
            semantic_s = max(0.0, min(1.0, semantic_scores[idx]))
            expertise_s, expertise_hits = _keyword_overlap_score(problem_text, inst.get("expertise", []))
            capability_s, capability_hits = _keyword_overlap_score(problem_text, inst.get("capabilities", []))
            facility_s, facility_hits = _keyword_overlap_score(problem_text, inst.get("facilities", []))
            geo_s = _geo_score(inst, latitude, longitude)

            composite = (
                WEIGHTS["domain"] * domain_s
                + WEIGHTS["subdomain"] * subdomain_s
                + WEIGHTS["semantic"] * semantic_s
                + WEIGHTS["expertise"] * expertise_s
                + WEIGHTS["capabilities"] * capability_s
                + WEIGHTS["facilities"] * facility_s
                + WEIGHTS["geo"] * geo_s
            )
            composite = round(min(1.0, max(0.0, composite)), 3)

            reasons = []
            if domain_s > 0:
                reasons.append(f"Domain relevance to '{domain}'")
            if subdomain_s > 0:
                reasons.append(f"Subdomain relevance to '{subdomain}'")
            if expertise_hits:
                reasons.append(f"Expertise overlap: {', '.join(expertise_hits)}")
            if capability_hits:
                reasons.append(f"Capability overlap: {', '.join(capability_hits)}")
            if facility_hits:
                reasons.append(f"Facility overlap: {', '.join(facility_hits)}")
            if geo_s > 0:
                reasons.append("Geographically proximate")
            if not reasons:
                reasons.append("Weak overall match; based mainly on general semantic similarity")

            results.append({
                "id": inst.get("id"),
                "name": inst.get("name"),
                "score": composite,
                "match_level": _match_level(composite),
                "reasons": reasons,
                "expertise": inst.get("expertise", []),
                "capabilities": inst.get("capabilities", []),
                "data_status": inst.get("data_status", "demo"),
            })

        results.sort(key=lambda r: r["score"], reverse=True)
        return results[:top_k]

    except Exception as e:
        logger.exception("University matching failed: %s", e)
        return []
