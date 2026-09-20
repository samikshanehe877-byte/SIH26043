"""
points_storage.py

Milestone-verified points ledger for university/industry project teams.

A project's team (see project_storage.get_project_parties) submits a milestone for a problem's
project; a government officer verifies it; only on verification does every current team member --
both the organization as a whole and each named individual on it (see `project_members`) -- get an
immutable point_events row. Nothing here ever mutates a running total: totals, badges and
certificates are always computed on read from the event ledger, the same way problem_storage keeps
an append-only verification_history instead of a mutable "verified by" field.

Tables are created centrally in problem_storage.initialize_storage() (see the comment there) so the
existing test convention -- monkeypatch problem_storage.DATABASE_PATH, then call
problem_storage.initialize_storage() -- recreates these tables too, exactly like it already does
for project_storage's project_messages/project_updates tables.
"""

import json
import re
import threading
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from urllib.parse import urlparse

from pydantic import BaseModel, Field

import problem_storage
import project_storage

# Milestones in order, front-loading small rewards for accepting/starting a project and weighting
# Implementation + Impact heavily -- this is deliberate: it's what stops a university/industry from
# grabbing many projects and abandoning them, since acceptance alone is worth almost nothing.
MILESTONE_SEQUENCE = [
    "project_accepted",
    "initial_planning",
    "development_started",
    "progress_50",
    "prototype_completed",
    "testing_completed",
    "government_validation",
    "implementation",
    "impact_demonstrated",
]

MILESTONE_POINTS: Dict[str, int] = {
    "project_accepted": 10,
    "initial_planning": 15,
    "development_started": 20,
    "progress_50": 30,
    "prototype_completed": 50,
    "testing_completed": 40,
    "government_validation": 60,
    "implementation": 100,
    "impact_demonstrated": 150,
}

# A verified milestone here also counts toward a "certificate" (see list_certificates).
CERTIFICATE_MILESTONE_TYPES = {"implementation", "impact_demonstrated"}

# Evidence a team can attach when submitting a milestone: uploaded files (validated and stored by
# api.py, which owns the allowed types and size limit) plus web links, e.g. a demo video, a shared
# drive folder, a GitHub repo. Only the link side is validated here, since only it is stored as-is.
MAX_MILESTONE_LINKS = 10
MAX_LINK_LENGTH = 2000
_HAS_SCHEME = re.compile(r"^[a-zA-Z][a-zA-Z0-9+.\-]*:")

# Belt-and-suspenders guard on top of the point_events UNIQUE constraint, same idiom as
# duplicate_engine.SUBMISSION_LOCK: a single-process lock around the verify check-then-act
# sequence. A real multi-process deployment would need a DB-level lock instead, per the same
# principle noted there.
MILESTONE_VERIFY_LOCK = threading.Lock()


class ProjectMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    problem_id: str
    user_id: str
    user_name: str
    organization_type: str  # "university" | "industry"
    organization_name: str
    role: Optional[str] = None
    joined_at: datetime = Field(default_factory=datetime.now)


