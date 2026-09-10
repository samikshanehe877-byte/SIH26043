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
import os
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any, Literal

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from notification_service import notify_fanout
from frontend_adapter import to_university_challenge, to_university_mentor
from department_matcher import list_departments_for_university, match_departments
from problem_storage import (
    ProblemBase,
    ProblemUpdate,
    NotificationRecord,
    create_problem,
    create_notification,
    get_problem,
    list_notifications,
    list_problems,
    mark_all_notifications_read,
    mark_notification_read,
    update_problem,
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "data", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
MAX_EVIDENCE_SIZE = 10 * 1024 * 1024
ALLOWED_EVIDENCE_TYPES = {
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SIH26043 AI Module API", version="1.0")
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

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


class VerificationDecision(BaseModel):
    decision: Literal["approve", "reject", "proof"]
    note: Optional[str] = None
    officer: str = "Government Officer"
    evidence_requested: Optional[List[str]] = None

class NotificationReadRequest(BaseModel):
    citizen_name: str

class CitizenProblemAction(BaseModel):
    citizen_name: str
    note: Optional[str] = None


class AnalyzeStoredProblemResponse(BaseModel):
    id: str
    status: str
    classification: Optional[Dict[str, Any]] = None
    priority: Optional[Dict[str, Any]] = None
    duplicates: List[Any] = []
    summary: Optional[Dict[str, Any]] = None
    location: Optional[Any] = None
    suggested_department: Optional[Dict[str, Any]] = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/problems", response_model=ProblemBase)
def create_problem_endpoint(problem: ProblemBase):
    """Persist a citizen problem for later review and public discovery."""
    return create_problem(problem)


@app.get("/problems", response_model=List[ProblemBase])
def list_problem_endpoint(status: Optional[str] = None, limit: int = 100, skip: int = 0):
    """List persisted problems, optionally filtered by workflow status."""
    return list_problems(status=status, limit=min(limit, 500), skip=max(skip, 0))


@app.get("/problems/{problem_id}", response_model=ProblemBase)
def get_problem_endpoint(problem_id: str):
    problem = get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem


@app.get("/notifications")
def get_notifications(citizen_name: str, limit: int = 100):
    return list_notifications(citizen_name, limit=min(max(limit, 1), 500))


@app.patch("/notifications/{notification_id}/read")
def read_notification(notification_id: str):
    notification = mark_notification_read(notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification


@app.post("/notifications/read-all")
def read_all_notifications(request: NotificationReadRequest):
    mark_all_notifications_read(request.citizen_name)
    return {"status": "ok"}


@app.post("/problems/{problem_id}/analyze", response_model=AnalyzeStoredProblemResponse)
def analyze_stored_problem_endpoint(problem_id: str):
    """Run AI triage for a stored citizen submission before government review."""
    problem = get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    from ai_pipeline import analyze_problem

    existing = [item.problem_text for item in list_problems(limit=500) if item.id != problem.id]
    result = analyze_problem(
        problem_text=problem.problem_text,
        existing_problems=existing,
        latitude=problem.latitude,
        longitude=problem.longitude,
        district=problem.district,
        block=problem.block,
        village=problem.village,
        source_language=problem.source_language,
    )

    classification = result.get("classification") or {}
    universities = result.get("universities") or []
    suggested_department = None
    if universities and classification.get("domain"):
        department_match = match_departments(
            problem_text=problem.problem_text,
            domain=classification.get("domain"),
            subdomain=classification.get("subdomain"),
            university_id=universities[0].get("id"),
        )
        suggested_department = department_match.get("primary") if department_match else None

    classification = {
        **classification,
        "suggested_department": suggested_department,
        "ai_status": classification.get("status", "NEEDS_HUMAN_REVIEW"),
    }
    updated = update_problem(
        problem_id,
        ProblemUpdate(
            status="under_review",
            original_text=result.get("original_text"),
            translated_text=result.get("translated_text"),
            classification=classification,
            priority=result.get("priority"),
            summary=result.get("summary"),
            duplicates=result.get("duplicates") or [],
            image_analysis=result.get("image_analysis"),
            universities=universities,
            mentors=(result.get("mentors") or {}).get("mentors", []),
            industry_partners=result.get("industry_partners") or [],
        ),
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Problem not found")

    return {
        "id": updated.id,
        "status": updated.status,
        "classification": updated.classification,
        "priority": updated.priority,
        "duplicates": updated.duplicates,
        "summary": updated.summary,
        "location": result.get("location"),
        "suggested_department": suggested_department,
    }


@app.post("/problems/{problem_id}/evidence", response_model=ProblemBase)
async def upload_evidence_endpoint(problem_id: str, files: List[UploadFile] = File(...)):
    """Store citizen evidence files and attach reviewable metadata to a problem."""
    problem = get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    if not files:
        raise HTTPException(status_code=400, detail="At least one file is required")

    attachments = list(problem.evidence_attachments)
    for upload in files:
        if not upload.filename:
            raise HTTPException(status_code=400, detail="Every upload must have a filename")
        content_type = upload.content_type or "application/octet-stream"
        is_media = content_type.startswith("image/") or content_type.startswith("video/")
        if content_type not in ALLOWED_EVIDENCE_TYPES and not is_media:
            raise HTTPException(status_code=415, detail=f"Unsupported evidence type: {upload.content_type or 'unknown'}")
        content = await upload.read()
        if len(content) > MAX_EVIDENCE_SIZE:
            raise HTTPException(status_code=413, detail="Each file must be 10 MB or smaller")
        extension = os.path.splitext(upload.filename)[1].lower()
        stored_name = f"{uuid.uuid4().hex}{extension}"
        stored_path = os.path.join(UPLOAD_DIR, stored_name)
        with open(stored_path, "wb") as output:
            output.write(content)
        attachments.append(
            {
                "name": upload.filename,
                "content_type": content_type,
                "size": len(content),
                "url": f"/uploads/{stored_name}",
            }
        )

    updated = update_problem(
        problem_id,
        ProblemUpdate(
            evidence_provided=[item["name"] for item in attachments],
            evidence_attachments=attachments,
        ),
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Problem not found")
    create_notification(
        NotificationRecord(
            citizen_name=updated.citizen_name,
            type="info",
            title="Problem resubmitted",
            message=f"Your problem '{updated.title or updated.problem_text}' was resubmitted for government review.",
            problem_id=updated.id,
            problem_title=updated.title or updated.problem_text,
        )
    )
    return updated


@app.patch("/problems/{problem_id}/verification", response_model=ProblemBase)
def verify_problem_endpoint(problem_id: str, decision: VerificationDecision):
    """Apply a government decision; only verified problems are public."""
    if decision.decision == "reject" and (not decision.note or not decision.note.strip()):
        raise HTTPException(status_code=400, detail="A rejection reason is required")

    current = get_problem(problem_id)
    if not current:
        raise HTTPException(status_code=404, detail="Problem not found")

    status_by_decision = {
        "approve": "verified",
        "reject": "rejected",
        "proof": "returned_for_correction",
    }
    note = (decision.note or "").strip()
    evidence_requested = decision.evidence_requested
    if decision.decision == "proof" and not evidence_requested:
        evidence_requested = [note or "Additional proof requested"]
    history_entry = {
        "officer": decision.officer,
        "timestamp": datetime.now().isoformat(),
        "note": note,
        "previous_status": current.status,
        "decision": decision.decision,
        "status": status_by_decision[decision.decision],
    }
    update = ProblemUpdate(
        status=status_by_decision[decision.decision],
        verification_notes=note,
        evidence_requested=evidence_requested,
        verification_history=[*current.verification_history, history_entry],
    )
    problem = update_problem(problem_id, update)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    if decision.decision == "approve":
        notification_type = "success"
        title = "Problem approved"
        message = f"Your problem '{problem.title or problem.problem_text}' was approved and published."
    elif decision.decision == "proof":
        notification_type = "warning"
        title = "Additional proof requested"
        message = f"Please provide additional proof for '{problem.title or problem.problem_text}': {note}"
    else:
        notification_type = "update"
        title = "Problem rejected"
        message = f"Your problem '{problem.title or problem.problem_text}' was rejected: {note}"
    create_notification(
        NotificationRecord(
            citizen_name=problem.citizen_name,
            type=notification_type,
            title=title,
            message=message,
            problem_id=problem.id,
            problem_title=problem.title or problem.problem_text,
        )
    )
    return problem


@app.post("/problems/{problem_id}/resubmit", response_model=ProblemBase)
def resubmit_problem_endpoint(problem_id: str, action: CitizenProblemAction):
    """Let the owning citizen respond to a proof request and return a problem to review."""
    problem = get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    if problem.citizen_name != action.citizen_name:
        raise HTTPException(status_code=403, detail="You can only update your own problems")
    if problem.status != "returned_for_correction":
        raise HTTPException(status_code=409, detail="Only problems sent back for correction can be resubmitted")

    history = {
        "officer": problem.citizen_name,
        "timestamp": datetime.now().isoformat(),
        "note": (action.note or "Additional evidence submitted").strip(),
        "previous_status": problem.status,
        "decision": "resubmit",
        "status": "under_review",
    }
    updated = update_problem(
        problem_id,
        ProblemUpdate(
            status="under_review",
            verification_notes=None,
            evidence_requested=None,
            verification_history=[*problem.verification_history, history],
        ),
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Problem not found")
    return updated


@app.delete("/problems/{problem_id}")
def delete_problem_endpoint(problem_id: str, citizen_name: str):
    """Delete only an unverified problem owned by the requesting citizen."""
    problem = get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    if problem.citizen_name != citizen_name:
        raise HTTPException(status_code=403, detail="You can only delete your own problems")
    if problem.status == "verified":
        raise HTTPException(status_code=409, detail="Verified problems cannot be deleted")
    from problem_storage import delete_problem
    if not delete_problem(problem_id):
        raise HTTPException(status_code=404, detail="Problem not found")
    return {"status": "deleted", "id": problem_id}


@app.get("/notifications")
def get_notifications(citizen_name: str, limit: int = 100):
    return list_notifications(citizen_name, limit=min(max(limit, 1), 500))


@app.patch("/notifications/{notification_id}/read")
def read_notification(notification_id: str):
    notification = mark_notification_read(notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification


@app.post("/notifications/read-all")
def read_all_notifications(request: NotificationReadRequest):
    mark_all_notifications_read(request.citizen_name)
    return {"status": "ok"}


@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    """Runs the full AI pipeline and returns the same dict shape app.py renders."""
    from ai_pipeline import analyze_problem

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
    from ai_pipeline import analyze_problem

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
