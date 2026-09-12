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

class NotificationRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    citizen_name: str
    type: str
    title: str
    message: str
    problem_id: str
    problem_title: Optional[str] = None
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
    skip: int = 0
) -> List[ProblemInDB]:
    """List problems with optional status filter."""
    with _connection() as connection:
        if status:
            rows = connection.execute(
                "SELECT payload FROM problems WHERE json_extract(payload, '$.status') = ? ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?",
                (status, limit, skip),
            ).fetchall()
        else:
            rows = connection.execute(
                "SELECT payload FROM problems ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?",
                (limit, skip),
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

def list_notifications(citizen_name: str, limit: int = 100) -> List[NotificationRecord]:
    with _connection() as connection:
        rows = connection.execute(
            "SELECT payload FROM notifications WHERE citizen_name = ? ORDER BY datetime(created_at) DESC LIMIT ?",
            (citizen_name, limit),
        ).fetchall()
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

def mark_all_notifications_read(citizen_name: str) -> None:
    with _connection() as connection:
        rows = connection.execute(
            "SELECT id, payload FROM notifications WHERE citizen_name = ? AND json_extract(payload, '$.is_read') = 0",
            (citizen_name,),
        ).fetchall()
        for row in rows:
            notification = NotificationRecord.model_validate(json.loads(row["payload"]))
            notification.is_read = True
            connection.execute(
                "UPDATE notifications SET payload = ? WHERE id = ?",
                (notification.model_dump_json(), row["id"]),
            )