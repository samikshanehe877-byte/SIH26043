"""
Milestone-verified points ledger: join/submit/verify, idempotency, badges and certificates.
"""

import sqlite3

import pytest

import problem_storage
import project_storage
import points_storage
from problem_storage import (
    CollaborationRequestRecord,
    ProblemBase,
    ProblemUpdate,
    add_volunteer,
    create_collaboration_request,
    create_problem,
    get_problem,
    select_volunteer,
    transition_collaboration_request,
    update_problem,
)

UNIVERSITY = "ABC Institute of Technology"
INDUSTRY = "Tech Solutions Pvt Ltd"
OFFICER_ID = "officer-1"
OFFICER_NAME = "Dr. Anita Sharma"


@pytest.fixture(autouse=True)
def isolated_db(tmp_path, monkeypatch):
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", str(tmp_path / "points.sqlite3"))
    problem_storage.initialize_storage()


@pytest.fixture
def project():
    """University leads; industry joined as an accepted collaborator."""
    problem = create_problem(ProblemBase(problem_text="Potholes", title="Pothole alerts", citizen_name="Rahul Sharma"))
    update_problem(problem.id, ProblemUpdate(status="verified"))
    add_volunteer(problem.id, "university", UNIVERSITY, "We can help")
    select_volunteer(problem.id, "university", UNIVERSITY)
    request = create_collaboration_request(CollaborationRequestRecord(
        requested_by="university", university_name=UNIVERSITY, industry_name=INDUSTRY,
        problem_id=problem.id, challenge_title="Pothole alerts",
    ))
    transition_collaboration_request(request.id, "industry", INDUSTRY, "accept")
    return get_problem(problem.id)


def test_join_project_rejects_organization_not_a_party(project):
    with pytest.raises(PermissionError):
        points_storage.join_project(project.id, "u9", "Someone", "university", "Some Other University")


def test_join_project_is_idempotent(project):
    first = points_storage.join_project(project.id, "u1", "Janhavi Tupe", "university", UNIVERSITY, role="student")
    second = points_storage.join_project(project.id, "u1", "Janhavi Tupe", "university", UNIVERSITY, role="student")
    assert first.id == second.id
    assert len(points_storage.list_project_members(project.id)) == 1


def test_submit_milestone_rejects_unknown_type(project):
    with pytest.raises(ValueError):
        points_storage.submit_milestone(
            project.id, "not_a_real_milestone", "u1", "Janhavi Tupe", "university", UNIVERSITY,
        )


def test_verify_approve_awards_org_and_member_points(project):
    points_storage.join_project(project.id, "u2", "Second Student", "university", UNIVERSITY, role="student")
    milestone = points_storage.submit_milestone(
        project.id, "prototype_completed", "u1", "Janhavi Tupe", "university", UNIVERSITY,
        note="Prototype demo ready",
    )
    assert milestone.status == "submitted"

    verified, new_events = points_storage.verify_milestone(
        milestone.id, "approve", "Looks solid", OFFICER_ID, OFFICER_NAME,
    )
    assert verified.status == "verified"

    points = points_storage.MILESTONE_POINTS["prototype_completed"]
    events_by_actor = {(e.actor_type, e.actor_id): e for e in new_events}

    # Both parties (university lead, industry collaborator) get an org-level event...
    assert events_by_actor[("university", UNIVERSITY)].points == points
    assert events_by_actor[("industry", INDUSTRY)].points == points
    # ...and every university-side team member (submitter auto-joined, plus the explicit joiner)
    # gets full individual credit too. The industry side has no joined members, so no user events
    # for it.
    assert events_by_actor[("user", "u1")].points == points
    assert events_by_actor[("user", "u2")].points == points
    assert ("user", "industry-employee") not in events_by_actor
    assert len(new_events) == 4

    summary = points_storage.summarize_actor("user", "u1")
    assert summary["total_points"] == points
    assert summary["verified_milestones"] == 1
    assert summary["distinct_projects"] == 1

    org_summary = points_storage.summarize_actor("university", UNIVERSITY)
    assert org_summary["total_points"] == points


def test_double_verify_is_idempotent(project):
    milestone = points_storage.submit_milestone(
        project.id, "project_accepted", "u1", "Janhavi Tupe", "university", UNIVERSITY,
    )
    _, first_events = points_storage.verify_milestone(milestone.id, "approve", None, OFFICER_ID, OFFICER_NAME)
    assert len(first_events) > 0

    _, second_events = points_storage.verify_milestone(milestone.id, "approve", None, OFFICER_ID, OFFICER_NAME)
    assert second_events == first_events  # same rows replayed, nothing new created

    all_events = points_storage.list_point_events(problem_id=project.id, milestone_id=milestone.id)
    assert len(all_events) == len(first_events)  # calling verify twice never doubled anything


