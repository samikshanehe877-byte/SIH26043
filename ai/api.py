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
from problem_structurer import structure_raw_problem, StructuredProblemDraft
from problem_storage import (
    COLLABORATION_PARTIES,
    NOTIFICATION_AUDIENCES,
    CollaborationRequestRecord,
    ProblemBase,
    ProblemUpdate,
    NotificationRecord,
    create_collaboration_request,
    create_problem,
    create_notification,
    get_collaboration_request,
    get_problem,
    list_collaboration_requests,
    list_notifications,
    list_problems,
    mark_all_notifications_read,
    mark_notification_read,
    transition_collaboration_request,
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
    audience: Optional[str] = None

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


class StructureProblemRequest(BaseModel):
    raw_text: str
    source_language: Optional[str] = "English"
    location_hint: Optional[str] = None


class VolunteerRequest(BaseModel):
    solver_type: str  # "university" | "industry"
    solver_name: str
    proposal: Optional[str] = None


class SelectVolunteerRequest(BaseModel):
    solver_type: str
    solver_name: str


class CreateCollaborationRequest(BaseModel):
    requested_by: str  # "university" | "industry"
    university_name: str
    industry_name: str
    requester_contact: Optional[str] = None
    problem_id: Optional[str] = None
    challenge_title: str
    problem_description: Optional[str] = None
    category: Optional[str] = None
    support_types: List[str] = []
    description: Optional[str] = None


class CollaborationAction(BaseModel):
    actor_type: str  # "university" | "industry"
    actor_name: str
    action: Literal["accept", "reject", "clarify", "reply", "withdraw"]
    note: Optional[str] = None


def _validate_solver(solver_type: str, solver_name: str) -> None:
    """Volunteer alerts are delivered to solver_name, so it must be a real organisation."""
    if solver_type not in COLLABORATION_PARTIES:
        raise HTTPException(status_code=400, detail="solver_type must be 'university' or 'industry'")
    if not solver_name or not solver_name.strip():
        raise HTTPException(status_code=400, detail="solver_name is required")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ai/structure-problem", response_model=StructuredProblemDraft)
def structure_problem_endpoint(req: StructureProblemRequest):
    """
    Transforms messy, unstructured citizen input (text or speech transcript)
    into a standardized, objective societal problem draft with estimated scope,
    nature (Technical/Non-Technical/Hybrid), and required capabilities.
    Presented to the citizen for review BEFORE government submission.
    """
    if not req.raw_text or not req.raw_text.strip():
        raise HTTPException(status_code=400, detail="Raw problem text cannot be empty.")
    return structure_raw_problem(
        raw_text=req.raw_text,
        source_language=req.source_language or "English",
        location_hint=req.location_hint,
    )


@app.post("/problems", response_model=ProblemBase)
def create_problem_endpoint(problem: ProblemBase):
    """Persist a citizen problem for later review and public discovery."""
    created = create_problem(problem)
    title = created.title or created.problem_text
    create_notification(
        NotificationRecord(
            citizen_name=created.citizen_name,
            type="success",
            title="Problem submitted",
            message=f"Your problem '{title}' was submitted for review.",
            problem_id=created.id,
            problem_title=title,
        )
    )
    return created


@app.post("/problems/{problem_id}/volunteer", response_model=ProblemBase)
def volunteer_for_problem_endpoint(problem_id: str, req: VolunteerRequest):
    """University or industry volunteers to solve a verified problem."""
    from problem_storage import add_volunteer, create_notification
    _validate_solver(req.solver_type, req.solver_name)
    try:
        problem = add_volunteer(problem_id, req.solver_type, req.solver_name, req.proposal or "")
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    title = problem.title or problem.problem_text
    # Notify the citizen that someone volunteered
    create_notification(
        NotificationRecord(
            citizen_name=problem.citizen_name,
            category="volunteer",
            type="info",
            title="New volunteer proposal",
            message=f"{req.solver_name} ({req.solver_type}) volunteered to solve your problem '{title}'.",
            problem_id=problem.id,
            problem_title=title,
        )
    )
    # Notify the volunteer that their request was received
    create_notification(
        NotificationRecord(
            citizen_name=req.solver_name,
            audience=req.solver_type,
            category="volunteer",
            type="info",
            title="Volunteer request submitted",
            message=f"Your volunteer proposal for '{title}' has been submitted and is awaiting the problem owner's decision.",
            problem_id=problem.id,
            problem_title=title,
        )
    )
    return problem


@app.delete("/problems/{problem_id}/volunteer")
def withdraw_volunteer_endpoint(problem_id: str, req: VolunteerRequest):
    """A volunteer withdraws their proposal before the giver has accepted anyone."""
    from problem_storage import withdraw_volunteer, create_notification
    _validate_solver(req.solver_type, req.solver_name)
    try:
        problem = withdraw_volunteer(problem_id, req.solver_type, req.solver_name)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    title = problem.title or problem.problem_text
    # Notify the citizen
    create_notification(
        NotificationRecord(
            citizen_name=problem.citizen_name,
            category="volunteer",
            type="info",
            title="Volunteer request withdrawn",
            message=f"{req.solver_name} ({req.solver_type}) withdrew their proposal for '{title}'.",
            problem_id=problem.id,
            problem_title=title,
        )
    )
    # Notify the volunteer that their withdrawal was processed
    create_notification(
        NotificationRecord(
            citizen_name=req.solver_name,
            audience=req.solver_type,
            category="volunteer",
            type="info",
            title="Volunteer request withdrawn",
            message=f"Your volunteer proposal for '{title}' has been withdrawn successfully.",
            problem_id=problem.id,
            problem_title=title,
        )
    )
    return {"status": "withdrawn", "id": problem_id}


@app.post("/problems/{problem_id}/select-volunteer", response_model=ProblemBase)
def select_volunteer_endpoint(problem_id: str, req: SelectVolunteerRequest):
    """Giver selects one volunteer; chosen is accepted, others are rejected."""
    from problem_storage import select_volunteer, create_notification
    _validate_solver(req.solver_type, req.solver_name)
    try:
        problem = select_volunteer(problem_id, req.solver_type, req.solver_name)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    title = problem.title or problem.problem_text
    # Notify the citizen that a volunteer was accepted
    create_notification(
        NotificationRecord(
            citizen_name=problem.citizen_name,
            category="volunteer",
            type="success",
            title="Volunteer accepted",
            message=f"Your problem '{title}' has been assigned to {req.solver_name} ({req.solver_type}).",
            problem_id=problem.id,
            problem_title=title,
        )
    )
    # Notify the accepted volunteer
    create_notification(
        NotificationRecord(
            citizen_name=req.solver_name,
            audience=req.solver_type,
            category="volunteer",
            type="success",
            title="Volunteer request accepted",
            message=f"Your volunteer proposal for '{title}' has been accepted by the problem owner. You are now assigned to solve this problem.",
            problem_id=problem.id,
            problem_title=title,
        )
    )
    # Notify rejected volunteers
    for v in problem.volunteers:
        if v["status"] == "rejected":
            create_notification(
                NotificationRecord(
                    citizen_name=v["solver_name"],
                    audience=v["solver_type"],
                    category="volunteer",
                    type="update",
                    title="Volunteer request not selected",
                    message=f"Your proposal for '{title}' was not selected. Another solver has been chosen.",
                    problem_id=problem.id,
                    problem_title=title,
                )
            )
    return problem


@app.get("/problems", response_model=List[ProblemBase])
def list_problem_endpoint(status: Optional[str] = None, limit: int = 100, skip: int = 0, citizen_name: Optional[str] = None, assigned_university: Optional[str] = None, assigned_industry: Optional[str] = None):
    """List persisted problems, optionally filtered by workflow status, citizen name, assigned university, or assigned industry."""
    return list_problems(status=status, limit=min(limit, 500), skip=max(skip, 0), citizen_name=citizen_name, assigned_university=assigned_university, assigned_industry=assigned_industry)


@app.get("/problems/{problem_id}", response_model=ProblemBase)
def get_problem_endpoint(problem_id: str):
    problem = get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem


def _check_audience(audience: Optional[str]) -> None:
    if audience and audience not in NOTIFICATION_AUDIENCES:
        raise HTTPException(status_code=400, detail=f"audience must be one of {sorted(NOTIFICATION_AUDIENCES)}")


@app.get("/notifications")
def get_notifications(citizen_name: str, limit: int = 100, audience: Optional[str] = None):
    """`citizen_name` is the recipient (a citizen name or an organisation name);
    pass `audience` so each portal only sees its own alerts."""
    _check_audience(audience)
    return list_notifications(citizen_name, limit=min(max(limit, 1), 500), audience=audience)


@app.patch("/notifications/{notification_id}/read")
def read_notification(notification_id: str):
    notification = mark_notification_read(notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification


@app.post("/notifications/read-all")
def read_all_notifications(request: NotificationReadRequest):
    _check_audience(request.audience)
    mark_all_notifications_read(request.citizen_name, audience=request.audience)
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# University <-> industry collaboration requests
# ---------------------------------------------------------------------------

def _notify_party(record: CollaborationRequestRecord, party: str, type: str, title: str, message: str) -> None:
    create_notification(
        NotificationRecord(
            citizen_name=record.party_name(party),
            audience=party,
            category="collaboration",
            type=type,
            title=title,
            message=message,
            problem_id=record.problem_id,
            problem_title=record.challenge_title,
            collaboration_request_id=record.id,
        )
    )


@app.post("/collaboration-requests", response_model=CollaborationRequestRecord, status_code=201)
def create_collaboration_request_endpoint(req: CreateCollaborationRequest):
    """A university asks an industry partner for support (or vice versa). Alerts both sides."""
    if req.requested_by not in COLLABORATION_PARTIES:
        raise HTTPException(status_code=400, detail="requested_by must be 'university' or 'industry'")
    if not req.university_name.strip() or not req.industry_name.strip():
        raise HTTPException(status_code=400, detail="university_name and industry_name are required")
    if not req.challenge_title.strip():
        raise HTTPException(status_code=400, detail="challenge_title is required")
    if req.problem_id and not get_problem(req.problem_id):
        raise HTTPException(status_code=404, detail="Problem not found")

    open_duplicates = [
        existing for existing in list_collaboration_requests(
            university_name=req.university_name, industry_name=req.industry_name, problem_id=req.problem_id,
        )
        if existing.status in ("pending", "clarification_needed") and existing.challenge_title == req.challenge_title
    ]
    if open_duplicates:
        raise HTTPException(status_code=409, detail="An open collaboration request for this challenge already exists")

    record = create_collaboration_request(CollaborationRequestRecord(**req.model_dump()))
    requester, responder = record.requested_by, record.responder
    support = ", ".join(record.support_types) or "collaboration"
    _notify_party(
        record, responder, "info", "New collaboration request",
        f"{record.party_name(requester)} requested {support} for '{record.challenge_title}'.",
    )
    _notify_party(
        record, requester, "info", "Collaboration request sent",
        f"Your request to {record.party_name(responder)} for '{record.challenge_title}' is awaiting their response.",
    )
    return record


@app.get("/collaboration-requests", response_model=List[CollaborationRequestRecord])
def list_collaboration_requests_endpoint(
    university_name: Optional[str] = None,
    industry_name: Optional[str] = None,
    status: Optional[str] = None,
    problem_id: Optional[str] = None,
    limit: int = 100,
):
    return list_collaboration_requests(
        university_name=university_name, industry_name=industry_name,
        status=status, problem_id=problem_id, limit=min(max(limit, 1), 500),
    )


@app.get("/collaboration-requests/{request_id}", response_model=CollaborationRequestRecord)
def get_collaboration_request_endpoint(request_id: str):
    record = get_collaboration_request(request_id)
    if not record:
        raise HTTPException(status_code=404, detail="Collaboration request not found")
    return record


@app.post("/collaboration-requests/{request_id}/actions", response_model=CollaborationRequestRecord)
def act_on_collaboration_request_endpoint(request_id: str, req: CollaborationAction):
    """Accept / reject / ask for clarification (receiver), or reply / withdraw (requester).
    Every step alerts the other side."""
    note = (req.note or "").strip()
    if req.action in ("reject", "clarify", "reply") and not note:
        raise HTTPException(status_code=400, detail=f"A note is required to {req.action}")
    try:
        record = transition_collaboration_request(request_id, req.actor_type, req.actor_name, req.action, note)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    if not record:
        raise HTTPException(status_code=404, detail="Collaboration request not found")

    title = record.challenge_title
    actor = record.party_name(req.actor_type)
    other = record.responder if req.actor_type == record.requested_by else record.requested_by
    alerts = {
        "accept": ("success", "Collaboration request accepted", f"{actor} accepted your collaboration request for '{title}'."),
        "reject": ("update", "Collaboration request declined", f"{actor} declined your collaboration request for '{title}': {note}"),
        "clarify": ("warning", "Clarification requested", f"{actor} needs more details on your request for '{title}': {note}"),
        "reply": ("info", "Clarification provided", f"{actor} replied on the collaboration request for '{title}': {note}"),
        "withdraw": ("update", "Collaboration request withdrawn", f"{actor} withdrew their collaboration request for '{title}'."),
    }
    alert_type, alert_title, alert_message = alerts[req.action]
    _notify_party(record, other, alert_type, alert_title, alert_message)

    if req.action == "accept" and record.problem_id:
        # Link the industry partner to the problem so it shows under their active collaborations.
        problem = get_problem(record.problem_id)
        if problem and not problem.assigned_industry:
            update_problem(record.problem_id, ProblemUpdate(assigned_industry=record.industry_name))
    return record


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

    create_notification(
        NotificationRecord(
            citizen_name=updated.citizen_name,
            type="update",
            title="Problem analysis completed",
            message=f"AI analysis for your problem '{updated.title or updated.problem_text}' is complete and it is ready for review.",
            problem_id=updated.id,
            problem_title=updated.title or updated.problem_text,
        )
    )

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
            title="Evidence submitted",
            message=f"Evidence for your problem '{updated.title or updated.problem_text}' was submitted for government review.",
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
    title = updated.title or updated.problem_text
    create_notification(
        NotificationRecord(
            citizen_name=updated.citizen_name,
            type="success",
            title="Problem resubmitted",
            message=f"Your problem '{title}' was resubmitted for government review.",
            problem_id=updated.id,
            problem_title=title,
        )
    )
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
    create_notification(
        NotificationRecord(
            citizen_name=problem.citizen_name,
            type="info",
            title="Problem deleted",
            message=f"Your problem '{problem.title or problem.problem_text}' was deleted.",
            problem_id=problem.id,
            problem_title=problem.title or problem.problem_text,
        )
    )
    # Volunteers still waiting on (or assigned to) this problem need to know it is gone.
    for volunteer in problem.volunteers:
        if volunteer.get("status") in ("volunteered", "accepted") and volunteer.get("solver_name"):
            create_notification(
                NotificationRecord(
                    citizen_name=volunteer["solver_name"],
                    audience=volunteer.get("solver_type", "university"),
                    category="volunteer",
                    type="warning",
                    title="Problem withdrawn by owner",
                    message=f"'{problem.title or problem.problem_text}' was deleted by its owner, so your volunteer proposal is closed.",
                    problem_id=problem.id,
                    problem_title=problem.title or problem.problem_text,
                )
            )
    from problem_storage import delete_problem
    if not delete_problem(problem_id):
        raise HTTPException(status_code=404, detail="Problem not found")
    return {"status": "deleted", "id": problem_id}


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