class Milestone(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    problem_id: str
    milestone_type: str
    status: str = "submitted"  # submitted | verified | rejected
    submitted_by_user_id: str
    submitted_by_name: str
    submitted_by_org_type: str
    submitted_by_org_name: str
    submitted_note: Optional[str] = None
    submitted_at: datetime = Field(default_factory=datetime.now)
    decided_by_officer_id: Optional[str] = None
    decided_by_officer_name: Optional[str] = None
    decision_note: Optional[str] = None
    decided_at: Optional[datetime] = None
    # Evidence for the reviewing officer. Attachments have the same {name, content_type, size, url}
    # shape as project update attachments, so the frontend gallery renders both the same way.
    submitted_attachments: List[Dict] = Field(default_factory=list)
    submitted_links: List[str] = Field(default_factory=list)


class PointEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    problem_id: str
    milestone_id: str
    milestone_type: str
    points: int
    actor_type: str  # "user" | "university" | "industry"
    actor_id: str  # user_id for actor_type="user", organization name otherwise
    actor_name: str
    organization_type: Optional[str] = None  # set on "user" rows: which org this credit counts toward
    organization_name: Optional[str] = None
    officer_id: str
    officer_name: str
    created_at: datetime = Field(default_factory=datetime.now)


# --------------------------------------------------------------------------------------- helpers --

def _row_to_member(row) -> ProjectMember:
    return ProjectMember(
        id=row["id"], problem_id=row["problem_id"], user_id=row["user_id"], user_name=row["user_name"],
        organization_type=row["organization_type"], organization_name=row["organization_name"],
        role=row["role"], joined_at=row["joined_at"],
    )


def _row_to_milestone(row) -> Milestone:
    return Milestone(
        id=row["id"], problem_id=row["problem_id"], milestone_type=row["milestone_type"], status=row["status"],
        submitted_by_user_id=row["submitted_by_user_id"], submitted_by_name=row["submitted_by_name"],
        submitted_by_org_type=row["submitted_by_org_type"], submitted_by_org_name=row["submitted_by_org_name"],
        submitted_note=row["submitted_note"], submitted_at=row["submitted_at"],
        decided_by_officer_id=row["decided_by_officer_id"], decided_by_officer_name=row["decided_by_officer_name"],
        decision_note=row["decision_note"], decided_at=row["decided_at"],
        submitted_attachments=json.loads(row["submitted_attachments"] or "[]"),
        submitted_links=json.loads(row["submitted_links"] or "[]"),
    )


def normalize_links(links: Optional[List[str]]) -> List[str]:
    """Cleans and validates evidence links: trims, drops blanks and repeats, and only lets through
    http(s) URLs (so nothing like `javascript:` ever gets stored and later rendered as an anchor).
    A bare "www.example.com" gets https:// added, since that's what people type. Raises ValueError,
    naming the offending link, so the caller can show it back."""
    cleaned: List[str] = []
    for raw in links or []:
        url = (raw or "").strip()
        if not url:
            continue
        if not _HAS_SCHEME.match(url):
            url = f"https://{url}"
        if len(url) > MAX_LINK_LENGTH:
            raise ValueError(f"A link is longer than {MAX_LINK_LENGTH} characters: '{url[:60]}...'")
        try:
            parsed = urlparse(url)
            _ = parsed.port  # raises ValueError for a non-numeric or out-of-range port
            valid = parsed.scheme in ("http", "https") and bool(parsed.hostname)
        except ValueError:
            valid = False
        if not valid:
            raise ValueError(f"'{url[:80]}' isn't a valid link. Links must start with http:// or https://")
        if url not in cleaned:
            cleaned.append(url)
    if len(cleaned) > MAX_MILESTONE_LINKS:
        raise ValueError(f"A milestone can have at most {MAX_MILESTONE_LINKS} links; you added {len(cleaned)}.")
    return cleaned


def _row_to_event(row) -> PointEvent:
    return PointEvent(
        id=row["id"], problem_id=row["problem_id"], milestone_id=row["milestone_id"],
        milestone_type=row["milestone_type"], points=row["points"], actor_type=row["actor_type"],
        actor_id=row["actor_id"], actor_name=row["actor_name"],
        organization_type=row["organization_type"], organization_name=row["organization_name"],
        officer_id=row["officer_id"], officer_name=row["officer_name"], created_at=row["created_at"],
    )


def _party_names(parties: List[Dict[str, str]]) -> set:
    return {(p["type"], p["name"]) for p in parties}


def _require_active_party(problem_id: str, organization_type: str, organization_name: str):
    """Raises ValueError if the project itself doesn't exist, or PermissionError unless
    (organization_type, organization_name) is an actual lead/collaborator on it today -- the same
    rule project_storage.get_viewer_role already enforces for workspace access, applied here so
    nobody can join, submit for, or be credited on a project their organization was never actually
    accepted onto. The two exception types match this codebase's existing convention (see
    transition_collaboration_request): PermissionError for an authorization failure, ValueError for
    everything else, so api.py can map them to 403 / 409 the same way it already does elsewhere."""
    problem = problem_storage.get_problem(problem_id)
    if not problem:
        raise ValueError("Project not found")
    parties = project_storage.get_project_parties(problem)
    if (organization_type, organization_name) not in _party_names(parties):
        raise PermissionError("This organization is not an accepted party on this project")
    return problem, parties


# ---------------------------------------------------------------------------------- team roster ---

def get_project_member(problem_id: str, user_id: str) -> Optional[ProjectMember]:
    with problem_storage._connection() as connection:
        row = connection.execute(
            "SELECT * FROM project_members WHERE problem_id = ? AND user_id = ?", (problem_id, user_id),
        ).fetchone()
    return _row_to_member(row) if row else None


def list_project_members(problem_id: str) -> List[ProjectMember]:
    with problem_storage._connection() as connection:
        rows = connection.execute(
            "SELECT * FROM project_members WHERE problem_id = ? ORDER BY joined_at ASC", (problem_id,),
        ).fetchall()
    return [_row_to_member(row) for row in rows]


def join_project(
    problem_id: str, user_id: str, user_name: str, organization_type: str, organization_name: str,
    role: Optional[str] = None,
) -> ProjectMember:
    """Adds a named person to a project's team, crediting them individually on future verified
    milestones. Only valid for someone whose organization is an accepted party on the project --
    call sites must resolve user_id/user_name from a real session, never a client-supplied value,
    since this is what individual point/certificate attribution is keyed on."""
    _require_active_party(problem_id, organization_type, organization_name)
    existing = get_project_member(problem_id, user_id)
    if existing:
        return existing
    member = ProjectMember(
        problem_id=problem_id, user_id=user_id, user_name=user_name,
        organization_type=organization_type, organization_name=organization_name, role=role,
    )
    with problem_storage._connection() as connection:
        connection.execute(
            "INSERT INTO project_members (id, problem_id, user_id, user_name, organization_type, "
            "organization_name, role, joined_at) VALUES (?,?,?,?,?,?,?,?)",
            (member.id, member.problem_id, member.user_id, member.user_name, member.organization_type,
             member.organization_name, member.role, member.joined_at.isoformat()),
        )
    return member


# ---------------------------------------------------------------------------------- milestones ----

def get_milestone(milestone_id: str) -> Optional[Milestone]:
    with problem_storage._connection() as connection:
        row = connection.execute("SELECT * FROM milestones WHERE id = ?", (milestone_id,)).fetchone()
    return _row_to_milestone(row) if row else None


def _get_milestone_by_type(problem_id: str, milestone_type: str) -> Optional[Milestone]:
    with problem_storage._connection() as connection:
        row = connection.execute(
            "SELECT * FROM milestones WHERE problem_id = ? AND milestone_type = ?",
            (problem_id, milestone_type),
        ).fetchone()
    return _row_to_milestone(row) if row else None


def list_milestones(problem_id: str) -> List[Milestone]:
    with problem_storage._connection() as connection:
        rows = connection.execute(
            "SELECT * FROM milestones WHERE problem_id = ? ORDER BY submitted_at ASC", (problem_id,),
        ).fetchall()
    return [_row_to_milestone(row) for row in rows]


def list_pending_milestones(limit: int = 100) -> List[Milestone]:
    """The government officer review queue -- every milestone awaiting a decision, across every
    project, newest-submitted first."""
    with problem_storage._connection() as connection:
        rows = connection.execute(
            "SELECT * FROM milestones WHERE status = 'submitted' ORDER BY submitted_at DESC LIMIT ?",
            (limit,),
        ).fetchall()
    return [_row_to_milestone(row) for row in rows]


def submit_milestone(
    problem_id: str, milestone_type: str, submitted_by_user_id: str, submitted_by_name: str,
    submitted_by_org_type: str, submitted_by_org_name: str, note: Optional[str] = None,
    attachments: Optional[List[Dict]] = None, links: Optional[List[str]] = None,
) -> Milestone:
    """Submit (or resubmit after a rejection) a milestone for verification. `attachments` are
    already-stored file records ({name, content_type, size, url}) that api.py has validated;
    `links` are validated here. A resubmission replaces the earlier submission's note and evidence
    outright -- it's a fresh submission, not an addition to the rejected one."""
    if milestone_type not in MILESTONE_POINTS:
        raise ValueError(f"Unknown milestone_type: {milestone_type!r}")
    clean_links = normalize_links(links)
    _require_active_party(problem_id, submitted_by_org_type, submitted_by_org_name)

    existing = _get_milestone_by_type(problem_id, milestone_type)
    if existing and existing.status == "verified":
        raise ValueError("This milestone has already been verified and cannot be resubmitted")

    # Whoever submits is automatically credited as a team member going forward -- an explicit
    # "join this project" action (join_project) is still how everyone else gets credited.
    join_project(problem_id, submitted_by_user_id, submitted_by_name, submitted_by_org_type, submitted_by_org_name)

    # `id` is intentionally a fresh uuid even on a resubmission: it's never part of the UPSERT's
    # DO UPDATE SET clause below, so on conflict the existing row keeps its original id regardless.
    milestone = Milestone(
        problem_id=problem_id, milestone_type=milestone_type, status="submitted",
        submitted_by_user_id=submitted_by_user_id, submitted_by_name=submitted_by_name,
        submitted_by_org_type=submitted_by_org_type, submitted_by_org_name=submitted_by_org_name,
        submitted_note=note, submitted_attachments=list(attachments or []), submitted_links=clean_links,
    )
    with problem_storage._connection() as connection:
        connection.execute(
            """
            INSERT INTO milestones (
                id, problem_id, milestone_type, status, submitted_by_user_id, submitted_by_name,
                submitted_by_org_type, submitted_by_org_name, submitted_note, submitted_at,
                decided_by_officer_id, decided_by_officer_name, decision_note, decided_at,
                submitted_attachments, submitted_links
            ) VALUES (?,?,?,?,?,?,?,?,?,?,NULL,NULL,NULL,NULL,?,?)
            ON CONFLICT(problem_id, milestone_type) DO UPDATE SET
                status='submitted', submitted_by_user_id=excluded.submitted_by_user_id,
                submitted_by_name=excluded.submitted_by_name, submitted_by_org_type=excluded.submitted_by_org_type,
                submitted_by_org_name=excluded.submitted_by_org_name, submitted_note=excluded.submitted_note,
                submitted_at=excluded.submitted_at, decided_by_officer_id=NULL, decided_by_officer_name=NULL,
                decision_note=NULL, decided_at=NULL,
                submitted_attachments=excluded.submitted_attachments, submitted_links=excluded.submitted_links
            """,
            (milestone.id, milestone.problem_id, milestone.milestone_type, milestone.status,
             milestone.submitted_by_user_id, milestone.submitted_by_name, milestone.submitted_by_org_type,
             milestone.submitted_by_org_name, milestone.submitted_note, milestone.submitted_at.isoformat(),
             json.dumps(milestone.submitted_attachments), json.dumps(milestone.submitted_links)),
        )
    return _get_milestone_by_type(problem_id, milestone_type)


def verify_milestone(
    milestone_id: str, decision: str, note: Optional[str], officer_id: str, officer_name: str,
) -> "tuple[Milestone, List[PointEvent]]":
    """The atomic, idempotent verify-and-award step. Approving inserts one point_events row for
    every organization currently party to the project and one for every currently known individual
    member of those organizations' teams -- all inside one transaction, so a milestone can never end
    up 'verified' with only some of that credit recorded. Calling this twice on an
    already-verified milestone is a safe no-op: it returns the same rows, never new ones."""
    if decision not in ("approve", "reject"):
        raise ValueError("decision must be 'approve' or 'reject'")

    with MILESTONE_VERIFY_LOCK:
        milestone = get_milestone(milestone_id)
        if not milestone:
            raise ValueError("Milestone not found")
        if milestone.status == "verified":
            return milestone, list_point_events(milestone_id=milestone.id)

        decided_at = datetime.now()
        clean_note = (note or "").strip() or None

        if decision == "reject":
            if not clean_note:
                raise ValueError("A rejection note is required")
            with problem_storage._connection() as connection:
                connection.execute(
                    "UPDATE milestones SET status='rejected', decided_by_officer_id=?, "
                    "decided_by_officer_name=?, decision_note=?, decided_at=? WHERE id=?",
                    (officer_id, officer_name, clean_note, decided_at.isoformat(), milestone_id),
                )
            return get_milestone(milestone_id), []

        # decision == "approve"
        problem = problem_storage.get_problem(milestone.problem_id)
        if not problem:
            raise ValueError("Project not found")
        parties = project_storage.get_project_parties(problem)
        members = list_project_members(milestone.problem_id)
        points = MILESTONE_POINTS[milestone.milestone_type]
        party_keys = _party_names(parties)
        awarded_at = datetime.now()
        now_iso = awarded_at.isoformat()
        new_events: List[PointEvent] = []

        with problem_storage._connection() as connection:
            connection.execute(
                "UPDATE milestones SET status='verified', decided_by_officer_id=?, "
                "decided_by_officer_name=?, decision_note=?, decided_at=? WHERE id=?",
                (officer_id, officer_name, clean_note, decided_at.isoformat(), milestone_id),
            )

            for party in parties:
                event = PointEvent(
                    problem_id=milestone.problem_id, milestone_id=milestone_id,
                    milestone_type=milestone.milestone_type, points=points,
                    actor_type=party["type"], actor_id=party["name"], actor_name=party["name"],
                    officer_id=officer_id, officer_name=officer_name, created_at=awarded_at,
                )
                cursor = connection.execute(
                    "INSERT OR IGNORE INTO point_events (id, problem_id, milestone_id, milestone_type, "
                    "points, actor_type, actor_id, actor_name, organization_type, organization_name, "
                    "officer_id, officer_name, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    (event.id, event.problem_id, event.milestone_id, event.milestone_type, event.points,
                     event.actor_type, event.actor_id, event.actor_name, None, None,
                     event.officer_id, event.officer_name, now_iso),
                )
                if cursor.rowcount:
                    new_events.append(event)

            for member in members:
                if (member.organization_type, member.organization_name) not in party_keys:
                    continue  # was on the team, but their org is no longer an accepted party
                event = PointEvent(
                    problem_id=milestone.problem_id, milestone_id=milestone_id,
                    milestone_type=milestone.milestone_type, points=points,
                    actor_type="user", actor_id=member.user_id, actor_name=member.user_name,
                    organization_type=member.organization_type, organization_name=member.organization_name,
                    officer_id=officer_id, officer_name=officer_name, created_at=awarded_at,
                )
                cursor = connection.execute(
                    "INSERT OR IGNORE INTO point_events (id, problem_id, milestone_id, milestone_type, "
                    "points, actor_type, actor_id, actor_name, organization_type, organization_name, "
                    "officer_id, officer_name, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    (event.id, event.problem_id, event.milestone_id, event.milestone_type, event.points,
                     event.actor_type, event.actor_id, event.actor_name,
                     event.organization_type, event.organization_name,
                     event.officer_id, event.officer_name, now_iso),
                )
                if cursor.rowcount:
                    new_events.append(event)

        return get_milestone(milestone_id), new_events


