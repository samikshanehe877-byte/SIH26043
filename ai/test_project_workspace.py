"""
Project workspaces: accepted problems, lead + collaborator parties, chat and updates.
"""

import pytest
from fastapi import HTTPException

import problem_storage
from api import (
    CollaborationAction,
    CreateCollaborationRequest,
    ProjectMessageRequest,
    ProjectUpdateRequest,
    SelectVolunteerRequest,
    VolunteerRequest,
    act_on_collaboration_request_endpoint,
    create_collaboration_request_endpoint,
    create_problem_endpoint,
    get_notifications,
    get_project_endpoint,
    list_project_messages_endpoint,
    list_project_updates_endpoint,
    list_projects_endpoint,
    post_project_message_endpoint,
    post_project_update_endpoint,
    preview_collaboration_request_endpoint,
    select_volunteer_endpoint,
    volunteer_for_problem_endpoint,
)
from problem_storage import ProblemBase, ProblemUpdate, get_problem, update_problem

UNIVERSITY = "ABC Institute of Technology"
INDUSTRY = "Tech Solutions Pvt Ltd"
OUTSIDER = "Other Industries"


@pytest.fixture(autouse=True)
def isolated_db(tmp_path, monkeypatch):
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", str(tmp_path / "projects.sqlite3"))
    problem_storage.initialize_storage()


@pytest.fixture
def project():
    """University leads the project; the industry joined through an accepted collaboration request."""
    problem = create_problem_endpoint(ProblemBase(problem_text="Potholes", title="Pothole alerts", citizen_name="Rahul Sharma"))
    update_problem(problem.id, ProblemUpdate(status="verified"))
    for solver_type, name in (("university", UNIVERSITY), ("industry", OUTSIDER)):
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


def test_problem_giver_can_open_workspace_and_chat_but_not_post_updates(project):
    citizen_projects = list_projects_endpoint("citizen", "Rahul Sharma")
    assert [(p["id"], p["my_role"]) for p in citizen_projects] == [(project.id, "owner")]
    assert get_project_endpoint(project.id, "citizen", "Rahul Sharma")["my_role"] == "owner"
    with pytest.raises(HTTPException) as error:
        get_project_endpoint(project.id, "citizen", "Someone Else")
    assert error.value.status_code == 403

    post_project_message_endpoint(project.id, ProjectMessageRequest(
        party_type="citizen", party_name="Rahul Sharma", author_name="Rahul Sharma", text="Thank you!"))
    assert list_project_messages_endpoint(project.id, "industry", INDUSTRY)[-1].author_type == "citizen"

    with pytest.raises(HTTPException) as error:
        post_project_update_endpoint(project.id, ProjectUpdateRequest(
            party_type="citizen", party_name="Rahul Sharma", author_name="Rahul", title="Hi"))
    assert error.value.status_code == 403


def test_problem_without_accepted_volunteer_has_no_workspace_for_citizen():
    problem = create_problem_endpoint(ProblemBase(problem_text="x", title="Unassigned", citizen_name="Rahul Sharma"))
    with pytest.raises(HTTPException) as error:
        get_project_endpoint(problem.id, "citizen", "Rahul Sharma")
    assert error.value.status_code == 403


def test_invitee_previews_problem_and_progress_then_accepting_alerts_everyone(project):
    post_project_update_endpoint(project.id, ProjectUpdateRequest(
        party_type="university", party_name=UNIVERSITY, author_name="Dr. Priya", title="Pilot live", progress=30))
    second_industry = "GreenEnergy Corp"
    request = create_collaboration_request_endpoint(CreateCollaborationRequest(
        requested_by="university", university_name=UNIVERSITY, industry_name=second_industry,
        problem_id=project.id, challenge_title="Pothole alerts", support_types=["Funding"],
        progress_summary="Pilot live on 2 roads, 30% done",
    ))

    preview = preview_collaboration_request_endpoint(request.id, "industry", second_industry)
    assert preview["request"]["progress_summary"] == "Pilot live on 2 roads, 30% done"
    assert preview["project"]["progress"] == 30
    assert [u["title"] for u in preview["recent_updates"]] == ["Pilot live"]
    with pytest.raises(HTTPException) as error:
        preview_collaboration_request_endpoint(request.id, "industry", INDUSTRY)  # not on this request
    assert error.value.status_code == 403
    # Not yet a party, so no workspace access before accepting.
    with pytest.raises(HTTPException):
        get_project_endpoint(project.id, "industry", second_industry)

    act_on_collaboration_request_endpoint(request.id, CollaborationAction(
        actor_type="industry", actor_name=second_industry, action="accept"))

    assert get_project_endpoint(project.id, "industry", second_industry)["my_role"] == "collaborator"
    assert get_notifications(second_industry, audience="industry")[0].title == "You joined the project workspace"
    assert get_notifications(INDUSTRY, audience="industry")[0].title == "New partner joined the project"
    assert get_notifications(UNIVERSITY, audience="university")[0].title == "Collaboration request accepted"
    assert get_notifications("Rahul Sharma", audience="citizen")[0].title == "New partner on your problem"


