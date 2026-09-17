"""
File attachments (images, videos, PDFs, Office docs) on project workspace updates.
Uses TestClient because multipart file upload is an HTTP-layer concern.
"""

import pytest
from fastapi.testclient import TestClient

import api
import problem_storage
from api import MAX_UPDATE_ATTACHMENTS, app
from problem_storage import ProblemUpdate, update_problem

UNIVERSITY = "ABC Institute of Technology"
CITIZEN = "Rahul Sharma"


@pytest.fixture(autouse=True)
def isolated_db(tmp_path, monkeypatch):
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", str(tmp_path / "attachments.sqlite3"))
    # Keep test uploads out of the real data/uploads folder.
    uploads = tmp_path / "uploads"
    uploads.mkdir()
    monkeypatch.setattr(api, "UPLOAD_DIR", str(uploads))
    problem_storage.initialize_storage()


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def project(client):
    """A verified problem with an accepted university volunteer -- i.e. a real workspace."""
    created = client.post("/problems", json={
        "problem_text": "Flooding", "title": "Flooding", "citizen_name": CITIZEN,
    }).json()
    update_problem(created["id"], ProblemUpdate(status="verified"))
    client.post(f"/problems/{created['id']}/volunteer", json={
        "solver_type": "university", "solver_name": UNIVERSITY,
    })
    client.post(f"/problems/{created['id']}/select-volunteer", json={
        "solver_type": "university", "solver_name": UNIVERSITY, "citizen_name": CITIZEN,
    })
    return created["id"]


def post_update(client, problem_id, files=None, **overrides):
    data = {
        "party_type": "university", "party_name": UNIVERSITY, "author_name": "Dr. Priya",
        "title": "Site visit", "body": "Photos from today", **overrides,
    }
    return client.post(f"/projects/{problem_id}/updates/with-attachments", data=data, files=files or [])


def test_update_accepts_image_video_pdf_and_office_documents(client, project):
    files = [
        ("files", ("photo.jpg", b"\xff\xd8\xff fake jpeg bytes", "image/jpeg")),
        ("files", ("clip.mp4", b"fake mp4 bytes", "video/mp4")),
        ("files", ("report.pdf", b"%PDF-1.4 fake", "application/pdf")),
        ("files", ("plan.docx", b"fake docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")),
        ("files", ("slides.pptx", b"fake pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation")),
    ]
    response = post_update(client, project, files=files)
    assert response.status_code == 201, response.text
    body = response.json()
    assert [a["name"] for a in body["attachments"]] == ["photo.jpg", "clip.mp4", "report.pdf", "plan.docx", "slides.pptx"]
    assert all(a["url"].startswith("/uploads/") for a in body["attachments"])

    # Persisted, not just returned once.
    listed = client.get(f"/projects/{project}/updates", params={"party_type": "university", "party_name": UNIVERSITY}).json()
    assert listed[0]["attachments"][0]["name"] == "photo.jpg"


def test_update_with_no_files_still_works(client, project):
    response = post_update(client, project, files=[])
    assert response.status_code == 201
    assert response.json()["attachments"] == []


def test_disallowed_file_type_is_rejected(client, project):
    files = [("files", ("virus.exe", b"MZ fake exe", "application/x-msdownload"))]
    response = post_update(client, project, files=files)
    assert response.status_code == 415


def test_oversized_file_is_rejected(client, project):
    huge = b"x" * (10 * 1024 * 1024 + 1)
    files = [("files", ("huge.png", huge, "image/png"))]
    response = post_update(client, project, files=files)
    assert response.status_code == 413


def test_too_many_files_is_rejected(client, project):
    files = [("files", (f"f{i}.png", b"x", "image/png")) for i in range(MAX_UPDATE_ATTACHMENTS + 1)]
    response = post_update(client, project, files=files)
    assert response.status_code == 400


def test_only_a_project_party_can_attach_files(client, project):
    files = [("files", ("photo.jpg", b"fake", "image/jpeg"))]
    response = post_update(client, project, files=files, party_type="industry", party_name="Some Other Company")
    assert response.status_code == 403


def test_problem_owner_cannot_post_update_with_attachments(client, project):
    files = [("files", ("photo.jpg", b"fake", "image/jpeg"))]
    response = post_update(client, project, files=files, party_type="citizen", party_name=CITIZEN)
    assert response.status_code == 403


def test_author_can_add_more_attachments_to_an_existing_update(client, project):
    created = post_update(client, project, files=[("files", ("first.png", b"fake", "image/png"))]).json()
    update_id = created["id"]

    response = client.post(
        f"/projects/{project}/updates/{update_id}/attachments",
        data={"party_type": "university", "party_name": UNIVERSITY},
        files=[
            ("files", ("second.pdf", b"%PDF-1.4 fake", "application/pdf")),
            ("files", ("third.pptx", b"fake pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation")),
        ],
    )
    assert response.status_code == 200, response.text
    body = response.json()
    assert [a["name"] for a in body["attachments"]] == ["first.png", "second.pdf", "third.pptx"]

    # Confirmed by re-reading the update from storage, not just trusting the response.
    listed = client.get(f"/projects/{project}/updates", params={"party_type": "university", "party_name": UNIVERSITY}).json()
    assert [a["name"] for a in listed[0]["attachments"]] == ["first.png", "second.pdf", "third.pptx"]