# --------------------------------------------------------------------------------- point events ---

def list_point_events(
    problem_id: Optional[str] = None, milestone_id: Optional[str] = None,
    actor_type: Optional[str] = None, actor_id: Optional[str] = None, limit: int = 500,
) -> List[PointEvent]:
    clauses, params = [], []
    if problem_id is not None:
        clauses.append("problem_id = ?"); params.append(problem_id)
    if milestone_id is not None:
        clauses.append("milestone_id = ?"); params.append(milestone_id)
    if actor_type is not None:
        clauses.append("actor_type = ?"); params.append(actor_type)
    if actor_id is not None:
        clauses.append("actor_id = ?"); params.append(actor_id)
    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    with problem_storage._connection() as connection:
        rows = connection.execute(
            f"SELECT * FROM point_events {where} ORDER BY created_at DESC LIMIT ?", (*params, limit),
        ).fetchall()
    return [_row_to_event(row) for row in rows]


def summarize_actor(actor_type: str, actor_id: str) -> Dict:
    events = list_point_events(actor_type=actor_type, actor_id=actor_id, limit=5000)
    actor_name = events[0].actor_name if events else actor_id
    return {
        "actor_type": actor_type,
        "actor_id": actor_id,
        "actor_name": actor_name,
        "total_points": sum(e.points for e in events),
        "verified_milestones": len({e.milestone_id for e in events}),
        "distinct_projects": len({e.problem_id for e in events}),
        "badges": compute_badges(events),
        "recent_events": events[:10],
    }