def test_project_invitation_requires_progress_summary(project):
    with pytest.raises(HTTPException) as error:
        create_collaboration_request_endpoint(CreateCollaborationRequest(
            requested_by="university", university_name=UNIVERSITY, industry_name="GreenEnergy Corp",
            problem_id=project.id, challenge_title="Pothole alerts", support_types=["Funding"],
        ))
    assert error.value.status_code == 400


def test_lead_and_collaborator_both_see_project(project):
    university_projects = list_projects_endpoint("university", UNIVERSITY)
    industry_projects = list_projects_endpoint("industry", INDUSTRY)

    assert [p["id"] for p in university_projects] == [project.id]
    assert university_projects[0]["my_role"] == "lead"
    assert industry_projects[0]["my_role"] == "collaborator"
    assert [(p["type"], p["role"]) for p in industry_projects[0]["parties"]] == [
        ("university", "lead"), ("industry", "collaborator"),
    ]
    # The rejected volunteer has no workspace.
    assert list_projects_endpoint("industry", OUTSIDER) == []


def test_outsiders_cannot_open_workspace(project):
    for call in (
        lambda: get_project_endpoint(project.id, "industry", OUTSIDER),
        lambda: list_project_messages_endpoint(project.id, "industry", OUTSIDER),
        lambda: post_project_message_endpoint(project.id, ProjectMessageRequest(
            party_type="industry", party_name=OUTSIDER, author_name="x", text="hi")),
    ):
        with pytest.raises(HTTPException) as error:
            call()
        assert error.value.status_code == 403


def test_chat_is_shared_between_parties_in_order(project):
    post_project_message_endpoint(project.id, ProjectMessageRequest(
        party_type="university", party_name=UNIVERSITY, author_name="Dr. Priya", text="Sensors needed by Friday"))
    post_project_message_endpoint(project.id, ProjectMessageRequest(
        party_type="industry", party_name=INDUSTRY, author_name="Amit", text="Shipping Thursday"))

    messages = list_project_messages_endpoint(project.id, "industry", INDUSTRY)
    assert [(m.author_org, m.text) for m in messages] == [
        (UNIVERSITY, "Sensors needed by Friday"), (INDUSTRY, "Shipping Thursday"),
    ]


def test_lead_progress_update_moves_problem_and_alerts_everyone(project):
    post_project_update_endpoint(project.id, ProjectUpdateRequest(
        party_type="university", party_name=UNIVERSITY, author_name="Dr. Priya",
        title="Prototype deployed", body="Two roads covered", progress=60))

    assert get_problem(project.id).progress == 60
    assert get_problem(project.id).status == "in_progress"
    assert get_notifications(INDUSTRY, audience="industry")[0].title == "New project update"
    assert get_notifications("Rahul Sharma", audience="citizen")[0].title == "Progress update on your problem"
    # The author does not alert itself.
    assert get_notifications(UNIVERSITY, audience="university")[0].title != "New project update"

    post_project_update_endpoint(project.id, ProjectUpdateRequest(
        party_type="university", party_name=UNIVERSITY, author_name="Dr. Priya", title="Done", progress=100))
    assert get_problem(project.id).status == "completed"
    assert [u.title for u in list_project_updates_endpoint(project.id, "industry", INDUSTRY)] == ["Done", "Prototype deployed"]
    # Completed projects stay in the workspace list.
    assert list_projects_endpoint("industry", INDUSTRY)[0]["status"] == "completed"


def test_collaborator_can_post_update_but_not_change_progress(project):
    post_project_update_endpoint(project.id, ProjectUpdateRequest(
        party_type="industry", party_name=INDUSTRY, author_name="Amit", title="Sensors shipped"))
    assert get_notifications(UNIVERSITY, audience="university")[0].title == "New project update"

    with pytest.raises(HTTPException) as error:
        post_project_update_endpoint(project.id, ProjectUpdateRequest(
            party_type="industry", party_name=INDUSTRY, author_name="Amit", title="Done", progress=100))
    assert error.value.status_code == 403


