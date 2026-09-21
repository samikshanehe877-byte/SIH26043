"""
problem_storage.py
SQLite storage for problems with status workflow.
"""

import json
import os
import re
import sqlite3
import threading
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
    DUPLICATE_REJECTED = "duplicate_rejected"  # auto- or government-flagged as a duplicate; dead end
    MERGED = "merged"  # government merged this into another problem; see merged_into_id


class DuplicateDecision(str):
    """Where a problem stands in the duplicate-detection pipeline (see duplicate_engine.py)."""
    NONE = "none"                              # no meaningful match found
    POTENTIAL_DUPLICATE = "potential_duplicate"  # 60-89% match; created normally, flagged for government
    DUPLICATE = "duplicate"                     # >=90% match; blocked from the normal pipeline
    DISTINCT = "distinct"                       # government reviewed a potential duplicate and cleared it
    MERGED = "merged"                           # government merged this into another problem


# Statuses a problem can be browsed in. Anything earlier (submitted, under review, returned for
# correction) or rejected is visible only to the citizen who reported it and to government reviewers.
PUBLIC_PROBLEM_STATUSES = ["verified", "assigned", "in_progress", "completed"]

# Existing problems compared against when checking a new submission for duplicates.
# A problem that's already a dead end (rejected outright, already flagged as a duplicate,
# or merged away) contributes nothing useful to compare against.
DUPLICATE_CHECK_EXCLUDED_STATUSES = {"rejected", "duplicate_rejected", "merged"}

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
    duplicates: List[Dict] = Field(default_factory=list)  # legacy text-only check from /analyze
    # Persistent composite duplicate-detection pipeline (semantic + location + domain +
    # affected-area + characteristics); see duplicate_engine.py. Independent of `duplicates` above.
    duplicate_score: Optional[float] = None
    duplicate_of_id: Optional[str] = None
    duplicate_decision: str = DuplicateDecision.NONE
    duplicate_reasons: List[str] = Field(default_factory=list)
    duplicate_breakdown: Optional[Dict] = None  # {"semantic":.., "location":.., "domain":.., ...}
    merged_into_id: Optional[str] = None
    merge_reason: Optional[str] = None
    # Additional owners gained through a negotiated merge request (see merge_requests below).
    # citizen_name remains the primary/original owner; co_owners is capped at 2 (3 owners total).
    co_owners: List[str] = Field(default_factory=list)
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
    duplicate_score: Optional[float] = None
    duplicate_of_id: Optional[str] = None
    duplicate_decision: Optional[str] = None
    duplicate_reasons: Optional[List[str]] = None
    duplicate_breakdown: Optional[Dict] = None
    merged_into_id: Optional[str] = None
    merge_reason: Optional[str] = None
    co_owners: Optional[List[str]] = None
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
    "duplicate_reasons",
    "duplicate_breakdown",
    "co_owners",
}


def is_owner(problem: ProblemBase, citizen_name: str) -> bool:
    """True if `citizen_name` is the primary owner or a co-owner gained through a merge request."""
    return citizen_name == problem.citizen_name or citizen_name in (problem.co_owners or [])


# ---------------------------------------------------------------------------
# Storage backend: SQLite by default, PostgreSQL when PROBLEM_DB_URL is set.
#
# SQLite is a file, so a problem created on one machine is invisible to every other one. Pointing
# PROBLEM_DB_URL at Postgres puts this state somewhere every deployment shares.
#
# SQLite stays the default deliberately. All thirteen test modules isolate themselves by pointing
# DATABASE_PATH at a fresh file under tmp_path, which needs no running server and keeps the suite
# fast; requiring Postgres to run the tests would cost far more than it would catch. The trade is
# real and worth stating: SQL that works on SQLite but not on Postgres will not be caught by the
# suite, so the translation below is deliberately small and every statement it rewrites is listed.
#
# The tables go in their own schema because `problems` and `project_members` already exist in the
# Prisma schema that owns users and organizations. Sharing one database is fine; sharing those two
# table names would have each half quietly overwriting the other.
# ---------------------------------------------------------------------------

PROBLEM_DB_URL = os.getenv("PROBLEM_DB_URL")
PROBLEM_DB_SCHEMA = os.getenv("PROBLEM_DB_SCHEMA", "ai")