_PERIOD_DAYS = {"30d": 30, "90d": 90, "365d": 365}


def _period_cutoff(period: Optional[str]) -> Optional[datetime]:
    if not period or period == "all":
        return None
    days = _PERIOD_DAYS.get(period)
    return datetime.now() - timedelta(days=days) if days else None


def _region_problem_ids(region: str) -> set:
    return {
        p.id for p in problem_storage.list_problems(limit=2000)
        if region.lower() in " ".join(filter(None, [p.district, p.block, p.village, p.location])).lower()
    }


def list_leaderboard(
    actor_types: List[str], region: Optional[str] = None, period: Optional[str] = None, limit: int = 50,
) -> List[Dict]:
    """Ranks organizations (actor_types=["university","industry"] or one of those) or individuals
    (actor_types=["user"]) by total verified points. Independent of the other leaderboard view --
    an org's total here is never the sum of its members' individual totals, they're two separate
    aggregations over the same underlying ledger (see the module docstring)."""
    cutoff = _period_cutoff(period)
    region_ids = _region_problem_ids(region) if region else None

    with problem_storage._connection() as connection:
        placeholders = ",".join("?" for _ in actor_types)
        rows = connection.execute(
            f"SELECT * FROM point_events WHERE actor_type IN ({placeholders})", tuple(actor_types),
        ).fetchall()
    events = [_row_to_event(row) for row in rows]
    if cutoff is not None:
        events = [e for e in events if e.created_at >= cutoff]
    if region_ids is not None:
        events = [e for e in events if e.problem_id in region_ids]

    totals: Dict[str, Dict] = {}
    for e in events:
        bucket = totals.setdefault(e.actor_id, {
            "actor_id": e.actor_id, "actor_name": e.actor_name, "actor_type": e.actor_type,
            "total_points": 0, "milestone_ids": set(), "problem_ids": set(),
        })
        bucket["total_points"] += e.points
        bucket["milestone_ids"].add(e.milestone_id)
        bucket["problem_ids"].add(e.problem_id)

    # Sort by points descending; ties break on actor_name so the ranking doesn't reorder itself
    # between page loads just because a query happened to return equal-scoring rows in a different order.
    ranked = sorted(totals.values(), key=lambda b: (-b["total_points"], b["actor_name"]))[:limit]
    return [
        {
            "rank": i + 1, "actor_type": b["actor_type"], "actor_id": b["actor_id"], "actor_name": b["actor_name"],
            "total_points": b["total_points"], "verified_milestones": len(b["milestone_ids"]),
            "distinct_projects": len(b["problem_ids"]),
        }
        for i, b in enumerate(ranked)
    ]


