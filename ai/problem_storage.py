"""
problem_storage.py
SQLite storage for problems with status workflow.
"""

import json
import os
import sqlite3
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

DATABASE_PATH = os.getenv(
    "PROBLEM_DB_PATH",
    os.path.join(os.path.dirname(__file__), "data", "problems.sqlite3"),
)

# Define the problem status workflow
class ProblemStatus(str):
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    VERIFIED = "verified"
    RETURNED_FOR_CORRECTION = "returned_for_correction"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"


# Statuses a problem can be browsed in. Anything earlier (submitted, under review, returned for
# correction) or rejected is visible only to the citizen who reported it and to government reviewers.
PUBLIC_PROBLEM_STATUSES = ["verified", "assigned", "in_progress", "completed"]

class ProblemBase(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    problem_text: str
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    citizen_avatar: Optional[str] = None
    date: Optional[str] = None
    translated_text: Optional[str] = None
    original_text: Optional[str] = None
    source_language: str = "English"
    # Unstructured input & structured problem definition
    raw_input: Optional[str] = None
    problem_nature: Optional[str] = None  # "Technical", "Non-Technical", "Hybrid"
    affected_population: Optional[str] = None
    frequency: Optional[str] = None
    required_capabilities: List[str] = Field(default_factory=list)
    confirmed_by_giver: bool = True
    # Problem giver entity type
    problem_giver_type: Optional[str] = "individual"  # "individual", "community_group", "ngo", "local_authority"
    community_group_name: Optional[str] = None
    # Volunteer / solver assignment workflow
    volunteers: List[Dict] = Field(default_factory=list)
    assigned_university: Optional[str] = None
    assigned_industry: Optional[str] = None
    assigned_by_giver: Optional[bool] = None
    # Optional location info
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    district: Optional[str] = None
    block: Optional[str] = None
    village: Optional[str] = None
    # Citizen info (who submitted)
    citizen_name: str
    citizen_contact: Optional[Dict[str, str]] = None  # email, phone
    # AI analysis results (to be filled after analysis)
    classification: Optional[Dict] = None
    priority: Optional[Dict] = None
    summary: Optional[Dict] = None
    duplicates: List[Dict] = Field(default_factory=list)
    image_analysis: Optional[Dict] = None  # New field for image analysis
    # Matching results (to be filled after matching)
    universities: Optional[List[Dict]] = None
    mentors: Optional[List[Dict]] = None
    industry_partners: Optional[List[Dict]] = None
    # Status and workflow
    status: str = ProblemStatus.SUBMITTED
    # For verification workflow
    verification_notes: Optional[str] = None  # Government notes during verification
    verification_history: List[Dict] = Field(default_factory=list)
    evidence_requested: Optional[List[str]] = None  # List of evidence types requested
    evidence_provided: Optional[List[str]] = None  # List of evidence provided by citizen
    evidence_attachments: List[Dict] = Field(default_factory=list)
    # Engagement metrics
    supporters: int = 0
    progress: int = 0
    current_step: int = 1
    # User engagement flags (simplified, not per-user)
    is_supported: bool = False
    is_saved: bool = False
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class ProblemInDB(ProblemBase):
    pass

NOTIFICATION_AUDIENCES = {"citizen", "university", "industry"}


class NotificationRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    # Recipient: a citizen's display name, or a university/industry organisation name.
    citizen_name: str
    # Which portal the alert belongs to, so a university/industry inbox never
    # shows citizen-government alerts even when two recipients share a name.
    audience: str = "citizen"
    category: Optional[str] = None  # "problem" | "volunteer" | "collaboration"
    type: str
    title: str
    message: str
    problem_id: Optional[str] = None
    problem_title: Optional[str] = None
    collaboration_request_id: Optional[str] = None
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.now)