def using_postgres() -> bool:
    """True when problem state lives in PostgreSQL rather than a local SQLite file."""
    return bool(PROBLEM_DB_URL)


_JSON_EXTRACT = re.compile(r"json_extract\(\s*([a-z_.]+)\s*,\s*'\$\.([a-z_]+)'\s*\)", re.IGNORECASE)


def _to_postgres(sql: str) -> str:
    """Rewrites the SQLite dialect this module uses into PostgreSQL.

    Only four things differ across the whole module, and each is rewritten here rather than being
    spelled differently at every call site:

      json_extract(payload, '$.x')  ->  payload::jsonb ->> 'x'
      INSERT OR IGNORE              ->  INSERT ... ON CONFLICT DO NOTHING
      INSERT OR REPLACE             ->  INSERT ... ON CONFLICT (<first column>) DO UPDATE SET ...
      ?                             ->  %s          (and REAL -> DOUBLE PRECISION in DDL)

    Both INSERT OR REPLACE/IGNORE statements in this codebase conflict on their first column, which
    is the primary key in each case, so that is what the rewrite targets.
    """
    sql = _JSON_EXTRACT.sub(r"\1::jsonb ->> '\2'", sql)

    conflict = ""
    if re.search(r"INSERT\s+OR\s+IGNORE", sql, re.IGNORECASE):
        sql = re.sub(r"INSERT\s+OR\s+IGNORE", "INSERT", sql, flags=re.IGNORECASE)
        conflict = " ON CONFLICT DO NOTHING"
    elif re.search(r"INSERT\s+OR\s+REPLACE", sql, re.IGNORECASE):
        sql = re.sub(r"INSERT\s+OR\s+REPLACE", "INSERT", sql, flags=re.IGNORECASE)
        columns = re.search(r"INSERT\s+INTO\s+[a-z_]+\s*\(([^)]*)\)", sql, re.IGNORECASE)
        names = [c.strip() for c in columns.group(1).split(",")] if columns else []
        if names:
            updates = ", ".join("%s = EXCLUDED.%s" % (c, c) for c in names[1:])
            conflict = " ON CONFLICT (%s) DO UPDATE SET %s" % (names[0], updates) if updates else " ON CONFLICT (%s) DO NOTHING" % names[0]

    # datetime(col) only exists in SQLite. Every timestamp this module stores is an ISO-8601 string
    # ("2026-09-17T14:45:31.247720"), and those sort and compare lexicographically in exactly
    # chronological order, so the wrapper can simply be dropped rather than cast.
    sql = re.sub(r"\bdatetime\(\s*([a-z_.]+)\s*\)", r"\1", sql, flags=re.IGNORECASE)

    sql = _qualify(sql)
    sql = sql.replace("?", "%s")
    sql = re.sub(r"\bREAL\b", "DOUBLE PRECISION", sql)
    return sql + conflict


# Every table this module and its siblings own. Names are rewritten to schema.table rather than
# relying on a session search_path: Neon (and any PgBouncer in transaction mode) multiplexes several
# clients onto one server connection, so a `SET search_path` leaks into whatever query runs next --
# which is how people_matcher, reading Prisma's tables in `public`, stopped being able to find them.
_OWNED_TABLES = {
    "problems", "notifications", "collaboration_requests", "merge_requests", "problem_embeddings",
    "problem_similarities", "project_members", "project_messages", "project_updates", "milestones",
    "point_events", "match_feedback", "matching_ai_cache",
}

_TABLE_REF = re.compile(
    r"\b(FROM|INTO|UPDATE|JOIN|TABLE IF NOT EXISTS|TABLE|ON)\s+([a-z_][a-z0-9_]*)",
    re.IGNORECASE,
)


def _qualify(sql: str) -> str:
    """Prefixes this module's own tables with their schema, leaving everything else untouched."""
    def replace(match):
        keyword, name = match.group(1), match.group(2)
        if name.lower() not in _OWNED_TABLES:
            return match.group(0)
        return '%s "%s".%s' % (keyword, PROBLEM_DB_SCHEMA, name)

    return _TABLE_REF.sub(replace, sql)


# One live connection per thread, reused across calls.
#
# Opening a connection to a hosted database is not free the way opening a SQLite file is: against
# Neon from here each TLS handshake costs about four seconds, and a single duplicate check makes
# roughly fifty of them. Dialling afresh per query turned a submission into a three-minute wait, so
# the connection is opened once per thread and handed back at the end of each `with` block instead
# of being closed. FastAPI runs sync endpoints on a thread pool, so per-thread is the right grain:
# no two requests ever share one connection concurrently.
_thread_state = threading.local()


