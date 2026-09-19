"""
Milestones / points ledger API: authorization, idempotency, and the happy path end-to-end.
"""

import pytest
from fastapi import HTTPException

import problem_storage
from api import (
    CollaborationAction,
    CreateCollaborationRequest,
    JoinProjectRequest,
    MilestoneSubmissionRequest,
    MilestoneVerificationDecision,
    SelectVolunteerRequest,
    VolunteerRequest,
    act_on_collaboration_request_endpoint,
    certificates_endpoint,
    create_collaboration_request_endpoint,
    create_problem_endpoint,
    join_project_endpoint,
    list_pending_milestones_endpoint,
    list_project_members_endpoint,
    list_project_milestones_endpoint,
    organization_leaderboard_endpoint,
    points_summary_endpoint,
    select_volunteer_endpoint,
    submit_milestone_endpoint,
    user_leaderboard_endpoint,
    verify_milestone_endpoint,
    volunteer_for_problem_endpoint,
)
from problem_storage import ProblemBase, ProblemUpdate, update_problem

UNIVERSITY = "ABC Institute of Technology"
INDUSTRY = "Tech Solutions Pvt Ltd"
OUTSIDER = "Some Other University"
OFFICER_ID = "officer-1"
OFFICER_NAME = "Dr. Anita Sharma"


@pytest.fixture(autouse=True)
def isolated_db(tmp_path, monkeypatch):
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", str(tmp_path / "milestones_api.sqlite3"))
    problem_storage.initialize_storage()


@pytest.fixture
def project():
    """University leads; industry joined as an accepted collaborator -- same shape as
    test_project_workspace.py's fixture."""
    problem = create_problem_endpoint(ProblemBase(problem_text="Potholes", title="Pothole alerts", citizen_name="Rahul Sharma"))
    update_problem(problem.id, ProblemUpdate(status="verified"))
    for solver_type, name in (("university", UNIVERSITY), ("industry", INDUSTRY)):
        volunteer_for_problem_endpoint(problem.id, VolunteerRequest(solver_type=solver_type, solver_name=name))
    select_volunteer_endpoint(problem.id, SelectVolunteerRequest(solver_type="university", solver_name=UNIVERSITY, citizen_name="Rahul Sharma"))
    request = create_collaboration_request_endpoint(CreateCollaborationRequest(
        requested_by="university", university_name=UNIVERSITY, industry_name=INDUSTRY,
        problem_id=problem.id, challenge_title="Pothole alerts", support_types=["Hardware"],
        progress_summary="Survey done, need sensors",
    ))
    act_on_collaboration_request_endpoint(request.id, CollaborationAction(
        actor_type="industry", actor_name=INDUSTRY, action="accept"))
    return problem


def test_outsider_cannot_join_or_submit(project):
    with pytest.raises(HTTPException) as error:
        join_project_endpoint(project.id, JoinProjectRequest(
            party_type="university", party_name=OUTSIDER, user_id="u9", user_name="Someone"))
    assert error.value.status_code == 403

    with pytest.raises(HTTPException) as error:
        submit_milestone_endpoint(project.id, MilestoneSubmissionRequest(
            party_type="university", party_name=OUTSIDER, user_id="u9", user_name="Someone",
            milestone_type="project_accepted"))
    assert error.value.status_code == 403


def test_citizen_cannot_submit_milestones(project):
    with pytest.raises(HTTPException) as error:
        submit_milestone_endpoint(project.id, MilestoneSubmissionRequest(
            party_type="citizen", party_name="Rahul Sharma", user_id="c1", user_name="Rahul Sharma",
            milestone_type="project_accepted"))
    assert error.value.status_code == 403


def test_join_submit_verify_happy_path(project):
    member = join_project_endpoint(project.id, JoinProjectRequest(
        party_type="university", party_name=UNIVERSITY, user_id="u1", user_name="Janhavi Tupe", role="student"))
    assert member.user_id == "u1"
    assert [m.user_id for m in list_project_members_endpoint(project.id, "industry", INDUSTRY)] == ["u1"]

    milestone = submit_milestone_endpoint(project.id, MilestoneSubmissionRequest(
        party_type="university", party_name=UNIVERSITY, user_id="u1", user_name="Janhavi Tupe",
        milestone_type="prototype_completed", note="Demo ready"))
    assert milestone.status == "submitted"

    pending = list_pending_milestones_endpoint()
    assert milestone.id in [m.id for m in pending]

    result = verify_milestone_endpoint(milestone.id, MilestoneVerificationDecision(
        decision="approve", note="Looks great", officer_id=OFFICER_ID, officer_name=OFFICER_NAME))
    assert result["milestone"].status == "verified"
    points = sum(e.points for e in result["new_point_events"] if e.actor_id == "u1")
    assert points > 0

    detail = list_project_milestones_endpoint(project.id, "university", UNIVERSITY)
    assert len(detail["milestones"]) == 1
    assert len(detail["point_events"]) == len(result["new_point_events"])

    summary = points_summary_endpoint("user", "u1")
    assert summary["total_points"] == points

    certificates = certificates_endpoint("university", UNIVERSITY)
    assert certificates == []  # prototype_completed isn't a certificate-eligible milestone

    org_board = organization_leaderboard_endpoint()
    assert any(row["actor_id"] == UNIVERSITY for row in org_board)
    user_board = user_leaderboard_endpoint()
    assert any(row["actor_id"] == "u1" for row in user_board)


def test_reject_requires_a_note(project):
    milestone = submit_milestone_endpoint(project.id, MilestoneSubmissionRequest(
        party_type="university", party_name=UNIVERSITY, user_id="u1", user_name="Janhavi Tupe",
        milestone_type="project_accepted"))
    with pytest.raises(HTTPException) as error:
        verify_milestone_endpoint(milestone.id, MilestoneVerificationDecision(
            decision="reject", note="", officer_id=OFFICER_ID, officer_name=OFFICER_NAME))
    assert error.value.status_code == 400


def test_double_verify_via_endpoint_awards_points_once(project):
    milestone = submit_milestone_endpoint(project.id, MilestoneSubmissionRequest(
        party_type="university", party_name=UNIVERSITY, user_id="u1", user_name="Janhavi Tupe",
        milestone_type="project_accepted"))
    verify_milestone_endpoint(milestone.id, MilestoneVerificationDecision(
        decision="approve", note=None, officer_id=OFFICER_ID, officer_name=OFFICER_NAME))
    verify_milestone_endpoint(milestone.id, MilestoneVerificationDecision(
        decision="approve", note=None, officer_id=OFFICER_ID, officer_name=OFFICER_NAME))

    summary = points_summary_endpoint("university", UNIVERSITY)
    assert summary["total_points"] == points_storage_points("project_accepted")


def points_storage_points(milestone_type: str) -> int:
    import points_storage
    return points_storage.MILESTONE_POINTS[milestone_type]


def test_verifying_unknown_milestone_returns_404():
    with pytest.raises(HTTPException) as error:
        verify_milestone_endpoint("does-not-exist", MilestoneVerificationDecision(
            decision="approve", note=None, officer_id=OFFICER_ID, officer_name=OFFICER_NAME))
    assert error.value.status_code == 404