class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    raw_input: Optional[str] = None
    problem_nature: Optional[str] = None
    affected_population: Optional[str] = None
    frequency: Optional[str] = None
    required_capabilities: Optional[List[str]] = None
    confirmed_by_giver: Optional[bool] = None
    problem_giver_type: Optional[str] = None
    community_group_name: Optional[str] = None
    volunteers: Optional[List[Dict]] = None
    assigned_university: Optional[str] = None
    assigned_industry: Optional[str] = None
    assigned_by_giver: Optional[bool] = None
    original_text: Optional[str] = None
    translated_text: Optional[str] = None
    source_language: Optional[str] = None
    image_analysis: Optional[Dict] = None
    status: Optional[str] = None
    verification_notes: Optional[str] = None
    verification_history: Optional[List[Dict]] = None
    evidence_requested: Optional[List[str]] = None
    evidence_provided: Optional[List[str]] = None
    evidence_attachments: Optional[List[Dict]] = None
    # Allow updating analysis results if needed
    classification: Optional[Dict] = None
    priority: Optional[Dict] = None
    summary: Optional[Dict] = None
    duplicates: Optional[List[Dict]] = None
    universities: Optional[List[Dict]] = None
    mentors: Optional[List[Dict]] = None
    industry_partners: Optional[List[Dict]] = None
    # Engagement metrics
    supporters: Optional[int] = None
    progress: Optional[int] = None
    current_step: Optional[int] = None
    # User engagement flags (simplified, not per-user)
    is_supported: Optional[bool] = None
    is_saved: Optional[bool] = None

_JSON_FIELDS = {
    "citizen_contact",
    "classification",
    "priority",
    "summary",
    "image_analysis",
    "universities",
    "mentors",
    "industry_partners",
    "evidence_requested",
    "evidence_provided",
    "evidence_attachments",
    "verification_history",
    "required_capabilities",
    "volunteers",
}


