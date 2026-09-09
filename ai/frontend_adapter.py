"""
frontend_adapter.py

Reshapes ai_pipeline.analyze_problem() output into the EXACT shapes your
teammate's Next.js frontend expects, per its types/problem.ts and
types/universityChallenge.ts. Without this, the frontend cannot consume
this module's output directly -- the field names, enums, and score scales
differ (see chat for the full comparison).

READ THE "OPEN QUESTIONS" SECTION AT THE BOTTOM -- several mappings here
are best-effort placeholders because the information to do them exactly
right isn't in this AI-module zip (e.g. data/taxonomy.json, which defines
the real domain names, wasn't included).

Connects to:
    - api.py (POST /analyze-for-frontend)
    - ai_pipeline.py (consumes its output)
"""

import re
from typing import Optional, Dict, Any, List

# ---------------------------------------------------------------------------
# Category mapping: AI classifier `domain` -> frontend ProblemCategory enum.
#
# ASSUMPTION: I don't have data/taxonomy.json (not included in this zip per
# README), so I can't see the exact domain strings classifier.py produces.
# This map covers the obvious cases by keyword; anything unmatched falls
# back to "Other". Once you have taxonomy.json, replace this with an exact
# 1:1 map from every taxonomy domain to one of the 9 frontend categories.
# ---------------------------------------------------------------------------
_CATEGORY_KEYWORDS = {
    "Infrastructure": ["infrastructure", "road", "building", "construction", "bridge", "civil"],
    "Environment": ["environment", "pollution", "waste", "climate", "forest"],
    "Education": ["education", "school", "literacy", "student"],
    "Healthcare": ["health", "medical", "hospital", "disease"],
    "Transportation": ["transport", "traffic", "vehicle", "signal"],
    "Public Safety": ["safety", "crime", "police", "disaster", "fire"],
    "Technology": ["technology", "digital", "software", "cyber"],
    "Water and Sanitation": ["water", "sanitation", "sewage", "drainage"],
}

_FRONTEND_CATEGORIES = list(_CATEGORY_KEYWORDS.keys()) + ["Other"]


def map_category(domain: Optional[str]) -> str:
    """Best-effort mapping of classifier.py's `domain` to a frontend ProblemCategory."""
    if not domain:
        return "Other"
    d = domain.lower()
    for category, keywords in _CATEGORY_KEYWORDS.items():
        if any(kw in d for kw in keywords):
            return category
    return "Other"


# ---------------------------------------------------------------------------
# Priority mapping: backend CRITICAL/HIGH/MEDIUM/LOW -> frontend Critical/
# High/Medium/Low. This one's exact -- just a casing difference.
# ---------------------------------------------------------------------------
_PRIORITY_MAP = {"CRITICAL": "Critical", "HIGH": "High", "MEDIUM": "Medium", "LOW": "Low"}


def map_priority(backend_priority_level: Optional[str]) -> str:
    return _PRIORITY_MAP.get((backend_priority_level or "").upper(), "Medium")


# ---------------------------------------------------------------------------
# Availability mapping: mentor_matcher.py's light/moderate/full/unknown ->
# frontend Available/Limited Capacity/Fully Assigned/Unavailable.
# ---------------------------------------------------------------------------
_AVAILABILITY_MAP = {
    "light": "Available",
    "moderate": "Limited Capacity",
    "full": "Fully Assigned",
    "unknown": "Unavailable",
}


def map_availability(backend_status: Optional[str]) -> str:
    return _AVAILABILITY_MAP.get(backend_status or "unknown", "Unavailable")


def _numeric_id(string_id: Optional[str]) -> int:
    """
    Frontend types use numeric `id`. Backend ids are strings like
    "uni_001" / "mentor_003". Extracts the trailing digits.
    NOTE: this only guarantees uniqueness within one entity type
    (universities vs mentors vs partners)sharing the same numeric range
    is fine here since the frontend keys them in separate arrays, but if
    you introduce a single combined table downstream, prefix or namespace
    these before storing.
    """
    if not string_id:
        return 0
    match = re.search(r"(\d+)$", string_id)
    return int(match.group(1)) if match else abs(hash(string_id)) % 100000


def _initials(name: Optional[str]) -> str:
    if not name:
        return "??"
    parts = [p for p in re.split(r"\s+", name) if p and p[0].isalpha()]
    return "".join(p[0].upper() for p in parts[:2]) or "??"