def test_only_the_updates_own_author_can_add_more_attachments(client, project):
    created = post_update(client, project).json()
    files = [("files", ("extra.png", b"fake", "image/png"))]

    for party_type, party_name in (("industry", "Some Other Company"), ("citizen", CITIZEN)):
        response = client.post(
            f"/projects/{project}/updates/{created['id']}/attachments",
            data={"party_type": party_type, "party_name": party_name},
            files=files,
        )
        assert response.status_code == 403


def test_appending_past_the_total_cap_is_rejected(client, project):
    created = post_update(
        client, project,
        files=[("files", (f"f{i}.png", b"x", "image/png")) for i in range(MAX_UPDATE_ATTACHMENTS - 1)],
    ).json()

    response = client.post(
        f"/projects/{project}/updates/{created['id']}/attachments",
        data={"party_type": "university", "party_name": UNIVERSITY},
        files=[
            ("files", ("a.png", b"x", "image/png")),
            ("files", ("b.png", b"x", "image/png")),
        ],
    )
    assert response.status_code == 400
    # Nothing was appended by the rejected request.
    listed = client.get(f"/projects/{project}/updates", params={"party_type": "university", "party_name": UNIVERSITY}).json()
    assert len(listed[0]["attachments"]) == MAX_UPDATE_ATTACHMENTS - 1


def test_appending_to_missing_update_is_404(client, project):
    response = client.post(
        f"/projects/{project}/updates/not-a-real-id/attachments",
        data={"party_type": "university", "party_name": UNIVERSITY},
        files=[("files", ("a.png", b"x", "image/png"))],
    )
    assert response.status_code == 404


def test_rejected_upload_names_the_offending_file(client, project):
    files = [
        ("files", ("good.png", b"fake", "image/png")),
        ("files", ("bad.exe", b"MZ", "application/x-msdownload")),
    ]
    response = post_update(client, project, files=files)
    assert response.status_code == 415
    assert "bad.exe" in response.json()["detail"]


def test_other_parties_and_citizen_see_and_are_told_about_attachments(client, project):
    """Files posted by one side must reach everyone who can open the workspace."""
    # Add an industry collaborator so there is an "other party" besides the citizen.
    industry = "TechSolutions Pvt Ltd"
    request = client.post("/collaboration-requests", json={
        "requested_by": "university", "university_name": UNIVERSITY, "industry_name": industry,
        "problem_id": project, "challenge_title": "Flooding", "support_types": ["Hardware"],
        "progress_summary": "Survey done",
    }).json()
    client.post(f"/collaboration-requests/{request['id']}/actions", json={
        "actor_type": "industry", "actor_name": industry, "action": "accept",
    })

    created = post_update(client, project, files=[
        ("files", ("site.jpg", b"fake", "image/jpeg")),
        ("files", ("report.pdf", b"%PDF-1.4", "application/pdf")),
    ]).json()

    for party_type, party_name in (("industry", industry), ("citizen", CITIZEN)):
        listed = client.get(f"/projects/{project}/updates", params={"party_type": party_type, "party_name": party_name}).json()
        assert [a["name"] for a in listed[0]["attachments"]] == ["site.jpg", "report.pdf"]
        # And the stored file itself can be downloaded from their side.
        download = client.get(
            f"/projects/{project}/updates/{listed[0]['id']}/attachments/0/download",
            params={"party_type": party_type, "party_name": party_name},
        )
        assert download.status_code == 200

    industry_alert = client.get("/notifications", params={"citizen_name": industry, "audience": "industry"}).json()[0]
    assert industry_alert["title"] == "New project update"
    assert "site.jpg" in industry_alert["message"] and "report.pdf" in industry_alert["message"]
    citizen_alert = client.get("/notifications", params={"citizen_name": CITIZEN, "audience": "citizen"}).json()[0]
    assert "2 attachments" in citizen_alert["message"]

    # Files added later are announced to the citizen too.
    client.post(
        f"/projects/{project}/updates/{created['id']}/attachments",
        data={"party_type": "university", "party_name": UNIVERSITY},
        files=[("files", ("extra.mp4", b"fake", "video/mp4"))],
    )
    assert client.get("/notifications", params={"citizen_name": CITIZEN, "audience": "citizen"}).json()[0]["title"] == "New files on your problem's progress"
    assert client.get("/notifications", params={"citizen_name": industry, "audience": "industry"}).json()[0]["title"] == "New attachment on project update"


# --- Upload failure handling ------------------------------------------------------------------

def stored_files():
    import os
    return sorted(os.listdir(api.UPLOAD_DIR))


