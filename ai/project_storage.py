"""
project_storage.py

Project workspaces for accepted problems. A workspace exists only once the
problem is verified and the problem giver has accepted a volunteer; that volunteer is the project lead. Any
university/industry partner whose collaboration request (sent by the lead) was
accepted joins as a collaborator. These parties and the citizen who reported
the problem (the "owner") can open the workspace; only parties post progress updates.

Tables live in the same SQLite file as problems (see problem_storage.initialize_storage).
"""

import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field

import problem_storage
from problem_storage import ProblemInDB, list_collaboration_requests, list_problems

PROJECT_STATUSES = {"assigned", "in_progress", "completed"}


class ProjectMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    problem_id: str
    author_type: str  # "university" | "industry" | "citizen" (the problem giver)
    author_org: str  # organisation name, or the citizen's name
    author_name: str  # the person who typed it
    text: str
    created_at: datetime = Field(default_factory=datetime.now)


class ProjectUpdate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    problem_id: str
    author_type: str
    author_org: str
    author_name: str
    title: str
    body: str = ""
    progress: Optional[int] = None  # set only when the lead changed overall progress
    # Photos, videos, PDFs, Office docs etc. proving/illustrating the update; see
    # api.py's ALLOWED_WORKSPACE_ATTACHMENT_TYPES for what is accepted. Each entry:
    # {"name", "content_type", "size", "url"} -- same shape as Problem.evidence_attachments.
    attachments: List[Dict] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.now)


def _accepted_lead(problem: ProblemInDB) -> Optional[Dict]:
    """The accepted volunteer, if there is one with an actual organisation name. A blank
    solver_name means nobody is really assigned (e.g. bad data), so it doesn't count."""
    return next(
        (v for v in problem.volunteers if v.get("status") == "accepted" and (v.get("solver_name") or "").strip()),
        None,
    )


def has_workspace(problem: ProblemInDB) -> bool:
    """A workspace exists only once the problem giver accepted a volunteer (an actual university/industry,
    not a blank name) on a verified problem. select-volunteer enforces status + giver and then moves the
    problem to 'assigned' with assigned_by_giver=True; later progress moves it to in_progress/completed."""
    return (
        bool(problem.assigned_by_giver)
        and problem.status in PROJECT_STATUSES
        and _accepted_lead(problem) is not None
    )


def get_project_parties(problem: ProblemInDB) -> List[Dict[str, str]]:
    """Lead (accepted volunteer) first, then accepted collaborators. Empty if the problem has no workspace."""
    lead = _accepted_lead(problem)
    if not has_workspace(problem) or not lead:
        return []
    parties = [{"type": lead["solver_type"], "name": lead["solver_name"], "role": "lead"}]
    for request in list_collaboration_requests(problem_id=problem.id, status="accepted", limit=500):
        if request.party_name(lead["solver_type"]) != lead["solver_name"]:
            continue
        other_type = "industry" if lead["solver_type"] == "university" else "university"
        other = {"type": other_type, "name": request.party_name(other_type), "role": "collaborator"}
        if all(not (p["type"] == other["type"] and p["name"] == other["name"]) for p in parties):
            parties.append(other)
    return parties


def get_viewer_role(problem: ProblemInDB, parties: List[Dict[str, str]], viewer_type: str, viewer_name: str) -> Optional[str]:
    """'owner' for the citizen who reported the problem, else the party's role. None if they may not see the workspace."""
    if not parties:
        return None  # no workspace until a volunteer is accepted
    if viewer_type == "citizen":
        return "owner" if viewer_name == problem.citizen_name else None
    return next((p["role"] for p in parties if p["type"] == viewer_type and p["name"] == viewer_name), None)


def list_projects_for_party(party_type: str, party_name: str) -> List[Dict]:
    projects = []
    for problem in list_problems(limit=500):
        if problem.status not in PROJECT_STATUSES:
            continue
        parties = get_project_parties(problem)
        role = get_viewer_role(problem, parties, party_type, party_name)
        if role:
            projects.append({"problem": problem, "parties": parties, "my_role": role})
    return projects


def _insert(table: str, record: BaseModel, problem_id: str, created_at: datetime) -> None:
    with problem_storage._connection() as connection:
        connection.execute(
            f"INSERT INTO {table} (id, problem_id, payload, created_at) VALUES (?, ?, ?, ?)",
            (record.id, problem_id, record.model_dump_json(), created_at.isoformat()),
        )


def _select(table: str, problem_id: str, limit: int) -> List[dict]:
    # Newest `limit` rows, returned oldest-first so chat reads top to bottom.
    with problem_storage._connection() as connection:
        rows = connection.execute(
            f"SELECT payload FROM {table} WHERE problem_id = ? ORDER BY created_at DESC LIMIT ?",
            (problem_id, limit),
        ).fetchall()
    return [json.loads(row["payload"]) for row in reversed(rows)]


def add_message(message: ProjectMessage) -> ProjectMessage:
    _insert("project_messages", message, message.problem_id, message.created_at)
    return message


def list_messages(problem_id: str, limit: int = 200) -> List[ProjectMessage]:
    return [ProjectMessage.model_validate(row) for row in _select("project_messages", problem_id, limit)]


def add_update(update: ProjectUpdate) -> ProjectUpdate:
    _insert("project_updates", update, update.problem_id, update.created_at)
    return update


def list_updates(problem_id: str, limit: int = 200) -> List[ProjectUpdate]:
    # Updates read newest-first.
    return [ProjectUpdate.model_validate(row) for row in reversed(_select("project_updates", problem_id, limit))]


def append_update_attachments(problem_id: str, update_id: str, new_attachments: List[Dict]) -> Optional[ProjectUpdate]:
    """Add more files to an update that was already posted (its author building up evidence over
    time, rather than being limited to only what they attached at the moment of posting)."""
    with problem_storage._connection() as connection:
        row = connection.execute(
            "SELECT payload FROM project_updates WHERE id = ? AND problem_id = ?", (update_id, problem_id),
        ).fetchone()
        if not row:
            return None
        update = ProjectUpdate.model_validate(json.loads(row["payload"]))
        update.attachments = [*update.attachments, *new_attachments]
        connection.execute(
            "UPDATE project_updates SET payload = ? WHERE id = ?",
            (update.model_dump_json(), update_id),
        )
    return update
