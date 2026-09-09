"""
api.py

Thin FastAPI wrapper around ai_pipeline.analyze_problem() and
notification_service.notify_fanout(), so a SEPARATE frontend (your
teammate's React/HTML app) can call this over HTTP instead of only being
able to use the Streamlit UI in app.py.

Why this file exists: app.py is a Streamlit app -- it has no HTTP API of
its own, so a standalone frontend has nothing to call yet. This is the
"backend integration" hook the README already flagged as future work
(see "Future Backend Integration" in README.md).

Run it with:
    uvicorn api:app --reload --port 8000

Then from the frontend:
    POST http://localhost:8000/analyze   { "problem_text": "...", ... }
    POST http://localhost:8000/notify    { "result": {...}, ... }
    GET  http://localhost:8000/health

Keep BOTH app.py and api.py:
    - app.py  -> operator-facing demo UI (judges click through this)
    - api.py  -> what the real frontend talks to

LIMITATIONS (read before wiring up the frontend):
    - Image upload isn't wired into /analyze yet (JSON body only). If the
      frontend needs to submit a photo, add a `POST /analyze-with-image`
      multipart endpoint that saves the upload to a temp file and passes
      `image_path=` through to analyze_problem(), the same way app.py does.
    - existing_problems (for duplicate detection) must be supplied by the
      frontend/backend -- e.g. the last N problem descriptions from your
      database -- this module never stores state between requests.
    - CORS below is wide open ("*") for hackathon/demo convenience. Lock
      `allow_origins` down to your actual frontend URL before any real
      deployment.
"""

import logging
from typing import Optional, List, Dict, Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ai_pipeline import analyze_problem
from notification_service import notify_fanout
from frontend_adapter import to_university_challenge, to_university_mentor
from department_matcher import list_departments_for_university, match_departments

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SIH26043 AI Module API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: replace with your frontend's actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    problem_text: str
    source_language: Optional[str] = "English"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    district: Optional[str] = None
    block: Optional[str] = None
    village: Optional[str] = None
    existing_problems: Optional[List[str]] = None


class AnalyzeForFrontendRequest(AnalyzeRequest):
    """Same inputs as /analyze, plus the fields the frontend needs that
    this AI module doesn't produce itself (identity, location string, date)."""
    problem_id: int
    citizen_name: str
    location: str
    date_submitted: str


class NotifyRequest(BaseModel):
    result: Dict[str, Any]
    citizen_contact: Optional[Dict[str, str]] = None
    selected_university: Optional[Dict[str, Any]] = None
    selected_mentor: Optional[Dict[str, Any]] = None
    selected_industry_partner: Optional[Dict[str, Any]] = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    """Runs the full AI pipeline and returns the same dict shape app.py renders."""
    result = analyze_problem(
        problem_text=req.problem_text,
        existing_problems=req.existing_problems,
        latitude=req.latitude,
        longitude=req.longitude,
        district=req.district,
        block=req.block,
        village=req.village,
        source_language=req.source_language,
    )
    return result


@app.get("/departments/{university_id}")
def departments(university_id: str):
    """Lists the departments on file for one university (see department_matcher.py)."""
    return {"university_id": university_id, "departments": list_departments_for_university(university_id)}


@app.post("/analyze-for-frontend")
def analyze_for_frontend(req: AnalyzeForFrontendRequest):
    """
    Same as /analyze, but reshaped to match the Next.js frontend's
    UniversityChallenge type exactly (see frontend_adapter.py). This is
    the endpoint the frontend should actually call -- /analyze's raw
    shape does not match what its TypeScript types expect.

    Returns BOTH the raw result (for debugging) and the adapted
    "challenge" shape the frontend can drop straight into its UI,
    including a real department assignment (department_matcher.py) scoped
    to whichever university the AI module ranked first.
    """
    result = analyze_problem(
        problem_text=req.problem_text,
        existing_problems=req.existing_problems,
        latitude=req.latitude,
        longitude=req.longitude,
        district=req.district,
        block=req.block,
        village=req.village,
        source_language=req.source_language,
    )

    universities = result.get("universities") or []
    top_university = universities[0] if universities else None
    classification = result.get("classification") or {}

    department_match = None
    if top_university:
        department_match = match_departments(
            problem_text=req.problem_text,
            domain=classification.get("domain"),
            subdomain=classification.get("subdomain"),
            university_id=top_university["id"],
        )

    challenge = to_university_challenge(
        result,
        problem_id=req.problem_id,
        citizen_name=req.citizen_name,
        location=req.location,
        date_submitted=req.date_submitted,
        department_match=department_match,
        has_industry_match=bool(result.get("industry_partners")),
    )
    mentors_raw = ((result.get("mentors") or {}).get("mentors")) or []
    mentors = [to_university_mentor(m) for m in mentors_raw]
    return {"challenge": challenge, "mentors": mentors, "raw_result": result}


@app.post("/notify")
def notify(req: NotifyRequest):
    """
    Fans out email/SMS for an already-analyzed and operator-assigned
    submission. Call this after the frontend/operator has picked a
    university, mentor, and (optionally) industry partner from the
    /analyze response.
    """
    statuses = notify_fanout(
        result=req.result,
        citizen_contact=req.citizen_contact,
        selected_university=req.selected_university,
        selected_mentor=req.selected_mentor,
        selected_industry_partner=req.selected_industry_partner,
    )
    return {"statuses": statuses}