def _thread_connection(url: str, schema: str):
    """This thread's connection, opening one if it has none or the last one died."""
    import psycopg
    from psycopg.rows import dict_row

    conn = getattr(_thread_state, "conn", None)
    if conn is not None and not conn.closed:
        try:
            # A connection left mid-transaction by an error would fail every later statement.
            conn.rollback()
            return conn
        except psycopg.Error:
            try:
                conn.close()
            except psycopg.Error:
                pass

    conn = psycopg.connect(url, row_factory=dict_row, autocommit=False)
    with conn.cursor() as cursor:
        # Table names are schema-qualified, so this connection needs no search_path of its own.
        # Resetting clears anything an earlier session left behind: a pooler in transaction mode
        # hands the same server connection to unrelated clients.
        cursor.execute("RESET search_path")
        cursor.execute('CREATE SCHEMA IF NOT EXISTS "%s"' % schema)
    conn.commit()
    _thread_state.conn = conn
    return conn


class _PostgresConnection:
    """The slice of the sqlite3.Connection interface this module uses, backed by psycopg.

    `execute` translates the statement and returns a cursor, so callers keep using .fetchone(),
    .fetchall() and .rowcount exactly as they do against SQLite. Rows come back as dicts, which
    supports the row["column"] access used throughout (no positional access is relied upon).
    """

    def __init__(self, url: str, schema: str):
        self._schema = schema
        self._conn = _thread_connection(url, schema)

    def execute(self, sql, params=()):
        cursor = self._conn.cursor()
        cursor.execute(_to_postgres(sql), tuple(params))
        return cursor

    def commit(self):
        self._conn.commit()

    def close(self):
        self._conn.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        # sqlite3 commits on a clean exit and rolls back on an exception. The connection itself is
        # kept open and reused: see _thread_connection for why closing it here was ruinous.
        if exc_type is None:
            self._conn.commit()
        else:
            self._conn.rollback()
        return False


