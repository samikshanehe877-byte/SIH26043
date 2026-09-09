"""
department_matcher.py

Closes the "department" gap flagged in chat: the frontend expects a
university's challenges to be routed to one of ITS OWN internal
departments (with a name, and a ranked primary + supporting list) --
not just to the university as a whole.

This AI module has no separate department dataset, but data/mentors.json
already tags each mentor with a `department` and `university_id`. This
module treats "the set of departments that have at least one mentor at
this university" as that university's department list, and ranks them
by how well their mentors' combined expertise/research_areas match the
problem's domain/subdomain and text -- the same keyword-overlap approach
university_matcher.py already uses, just scoped to one university's
mentor roster instead of comparing across universities.

CAVEAT: department coverage is only as complete as data/mentors.json.
A university with only 1-2 mentors on file will show only 1-2
departments, even if it has more in reality -- same "demo data" caveat
that already applies to the rest of data/mentors.json.

Public functions:
    list_departments_for_university(university_id) -> List[Dict]
    match_departments(problem_text, domain, subdomain, university_id, top_k=3) -> Dict

Connects to:
    - data/mentors.json
    - frontend_adapter.py (to_ai_department_assignment)
    - api.py (POST /analyze-for-frontend, GET /departments/{university_id})
"""

import json
import re
from typing import Dict, List, Optional

with open("data/mentors.json", "r", encoding="utf-8") as f:
    _MENTORS = json.load(f)["mentors"]


def _tokenize(text: str) -> set:
    return set(re.findall(r"[a-z0-9]+", (text or "").lower()))


def list_departments_for_university(university_id: str) -> List[Dict]:
    """
    Returns [{"id": int, "name": str}] for every distinct department that
    has at least one mentor on file at this university. IDs are stable
    (alphabetical order within the university) so the same department
    always gets the same numeric id across calls.
    """
    names = sorted({
        m["department"] for m in _MENTORS
        if m.get("university_id") == university_id and m.get("department")
    })
    return [{"id": i + 1, "name": name} for i, name in enumerate(names)]


def _department_mentors(university_id: str, department_name: str) -> List[Dict]:
    return [
        m for m in _MENTORS
        if m.get("university_id") == university_id and m.get("department") == department_name
    ]


def _department_score(mentors: List[Dict], domain: str, subdomain: str, problem_tokens: set) -> float:
    combined_text = " ".join(
        " ".join(m.get("expertise", []) + m.get("research_areas", [])) for m in mentors
    ).lower()

    domain_l = (domain or "").lower()
    subdomain_l = (subdomain or "").lower()

    domain_score = 1.0 if domain_l and domain_l in combined_text else 0.0
    subdomain_score = 1.0 if subdomain_l and subdomain_l in combined_text else 0.0

    dept_tokens = _tokenize(combined_text)
    overlap = problem_tokens & dept_tokens
    keyword_score = min(len(overlap) / 5.0, 1.0) if dept_tokens else 0.0

    # Weighted the same way university_matcher.py weights its domain vs.
    # semantic/keyword components -- domain match matters most.
    return round(0.5 * domain_score + 0.3 * subdomain_score + 0.2 * keyword_score, 4)


def match_departments(
    problem_text: str,
    domain: Optional[str],
    subdomain: Optional[str],
    university_id: str,
    top_k: int = 3,
) -> Dict:
    """
    Ranks this university's departments (per list_departments_for_university)
    against the problem, and returns:
        {
            "primary": {"id": int, "name": str, "score": float} | None,
            "supporting": [{"id", "name", "score"}, ...],  # up to top_k-1 more
        }
    Returns primary=None, supporting=[] if the university has no mentors
    on file at all (nothing to rank).
    """
    departments = list_departments_for_university(university_id)
    if not departments:
        return {"primary": None, "supporting": []}

    problem_tokens = _tokenize(problem_text)
    scored = []
    for dept in departments:
        mentors = _department_mentors(university_id, dept["name"])
        score = _department_score(mentors, domain or "", subdomain or "", problem_tokens)
        scored.append({**dept, "score": score})

    scored.sort(key=lambda d: d["score"], reverse=True)
    primary = scored[0] if scored else None
    supporting = scored[1:top_k] if len(scored) > 1 else []
    return {"primary": primary, "supporting": supporting}