def test_failed_batch_leaves_no_files_and_no_update(client, project):
    files = [
        ("files", ("good.png", b"fake", "image/png")),
        ("files", ("good.pdf", b"%PDF", "application/pdf")),
        ("files", ("bad.exe", b"MZ", "application/x-msdownload")),
    ]
    response = post_update(client, project, files=files)
    assert response.status_code == 415
    assert "bad.exe" in response.json()["detail"]
    # All-or-nothing: the two valid files saved before the bad one were removed again.
    assert stored_files() == []
    assert client.get(f"/projects/{project}/updates", params={"party_type": "university", "party_name": UNIVERSITY}).json() == []


def test_rejected_permission_saves_no_files(client, project):
    files = [("files", ("photo.jpg", b"fake", "image/jpeg"))]
    assert post_update(client, project, files=files, party_type="industry", party_name="Outsider Ltd").status_code == 403
    assert post_update(client, project, files=files, title="   ").status_code == 400
    assert stored_files() == []


def test_office_file_sent_without_a_type_is_accepted_by_extension(client, project):
    files = [
        ("files", ("slides.pptx", b"fake pptx", "application/octet-stream")),
        ("files", ("budget.xlsx", b"fake xlsx", "")),
    ]
    response = post_update(client, project, files=files)
    assert response.status_code == 201, response.text
    types = [a["content_type"] for a in response.json()["attachments"]]
    assert types == [
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]


def test_empty_file_is_rejected_with_a_clear_message(client, project):
    response = post_update(client, project, files=[("files", ("blank.png", b"", "image/png"))])
    assert response.status_code == 400
    assert "blank.png" in response.json()["detail"] and "empty" in response.json()["detail"]


# --- Downloads --------------------------------------------------------------------------------

def add_collaborator(client, project, industry="TechSolutions Pvt Ltd"):
    request = client.post("/collaboration-requests", json={
        "requested_by": "university", "university_name": UNIVERSITY, "industry_name": industry,
        "problem_id": project, "challenge_title": "Flooding", "support_types": ["Hardware"],
        "progress_summary": "Survey done",
    }).json()
    client.post(f"/collaboration-requests/{request['id']}/actions", json={
        "actor_type": "industry", "actor_name": industry, "action": "accept",
    })
    return industry


def test_every_party_can_download_a_file_under_its_original_name(client, project):
    industry = add_collaborator(client, project)
    created = post_update(client, project, files=[("files", ("Site photo.jpg", b"jpeg-bytes", "image/jpeg"))]).json()
    url = f"/projects/{project}/updates/{created['id']}/attachments/0/download"

    for party_type, party_name in (("university", UNIVERSITY), ("industry", industry), ("citizen", CITIZEN)):
        response = client.get(url, params={"party_type": party_type, "party_name": party_name})
        assert response.status_code == 200
        assert response.content == b"jpeg-bytes"
        disposition = response.headers["content-disposition"]
        assert disposition.startswith("attachment") and "Site photo.jpg" in disposition.replace("%20", " ")

    outsider = client.get(url, params={"party_type": "industry", "party_name": "Outsider Ltd"})
    assert outsider.status_code == 403
    missing = client.get(f"/projects/{project}/updates/{created['id']}/attachments/5/download",
                         params={"party_type": "citizen", "party_name": CITIZEN})
    assert missing.status_code == 404


def test_download_all_files_of_an_update_as_zip(client, project):
    import io, zipfile
    created = post_update(client, project, files=[
        ("files", ("photo.jpg", b"one", "image/jpeg")),
        ("files", ("photo.jpg", b"two", "image/jpeg")),
        ("files", ("report.pdf", b"%PDF", "application/pdf")),
    ]).json()
    response = client.get(f"/projects/{project}/updates/{created['id']}/attachments.zip",
                          params={"party_type": "citizen", "party_name": CITIZEN})
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/zip"
    archive = zipfile.ZipFile(io.BytesIO(response.content))
    assert sorted(archive.namelist()) == ["photo (2).jpg", "photo.jpg", "report.pdf"]
    assert archive.read("photo (2).jpg") == b"two"


def test_download_whole_workspace_as_zip_notes_missing_files(client, project):
    import io, os, zipfile
    first = post_update(client, project, title="Survey", files=[("files", ("map.png", b"map", "image/png"))]).json()
    post_update(client, project, title="Report", files=[("files", ("final.pdf", b"%PDF", "application/pdf"))])
    # Simulate a file that disappeared from the server.
    os.remove(os.path.join(api.UPLOAD_DIR, os.path.basename(first["attachments"][0]["url"])))

    response = client.get(f"/projects/{project}/attachments.zip", params={"party_type": "university", "party_name": UNIVERSITY})
    assert response.status_code == 200
    names = zipfile.ZipFile(io.BytesIO(response.content)).namelist()
    assert any(n.endswith("- Report/final.pdf") for n in names)
    assert "MISSING FILES.txt" in names
    assert not any(n.endswith("map.png") for n in names)

    assert client.get(f"/projects/{project}/attachments.zip",
                      params={"party_type": "industry", "party_name": "Outsider Ltd"}).status_code == 403