def _connection():
    """A connection to wherever problem state lives: PostgreSQL if configured, else the SQLite file."""
    if PROBLEM_DB_URL:
        return _PostgresConnection(PROBLEM_DB_URL, PROBLEM_DB_SCHEMA)
    os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def _table_columns(connection, table: str) -> set:
    """The column names of one table. SQLite answers with PRAGMA, PostgreSQL with information_schema."""
    if using_postgres():
        rows = connection.execute(
            "SELECT column_name FROM information_schema.columns WHERE table_schema = ? AND table_name = ?",
            (PROBLEM_DB_SCHEMA, table),
        ).fetchall()
        return {row["column_name"] for row in rows}
    return {row["name"] for row in connection.execute(f"PRAGMA table_info({table})")}


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
        # Negotiated multi-party merge requests: government proposes merging up to 2 candidate
        # problems into a primary one; each candidate owner accepts/declines, and the primary
        # owner must separately approve each acceptance before that owner becomes a co-owner.
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS merge_requests (
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
        # Persistent duplicate-detection pipeline (see duplicate_engine.py): one cached embedding
        # per problem so repeated checks don't re-embed the whole corpus every time, plus an
        # audit trail of every pairwise comparison a submission ever triggered.
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS problem_embeddings (
                problem_id TEXT PRIMARY KEY,
                embedding TEXT NOT NULL,
                model TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS problem_similarities (
                id TEXT PRIMARY KEY,
                problem_a_id TEXT NOT NULL,
                problem_b_id TEXT NOT NULL,
                semantic_score REAL NOT NULL,
                location_score REAL NOT NULL,
                domain_score REAL NOT NULL,
                affected_area_score REAL NOT NULL,
                characteristics_score REAL NOT NULL,
                overall_score REAL NOT NULL,
                tier TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_problem_similarities_a ON problem_similarities(problem_a_id)"
        )
        # Milestone-verified points ledger (see points_storage.py). Real typed columns, not the
        # payload-blob style used above, because this data needs an enforceable UNIQUE constraint
        # (idempotent point-awarding) and GROUP BY/SUM aggregation for the leaderboard.
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS project_members (
                id TEXT PRIMARY KEY,
                problem_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                user_name TEXT NOT NULL,
                organization_type TEXT NOT NULL,
                organization_name TEXT NOT NULL,
                role TEXT,
                joined_at TEXT NOT NULL,
                UNIQUE(problem_id, user_id)
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS milestones (
                id TEXT PRIMARY KEY,
                problem_id TEXT NOT NULL,
                milestone_type TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'submitted',
                submitted_by_user_id TEXT NOT NULL,
                submitted_by_name TEXT NOT NULL,
                submitted_by_org_type TEXT NOT NULL,
                submitted_by_org_name TEXT NOT NULL,
                submitted_note TEXT,
                submitted_at TEXT NOT NULL,
                decided_by_officer_id TEXT,
                decided_by_officer_name TEXT,
                decision_note TEXT,
                decided_at TEXT,
                submitted_attachments TEXT NOT NULL DEFAULT '[]',
                submitted_links TEXT NOT NULL DEFAULT '[]',
                UNIQUE(problem_id, milestone_type)
            )
            """
        )
        # CREATE TABLE IF NOT EXISTS never alters a table that already exists, so a database created
        # before milestones could carry evidence needs these two columns added in place. Existing rows
        # get the '[]' default, i.e. "no evidence attached", which is exactly what they had.
        existing_milestone_columns = _table_columns(connection, "milestones")
        for column in ("submitted_attachments", "submitted_links"):
            if column not in existing_milestone_columns:
                connection.execute(f"ALTER TABLE milestones ADD COLUMN {column} TEXT NOT NULL DEFAULT '[]'")
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status)"
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS point_events (
                id TEXT PRIMARY KEY,
                problem_id TEXT NOT NULL,
                milestone_id TEXT NOT NULL,
                milestone_type TEXT NOT NULL,
                points INTEGER NOT NULL,
                actor_type TEXT NOT NULL,
                actor_id TEXT NOT NULL,
                actor_name TEXT NOT NULL,
                organization_type TEXT,
                organization_name TEXT,
                officer_id TEXT NOT NULL,
                officer_name TEXT NOT NULL,
                created_at TEXT NOT NULL,
                UNIQUE(problem_id, milestone_type, actor_type, actor_id)
            )
            """
        )
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_point_events_actor ON point_events(actor_type, actor_id)"
        )
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_point_events_problem ON point_events(problem_id)"
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
            # Matches the primary owner, or a co-owner gained through an approved merge
            # request. co_owners is a small JSON array of plain names, so a quoted-substring
            # match is a safe, portable stand-in for a real array-membership check here.
            conditions.append(
                "(json_extract(payload, '$.citizen_name') = ? OR "
                "json_extract(payload, '$.co_owners') LIKE ?)"
            )
            params.append(citizen_name)
            params.append(f'%"{citizen_name}"%')
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
    """Delete a problem, and any embedding/similarity rows that reference it."""
    with _connection() as connection:
        cursor = connection.execute("DELETE FROM problems WHERE id = ?", (problem_id,))
        connection.execute("DELETE FROM problem_embeddings WHERE problem_id = ?", (problem_id,))
        connection.execute(
            "DELETE FROM problem_similarities WHERE problem_a_id = ? OR problem_b_id = ?",
            (problem_id, problem_id),
        )
    return cursor.rowcount > 0


# ---------------------------------------------------------------------------
# Persistent duplicate-detection pipeline: cached embeddings + a similarity audit trail.
# See duplicate_engine.py for the scoring logic that populates these.
# ---------------------------------------------------------------------------

def save_problem_embedding(problem_id: str, vector: List[float], model: str) -> None:
    with _connection() as connection:
        connection.execute(
            """
            INSERT INTO problem_embeddings (problem_id, embedding, model, created_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(problem_id) DO UPDATE SET
                embedding = excluded.embedding, model = excluded.model, created_at = excluded.created_at
            """,
            (problem_id, json.dumps([float(x) for x in vector]), model, datetime.now().isoformat()),
        )


def get_problem_embedding(problem_id: str) -> Optional[List[float]]:
    with _connection() as connection:
        row = connection.execute(
            "SELECT embedding FROM problem_embeddings WHERE problem_id = ?", (problem_id,)
        ).fetchone()
    return json.loads(row["embedding"]) if row else None


def get_problem_embeddings(problem_ids: List[str]) -> Dict[str, List[float]]:
    """Every cached embedding among `problem_ids`, as {problem_id: vector}, in one round trip.

    The per-id version below is fine against a local file but ruinous against a hosted database:
    a duplicate check looks at every existing problem, and fifty sequential queries to Neon cost
    about fifty seconds, which is most of why submitting a problem appeared to hang.
    """
    if not problem_ids:
        return {}
    with _connection() as connection:
        placeholders = ",".join("?" for _ in problem_ids)
        rows = connection.execute(
            "SELECT problem_id, embedding FROM problem_embeddings WHERE problem_id IN (%s)" % placeholders,
            tuple(problem_ids),
        ).fetchall()
    return {row["problem_id"]: json.loads(row["embedding"]) for row in rows}


def save_problem_similarity(problem_a_id: str, problem_b_id: str, scores: Dict[str, float], tier: str) -> None:
    """Records one pairwise comparison a submission triggered, for the government dashboard's
    'why was this flagged' view and for later audit."""
    with _connection() as connection:
        connection.execute(
            """
            INSERT INTO problem_similarities
                (id, problem_a_id, problem_b_id, semantic_score, location_score, domain_score,
                 affected_area_score, characteristics_score, overall_score, tier, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                str(uuid.uuid4()), problem_a_id, problem_b_id,
                scores["semantic"], scores["location"], scores["domain"],
                scores["affected_area"], scores["characteristics"], scores["overall"],
                tier, datetime.now().isoformat(),
            ),
        )


def list_problem_similarities(problem_id: str) -> List[Dict]:
    with _connection() as connection:
        rows = connection.execute(
            "SELECT * FROM problem_similarities WHERE problem_a_id = ? OR problem_b_id = ? "
            "ORDER BY datetime(created_at) DESC",
            (problem_id, problem_id),
        ).fetchall()
    return [dict(row) for row in rows]

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


# ---------------------------------------------------------------------------
# Negotiated multi-party merge requests.
#
# A government officer proposes merging one or more "candidate" problems into a "primary"
# problem. Each candidate's owner independently accepts or declines. Accepting does not, by
# itself, make that owner a co-owner -- the primary owner must separately approve each
# acceptance. Only then is that candidate's problem retired (status "merged") and its owner
# added to the primary problem's co_owners. At most 2 candidates may be approved onto a given
# primary problem, for 3 owners total (primary + 2 co-owners).
# ---------------------------------------------------------------------------

MAX_CO_OWNERS = 2  # + the primary owner = 3 total


class MergeRequestMember(BaseModel):
    problem_id: str
    citizen_name: str
    problem_title: str
    response: str = "pending"  # pending | accepted | declined
    approved: bool = False
    responded_at: Optional[str] = None
    approved_at: Optional[str] = None


class MergeRequestRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    primary_problem_id: str
    primary_citizen_name: str
    primary_problem_title: str
    initiated_by: str  # the government officer who proposed the merge
    note: Optional[str] = None
    status: str = "open"  # open | closed
    members: List[MergeRequestMember] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


def _save_merge_request(record: MergeRequestRecord, insert: bool = False) -> MergeRequestRecord:
    record.updated_at = datetime.now()
    with _connection() as connection:
        if insert:
            connection.execute(
                "INSERT INTO merge_requests (id, payload, created_at, updated_at) VALUES (?, ?, ?, ?)",
                (record.id, record.model_dump_json(), record.created_at.isoformat(), record.updated_at.isoformat()),
            )
        else:
            connection.execute(
                "UPDATE merge_requests SET payload = ?, updated_at = ? WHERE id = ?",
                (record.model_dump_json(), record.updated_at.isoformat(), record.id),
            )
    return record


def _is_merge_request_resolved(record: MergeRequestRecord) -> bool:
    """True once every member has either declined or been approved -- nothing left pending
    or merely accepted-but-unapproved."""
    return all(m.response == "declined" or m.approved for m in record.members)


def create_merge_request(
    primary_problem: ProblemBase, candidates: List[ProblemBase], initiated_by: str, note: Optional[str] = None
) -> MergeRequestRecord:
    if not candidates:
        raise ValueError("At least one candidate problem is required")
    if len(candidates) > MAX_CO_OWNERS:
        raise ValueError(f"A merge request can include at most {MAX_CO_OWNERS} candidate problems")
    record = MergeRequestRecord(
        primary_problem_id=primary_problem.id,
        primary_citizen_name=primary_problem.citizen_name,
        primary_problem_title=primary_problem.title or primary_problem.problem_text,
        initiated_by=initiated_by,
        note=note,
        members=[
            MergeRequestMember(
                problem_id=candidate.id,
                citizen_name=candidate.citizen_name,
                problem_title=candidate.title or candidate.problem_text,
            )
            for candidate in candidates
        ],
    )
    return _save_merge_request(record, insert=True)


def get_merge_request(request_id: str) -> Optional[MergeRequestRecord]:
    with _connection() as connection:
        row = connection.execute("SELECT payload FROM merge_requests WHERE id = ?", (request_id,)).fetchone()
    return MergeRequestRecord.model_validate(json.loads(row["payload"])) if row else None


def list_merge_requests(
    citizen_name: Optional[str] = None,
    problem_id: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 200,
) -> List[MergeRequestRecord]:
    """Merge-request volume is expected to stay tiny, so filtering (beyond `status`, which is a
    flat field) happens in Python against the small full set rather than via nested JSON SQL."""
    conditions = []
    params: list = []
    if status:
        conditions.append("json_extract(payload, '$.status') = ?")
        params.append(status)
    where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""
    with _connection() as connection:
        rows = connection.execute(
            f"SELECT payload FROM merge_requests{where_clause} ORDER BY datetime(created_at) DESC LIMIT ?",
            [*params, limit],
        ).fetchall()
    records = [MergeRequestRecord.model_validate(json.loads(row["payload"])) for row in rows]
    if problem_id:
        records = [
            r for r in records
            if r.primary_problem_id == problem_id or any(m.problem_id == problem_id for m in r.members)
        ]
    if citizen_name:
        records = [
            r for r in records
            if r.primary_citizen_name == citizen_name or any(m.citizen_name == citizen_name for m in r.members)
        ]
    return records


def respond_to_merge_request(request_id: str, problem_id: str, citizen_name: str, response: str) -> MergeRequestRecord:
    """A candidate owner accepts or declines. Raises ValueError for a bad state, PermissionError
    if `citizen_name` doesn't own that candidate problem."""
    if response not in ("accepted", "declined"):
        raise ValueError("response must be 'accepted' or 'declined'")
    record = get_merge_request(request_id)
    if not record:
        raise ValueError("Merge request not found")
    if record.status != "open":
        raise ValueError("This merge request is closed")
    member = next((m for m in record.members if m.problem_id == problem_id), None)
    if not member:
        raise ValueError("That problem is not part of this merge request")
    if member.citizen_name != citizen_name:
        raise PermissionError("Only the owner of that problem can respond to this merge request")
    if member.response != "pending":
        raise ValueError(f"Already responded ({member.response})")

    member.response = response
    member.responded_at = datetime.now().isoformat()
    if _is_merge_request_resolved(record):
        record.status = "closed"
    return _save_merge_request(record)


def approve_merge_request_member(request_id: str, problem_id: str, primary_citizen_name: str) -> "tuple[MergeRequestRecord, MergeRequestMember]":
    """The primary owner approves a candidate who already accepted, making them a co-owner.
    Raises PermissionError if the caller isn't the primary owner, ValueError for a bad state
    or if the 3-owner cap would be exceeded."""
    record = get_merge_request(request_id)
    if not record:
        raise ValueError("Merge request not found")
    if record.primary_citizen_name != primary_citizen_name:
        raise PermissionError("Only the primary problem's owner can approve a co-owner")
    member = next((m for m in record.members if m.problem_id == problem_id), None)
    if not member:
        raise ValueError("That problem is not part of this merge request")
    if member.response != "accepted":
        raise ValueError("This owner has not accepted the merge request yet")
    if member.approved:
        raise ValueError("Already approved")
    already_approved = sum(1 for m in record.members if m.approved)
    if already_approved >= MAX_CO_OWNERS:
        raise ValueError(f"This problem already has the maximum of {MAX_CO_OWNERS + 1} owners")

    member.approved = True
    member.approved_at = datetime.now().isoformat()
    if _is_merge_request_resolved(record):
        record.status = "closed"
    saved = _save_merge_request(record)
    return saved, next(m for m in saved.members if m.problem_id == problem_id)