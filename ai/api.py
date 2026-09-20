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

import contextlib
import logging
import os
import re
import tempfile
import uuid
import zipfile
from datetime import datetime
from typing import Optional, List, Dict, Any, Literal, Tuple

from fastapi import FastAPI, File, Form, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.background import BackgroundTask
from pydantic import BaseModel

from notification_service import notify_fanout
from project_storage import (
    ProjectMessage,
    ProjectUpdate,
    add_message,
    add_update,
    append_update_attachments,
    get_project_parties,
    get_viewer_role,
    list_messages,
    list_projects_for_party,
    list_updates,
)
import points_storage
from frontend_adapter import to_university_challenge, to_university_mentor
import people_matcher
from department_matcher import list_departments_for_university, match_departments
from problem_structurer import structure_raw_problem, StructuredProblemDraft
from problem_storage import (
    COLLABORATION_PARTIES,
    MAX_CO_OWNERS,
    NOTIFICATION_AUDIENCES,
    PUBLIC_PROBLEM_STATUSES,
    CollaborationRequestRecord,
    DuplicateDecision,
    MergeRequestRecord,
    ProblemBase,
    ProblemStatus,
    ProblemUpdate,
    NotificationRecord,
    approve_merge_request_member,
    create_collaboration_request,
    create_merge_request,
    create_problem,
    create_notification,
    get_collaboration_request,
    get_merge_request,
    get_problem,
    is_owner,
    list_collaboration_requests,
    list_merge_requests,
    list_notifications,
    list_problem_similarities,
    list_problems,
    mark_all_notifications_read,
    mark_notification_read,
    respond_to_merge_request,
    transition_collaboration_request,
    update_problem,
)
# duplicate_engine pulls in sentence-transformers (via embeddings.py), the same heavy/optional
# dependency ai_pipeline.py has -- imported lazily inside the endpoints that use it (below) so a
# broken or missing sentence-transformers install can't take down the whole API at startup.

UPLOAD_DIR = os.getenv("UPLOAD_DIR", os.path.join(os.path.dirname(__file__), "data", "uploads"))
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
# Project workspace update attachments: everything evidence accepts, plus slide decks and
# spreadsheets (progress reports/plans are often shared as .ppt/.pptx/.xls/.xlsx).
ALLOWED_WORKSPACE_ATTACHMENT_TYPES = ALLOWED_EVIDENCE_TYPES | {
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}
MAX_UPDATE_ATTACHMENTS = 10  # total per update, across the initial post and any later additions
WORKSPACE_ATTACHMENT_LABEL = "images, videos, PDFs, or Word, PowerPoint or Excel files"
EXTENSION_CONTENT_TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
    citizen_name: str  # must be the problem giver; only they accept a volunteer


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
    progress_summary: Optional[str] = None  # required when the request is for a project (problem_id)


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


_duplicate_engine_module = None  # cached: None = not tried yet, False = import failed, module = loaded


def _get_duplicate_engine():
    """Lazily imports duplicate_engine once and caches the result (success or failure) so a
    broken sentence-transformers install doesn't retry (and re-fail slowly) on every request."""
    global _duplicate_engine_module
    if _duplicate_engine_module is None:
        try:
            import duplicate_engine
            _duplicate_engine_module = duplicate_engine
        except Exception as e:
            logger.warning("duplicate_engine unavailable, duplicate checks will be skipped: %s", e)
            _duplicate_engine_module = False
    return _duplicate_engine_module or None


def _safe_duplicate_check(fields: Dict[str, Any], **kwargs) -> Dict[str, Any]:
    """Runs duplicate_engine.duplicate_check(), but degrades to "no duplicate found" instead
    of breaking problem submission entirely if duplicate_engine (or its sentence-transformers
    dependency) can't be imported -- same fail-open principle duplicate_check() itself already
    applies to a scoring error, just one layer further out."""
    engine = _get_duplicate_engine()
    if engine is None:
        return {"tier": "normal", "best_match": None, "candidates": [], "error": "duplicate_engine_unavailable"}
    return engine.duplicate_check(fields, **kwargs)


def _notify_owners(problem: ProblemBase, *, exclude: Optional[str] = None, **fields) -> None:
    """Sends one notification to every citizen who owns this problem.

    After a merge a problem can have co-owners with the same rights as the original reporter
    (see problem_storage.is_owner), so anything the owner needs to hear about, all of them do --
    otherwise a co-owner could accept a volunteer and nobody else would ever find out.
    """
    for name in [problem.citizen_name, *(problem.co_owners or [])]:
        if name == exclude:
            continue
        create_notification(
            NotificationRecord(
                citizen_name=name,
                problem_id=problem.id,
                problem_title=problem.title or problem.problem_text,
                **fields,
            )
        )


def _duplicate_check_fields(problem: ProblemBase) -> Dict[str, Any]:
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


class DuplicateCheckRequest(BaseModel):
    """Same shape as the fields a submission provides; used for the advisory
    pre-check before the citizen commits to submitting."""
    title: Optional[str] = None
    problem_text: str
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    district: Optional[str] = None
    block: Optional[str] = None
    village: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    affected_population: Optional[str] = None
    required_capabilities: List[str] = []
    problem_nature: Optional[str] = None
    exclude_problem_id: Optional[str] = None  # when re-checking an existing draft/problem


@app.post("/problems/check-duplicates")
def check_duplicates_endpoint(req: DuplicateCheckRequest):
    """
    Advisory pre-check the frontend calls right after AI structuring, before the
    citizen commits to submitting -- lets the UI show a block screen or a
    "continue anyway" warning ahead of time. This is NOT the authoritative
    check: POST /problems independently re-runs the same logic at the moment
    of creation, since only that request is guarded against a second
    submission racing in between (see duplicate_engine.SUBMISSION_LOCK).
    Nothing here is persisted -- this may be checking a draft that never
    becomes a real problem.
    """
    if not req.problem_text.strip():
        raise HTTPException(status_code=400, detail="problem_text cannot be empty")
    return _safe_duplicate_check(req.model_dump(exclude={"exclude_problem_id"}), exclude_problem_id=req.exclude_problem_id)