# --------------------------------------------------------------------------------- badges (pure) --

def compute_badges(events: List[PointEvent]) -> List[Dict]:
    """Pure function over an actor's point events -- badges are never stored, only ever derived, so
    there's nothing to keep in sync when the underlying ledger changes. Icon names match the
    lucide-react icons frontend/app/student/achievements/page.tsx already knows how to render."""
    if not events:
        return []

    types_by_problem: Dict[str, set] = {}
    for e in events:
        types_by_problem.setdefault(e.problem_id, set()).add(e.milestone_type)
    all_types = {e.milestone_type for e in events}

    badges = [{
        "id": "first_verified_milestone", "title": "First Verified Milestone",
        "description": "Earned your first government-verified milestone.", "icon": "Star",
    }]
    if "prototype_completed" in all_types:
        badges.append({
            "id": "prototype_builder", "title": "Prototype Builder",
            "description": "Completed a verified prototype.", "icon": "Zap",
        })
    if "government_validation" in all_types:
        badges.append({
            "id": "government_validated", "title": "Government Validated",
            "description": "Had a solution validated by a government officer.", "icon": "Shield",
        })
    if "impact_demonstrated" in all_types:
        badges.append({
            "id": "impact_maker", "title": "Impact Maker",
            "description": "Demonstrated real-world impact with a verified solution.", "icon": "TrendingUp",
        })
    if len(types_by_problem) >= 3:
        badges.append({
            "id": "reliable_partner", "title": "Reliable Partner",
            "description": "Verified milestones across 3 or more different projects.", "icon": "Award",
        })
    if any(types == set(MILESTONE_SEQUENCE) for types in types_by_problem.values()):
        badges.append({
            "id": "project_champion", "title": "Project Champion",
            "description": "Completed every milestone, from acceptance to impact, on one project.",
            "icon": "Trophy",
        })
    return badges


