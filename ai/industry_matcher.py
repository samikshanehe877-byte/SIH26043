"""
industry_matcher.py

Hybrid industry/CSR partner matching for SIH26043.
Mirrors the strategy used in university_matcher.py.

Public function:
    match_industry_partners(problem_text, domain, subdomain, top_k=3)

Connects to:
    - data/industry_partners.json
    - ai_pipeline.py
    - app.py
"""

import json
import logging
import os
from typing import List, Dict

from sentence_transformers import SentenceTransformer, util

logger = logging.getLogger(__name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "industry_partners.json")

WEIGHTS = {
    "sector": 0.35,
    "semantic": 0.25,
    "expertise": 0.25,
    "capabilities": 0.15,
}

_model = None
_partners_cache = None
_embedding_cache = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def _load_partners() -> List[Dict]:
    global _partners_cache
    if _partners_cache is None:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            raw = json.load(f)
        _partners_cache = raw.get("partners", [])
    return _partners_cache


def _build_profile_text(p: Dict) -> str:
    parts = [
        p.get("name", ""),
        p.get("type", ""),
        " ".join(p.get("sectors", [])),
        " ".join(p.get("expertise", [])),
        " ".join(p.get("capabilities", [])),
    ]
    return ". ".join(x for x in parts if x)


def _get_embeddings(partners: List[Dict]):
    global _embedding_cache
    if _embedding_cache is None:
        model = _get_model()
        texts = [_build_profile_text(p) for p in partners]
        _embedding_cache = model.encode(texts, convert_to_tensor=True)
    return _embedding_cache


def _keyword_overlap_score(problem_text: str, keywords: List[str]):
    if not keywords:
        return 0.0, []
    text_lower = problem_text.lower()
    matched = [kw for kw in keywords if kw.lower() in text_lower]
    return min(len(matched) / len(keywords), 1.0), matched


def _sector_score(p: Dict, domain: str, subdomain: str) -> float:
    domain_l = (domain or "").lower()
    subdomain_l = (subdomain or "").lower()
    sectors_text = " ".join(p.get("sectors", [])).lower()
    score = 0.0
    if domain_l and domain_l in sectors_text:
        score += 0.6
    elif domain_l and any(w in sectors_text for w in domain_l.split()):
        score += 0.3
    if subdomain_l and subdomain_l in sectors_text:
        score += 0.4
    elif subdomain_l and any(w in sectors_text for w in subdomain_l.split()):
        score += 0.2
    return min(score, 1.0)


def _match_level(score: float) -> str:
    if score >= 0.70:
        return "HIGH"
    if score >= 0.50:
        return "MEDIUM"
    return "LOW"


def match_industry_partners(
    problem_text: str,
    domain: str,
    subdomain: str,
    top_k: int = 3,
) -> List[Dict]:
    try:
        partners = _load_partners()
        if not partners:
            return []

        embeddings = _get_embeddings(partners)
        model = _get_model()
        problem_embedding = model.encode(problem_text, convert_to_tensor=True)
        semantic_scores = util.cos_sim(problem_embedding, embeddings)[0].tolist()

        results = []
        for idx, p in enumerate(partners):
            sector_s = _sector_score(p, domain, subdomain)
            semantic_s = max(0.0, min(1.0, semantic_scores[idx]))
            expertise_s, expertise_hits = _keyword_overlap_score(problem_text, p.get("expertise", []))
            capability_s, capability_hits = _keyword_overlap_score(problem_text, p.get("capabilities", []))

            composite = (
                WEIGHTS["sector"] * sector_s
                + WEIGHTS["semantic"] * semantic_s
                + WEIGHTS["expertise"] * expertise_s
                + WEIGHTS["capabilities"] * capability_s
            )
            composite = round(min(1.0, max(0.0, composite)), 3)

            reasons = []
            if sector_s > 0:
                reasons.append(f"Sector relevance to '{domain}' / '{subdomain}'")
            if expertise_hits:
                reasons.append(f"Expertise overlap: {', '.join(expertise_hits)}")
            if capability_hits:
                reasons.append(f"Capability overlap: {', '.join(capability_hits)}")
            if not reasons:
                reasons.append("Weak overall match; based mainly on general semantic similarity")

            results.append({
                "name": p.get("name"),
                "score": composite,
                "match_level": _match_level(composite),
                "reasons": reasons,
                "support_types": p.get("support_types", []),
                "expertise": p.get("expertise", []),
                "capabilities": p.get("capabilities", []),
                "data_status": p.get("data_status", "demo"),
            })

        results.sort(key=lambda r: r["score"], reverse=True)
        return results[:top_k]

    except Exception as e:
        logger.exception("Industry matching failed: %s", e)
        return []