@app.post("/problems", response_model=ProblemBase)
def create_problem_endpoint(problem: ProblemBase):
    """
    Persist a citizen problem for later review and public discovery.

    This is the AUTHORITATIVE duplicate-detection gate (the frontend's
    /problems/check-duplicates call is advisory only). Under SUBMISSION_LOCK,
    every existing eligible problem is re-scored fresh against this
    submission, so a second citizen submitting the same thing moments after
    the first one still gets caught, even if their own pre-check ran before
    either existed:

        score >= 90%   -> still created (audit trail), but routed straight to
                          DUPLICATE_REJECTED; never enters government review
        score 60-89%   -> created normally; flagged POTENTIAL_DUPLICATE for a
                          human (government) to resolve during verification
        score < 60%    -> created normally, no flag
    """
    engine = _get_duplicate_engine()
    lock = engine.SUBMISSION_LOCK if engine else contextlib.nullcontext()
    with lock:
        result = (
            engine.duplicate_check(_duplicate_check_fields(problem), persist_similarities_for=problem.id)
            if engine else {"tier": "normal", "best_match": None, "candidates": []}
        )
        best = result["best_match"]

        if result["tier"] == "block" and best:
            problem.status = ProblemStatus.DUPLICATE_REJECTED
            problem.duplicate_decision = DuplicateDecision.DUPLICATE
            problem.duplicate_of_id = best["problem_id"]
            problem.duplicate_score = best["overall"]
            problem.duplicate_reasons = best["reasons"]
            problem.duplicate_breakdown = {k: best[k] for k in ("semantic", "location", "domain", "affected_area", "characteristics")}
            created = create_problem(problem)
            title = created.title or created.problem_text
            create_notification(
                NotificationRecord(
                    citizen_name=created.citizen_name,
                    type="warning",
                    title="Not submitted -- duplicate found",
                    message=(
                        f"'{title}' looks like the same issue as an existing report "
                        f"('{best['title']}'), so it wasn't sent for government review. "
                        f"You can support the existing report instead."
                    ),
                    problem_id=created.id,
                    problem_title=title,
                )
            )
            return created

        if result["tier"] == "warning" and best:
            problem.duplicate_decision = DuplicateDecision.POTENTIAL_DUPLICATE
            problem.duplicate_of_id = best["problem_id"]
            problem.duplicate_score = best["overall"]
            problem.duplicate_reasons = best["reasons"]
            problem.duplicate_breakdown = {k: best[k] for k in ("semantic", "location", "domain", "affected_area", "characteristics")}

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
    current = get_problem(problem_id)
    if not current:
        raise HTTPException(status_code=404, detail="Problem not found")
    if current.status != "verified":
        raise HTTPException(status_code=409, detail="Volunteering opens only after the government verifies the problem")
    try:
        problem = add_volunteer(problem_id, req.solver_type, req.solver_name, req.proposal or "")
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    title = problem.title or problem.problem_text
    # Notify the citizen owners that someone volunteered
    _notify_owners(
        problem,
        category="volunteer",
        type="info",
        title="New volunteer proposal",
        message=f"{req.solver_name} ({req.solver_type}) volunteered to solve your problem '{title}'.",
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
    # Notify the citizen owners
    _notify_owners(
        problem,
        category="volunteer",
        type="info",
        title="Volunteer request withdrawn",
        message=f"{req.solver_name} ({req.solver_type}) withdrew their proposal for '{title}'.",
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
    """Giver selects one volunteer; chosen is accepted, others are rejected.
    This is the step that creates the project workspace, so the problem must be verified
    and the request must come from the citizen who reported it."""
    from problem_storage import select_volunteer, create_notification
    _validate_solver(req.solver_type, req.solver_name)
    current = get_problem(problem_id)
    if not current:
        raise HTTPException(status_code=404, detail="Problem not found")
    if not is_owner(current, req.citizen_name):
        raise HTTPException(status_code=403, detail="Only the problem giver can accept a volunteer")
    if current.status != "verified":
        raise HTTPException(status_code=409, detail="A volunteer can only be accepted on a verified problem")
    try:
        problem = select_volunteer(problem_id, req.solver_type, req.solver_name)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    title = problem.title or problem.problem_text
    # Notify the citizen owners that a volunteer was accepted. Any owner can accept one, so the
    # others are told who did it rather than being left to wonder.
    accepted_by = "" if req.citizen_name == problem.citizen_name and not problem.co_owners else f" (accepted by {req.citizen_name})"
    _notify_owners(
        problem,
        category="volunteer",
        type="success",
        title="Volunteer accepted",
        message=f"Your problem '{title}' has been assigned to {req.solver_name} ({req.solver_type}).{accepted_by}",
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
def list_problem_endpoint(
    status: Optional[str] = None,
    limit: int = 100,
    skip: int = 0,
    citizen_name: Optional[str] = None,
    assigned_university: Optional[str] = None,
    assigned_industry: Optional[str] = None,
    include_unverified: bool = False,
):
    """List persisted problems, optionally filtered by workflow status, citizen name, assigned university, or assigned industry.

    Unverified problems (submitted, under review, returned for correction, rejected) are left out of
    browsing lists. They are only returned in a citizen's own list (`citizen_name`) or to the
    government review queue (`include_unverified=true`)."""
    public_only = not citizen_name and not include_unverified
    if public_only and status and status not in PUBLIC_PROBLEM_STATUSES:
        return []
    return list_problems(
        status=status,
        limit=min(limit, 500),
        skip=max(skip, 0),
        citizen_name=citizen_name,
        assigned_university=assigned_university,
        assigned_industry=assigned_industry,
        statuses=PUBLIC_PROBLEM_STATUSES if public_only else None,
    )


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
    if req.problem_id:
        problem = get_problem(req.problem_id)
        if not problem:
            raise HTTPException(status_code=404, detail="Problem not found")
        # Collaboration on a problem is opened by its accepted volunteer (the project lead).
        lead = next((p for p in get_project_parties(problem) if p["role"] == "lead"), None)
        if not lead:
            raise HTTPException(status_code=409, detail="Collaboration opens once the problem owner accepts a volunteer")
        requester_name = req.university_name if req.requested_by == "university" else req.industry_name
        if lead["type"] != req.requested_by or lead["name"] != requester_name:
            raise HTTPException(status_code=403, detail="Only the accepted volunteer can invite collaborators to this project")
        if not (req.progress_summary or "").strip():
            raise HTTPException(status_code=400, detail="Describe the progress so far so the partner can review the project")

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


@app.get("/collaboration-requests/{request_id}/preview")
def preview_collaboration_request_endpoint(request_id: str, party_type: str, party_name: str):
    """What a partner reviews before accepting: the request, the problem, its progress and recent updates.
    Only the two organisations on the request can see it."""
    record = get_collaboration_request(request_id)
    if not record:
        raise HTTPException(status_code=404, detail="Collaboration request not found")
    if party_type not in COLLABORATION_PARTIES or record.party_name(party_type) != party_name:
        raise HTTPException(status_code=403, detail="You are not part of this collaboration request")

    project = None
    updates: List[Dict[str, Any]] = []
    problem = get_problem(record.problem_id) if record.problem_id else None
    if problem:
        parties = get_project_parties(problem)
        project = _project_summary(problem, parties, "invitee")
        updates = [u.model_dump(mode="json") for u in list_updates(problem.id, limit=5)]
    return {"request": record.model_dump(mode="json"), "project": project, "recent_updates": updates}


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

    problem = get_problem(record.problem_id) if req.action == "accept" and record.problem_id else None
    # An existing partner can accept another request (more support); they don't "join" again.
    already_partner = bool(problem) and any(
        other.id != record.id and other.party_name(record.responder) == actor
        for other in list_collaboration_requests(
            university_name=record.university_name, industry_name=record.industry_name,
            problem_id=record.problem_id, status="accepted",
        )
    )
    if problem and already_partner:
        problem_title = problem.title or problem.problem_text
        support = ", ".join(record.support_types) or "additional support"
        for party in get_project_parties(problem):
            if party["type"] == record.requested_by and party["name"] == record.party_name(record.requested_by):
                continue
            is_actor = party["type"] == req.actor_type and party["name"] == actor
            create_notification(
                NotificationRecord(
                    citizen_name=party["name"],
                    audience=party["type"],
                    category="project",
                    type="success",
                    title="Additional support confirmed",
                    message=(
                        f"You agreed to provide {support} on '{problem_title}'."
                        if is_actor
                        else f"{actor} agreed to provide {support} on '{problem_title}'."
                    ),
                    problem_id=problem.id,
                    problem_title=problem_title,
                )
            )
    elif problem:
        # Link the collaborator to the problem so it also shows in their portal's problem lists.
        if record.responder == "industry" and not problem.assigned_industry:
            update_problem(record.problem_id, ProblemUpdate(assigned_industry=record.industry_name))
        elif record.responder == "university" and not problem.assigned_university:
            update_problem(record.problem_id, ProblemUpdate(assigned_university=record.university_name))

        # The accepter is now a workspace party (parties derive from accepted requests);
        # tell everyone involved. The requester already got the "accepted" alert above.
        problem_title = problem.title or problem.problem_text
        for party in get_project_parties(problem):
            if party["type"] == record.requested_by and party["name"] == record.party_name(record.requested_by):
                continue
            joined_self = party["type"] == req.actor_type and party["name"] == actor
            create_notification(
                NotificationRecord(
                    citizen_name=party["name"],
                    audience=party["type"],
                    category="project",
                    type="success",
                    title="You joined the project workspace" if joined_self else "New partner joined the project",
                    message=(
                        f"You are now a collaborator on '{problem_title}'. Open the workspace to see updates and chat."
                        if joined_self
                        else f"{actor} joined '{problem_title}' as a collaborator."
                    ),
                    problem_id=problem.id,
                    problem_title=problem_title,
                )
            )
        _notify_owners(
            problem,
            category="project",
            type="info",
            title="New partner on your problem",
            message=f"{actor} joined {record.party_name(record.requested_by)} to work on '{problem_title}'.",
        )
    return record


# ---------------------------------------------------------------------------
# Project workspaces: accepted problems, their parties, chat and updates
# ---------------------------------------------------------------------------

class ProjectMessageRequest(BaseModel):
    party_type: str
    party_name: str
    author_name: str
    text: str


class ProjectUpdateRequest(BaseModel):
    party_type: str
    party_name: str
    author_name: str
    title: str
    body: Optional[str] = None
    progress: Optional[int] = None


# --- Milestones & points ledger ---------------------------------------------------------------
# FastAPI has no auth of its own (same as every other endpoint here) -- user_id/user_name and
# officer_id/officer_name below are only trustworthy because the Next.js frontend resolves them
# from a real signed-in session before calling these endpoints, on the three actions that write
# permanent ledger credit: joining a project, submitting a milestone, and an officer's decision.

class JoinProjectRequest(BaseModel):
    party_type: str  # "university" | "industry" -- the caller's own organization
    party_name: str
    user_id: str
    user_name: str
    role: Optional[str] = None


class MilestoneSubmissionRequest(BaseModel):
    party_type: str
    party_name: str
    user_id: str
    user_name: str
    milestone_type: str
    note: Optional[str] = None
    links: List[str] = []


class MilestoneVerificationDecision(BaseModel):
    decision: Literal["approve", "reject"]
    note: Optional[str] = None
    officer_id: str
    officer_name: str


def _project_summary(problem: ProblemBase, parties: List[Dict[str, str]], my_role: str) -> Dict[str, Any]:
    updates = list_updates(problem.id, limit=1)
    return {
        "id": problem.id,
        "title": problem.title or problem.problem_text,
        "description": problem.description or problem.problem_text,
        "category": problem.category,
        "location": problem.location,
        "citizen_name": problem.citizen_name,
        "co_owners": problem.co_owners,
        "status": problem.status,
        "progress": problem.progress,
        "required_capabilities": problem.required_capabilities,
        "parties": parties,
        "my_role": my_role,
        "latest_update": updates[0].model_dump(mode="json") if updates else None,
        "updated_at": problem.updated_at.isoformat(),
    }


def _require_party(problem_id: str, party_type: str, party_name: str):
    """Workspace content is only for the problem giver (citizen, role 'owner'), the lead and accepted collaborators."""
    problem = get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Project not found")
    parties = get_project_parties(problem)
    role = get_viewer_role(problem, parties, party_type, party_name)
    if not role:
        raise HTTPException(status_code=403, detail="You are not part of this project")
    return problem, parties, role


def _notify_other_parties(problem: ProblemBase, parties: List[Dict[str, str]], sender_type: str, sender_name: str,
                          type: str, title: str, message: str) -> None:
    for party in parties:
        if party["type"] == sender_type and party["name"] == sender_name:
            continue
        create_notification(
            NotificationRecord(
                citizen_name=party["name"],
                audience=party["type"],
                category="project",
                type=type,
                title=title,
                message=message,
                problem_id=problem.id,
                problem_title=problem.title or problem.problem_text,
            )
        )


@app.get("/projects")
def list_projects_endpoint(party_type: str, party_name: str):
    """Accepted problems where this university/industry is the lead or a collaborator,
    or (party_type=citizen) problems this citizen reported that have a workspace."""
    if party_type != "citizen":
        _validate_solver(party_type, party_name)
    return [
        _project_summary(item["problem"], item["parties"], item["my_role"])
        for item in list_projects_for_party(party_type, party_name)
    ]


@app.get("/projects/{problem_id}")
def get_project_endpoint(problem_id: str, party_type: str, party_name: str):
    problem, parties, role = _require_party(problem_id, party_type, party_name)
    return _project_summary(problem, parties, role)


@app.get("/projects/{problem_id}/messages", response_model=List[ProjectMessage])
def list_project_messages_endpoint(problem_id: str, party_type: str, party_name: str, limit: int = 200):
    _require_party(problem_id, party_type, party_name)
    return list_messages(problem_id, limit=min(max(limit, 1), 500))


@app.post("/projects/{problem_id}/messages", response_model=ProjectMessage, status_code=201)
def post_project_message_endpoint(problem_id: str, req: ProjectMessageRequest):
    _require_party(problem_id, req.party_type, req.party_name)
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    if len(text) > 2000:
        raise HTTPException(status_code=400, detail="Message must be 2000 characters or fewer")
    return add_message(ProjectMessage(
        problem_id=problem_id, author_type=req.party_type, author_org=req.party_name,
        author_name=req.author_name.strip() or req.party_name, text=text,
    ))


@app.get("/projects/{problem_id}/updates", response_model=List[ProjectUpdate])
def list_project_updates_endpoint(problem_id: str, party_type: str, party_name: str, limit: int = 200):
    _require_party(problem_id, party_type, party_name)
    return list_updates(problem_id, limit=min(max(limit, 1), 500))


# --- Milestones, points ledger, badges, certificates, leaderboard ------------------------------

@app.post("/projects/{problem_id}/members", response_model=points_storage.ProjectMember, status_code=201)
def join_project_endpoint(problem_id: str, req: JoinProjectRequest):
    """A named person joins their organization's team on this project, so future verified
    milestones credit them individually as well as their organization as a whole."""
    try:
        return points_storage.join_project(
            problem_id, req.user_id, req.user_name, req.party_type, req.party_name, role=req.role,
        )
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@app.get("/projects/{problem_id}/members", response_model=List[points_storage.ProjectMember])
def list_project_members_endpoint(problem_id: str, party_type: str, party_name: str):
    _require_party(problem_id, party_type, party_name)
    return points_storage.list_project_members(problem_id)


MAX_MILESTONE_ATTACHMENTS = MAX_UPDATE_ATTACHMENTS


def _submit_milestone(
    problem_id: str, party_type: str, party_name: str, user_id: str, user_name: str, milestone_type: str,
    note: Optional[str], links: List[str], attachments: List[Dict[str, Any]],
) -> points_storage.Milestone:
    """Shared by the JSON and the multipart submit endpoints: authorise, store, then tell the
    other parties. Raises HTTPException, so a caller that has already saved files can clean them up."""
    if party_type not in COLLABORATION_PARTIES:
        raise HTTPException(status_code=403, detail="Only the university or industry team may submit milestones")
    problem, parties, _role = _require_party(problem_id, party_type, party_name)
    try:
        links = points_storage.normalize_links(links)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    try:
        milestone = points_storage.submit_milestone(
            problem_id, milestone_type, user_id, user_name, party_type, party_name,
            note=note, attachments=attachments, links=links,
        )
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

    title = problem.title or problem.problem_text
    evidence = []
    if attachments:
        evidence.append(f"{len(attachments)} file{'' if len(attachments) == 1 else 's'}")
    if milestone.submitted_links:
        evidence.append(f"{len(milestone.submitted_links)} link{'' if len(milestone.submitted_links) == 1 else 's'}")
    evidence_note = f" It includes {' and '.join(evidence)} as evidence." if evidence else ""
    _notify_other_parties(
        problem, parties, sender_type=party_type, sender_name=party_name,
        type="info", title="Milestone submitted for verification",
        message=(
            f"{party_name} submitted '{milestone.milestone_type.replace('_', ' ')}' for '{title}', "
            f"awaiting government verification.{evidence_note}"
        ),
    )
    return milestone


@app.post("/projects/{problem_id}/milestones", response_model=points_storage.Milestone, status_code=201)
def submit_milestone_endpoint(problem_id: str, req: MilestoneSubmissionRequest):
    """Submit a milestone with a note and links only. See .../milestones/with-attachments for files."""
    return _submit_milestone(
        problem_id, req.party_type, req.party_name, req.user_id, req.user_name, req.milestone_type,
        req.note, req.links, attachments=[],
    )


@app.post("/projects/{problem_id}/milestones/with-attachments", response_model=points_storage.Milestone, status_code=201)
async def submit_milestone_with_attachments_endpoint(
    problem_id: str,
    party_type: str = Form(...),
    party_name: str = Form(...),
    user_id: str = Form(...),
    user_name: str = Form(...),
    milestone_type: str = Form(...),
    note: Optional[str] = Form(None),
    links: List[str] = Form(default=[]),
    files: List[UploadFile] = File(default=[]),
):
    """Same as POST .../milestones, but the submission can carry evidence files -- photos, videos,
    PDFs and Office documents, exactly what project updates accept (see
    ALLOWED_WORKSPACE_ATTACHMENT_TYPES) -- as well as links."""
    if len(files) > MAX_MILESTONE_ATTACHMENTS:
        raise HTTPException(
            status_code=400,
            detail=f"You selected {len(files)} files; a milestone can have at most {MAX_MILESTONE_ATTACHMENTS}.",
        )
    # Reject an unauthorised caller or bad links *before* writing anything to disk.
    if party_type not in COLLABORATION_PARTIES:
        raise HTTPException(status_code=403, detail="Only the university or industry team may submit milestones")
    _require_party(problem_id, party_type, party_name)
    try:
        clean_links = points_storage.normalize_links(links)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    attachments = await _store_attachments(files, ALLOWED_WORKSPACE_ATTACHMENT_TYPES, WORKSPACE_ATTACHMENT_LABEL)
    try:
        return _submit_milestone(
            problem_id, party_type, party_name, user_id, user_name, milestone_type, note, clean_links, attachments,
        )
    except Exception:
        _discard_attachments(attachments)
        raise


@app.get("/projects/{problem_id}/milestones")
def list_project_milestones_endpoint(problem_id: str, party_type: str, party_name: str):
    _require_party(problem_id, party_type, party_name)
    return {
        "milestones": points_storage.list_milestones(problem_id),
        "point_events": points_storage.list_point_events(problem_id=problem_id),
    }


@app.get("/milestones", response_model=List[points_storage.Milestone])
def list_pending_milestones_endpoint(status: str = "submitted", limit: int = 100):
    """The government officer's review queue -- unfiltered by party, same as the existing problem
    verification queue (GET /problems), since the government portal isn't gated at this layer."""
    if status != "submitted":
        raise HTTPException(status_code=400, detail="Only status=submitted is supported")
    return points_storage.list_pending_milestones(limit=min(max(limit, 1), 500))


@app.patch("/milestones/{milestone_id}/verification")
def verify_milestone_endpoint(milestone_id: str, decision: MilestoneVerificationDecision):
    if decision.decision == "reject" and not (decision.note or "").strip():
        raise HTTPException(status_code=400, detail="A rejection note is required")
    try:
        milestone, new_events = points_storage.verify_milestone(
            milestone_id, decision.decision, decision.note, decision.officer_id, decision.officer_name,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    problem = get_problem(milestone.problem_id)
    if problem:
        parties = get_project_parties(problem)
        title = problem.title or problem.problem_text
        verb = "verified" if milestone.status == "verified" else "rejected"
        message = f"Your '{milestone.milestone_type.replace('_', ' ')}' milestone for '{title}' was {verb}" + (
            f": {milestone.decision_note}" if milestone.decision_note else "."
        )
        # sender_type="government" never matches a university/industry party, so this reaches both
        # the lead and any collaborator -- whoever submitted it and whoever didn't.
        _notify_other_parties(
            problem, parties, sender_type="government", sender_name=decision.officer_name,
            type="success" if verb == "verified" else "warning",
            title=f"Milestone {verb}", message=message,
        )
        _notify_owners(problem, category="milestone", type="update", title=f"Project milestone {verb}", message=message)
    return {"milestone": milestone, "new_point_events": new_events}


@app.get("/points/summary")
def points_summary_endpoint(actor_type: str, actor_id: str):
    if actor_type not in ("user", "university", "industry"):
        raise HTTPException(status_code=400, detail="actor_type must be 'user', 'university', or 'industry'")
    return points_storage.summarize_actor(actor_type, actor_id)


@app.get("/certificates")
def certificates_endpoint(actor_type: str, actor_id: str):
    if actor_type not in ("user", "university", "industry"):
        raise HTTPException(status_code=400, detail="actor_type must be 'user', 'university', or 'industry'")
    return points_storage.list_certificates(actor_type, actor_id)


@app.get("/leaderboard/organizations")
def organization_leaderboard_endpoint(
    org_type: str = "all", region: Optional[str] = None, period: Optional[str] = None, limit: int = 50,
):
    actor_types = ["university", "industry"] if org_type == "all" else [org_type]
    if any(t not in ("university", "industry") for t in actor_types):
        raise HTTPException(status_code=400, detail="org_type must be 'all', 'university', or 'industry'")
    return points_storage.list_leaderboard(actor_types, region=region, period=period, limit=min(max(limit, 1), 200))


@app.get("/leaderboard/users")
def user_leaderboard_endpoint(region: Optional[str] = None, period: Optional[str] = None, limit: int = 50):
    return points_storage.list_leaderboard(["user"], region=region, period=period, limit=min(max(limit, 1), 200))


# --- Downloading workspace files -------------------------------------------------------------
# The frontend runs on a different origin than this API, where browsers ignore <a download> and
# open images/PDFs/videos in a tab instead. These endpoints send files as attachments under their
# original names. Anyone who can open the workspace (lead, collaborators, the citizen) may download.

_UNSAFE_FILENAME_CHARS = re.compile(r'[<>:"/\\|?*\x00-\x1f]')


def _safe_filename(name: str, fallback: str = "file") -> str:
    cleaned = _UNSAFE_FILENAME_CHARS.sub("_", name).strip().strip(".")
    return cleaned[:150] or fallback


def _unique_name(name: str, used: set) -> str:
    candidate, number = name, 2
    stem, extension = os.path.splitext(name)
    while candidate.lower() in used:
        candidate = f"{stem} ({number}){extension}"
        number += 1
    used.add(candidate.lower())
    return candidate


def _zip_download(entries: List[Tuple[str, Optional[str], str]], zip_name: str) -> FileResponse:
    """entries: (path inside the zip, file on disk or None if missing, original name)."""
    present = [(arcname, path) for arcname, path, _ in entries if path]
    if not present:
        raise HTTPException(status_code=404, detail="None of these files are available on the server any more")
    missing = [name for _, path, name in entries if not path]
    handle = tempfile.NamedTemporaryFile(delete=False, suffix=".zip")
    handle.close()
    try:
        # Stored, not compressed: photos, videos, PDFs and Office files are already compressed.
        with zipfile.ZipFile(handle.name, "w", compression=zipfile.ZIP_STORED) as archive:
            for arcname, path in present:
                archive.write(path, arcname)
            if missing:
                archive.writestr(
                    "MISSING FILES.txt",
                    "These attachments could not be found on the server and are not included:\n"
                    + "\n".join(f"- {name}" for name in missing),
                )
    except Exception:
        os.remove(handle.name)
        raise
    return FileResponse(
        handle.name, media_type="application/zip", filename=zip_name,
        background=BackgroundTask(os.remove, handle.name),
    )


@app.get("/projects/{problem_id}/updates/{update_id}/attachments/{index}/download")
def download_update_attachment_endpoint(problem_id: str, update_id: str, index: int, party_type: str, party_name: str):
    """One attachment, saved under its original file name."""
    _require_party(problem_id, party_type, party_name)
    update = _find_update(problem_id, update_id)
    if not 0 <= index < len(update.attachments):
        raise HTTPException(status_code=404, detail="Attachment not found")
    attachment = update.attachments[index]
    path = _upload_path(attachment)
    if not path:
        raise HTTPException(status_code=404, detail=f"'{attachment['name']}' is no longer available on the server")
    return FileResponse(
        path, media_type=attachment.get("content_type") or "application/octet-stream",
        filename=_safe_filename(attachment["name"]),
    )


@app.get("/projects/{problem_id}/updates/{update_id}/attachments.zip")
def download_update_attachments_zip_endpoint(problem_id: str, update_id: str, party_type: str, party_name: str):
    """Every file on one update, as a zip."""
    _require_party(problem_id, party_type, party_name)
    update = _find_update(problem_id, update_id)
    if not update.attachments:
        raise HTTPException(status_code=404, detail="This update has no attachments")
    used: set = set()
    entries = [
        (_unique_name(_safe_filename(a["name"]), used), _upload_path(a), a["name"])
        for a in update.attachments
    ]
    return _zip_download(entries, f"{_safe_filename(update.title, 'update')[:60]} - files.zip")


@app.get("/projects/{problem_id}/attachments.zip")
def download_project_attachments_zip_endpoint(problem_id: str, party_type: str, party_name: str):
    """Every file in the workspace, one folder per update."""
    problem, _, _ = _require_party(problem_id, party_type, party_name)
    updates = [u for u in reversed(list_updates(problem_id, limit=500)) if u.attachments]  # oldest first
    if not updates:
        raise HTTPException(status_code=404, detail="No files have been shared in this workspace yet")
    folders: set = set()
    entries: List[Tuple[str, Optional[str], str]] = []
    for update in updates:
        folder = _unique_name(f"{update.created_at:%Y-%m-%d} - {_safe_filename(update.title, 'update')[:60]}", folders)
        used: set = set()
        for attachment in update.attachments:
            entries.append((f"{folder}/{_unique_name(_safe_filename(attachment['name']), used)}", _upload_path(attachment), attachment["name"]))
    title = _safe_filename(problem.title or problem.problem_text, "workspace")[:60]
    return _zip_download(entries, f"{title} - all files.zip")


def _check_can_post_update(problem_id: str, party_type: str, party_name: str, title: str, progress: Optional[int]):
    """Everything that can reject an update, checked before any uploaded file is written to disk."""
    problem, parties, role = _require_party(problem_id, party_type, party_name)
    if role == "owner":
        raise HTTPException(status_code=403, detail="Progress updates are posted by the solving organisations; use the chat to respond")
    title = title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Update title is required")
    if progress is not None:
        if role != "lead":
            raise HTTPException(status_code=403, detail="Only the project lead can change overall progress")
        if not 0 <= progress <= 100:
            raise HTTPException(status_code=400, detail="Progress must be between 0 and 100")
    return problem, parties, role, title


def _find_update(problem_id: str, update_id: str) -> ProjectUpdate:
    update = next((u for u in list_updates(problem_id, limit=500) if u.id == update_id), None)
    if not update:
        raise HTTPException(status_code=404, detail="Update not found")
    return update


def _create_project_update(
    problem_id: str, party_type: str, party_name: str, author_name: str,
    title: str, body: str, progress: Optional[int], attachments: List[Dict[str, Any]],
) -> ProjectUpdate:
    """Shared by the JSON 'post update' endpoint and the multipart one that accepts file attachments.
    Any party can post an update; only the lead can move overall progress. Other parties and the
    citizen who reported the problem are alerted."""
    problem, parties, role, title = _check_can_post_update(problem_id, party_type, party_name, title, progress)

    update = add_update(ProjectUpdate(
        problem_id=problem_id, author_type=party_type, author_org=party_name,
        author_name=author_name.strip() or party_name, title=title,
        body=body.strip(), progress=progress, attachments=attachments,
    ))
    if progress is not None:
        update_problem(problem_id, ProblemUpdate(
            progress=progress,
            status="completed" if progress >= 100 else "in_progress",
        ))

    problem_title = problem.title or problem.problem_text
    progress_note = f" Progress is now {progress}%." if progress is not None else ""
    # Say so when files came with the update, so partners know there is something to look at.
    files_note = (
        f" Includes {len(attachments)} attachment{'s' if len(attachments) != 1 else ''}: "
        f"{', '.join(a['name'] for a in attachments)}."
        if attachments else ""
    )
    _notify_other_parties(
        problem, parties, party_type, party_name, "update", "New project update",
        f"{party_name} posted '{title}' on '{problem_title}'.{progress_note}{files_note}",
    )
    _notify_owners(
        problem,
        category="project",
        type="success" if progress == 100 else "update",
        title="Problem solved" if progress == 100 else "Progress update on your problem",
        message=f"{party_name}: {title}.{progress_note}{files_note}",
    )
    return update


@app.post("/projects/{problem_id}/updates", response_model=ProjectUpdate, status_code=201)
def post_project_update_endpoint(problem_id: str, req: ProjectUpdateRequest):
    """Post a text-only update (no attachments). See POST .../updates/with-attachments for files."""
    return _create_project_update(
        problem_id, req.party_type, req.party_name, req.author_name,
        req.title, req.body or "", req.progress, attachments=[],
    )


@app.post("/projects/{problem_id}/updates/with-attachments", response_model=ProjectUpdate, status_code=201)
async def post_project_update_with_attachments_endpoint(
    problem_id: str,
    party_type: str = Form(...),
    party_name: str = Form(...),
    author_name: str = Form(...),
    title: str = Form(...),
    body: str = Form(""),
    progress: Optional[int] = Form(None),
    files: List[UploadFile] = File(default=[]),
):
    """Same as POST .../updates, but the update can carry photos, videos, PDFs, and Office
    documents (Word/Excel/PowerPoint) -- see ALLOWED_WORKSPACE_ATTACHMENT_TYPES."""
    if len(files) > MAX_UPDATE_ATTACHMENTS:
        raise HTTPException(
            status_code=400,
            detail=f"You selected {len(files)} files; an update can have at most {MAX_UPDATE_ATTACHMENTS}.",
        )
    _check_can_post_update(problem_id, party_type, party_name, title, progress)
    attachments = await _store_attachments(files, ALLOWED_WORKSPACE_ATTACHMENT_TYPES, WORKSPACE_ATTACHMENT_LABEL)
    try:
        return _create_project_update(problem_id, party_type, party_name, author_name, title, body, progress, attachments)
    except Exception:
        _discard_attachments(attachments)
        raise


@app.post("/projects/{problem_id}/updates/{update_id}/attachments", response_model=ProjectUpdate)
async def add_project_update_attachments_endpoint(
    problem_id: str,
    update_id: str,
    party_type: str = Form(...),
    party_name: str = Form(...),
    files: List[UploadFile] = File(...),
):
    """Attach more files to an update that was already posted -- multiple attachment rounds are
    allowed, not just what was picked at the moment of posting. Only that update's own author may
    add to it (an outsider re-labelling someone else's evidence would defeat the point of it).
    Every file is validated and saved the same way as at creation, and the confirmed, saved
    attachment list is always returned so the caller has an authoritative answer, not a guess,
    about what actually made it into the workspace."""
    problem, parties, role = _require_party(problem_id, party_type, party_name)
    if role == "owner":
        raise HTTPException(status_code=403, detail="Only the organisation that posted the update can attach files to it")
    if not files:
        raise HTTPException(status_code=400, detail="At least one file is required")

    update = _find_update(problem_id, update_id)
    if update.author_type != party_type or update.author_org != party_name:
        raise HTTPException(status_code=403, detail="Only the author of this update can attach files to it")
    if len(update.attachments) + len(files) > MAX_UPDATE_ATTACHMENTS:
        remaining = MAX_UPDATE_ATTACHMENTS - len(update.attachments)
        raise HTTPException(
            status_code=400,
            detail=f"An update can have at most {MAX_UPDATE_ATTACHMENTS} attachments in total "
                   f"({len(update.attachments)} already attached, so you can add {remaining} more).",
        )

    new_attachments = await _store_attachments(files, ALLOWED_WORKSPACE_ATTACHMENT_TYPES, WORKSPACE_ATTACHMENT_LABEL)
    updated = append_update_attachments(problem_id, update_id, new_attachments)
    if not updated:
        _discard_attachments(new_attachments)
        raise HTTPException(status_code=404, detail="Update not found")

    problem_title = problem.title or problem.problem_text
    names = ", ".join(a["name"] for a in new_attachments)
    message = f"{party_name} added {names} to their update '{update.title}' on '{problem_title}'."
    _notify_other_parties(problem, parties, party_type, party_name, "update", "New attachment on project update", message)
    # The citizen owners can view the workspace too, so they hear about new files the same as new updates.
    _notify_owners(
        problem,
        category="project",
        type="update",
        title="New files on your problem's progress",
        message=message,
    )
    return updated


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


def _is_allowed_type(content_type: str, allowed_types: set) -> bool:
    return content_type in allowed_types or content_type.startswith(("image/", "video/"))


async def _store_attachment(
    upload: UploadFile,
    allowed_types: set,
    max_size: int = MAX_EVIDENCE_SIZE,
    allowed_label: str = "images, videos, PDFs or Word documents",
) -> Dict[str, Any]:
    """Validate one upload against `allowed_types`/`max_size`, save it under UPLOAD_DIR, and
    return its {name, content_type, size, url} record. Shared by the evidence and project-update
    upload endpoints so both accept/reject files the same way."""
    if not upload.filename:
        raise HTTPException(status_code=400, detail="Every upload must have a filename")
    extension = os.path.splitext(upload.filename)[1].lower()
    # Browsers often send Office files (and sometimes others) without a type, or as a generic
    # "application/octet-stream". Fall back to the file extension instead of rejecting a valid file.
    content_type = (upload.content_type or "").lower()
    if not _is_allowed_type(content_type, allowed_types):
        guessed = EXTENSION_CONTENT_TYPES.get(extension)
        if guessed and _is_allowed_type(guessed, allowed_types):
            content_type = guessed
    # Named per-file (not just "a file"), so when several are submitted together the response
    # says exactly which one was rejected instead of leaving the sender to guess.
    if not _is_allowed_type(content_type, allowed_types):
        kind = extension.lstrip(".").upper() or upload.content_type or "this kind of"
        raise HTTPException(
            status_code=415,
            detail=f"'{upload.filename}' can't be uploaded: {kind} files aren't allowed. Upload {allowed_label}.",
        )
    content = await upload.read()
    if not content:
        raise HTTPException(status_code=400, detail=f"'{upload.filename}' is empty (0 bytes). Pick the file again.")
    if len(content) > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"'{upload.filename}' is {len(content) / (1024 * 1024):.1f} MB; "
                   f"files must be {max_size // (1024 * 1024)} MB or smaller.",
        )
    stored_name = f"{uuid.uuid4().hex}{extension}"
    stored_path = os.path.join(UPLOAD_DIR, stored_name)
    try:
        with open(stored_path, "wb") as output:
            output.write(content)
    except OSError as e:
        # Surfaced distinctly from a validation failure, so the client can tell "rejected" apart
        # from "the server failed to save it" -- both are reasons a file isn't properly attached.
        raise HTTPException(status_code=500, detail=f"'{upload.filename}' could not be saved: {e}")
    if not os.path.exists(stored_path) or os.path.getsize(stored_path) != len(content):
        # Belt-and-braces: confirm the write actually landed before telling the caller it succeeded.
        raise HTTPException(status_code=500, detail=f"'{upload.filename}' was not saved correctly")
    return {"name": upload.filename, "content_type": content_type, "size": len(content), "url": f"/uploads/{stored_name}"}


def _upload_path(attachment: Dict[str, Any]) -> Optional[str]:
    """Absolute path of a stored attachment, or None if it isn't a file inside UPLOAD_DIR."""
    stored_name = os.path.basename(str(attachment.get("url", "")))
    if not stored_name:
        return None
    path = os.path.realpath(os.path.join(UPLOAD_DIR, stored_name))
    if not path.startswith(os.path.realpath(UPLOAD_DIR) + os.sep) or not os.path.isfile(path):
        return None
    return path


def _discard_attachments(attachments: List[Dict[str, Any]]) -> None:
    for attachment in attachments:
        path = _upload_path(attachment)
        if path:
            try:
                os.remove(path)
            except OSError:
                logger.warning("Could not remove orphaned upload %s", path)


async def _store_attachments(
    uploads: List[UploadFile], allowed_types: set, allowed_label: str,
) -> List[Dict[str, Any]]:
    """Store a batch all-or-nothing: if any file is rejected, the ones already saved are deleted,
    so a failed upload never leaves some of its files half-attached."""
    stored: List[Dict[str, Any]] = []
    try:
        for upload in uploads:
            stored.append(await _store_attachment(upload, allowed_types, allowed_label=allowed_label))
    except Exception:
        _discard_attachments(stored)
        raise
    return stored


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
        attachments.append(await _store_attachment(upload, ALLOWED_EVIDENCE_TYPES))

    updated = update_problem(
        problem_id,
        ProblemUpdate(
            evidence_provided=[item["name"] for item in attachments],
            evidence_attachments=attachments,
        ),
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Problem not found")
    _notify_owners(
        updated,
        type="info",
        title="Evidence submitted",
        message=f"Evidence for your problem '{updated.title or updated.problem_text}' was submitted for government review.",
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


@app.get("/problems/{problem_id}/similarities")
def get_problem_similarities_endpoint(problem_id: str):
    """The full similarity audit trail for one problem -- every existing problem it was
    compared against at submission time, with the score breakdown, for the government
    dashboard's 'why was this flagged' view."""
    if not get_problem(problem_id):
        raise HTTPException(status_code=404, detail="Problem not found")
    rows = list_problem_similarities(problem_id)
    results = []
    for row in rows:
        other_id = row["problem_b_id"] if row["problem_a_id"] == problem_id else row["problem_a_id"]
        other = get_problem(other_id)
        results.append({
            "other_problem_id": other_id,
            "other_problem_title": (other.title or other.problem_text) if other else "(deleted problem)",
            "other_problem_status": other.status if other else None,
            "semantic_score": row["semantic_score"],
            "location_score": row["location_score"],
            "domain_score": row["domain_score"],
            "affected_area_score": row["affected_area_score"],
            "characteristics_score": row["characteristics_score"],
            "overall_score": row["overall_score"],
            "tier": row["tier"],
            "created_at": row["created_at"],
        })
    return results


class DuplicateReviewDecision(BaseModel):
    decision: Literal["distinct", "duplicate"]
    officer: str = "Government Officer"
    note: Optional[str] = None
    merged_into_id: Optional[str] = None  # only for "duplicate"; defaults to duplicate_of_id


@app.post("/problems/{problem_id}/duplicate-decision", response_model=ProblemBase)
def duplicate_decision_endpoint(problem_id: str, decision: DuplicateReviewDecision):
    """
    Government resolves a POTENTIAL_DUPLICATE flag (the 60-89% tier): the AI only ever
    recommends here, it never auto-decides.

        distinct  -> clears the flag; the problem carries on through normal verification
        duplicate -> ends this problem as a duplicate of the other one (same terminal
                      status the auto-block tier uses, so both paths look the same
                      to the citizen and to any dashboard filtering on status)

    Merging two or more genuinely-the-same reports into one is a separate, negotiated
    workflow -- see POST /merge-requests -- since it changes who owns the resulting problem
    and requires each affected citizen's consent, not just a government call.
    """
    problem = get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    if decision.decision == "duplicate" and not (decision.note or "").strip():
        raise HTTPException(status_code=400, detail="A note explaining the decision is required")

    title = problem.title or problem.problem_text

    if decision.decision == "distinct":
        updated = update_problem(problem_id, ProblemUpdate(duplicate_decision=DuplicateDecision.DISTINCT))
        create_notification(
            NotificationRecord(
                citizen_name=problem.citizen_name,
                type="update",
                title="Similarity review cleared",
                message=f"'{title}' was reviewed and is being treated as a distinct problem.",
                problem_id=problem.id,
                problem_title=title,
            )
        )
        return updated

    if decision.decision == "duplicate":
        updated = update_problem(problem_id, ProblemUpdate(
            status=ProblemStatus.DUPLICATE_REJECTED,
            duplicate_decision=DuplicateDecision.DUPLICATE,
            duplicate_of_id=decision.merged_into_id or problem.duplicate_of_id,
            verification_notes=decision.note,
        ))
        create_notification(
            NotificationRecord(
                citizen_name=problem.citizen_name,
                type="update",
                title="Problem rejected as a duplicate",
                message=f"'{title}' was reviewed and closed as a duplicate: {decision.note}",
                problem_id=problem.id,
                problem_title=title,
            )
        )
        return updated

    # duplicate
    updated = update_problem(problem_id, ProblemUpdate(
        status=ProblemStatus.DUPLICATE_REJECTED,
        duplicate_decision=DuplicateDecision.DUPLICATE,
        duplicate_of_id=decision.merged_into_id or problem.duplicate_of_id,
        verification_notes=decision.note,
    ))
    create_notification(
        NotificationRecord(
            citizen_name=problem.citizen_name,
            type="update",
            title="Problem rejected as a duplicate",
            message=f"'{title}' was reviewed and closed as a duplicate: {decision.note}",
            problem_id=problem.id,
            problem_title=title,
        )
    )
    return updated


NON_MERGEABLE_STATUSES = {"assigned", "in_progress", "completed", "duplicate_rejected", "merged"}


class CreateMergeRequestBody(BaseModel):
    primary_problem_id: str
    candidate_problem_ids: List[str]
    officer: str = "Government Officer"
    note: Optional[str] = None


@app.post("/merge-requests", response_model=MergeRequestRecord)
def create_merge_request_endpoint(body: CreateMergeRequestBody):
    """Government proposes that up to MAX_CO_OWNERS other reports are the same problem as
    `primary_problem_id`. Nothing is merged yet -- each candidate owner must accept, and then
    the primary owner must separately approve each acceptance (see /respond and /approve)."""
    if not body.candidate_problem_ids:
        raise HTTPException(status_code=400, detail="At least one candidate problem is required")
    if len(body.candidate_problem_ids) > MAX_CO_OWNERS:
        raise HTTPException(
            status_code=400,
            detail=f"A merge request can include at most {MAX_CO_OWNERS} candidate problems (3 owners total)",
        )
    if body.primary_problem_id in body.candidate_problem_ids:
        raise HTTPException(status_code=400, detail="The primary problem cannot also be a candidate")

    primary = get_problem(body.primary_problem_id)
    if not primary:
        raise HTTPException(status_code=404, detail="Primary problem not found")
    if primary.status in NON_MERGEABLE_STATUSES:
        raise HTTPException(status_code=409, detail="The primary problem is not in a state that can receive a merge")

    candidates = []
    for candidate_id in body.candidate_problem_ids:
        candidate = get_problem(candidate_id)
        if not candidate:
            raise HTTPException(status_code=404, detail=f"Candidate problem {candidate_id} not found")
        if candidate.status in NON_MERGEABLE_STATUSES:
            raise HTTPException(
                status_code=409,
                detail=f"'{candidate.title or candidate.problem_text}' cannot be merged (status: {candidate.status})",
            )
        candidates.append(candidate)

    try:
        record = create_merge_request(primary, candidates, body.officer, body.note)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    for candidate in candidates:
        create_notification(
            NotificationRecord(
                citizen_name=candidate.citizen_name,
                type="info",
                title="Is this the same problem as an existing report?",
                message=(
                    f"A government officer thinks your report '{candidate.title or candidate.problem_text}' "
                    f"may be the same problem as '{primary.title or primary.problem_text}' "
                    f"(reported by {primary.citizen_name}). If you agree, you can accept and join as a "
                    f"co-owner of that report."
                ),
                problem_id=candidate.id,
                problem_title=candidate.title or candidate.problem_text,
            )
        )
    create_notification(
        NotificationRecord(
            citizen_name=primary.citizen_name,
            type="info",
            title="Merge request sent",
            message=(
                f"You proposed merging {len(candidates)} similar report(s) into "
                f"'{primary.title or primary.problem_text}'. You'll be notified as each owner responds, "
                f"and you'll need to approve anyone who accepts before they become a co-owner."
            ),
            problem_id=primary.id,
            problem_title=primary.title or primary.problem_text,
        )
    )
    return record


@app.get("/merge-requests", response_model=List[MergeRequestRecord])
def list_merge_requests_endpoint(citizen_name: Optional[str] = None, problem_id: Optional[str] = None, limit: int = 200):
    return list_merge_requests(citizen_name=citizen_name, problem_id=problem_id, limit=min(max(limit, 1), 500))


@app.get("/merge-requests/{request_id}", response_model=MergeRequestRecord)
def get_merge_request_endpoint(request_id: str):
    record = get_merge_request(request_id)
    if not record:
        raise HTTPException(status_code=404, detail="Merge request not found")
    return record


class MergeRequestResponseBody(BaseModel):
    problem_id: str
    citizen_name: str
    response: Literal["accepted", "declined"]


@app.post("/merge-requests/{request_id}/respond", response_model=MergeRequestRecord)
def respond_to_merge_request_endpoint(request_id: str, body: MergeRequestResponseBody):
    """A candidate problem's owner accepts or declines. Accepting alone does not make them a
    co-owner yet -- the primary owner still has to approve (see /approve)."""
    try:
        record = respond_to_merge_request(request_id, body.problem_id, body.citizen_name, body.response)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

    member = next(m for m in record.members if m.problem_id == body.problem_id)
    verb = "accepted" if body.response == "accepted" else "declined"
    create_notification(
        NotificationRecord(
            citizen_name=record.primary_citizen_name,
            type="update",
            title=f"Merge request {verb}",
            message=(
                f"{member.citizen_name} {verb} the request to merge '{member.problem_title}' into "
                f"'{record.primary_problem_title}'."
                + (" You can now approve them as a co-owner." if body.response == "accepted" else "")
            ),
            problem_id=record.primary_problem_id,
            problem_title=record.primary_problem_title,
        )
    )
    return record


class ApproveMergeRequestBody(BaseModel):
    problem_id: str
    citizen_name: str  # must be the primary problem's owner


@app.post("/merge-requests/{request_id}/approve", response_model=MergeRequestRecord)
def approve_merge_request_endpoint(request_id: str, body: ApproveMergeRequestBody):
    """The primary owner approves a candidate who already accepted. This is the point at which
    the candidate's problem is actually retired and its owner becomes a co-owner of the primary."""
    try:
        record, member = approve_merge_request_member(request_id, body.problem_id, body.citizen_name)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

    primary = get_problem(record.primary_problem_id)
    candidate = get_problem(body.problem_id)
    if primary and candidate:
        new_co_owners = list(dict.fromkeys([*primary.co_owners, candidate.citizen_name]))
        update_problem(primary.id, ProblemUpdate(
            co_owners=new_co_owners,
            supporters=primary.supporters + candidate.supporters,
            evidence_attachments=[*primary.evidence_attachments, *candidate.evidence_attachments],
        ))
        update_problem(candidate.id, ProblemUpdate(
            status=ProblemStatus.MERGED,
            duplicate_decision=DuplicateDecision.MERGED,
            merged_into_id=primary.id,
            merge_reason=f"Joined as a co-owner of '{primary.title or primary.problem_text}'",
        ))
        create_notification(
            NotificationRecord(
                citizen_name=candidate.citizen_name,
                type="success",
                title="You're now a co-owner",
                message=(
                    f"{primary.citizen_name} approved your request to join "
                    f"'{primary.title or primary.problem_text}'. You can now see and act on it from your "
                    f"problems list."
                ),
                problem_id=primary.id,
                problem_title=primary.title or primary.problem_text,
            )
        )
    return record


@app.post("/problems/{problem_id}/resubmit", response_model=ProblemBase)
def resubmit_problem_endpoint(problem_id: str, action: CitizenProblemAction):
    """Let the owning citizen respond to a proof request and return a problem to review."""
    problem = get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    if not is_owner(problem, action.citizen_name):
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
    _notify_owners(
        updated,
        type="success",
        title="Problem resubmitted",
        message=f"Your problem '{title}' was resubmitted for government review.",
    )
    return updated


@app.delete("/problems/{problem_id}")
def delete_problem_endpoint(problem_id: str, citizen_name: str):
    """Delete only an unverified problem owned by the requesting citizen."""
    problem = get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    if not is_owner(problem, citizen_name):
        raise HTTPException(status_code=403, detail="You can only delete your own problems")
    if problem.status == "verified":
        raise HTTPException(status_code=409, detail="Verified problems cannot be deleted")
    _notify_owners(
        problem,
        type="info",
        title="Problem deleted",
        message=f"Your problem '{problem.title or problem.problem_text}' was deleted by {citizen_name}.",
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


@app.get("/problems/{problem_id}/team-matches")
def problem_team_matches_endpoint(problem_id: str, top_k: int = Query(3, ge=1, le=10)):
    """
    Ranks universities and industries for a problem by how well their real people (from the shared
    Postgres directory) collectively cover what it needs, and returns the suggested team from each.
    See people_matcher.py.
    """
    problem = get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    try:
        people = people_matcher.load_people()
        taxonomy = people_matcher.load_taxonomy()
    except people_matcher.PeopleDataUnavailable as error:
        logger.error("People directory unavailable: %s", error)
        raise HTTPException(status_code=503, detail="The people directory is unavailable right now")
    return {"problem_id": problem.id, **people_matcher.match_problem(problem.model_dump(), people, taxonomy, top_k)}


@app.get("/organizations/{org_type}/{org_id}/problem-matches")
def organization_problem_matches_endpoint(org_type: str, org_id: str, top_k: int = Query(3, ge=1, le=10)):
    """
    The open, verified problems one university or industry is best placed to take on, ranked by how
    well its own people cover what each problem needs, with the mixed-role team it would field.
    Called from the Next.js proxy, which resolves org_id from the signed-in session.
    """
    if org_type not in ("university", "industry"):
        raise HTTPException(status_code=400, detail="org_type must be 'university' or 'industry'")
    try:
        everyone = people_matcher.load_people()
        taxonomy = people_matcher.load_taxonomy()
    except people_matcher.PeopleDataUnavailable as error:
        logger.error("People directory unavailable: %s", error)
        raise HTTPException(status_code=503, detail="The people directory is unavailable right now")
    people = [p for p in everyone if p["org_type"] == org_type and p["org_id"] == org_id]
    if not people:
        return {"organization": None, "matches": []}
    skill_catalogue = {name for person in everyone for name, _ in person.get("skills", [])}

    open_problems = [problem.model_dump() for problem in list_problems(status="verified", limit=500)]
    matches = people_matcher.rank_problems_for_organization(open_problems, people, org_type, taxonomy, top_k, skill_catalogue)
    for item in matches:
        problem = item["problem"]
        item["problem"] = {
            "id": problem["id"],
            "title": problem.get("title") or problem.get("problem_text"),
            "description": problem.get("description") or problem.get("problem_text"),
            "category": problem.get("category"),
            "district": problem.get("district"),
            "location": problem.get("location"),
        }
    return {"organization": {"id": org_id, "type": org_type, "name": people[0]["org_name"]}, "matches": matches}


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