def test_reject_requires_a_note(project):
    milestone = points_storage.submit_milestone(
        project.id, "project_accepted", "u1", "Janhavi Tupe", "university", UNIVERSITY,
    )
    with pytest.raises(ValueError):
        points_storage.verify_milestone(milestone.id, "reject", "   ", OFFICER_ID, OFFICER_NAME)

    rejected, events = points_storage.verify_milestone(
        milestone.id, "reject", "Needs more evidence", OFFICER_ID, OFFICER_NAME,
    )
    assert rejected.status == "rejected"
    assert events == []
    assert points_storage.list_point_events(milestone_id=milestone.id) == []


def test_resubmit_after_rejection_then_verify_succeeds(project):
    milestone = points_storage.submit_milestone(
        project.id, "initial_planning", "u1", "Janhavi Tupe", "university", UNIVERSITY,
    )
    points_storage.verify_milestone(milestone.id, "reject", "Not ready yet", OFFICER_ID, OFFICER_NAME)

    resubmitted = points_storage.submit_milestone(
        project.id, "initial_planning", "u1", "Janhavi Tupe", "university", UNIVERSITY, note="Ready now",
    )
    assert resubmitted.id == milestone.id  # same milestone row, re-upserted
    assert resubmitted.status == "submitted"

    verified, events = points_storage.verify_milestone(resubmitted.id, "approve", "Good", OFFICER_ID, OFFICER_NAME)
    assert verified.status == "verified"
    assert len(events) > 0


def test_verified_milestone_cannot_be_resubmitted(project):
    milestone = points_storage.submit_milestone(
        project.id, "project_accepted", "u1", "Janhavi Tupe", "university", UNIVERSITY,
    )
    points_storage.verify_milestone(milestone.id, "approve", None, OFFICER_ID, OFFICER_NAME)
    with pytest.raises(ValueError):
        points_storage.submit_milestone(
            project.id, "project_accepted", "u1", "Janhavi Tupe", "university", UNIVERSITY,
        )


def test_badges_and_certificates_reflect_verified_milestones(project):
    for milestone_type in ("project_accepted", "prototype_completed", "implementation"):
        milestone = points_storage.submit_milestone(
            project.id, milestone_type, "u1", "Janhavi Tupe", "university", UNIVERSITY,
        )
        points_storage.verify_milestone(milestone.id, "approve", None, OFFICER_ID, OFFICER_NAME)

    events = points_storage.list_point_events(actor_type="user", actor_id="u1")
    badge_ids = {b["id"] for b in points_storage.compute_badges(events)}
    assert "first_verified_milestone" in badge_ids
    assert "prototype_builder" in badge_ids
    assert "government_validated" not in badge_ids  # never submitted/verified for this project

    certificates = points_storage.list_certificates("user", "u1")
    assert len(certificates) == 1
    assert certificates[0]["status"] == "Verified"
    assert certificates[0]["challenge_title"] == "Pothole alerts"
    assert certificates[0]["actor_name"] == "Janhavi Tupe"


def test_certificate_is_pending_when_submitted_but_not_yet_verified(project):
    points_storage.submit_milestone(
        project.id, "implementation", "u1", "Janhavi Tupe", "university", UNIVERSITY,
    )
    certificates = points_storage.list_certificates("user", "u1")
    assert len(certificates) == 1
    assert certificates[0]["status"] == "Pending"


def test_leaderboard_ranks_by_total_points_and_respects_actor_type(project):
    # A verified milestone credits every current party equally -- the lead and the collaborator
    # both did the project, so both end up tied here. A second, unrelated project (university only,
    # no industry collaborator) pushes the university strictly ahead on its own leaderboard total.
    shared = points_storage.submit_milestone(
        project.id, "impact_demonstrated", "u1", "Janhavi Tupe", "university", UNIVERSITY,
    )
    points_storage.verify_milestone(shared.id, "approve", None, OFFICER_ID, OFFICER_NAME)

    other_problem = create_problem(ProblemBase(problem_text="Streetlights", title="Streetlight repair", citizen_name="Meera Iyer"))
    update_problem(other_problem.id, ProblemUpdate(status="verified"))
    add_volunteer(other_problem.id, "university", UNIVERSITY, "We can help")
    select_volunteer(other_problem.id, "university", UNIVERSITY)
    extra = points_storage.submit_milestone(
        other_problem.id, "government_validation", "u1", "Janhavi Tupe", "university", UNIVERSITY,
    )
    points_storage.verify_milestone(extra.id, "approve", None, OFFICER_ID, OFFICER_NAME)

    org_board = points_storage.list_leaderboard(["university", "industry"])
    assert org_board[0]["actor_id"] == UNIVERSITY
    assert org_board[0]["total_points"] == (
        points_storage.MILESTONE_POINTS["impact_demonstrated"] + points_storage.MILESTONE_POINTS["government_validation"]
    )
    assert org_board[0]["distinct_projects"] == 2
    assert org_board[1]["actor_id"] == INDUSTRY
    assert org_board[1]["total_points"] == points_storage.MILESTONE_POINTS["impact_demonstrated"]

    user_board = points_storage.list_leaderboard(["user"])
    assert user_board[0]["actor_id"] == "u1"
    assert all(row["actor_type"] == "user" for row in user_board)


# ---------------------------------------------------------------------- milestone evidence ----