def to_ai_department_assignment(
    classification: Optional[Dict[str, Any]],
    department_match: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Adapts classifier.py's flat {domain, subdomain, confidence, reason}
    plus department_matcher.py's ranked department list into the
    frontend's AIDepartmentAssignment shape.

    department_match: the dict returned by
    department_matcher.match_departments() -- {"primary": {...}|None,
    "supporting": [...]}. Pass None if you don't have a university
    selected yet (falls back to a domain-name placeholder, id=0).
    """
    confidence = (classification or {}).get("confidence", 0) or 0
    confidence_pct = round(confidence * 100) if confidence <= 1 else round(confidence)
    reason = (classification or {}).get("reason", "")

    primary = department_match.get("primary") if department_match else None
    supporting = department_match.get("supporting") if department_match else []

    if primary:
        return {
            "primaryDepartment": {"id": primary["id"], "name": primary["name"]},
            "supportingDepartments": [{"id": d["id"], "name": d["name"]} for d in (supporting or [])],
            "confidence": confidence_pct,
            "reason": reason,
        }

    # No department match available (no university selected yet, or that
    # university has no mentors on file) -- fall back to a domain-name
    # placeholder so the shape is still valid.
    domain = (classification or {}).get("domain", "Unclassified")
    return {
        "primaryDepartment": {"id": 0, "name": domain},
        "supportingDepartments": [],
        "confidence": confidence_pct,
        "reason": reason or "Classification unavailable.",
    }


def to_university_challenge(
    result: Dict[str, Any],
    *,
    problem_id: int,
    citizen_name: str,
    location: str,
    date_submitted: str,
    citizen_avatar: Optional[str] = None,
    status: str = "Awaiting Decision",
    selected_university: Optional[Dict[str, Any]] = None,
    selected_mentor: Optional[Dict[str, Any]] = None,
    department_match: Optional[Dict[str, Any]] = None,
    has_industry_match: bool = False,
) -> Dict[str, Any]:
    """
    Builds a dict matching frontend types/universityChallenge.ts's
    UniversityChallenge interface, from one analyze_problem() result plus
    the caller-supplied fields the AI module doesn't produce (id, citizen
    identity, location string, submission date, workflow status -- all of
    these belong to your database/backend, not the AI module).

    department_match: pass the dict from
    department_matcher.match_departments() (scoped to whichever university
    was selected) to populate real assignedDepartmentId/Name and a real
    aiDepartmentAssignment -- see api.py's /analyze-for-frontend for how
    these fit together. Omit if no university is selected yet.
    """
    classification = result.get("classification") or {}
    summary = result.get("summary") or {}
    priority = result.get("priority") or {}
    universities = result.get("universities") or []

    top_university = selected_university or (universities[0] if universities else None)
    top_score = top_university.get("score") if top_university else 0
    ai_match_score = round((top_score or 0) * 100) if (top_score or 0) <= 1 else round(top_score or 0)

    primary_dept = department_match.get("primary") if department_match else None

    return {
        "id": problem_id,
        "title": summary.get("title") or "Untitled submission",
        "description": summary.get("summary") or result.get("original_text", ""),
        "category": map_category(classification.get("domain")),
        "location": location,
        "citizenName": citizen_name,
        "citizenAvatar": citizen_avatar or _initials(citizen_name),
        "dateSubmitted": date_submitted,
        "status": status,
        "priority": map_priority(priority.get("priority")),
        "aiMatchScore": ai_match_score,
        "supporters": 0,  # not tracked by this AI module -- community feature elsewhere
        "aiDepartmentAssignment": to_ai_department_assignment(classification, department_match),
        "assignedDepartmentId": primary_dept["id"] if primary_dept else None,
        "assignedDepartmentName": primary_dept["name"] if primary_dept else None,
        "assignedMentorId": _numeric_id(selected_mentor.get("id")) if selected_mentor else None,
        "assignedMentorName": selected_mentor.get("name") if selected_mentor else None,
        "progress": 0,  # driven by PROGRESS_TRACKING_SCHEMA.md's milestones table, not this module
        "currentStep": 0,
        "industryCollabStatus": "Not Requested" if has_industry_match else "Not Required",
        "rejectionReason": None,
        "notes": None,
        "image": None,
    }


def to_university_mentor(mentor_record: Dict[str, Any], department_name: Optional[str] = None) -> Dict[str, Any]:
    """
    Adapts one entry from mentor_matcher.py's mentor list (or
    data/mentors.json) into the frontend's UniversityMentor shape.
    """
    return {
        "id": _numeric_id(mentor_record.get("id")),
        "name": mentor_record.get("name", ""),
        "avatar": _initials(mentor_record.get("name")),
        "departmentId": 0,  # see department note above
        "departmentName": department_name or mentor_record.get("department", ""),
        "designation": mentor_record.get("designation", ""),
        "expertise": mentor_record.get("expertise", []),
        "bio": (
            f"Research areas: {', '.join(mentor_record.get('research_areas', []))}."
            if mentor_record.get("research_areas") else ""
        ),
        "challengesAssigned": mentor_record.get("current_load", 0),
        "maxCapacity": mentor_record.get("max_capacity", 0),
        "completedProjects": 0,  # not tracked by this AI module
        "availability": map_availability(mentor_record.get("availability_status")),
        "email": mentor_record.get("contact_email", ""),
        "phone": mentor_record.get("contact_phone", ""),
    }


# ---------------------------------------------------------------------------
# OPEN QUESTIONS -- resolve these with your team before this is production-
# ready. None of them can be answered from inside this AI module alone:
#
# 1. data/taxonomy.json isn't in this zip, so `map_category()` is
#    keyword-guessing rather than an exact lookup table. Get that file and
#    replace _CATEGORY_KEYWORDS with a real 1:1 map.
# 2. Numeric IDs here are derived from string IDs via regex -- fine for a
#    demo, but your real database should assign its own numeric/UUID
#    primary keys and this module should just carry them through instead.
# 3. Status enums: `problem.ts`'s ProblemStatus and
#    `universityChallenge.ts`'s ChallengeStatus are two DIFFERENT enums, and
#    PROGRESS_TRACKING_SCHEMA.md has a THIRD one. Someone needs to pick one
#    canonical status enum for the whole system before more code is built
#    on top of any of them.
# 4. Department coverage (department_matcher.py) is only as good as which
#    mentors are in data/mentors.json -- a university with 1 mentor on file
#    shows 1 department even if it really has ten. Add more mentor records
#    (with real departments) to widen this before your demo if it matters
#    for the university you're demoing with.
# ---------------------------------------------------------------------------