def test_existing_partner_can_be_asked_again_for_more_support(project):
    request = create_collaboration_request_endpoint(CreateCollaborationRequest(
        requested_by="university", university_name=UNIVERSITY, industry_name=INDUSTRY,
        problem_id=project.id, challenge_title="Pothole alerts", support_types=["Funding"],
        progress_summary="Sensors installed, need funds for rollout",
    ))
    # Only one open request per pair at a time.
    with pytest.raises(HTTPException) as error:
        create_collaboration_request_endpoint(CreateCollaborationRequest(
            requested_by="university", university_name=UNIVERSITY, industry_name=INDUSTRY,
            problem_id=project.id, challenge_title="Pothole alerts", support_types=["Mentorship"],
            progress_summary="Same",
        ))
    assert error.value.status_code == 409

    act_on_collaboration_request_endpoint(request.id, CollaborationAction(
        actor_type="industry", actor_name=INDUSTRY, action="accept"))

    assert get_notifications(INDUSTRY, audience="industry")[0].title == "Additional support confirmed"
    assert get_notifications(UNIVERSITY, audience="university")[0].title == "Collaboration request accepted"
    parties = get_project_endpoint(project.id, "industry", INDUSTRY)["parties"]
    assert [p["name"] for p in parties].count(INDUSTRY) == 1


def test_workspace_only_after_verification_and_giver_acceptance():
    problem = create_problem_endpoint(ProblemBase(problem_text="Flooding", title="Flooding", citizen_name="Rahul Sharma"))

    # Not verified: no volunteering, so no workspace for anyone.
    with pytest.raises(HTTPException):
        volunteer_for_problem_endpoint(problem.id, VolunteerRequest(solver_type="university", solver_name=UNIVERSITY))
    assert list_projects_endpoint("citizen", "Rahul Sharma") == []

    # Verified with a pending volunteer: still no workspace until the giver accepts.
    update_problem(problem.id, ProblemUpdate(status="verified"))
    volunteer_for_problem_endpoint(problem.id, VolunteerRequest(solver_type="university", solver_name=UNIVERSITY))
    assert list_projects_endpoint("university", UNIVERSITY) == []
    assert list_projects_endpoint("citizen", "Rahul Sharma") == []

    select_volunteer_endpoint(problem.id, SelectVolunteerRequest(
        solver_type="university", solver_name=UNIVERSITY, citizen_name="Rahul Sharma"))
    assert [p["id"] for p in list_projects_endpoint("university", UNIVERSITY)] == [problem.id]
    assert [p["id"] for p in list_projects_endpoint("citizen", "Rahul Sharma")] == [problem.id]


def test_assignment_not_made_by_giver_has_no_workspace():
    """e.g. legacy data: an accepted volunteer recorded without the giver's acceptance."""
    problem = create_problem_endpoint(ProblemBase(problem_text="Legacy", title="Legacy", citizen_name="Rahul Sharma"))
    update_problem(problem.id, ProblemUpdate(
        status="assigned", assigned_by_giver=None,
        volunteers=[{"solver_type": "university", "solver_name": UNIVERSITY, "status": "accepted"}],
    ))
    assert list_projects_endpoint("university", UNIVERSITY) == []
    with pytest.raises(HTTPException) as error:
        get_project_endpoint(problem.id, "university", UNIVERSITY)
    assert error.value.status_code == 403


def test_accepted_volunteer_with_blank_name_has_no_workspace():
    """Guards against bad/legacy data: an 'accepted' volunteer entry with an empty solver_name
    must not create a workspace, since nobody real is actually assigned."""
    problem = create_problem_endpoint(ProblemBase(problem_text="Potholes", title="Potholes", citizen_name="Rahul Sharma"))
    update_problem(problem.id, ProblemUpdate(
        status="assigned", assigned_by_giver=True,
        volunteers=[{"solver_type": "industry", "solver_name": "", "status": "accepted"}],
    ))
    assert list_projects_endpoint("citizen", "Rahul Sharma") == []
    with pytest.raises(HTTPException) as error:
        get_project_endpoint(problem.id, "citizen", "Rahul Sharma")
    assert error.value.status_code == 403