# --------------------------------------------------------------------------- certificates (pure) --

def list_certificates(actor_type: str, actor_id: str) -> List[Dict]:
    """One certificate per project where this actor has a verified implementation/impact milestone
    (status 'Verified'), plus -- for individual actors only -- one 'Pending' entry per project
    they're on a team for where that milestone has been submitted but not yet decided. Matches the
    two-state Certificate.status already defined in frontend/types/student.ts."""
    events = list_point_events(actor_type=actor_type, actor_id=actor_id, limit=5000)
    best_by_problem: Dict[str, PointEvent] = {}
    for e in events:
        if e.milestone_type not in CERTIFICATE_MILESTONE_TYPES:
            continue
        current = best_by_problem.get(e.problem_id)
        if not current or e.milestone_type == "impact_demonstrated":
            best_by_problem[e.problem_id] = e

    certificates: List[Dict] = []
    for problem_id, event in best_by_problem.items():
        problem = problem_storage.get_problem(problem_id)
        certificates.append({
            "id": event.id, "problem_id": problem_id,
            "challenge_title": (problem.title or problem.problem_text) if problem else problem_id,
            "actor_name": event.actor_name, "completion_date": event.created_at.isoformat(),
            "status": "Verified",
            "certificate_id": f"CERT-{event.created_at.year}-{event.id[:8].upper()}",
            "issue_authority": event.officer_name,
        })

    if actor_type == "user":
        member_problem_ids = {m.problem_id for m in _project_ids_for_user(actor_id)}
        for problem_id in member_problem_ids - set(best_by_problem):
            pending = [
                m for m in list_milestones(problem_id)
                if m.milestone_type in CERTIFICATE_MILESTONE_TYPES and m.status == "submitted"
            ]
            if not pending:
                continue
            milestone = pending[0]
            problem = problem_storage.get_problem(problem_id)
            certificates.append({
                "id": milestone.id, "problem_id": problem_id,
                "challenge_title": (problem.title or problem.problem_text) if problem else problem_id,
                "actor_name": milestone.submitted_by_name, "completion_date": None, "status": "Pending",
                "certificate_id": f"PENDING-{milestone.id[:8].upper()}",
                "issue_authority": "Awaiting government verification",
            })
    return certificates


def _project_ids_for_user(user_id: str) -> List[ProjectMember]:
    with problem_storage._connection() as connection:
        rows = connection.execute(
            "SELECT * FROM project_members WHERE user_id = ?", (user_id,),
        ).fetchall()
    return [_row_to_member(row) for row in rows]