def _connection() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_storage() -> None:
    with _connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS problems (
                id TEXT PRIMARY KEY,
                payload TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY,
                citizen_name TEXT NOT NULL,
                payload TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS collaboration_requests (
                id TEXT PRIMARY KEY,
                payload TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        # Project workspace chat and progress updates (see project_storage.py)
        for table in ("project_messages", "project_updates"):
            connection.execute(
                f"""
                CREATE TABLE IF NOT EXISTS {table} (
                    id TEXT PRIMARY KEY,
                    problem_id TEXT NOT NULL,
                    payload TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )


def _serialize(problem: ProblemBase) -> str:
    data = problem.model_dump(mode="json")
    return json.dumps(data)


def _deserialize(payload: str) -> ProblemInDB:
    return ProblemInDB.model_validate(json.loads(payload))


initialize_storage()

def create_problem(problem: ProblemBase) -> ProblemInDB:
    """Create a new problem."""
    problem_db = ProblemInDB.model_validate(problem.model_dump())
    with _connection() as connection:
        connection.execute(
            "INSERT INTO problems (id, payload, created_at, updated_at) VALUES (?, ?, ?, ?)",
            (problem_db.id, _serialize(problem_db), problem_db.created_at.isoformat(), problem_db.updated_at.isoformat()),
        )
    return problem_db

def get_problem(problem_id: str) -> Optional[ProblemInDB]:
    """Get a problem by ID."""
    with _connection() as connection:
        row = connection.execute("SELECT payload FROM problems WHERE id = ?", (problem_id,)).fetchone()
    return _deserialize(row["payload"]) if row else None

def update_problem(problem_id: str, update: ProblemUpdate) -> Optional[ProblemInDB]:
    """Update a problem."""
    problem = get_problem(problem_id)
    if not problem:
        return None
    update_data = update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(problem, field, value)
    problem.updated_at = datetime.now()
    with _connection() as connection:
        connection.execute(
            "UPDATE problems SET payload = ?, updated_at = ? WHERE id = ?",
            (_serialize(problem), problem.updated_at.isoformat(), problem_id),
        )
    return problem

def list_problems(
    status: Optional[str] = None,
    limit: int = 100,
    skip: int = 0,
    citizen_name: Optional[str] = None,
    assigned_university: Optional[str] = None,
    assigned_industry: Optional[str] = None,
    statuses: Optional[List[str]] = None,
) -> List[ProblemInDB]:
    """List problems with optional status (or any of `statuses`), citizen_name, assigned_university, and assigned_industry filters."""
    with _connection() as connection:
        conditions = []
        params = []

        if status:
            conditions.append("json_extract(payload, '$.status') = ?")
            params.append(status)
        if statuses is not None:
            if not statuses:
                return []
            conditions.append(f"json_extract(payload, '$.status') IN ({', '.join('?' for _ in statuses)})")
            params.extend(statuses)
        if citizen_name:
            conditions.append("json_extract(payload, '$.citizen_name') = ?")
            params.append(citizen_name)
        if assigned_university:
            conditions.append("json_extract(payload, '$.assigned_university') = ?")
            params.append(assigned_university)
        if assigned_industry:
            conditions.append("json_extract(payload, '$.assigned_industry') = ?")
            params.append(assigned_industry)
        
        where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""
        params.extend([limit, skip])
        
        rows = connection.execute(
            f"SELECT payload FROM problems{where_clause} ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?",
            params,
        ).fetchall()
    
    problems = [_deserialize(row["payload"]) for row in rows]
    return problems

def delete_problem(problem_id: str) -> bool:
    """Delete a problem."""
    with _connection() as connection:
        cursor = connection.execute("DELETE FROM problems WHERE id = ?", (problem_id,))
    return cursor.rowcount > 0

def create_notification(notification: NotificationRecord) -> NotificationRecord:
    with _connection() as connection:
        connection.execute(
            "INSERT INTO notifications (id, citizen_name, payload, created_at) VALUES (?, ?, ?, ?)",
            (notification.id, notification.citizen_name, notification.model_dump_json(), notification.created_at.isoformat()),
        )
    return notification

_AUDIENCE_SQL = "COALESCE(json_extract(payload, '$.audience'), 'citizen') = ?"


def list_notifications(citizen_name: str, limit: int = 100, audience: Optional[str] = None) -> List[NotificationRecord]:
    """List a recipient's notifications, optionally only those for one portal audience.
    Rows written before `audience` existed are treated as citizen notifications."""
    query = "SELECT payload FROM notifications WHERE citizen_name = ?"
    params: list = [citizen_name]
    if audience:
        query += f" AND {_AUDIENCE_SQL}"
        params.append(audience)
    # created_at is an ISO string; the tiebreak keeps sub-second order that datetime() truncates.
    query += " ORDER BY datetime(created_at) DESC, created_at DESC LIMIT ?"
    params.append(limit)
    with _connection() as connection:
        rows = connection.execute(query, params).fetchall()
    return [NotificationRecord.model_validate(json.loads(row["payload"])) for row in rows]

def mark_notification_read(notification_id: str) -> Optional[NotificationRecord]:
    with _connection() as connection:
        row = connection.execute("SELECT payload FROM notifications WHERE id = ?", (notification_id,)).fetchone()
        if not row:
            return None
        notification = NotificationRecord.model_validate(json.loads(row["payload"]))
        notification.is_read = True
        connection.execute(
            "UPDATE notifications SET payload = ? WHERE id = ?",
            (notification.model_dump_json(), notification_id),
        )
    return notification

def mark_all_notifications_read(citizen_name: str, audience: Optional[str] = None) -> None:
    query = "SELECT id, payload FROM notifications WHERE citizen_name = ? AND json_extract(payload, '$.is_read') = 0"
    params: list = [citizen_name]
    if audience:
        query += f" AND {_AUDIENCE_SQL}"
        params.append(audience)
    with _connection() as connection:
        rows = connection.execute(query, params).fetchall()
        for row in rows:
            notification = NotificationRecord.model_validate(json.loads(row["payload"]))
            notification.is_read = True
            connection.execute(
                "UPDATE notifications SET payload = ? WHERE id = ?",
                (                 notification.model_dump_json(), row["id"]),
            )


# ---------------------------------------------------------------------------
# Volunteer / solver-assignment workflow helpers
# ---------------------------------------------------------------------------

VOLUNTEER_STATUSES = {"volunteered", "accepted", "rejected", "withdrawn"}


def _volunteer_index(problem: ProblemInDB, solver_type: str, solver_name: str) -> int | None:
    """Return the index of an existing active volunteer entry, or None."""
    for i, v in enumerate(problem.volunteers):
        if v.get("solver_type") == solver_type and v.get("solver_name") == solver_name:
            return i
    return None


def add_volunteer(problem_id: str, solver_type: str, solver_name: str, proposal: str) -> ProblemInDB | None:
    """Add a volunteer proposal to a problem. Raises if a volunteer with the same
    entity already exists and has not been withdrawn."""
    problem = get_problem(problem_id)
    if not problem:
        return None
    idx = _volunteer_index(problem, solver_type, solver_name)
    existing = problem.volunteers[idx]["status"] if idx is not None else None
    if existing in ("volunteered", "accepted"):
        raise ValueError(f"{solver_type} '{solver_name}' has already volunteered")
    entry = {
        "solver_type": solver_type,
        "solver_name": solver_name,
        "proposal": proposal,
        "submitted_at": datetime.now().isoformat(),
        "status": "volunteered",
    }
    if idx is not None:
        problem.volunteers[idx] = entry
    else:
        problem.volunteers.append(entry)
    updated = update_problem(
        problem_id,
        ProblemUpdate(volunteers=problem.volunteers),
    )
    return updated


def withdraw_volunteer(problem_id: str, solver_type: str, solver_name: str) -> ProblemInDB | None:
    """Withdraw a volunteer proposal — only allowed while status is still 'volunteered'."""
    problem = get_problem(problem_id)
    if not problem:
        return None
    idx = _volunteer_index(problem, solver_type, solver_name)
    if idx is None or problem.volunteers[idx]["status"] != "volunteered":
        raise ValueError("Cannot withdraw: proposal not found or already decided")
    problem.volunteers[idx]["status"] = "withdrawn"
    return update_problem(problem_id, ProblemUpdate(volunteers=problem.volunteers))


def select_volunteer(problem_id: str, solver_type: str, solver_name: str) -> ProblemInDB | None:
    """Giver selects one volunteer. The chosen entry becomes 'accepted'; all other
    'volunteered' entries become 'rejected'."""
    problem = get_problem(problem_id)
    if not problem:
        return None
    idx = _volunteer_index(problem, solver_type, solver_name)
    if idx is None or problem.volunteers[idx]["status"] != "volunteered":
        raise ValueError("Cannot select: proposal not found or not in 'volunteered' state")
    for i, v in enumerate(problem.volunteers):
        if i == idx:
            v["status"] = "accepted"
        elif v["status"] == "volunteered":
            v["status"] = "rejected"
    assignment_update = ProblemUpdate(
        volunteers=problem.volunteers,
        status="assigned",
        assigned_by_giver=True,
    )
    if solver_type == "university":
        assignment_update.assigned_university = solver_name
    elif solver_type == "industry":
        assignment_update.assigned_industry = solver_name
    return update_problem(problem_id, assignment_update)


# ---------------------------------------------------------------------------
# University <-> industry collaboration requests
# ---------------------------------------------------------------------------

COLLABORATION_PARTIES = {"university", "industry"}
OPEN_COLLABORATION_STATUSES = {"pending", "clarification_needed"}


class CollaborationRequestRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    requested_by: str  # "university" | "industry" -- the side that opened the request
    university_name: str
    industry_name: str
    requester_contact: Optional[str] = None  # the person who submitted it
    problem_id: Optional[str] = None
    challenge_title: str
    problem_description: Optional[str] = None
    category: Optional[str] = None
    support_types: List[str] = Field(default_factory=list)
    description: Optional[str] = None
    # Written by the side extending the invitation so the receiver can judge the project before accepting.
    progress_summary: Optional[str] = None
    status: str = "pending"  # pending | clarification_needed | accepted | rejected | withdrawn
    history: List[Dict] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    def party_name(self, party: str) -> str:
        return self.university_name if party == "university" else self.industry_name

    @property
    def responder(self) -> str:
        return "industry" if self.requested_by == "university" else "university"


def _save_collaboration_request(record: CollaborationRequestRecord, insert: bool = False) -> CollaborationRequestRecord:
    with _connection() as connection:
        if insert:
            connection.execute(
                "INSERT INTO collaboration_requests (id, payload, created_at, updated_at) VALUES (?, ?, ?, ?)",
                (record.id, record.model_dump_json(), record.created_at.isoformat(), record.updated_at.isoformat()),
            )
        else:
            connection.execute(
                "UPDATE collaboration_requests SET payload = ?, updated_at = ? WHERE id = ?",
                (record.model_dump_json(), record.updated_at.isoformat(), record.id),
            )
    return record


def create_collaboration_request(record: CollaborationRequestRecord) -> CollaborationRequestRecord:
    record.history = [{
        "actor_type": record.requested_by,
        "actor_name": record.party_name(record.requested_by),
        "action": "requested",
        "note": record.description or "",
        "timestamp": datetime.now().isoformat(),
    }]
    return _save_collaboration_request(record, insert=True)


def get_collaboration_request(request_id: str) -> Optional[CollaborationRequestRecord]:
    with _connection() as connection:
        row = connection.execute("SELECT payload FROM collaboration_requests WHERE id = ?", (request_id,)).fetchone()
    return CollaborationRequestRecord.model_validate(json.loads(row["payload"])) if row else None


def list_collaboration_requests(
    university_name: Optional[str] = None,
    industry_name: Optional[str] = None,
    status: Optional[str] = None,
    problem_id: Optional[str] = None,
    limit: int = 100,
) -> List[CollaborationRequestRecord]:
    conditions = []
    params: list = []
    for field, value in (
        ("university_name", university_name),
        ("industry_name", industry_name),
        ("status", status),
        ("problem_id", problem_id),
    ):
        if value:
            conditions.append(f"json_extract(payload, '$.{field}') = ?")
            params.append(value)
    where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""
    params.append(limit)
    with _connection() as connection:
        rows = connection.execute(
            f"SELECT payload FROM collaboration_requests{where_clause} ORDER BY datetime(created_at) DESC, created_at DESC LIMIT ?",
            params,
        ).fetchall()
    return [CollaborationRequestRecord.model_validate(json.loads(row["payload"])) for row in rows]


def transition_collaboration_request(
    request_id: str,
    actor_type: str,
    actor_name: str,
    action: str,
    note: str = "",
) -> Optional[CollaborationRequestRecord]:
    """Apply one workflow step. Raises PermissionError if the actor may not take
    this action, ValueError if the request is not in a state that allows it.

    - accept / reject / clarify: only the receiving party, while the request is open
    - reply: only the requester, after the receiver asked for clarification
    - withdraw: only the requester, while the request is open
    """
    record = get_collaboration_request(request_id)
    if not record:
        return None

    if action in ("accept", "reject", "clarify"):
        allowed_party = record.responder
        allowed_statuses = OPEN_COLLABORATION_STATUSES
    elif action == "reply":
        allowed_party = record.requested_by
        allowed_statuses = {"clarification_needed"}
    elif action == "withdraw":
        allowed_party = record.requested_by
        allowed_statuses = OPEN_COLLABORATION_STATUSES
    else:
        raise ValueError(f"Unknown action '{action}'")

    if actor_type != allowed_party or actor_name != record.party_name(allowed_party):
        raise PermissionError(f"Only the {allowed_party} on this request can {action} it")
    if record.status not in allowed_statuses:
        raise ValueError(f"Cannot {action} a request that is '{record.status}'")

    record.status = {
        "accept": "accepted",
        "reject": "rejected",
        "clarify": "clarification_needed",
        "reply": "pending",
        "withdraw": "withdrawn",
    }[action]
    record.history = [*record.history, {
        "actor_type": actor_type,
        "actor_name": actor_name,
        "action": action,
        "note": note,
        "timestamp": datetime.now().isoformat(),
    }]
    record.updated_at = datetime.now()
    return _save_collaboration_request(record)