def test_normalize_links_trims_dedupes_and_adds_https():
    assert points_storage.normalize_links(
        ["  https://example.com/demo  ", "", "www.example.org/report", "https://example.com/demo"]
    ) == ["https://example.com/demo", "https://www.example.org/report"]
    assert points_storage.normalize_links(None) == []


@pytest.mark.parametrize("bad", [
    "javascript:alert(1)", "ftp://example.com/file", "file:///etc/passwd", "data:text/html,hi",
    "https://", "https://example.com:notaport/x",
])
def test_normalize_links_rejects_anything_that_isnt_a_web_link(bad):
    with pytest.raises(ValueError):
        points_storage.normalize_links([bad])


def test_normalize_links_enforces_the_limit():
    too_many = [f"https://example.com/{i}" for i in range(points_storage.MAX_MILESTONE_LINKS + 1)]
    with pytest.raises(ValueError):
        points_storage.normalize_links(too_many)


def test_submit_milestone_stores_and_returns_evidence(project):
    attachments = [{"name": "photo.jpg", "content_type": "image/jpeg", "size": 12, "url": "/uploads/abc.jpg"}]
    milestone = points_storage.submit_milestone(
        project.id, "prototype_completed", "u1", "Janhavi Tupe", "university", UNIVERSITY,
        note="Demo ready", attachments=attachments, links=["https://example.com/demo-video"],
    )
    assert milestone.submitted_attachments == attachments
    assert milestone.submitted_links == ["https://example.com/demo-video"]

    # Persisted, not just returned once -- and visible in the officer's review queue too.
    stored = points_storage.get_milestone(milestone.id)
    assert stored.submitted_attachments == attachments
    assert [m.submitted_links for m in points_storage.list_pending_milestones()] == [["https://example.com/demo-video"]]


def test_a_submission_with_no_evidence_still_works(project):
    milestone = points_storage.submit_milestone(
        project.id, "project_accepted", "u1", "Janhavi Tupe", "university", UNIVERSITY,
    )
    assert milestone.submitted_attachments == []
    assert milestone.submitted_links == []


def test_resubmission_replaces_the_evidence(project):
    first = points_storage.submit_milestone(
        project.id, "initial_planning", "u1", "Janhavi Tupe", "university", UNIVERSITY,
        attachments=[{"name": "old.pdf", "content_type": "application/pdf", "size": 1, "url": "/uploads/old.pdf"}],
        links=["https://example.com/old"],
    )
    points_storage.verify_milestone(first.id, "reject", "Not enough detail", OFFICER_ID, OFFICER_NAME)

    second = points_storage.submit_milestone(
        project.id, "initial_planning", "u1", "Janhavi Tupe", "university", UNIVERSITY,
        attachments=[{"name": "new.pdf", "content_type": "application/pdf", "size": 2, "url": "/uploads/new.pdf"}],
        links=["https://example.com/new"],
    )
    assert second.id == first.id
    assert [a["name"] for a in second.submitted_attachments] == ["new.pdf"]
    assert second.submitted_links == ["https://example.com/new"]


def test_invalid_link_rejects_the_whole_submission(project):
    with pytest.raises(ValueError):
        points_storage.submit_milestone(
            project.id, "project_accepted", "u1", "Janhavi Tupe", "university", UNIVERSITY,
            links=["javascript:alert(1)"],
        )
    assert points_storage.list_milestones(project.id) == []  # nothing half-saved


def test_initialize_storage_adds_evidence_columns_to_an_older_milestones_table(tmp_path, monkeypatch):
    """A database created before milestones could carry evidence must be upgraded in place, keeping
    its existing rows -- CREATE TABLE IF NOT EXISTS alone would leave it without the new columns."""
    old_db = str(tmp_path / "old_schema.sqlite3")
    with sqlite3.connect(old_db) as connection:
        connection.execute("""
            CREATE TABLE milestones (
                id TEXT PRIMARY KEY, problem_id TEXT NOT NULL, milestone_type TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'submitted', submitted_by_user_id TEXT NOT NULL,
                submitted_by_name TEXT NOT NULL, submitted_by_org_type TEXT NOT NULL,
                submitted_by_org_name TEXT NOT NULL, submitted_note TEXT, submitted_at TEXT NOT NULL,
                decided_by_officer_id TEXT, decided_by_officer_name TEXT, decision_note TEXT, decided_at TEXT,
                UNIQUE(problem_id, milestone_type)
            )
        """)
        connection.execute(
            "INSERT INTO milestones (id, problem_id, milestone_type, submitted_by_user_id, submitted_by_name, "
            "submitted_by_org_type, submitted_by_org_name, submitted_at) VALUES "
            "('old-1','p1','project_accepted','u1','Old Row','university','ABC','2026-01-01T00:00:00')"
        )
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", old_db)
    problem_storage.initialize_storage()
    problem_storage.initialize_storage()  # and running it again is harmless

    migrated = points_storage.get_milestone("old-1")
    assert migrated.submitted_by_name == "Old Row"
    assert migrated.submitted_attachments == []
    assert migrated.submitted_links == []
