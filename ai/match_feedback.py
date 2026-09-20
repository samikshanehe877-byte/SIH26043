"""
match_feedback.py

What a person has done with the "Best Match Problems" cards, so the list stops showing the same
problems forever and new ones get a turn.

  seen       The card was shown to them. Each earlier view lowers a problem's ordering a little, so a
             fresh problem with a slightly lower match overtakes one they have already looked at.
  dismissed  They pressed "Not interested". That ranks the problem below every problem they have not
             dismissed, but does not delete it: it can be restored, and it still appears once there
             is nothing undismissed left to show.

This changes ORDER only. The match percentage, coverage and gaps a card shows are still the
calculated ones, so a demoted problem is never made to look like a worse match than it is.

Feedback belongs to the signed-in person, not the organization: one coordinator's "not interested"
does not hide a problem from a colleague. FastAPI has no auth of its own, so the user id is supplied
by the Next.js proxy from the session, never taken from the browser.
"""

import time
from typing import Dict, Iterable, List

import problem_storage

SEEN_DECAY = 0.85          # ordering weight kept per earlier view
SEEN_FLOOR = 0.45          # however often it has been seen, a problem keeps at least this weight
SEEN_DEBOUNCE_SECONDS = 30  # reloads and double mounts within this window count as one view
MAX_IDS_PER_CALL = 20


def _ensure(connection) -> None:
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS match_feedback (
            user_id TEXT NOT NULL,
            org_type TEXT NOT NULL,
            org_id TEXT NOT NULL,
            problem_id TEXT NOT NULL,
            views INTEGER NOT NULL DEFAULT 0,
            dismissed INTEGER NOT NULL DEFAULT 0,
            last_seen REAL NOT NULL DEFAULT 0,
            updated_at REAL NOT NULL,
            PRIMARY KEY (user_id, org_id, problem_id)
        )
        """
    )


def record_seen(user_id: str, org_type: str, org_id: str, problem_ids: Iterable[str]) -> int:
    """Counts one view for each problem, unless it was already counted a moment ago. Returns how many counted."""
    now = time.time()
    counted = 0
    with problem_storage._connection() as connection:
        _ensure(connection)
        for problem_id in problem_ids:
            row = connection.execute(
                "SELECT last_seen FROM match_feedback WHERE user_id = ? AND org_id = ? AND problem_id = ?",
                (user_id, org_id, problem_id),
            ).fetchone()
            if row and now - row["last_seen"] < SEEN_DEBOUNCE_SECONDS:
                continue
            connection.execute(
                """
                INSERT INTO match_feedback (user_id, org_type, org_id, problem_id, views, last_seen, updated_at)
                VALUES (?, ?, ?, ?, 1, ?, ?)
                ON CONFLICT(user_id, org_id, problem_id) DO UPDATE SET views = views + 1, last_seen = ?, updated_at = ?
                """,
                (user_id, org_type, org_id, problem_id, now, now, now, now),
            )
            counted += 1
    return counted


def set_dismissed(user_id: str, org_type: str, org_id: str, problem_ids: Iterable[str], dismissed: bool) -> int:
    """Marks problems "not interested" (or restores them). Returns how many were updated."""
    now = time.time()
    updated = 0
    with problem_storage._connection() as connection:
        _ensure(connection)
        for problem_id in problem_ids:
            connection.execute(
                """
                INSERT INTO match_feedback (user_id, org_type, org_id, problem_id, dismissed, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id, org_id, problem_id) DO UPDATE SET dismissed = ?, updated_at = ?
                """,
                (user_id, org_type, org_id, problem_id, int(dismissed), now, int(dismissed), now),
            )
            updated += 1
    return updated


def load(user_id: str, org_id: str) -> Dict[str, Dict]:
    """{problem_id: {"views": n, "dismissed": bool}} for one person in one organization."""
    with problem_storage._connection() as connection:
        _ensure(connection)
        rows = connection.execute(
            "SELECT problem_id, views, dismissed FROM match_feedback WHERE user_id = ? AND org_id = ?", (user_id, org_id)
        ).fetchall()
    return {row["problem_id"]: {"views": row["views"], "dismissed": bool(row["dismissed"])} for row in rows}


def priority(score: float, feedback: Dict) -> float:
    """The ordering weight of a problem among others in its group: its match score, worn down by views."""
    return score * max(SEEN_FLOOR, SEEN_DECAY ** feedback.get("views", 0))


def sort_key(score: float, feedback: Dict):
    """How a problem is ordered: "not interested" below everything else, then by view-worn score.

    Dismissing is a partition, not a discount. A discount cannot do the job: multiplying every
    dismissed problem by the same factor leaves their order among themselves unchanged, so once a
    person has dismissed every problem their organization can match, the same cards keep the same
    top slots forever. Ranking them strictly below the rest means one dismissal always frees a slot
    for a problem that has not been dismissed, if any remains.
    """
    return (0 if feedback.get("dismissed") else 1, priority(score, feedback))


def rerank(items: List[Dict], feedback: Dict[str, Dict]) -> List[Dict]:
    """Orders rank_problems_for_organization items by sort_key, and tags each with the feedback that applied.

    `score` is left untouched: only the order changes.
    """
    tagged = []
    for item in items:
        fb = feedback.get(item["problem"]["id"], {"views": 0, "dismissed": False})
        tagged.append(({**item, "feedback": {"views": fb["views"], "dismissed": fb["dismissed"]}}, sort_key(item["match"]["score"], fb)))
    tagged.sort(key=lambda pair: pair[1], reverse=True)
    return [item for item, _ in tagged]
