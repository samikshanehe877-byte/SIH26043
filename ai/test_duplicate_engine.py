"""
Tests for the persistent duplicate-detection pipeline (duplicate_engine.py) and its wiring
into api.py: the block/warning/normal tiers, the composite score breakdown, the persisted
embedding cache, the similarity audit trail, and the government duplicate-decision workflow.

RUN IN ISOLATION: this environment's `sentence-transformers` install is broken (a pre-existing,
unrelated issue -- see api.py's _get_duplicate_engine(), which is why real problem creation
still works fine without this file: it fails open). To exercise the real scoring logic anyway,
this file installs a fake `sentence_transformers` module into sys.modules (a deterministic
hashing-trick "embedding" -- shared vocabulary between two texts pushes their cosine similarity
up, same idea as a real embedding, just not learned) before importing duplicate_engine/embeddings,
and resets api.py's cached "engine unavailable" flag so it picks up the fake. Because that's a
process-wide sys.modules swap, run this file on its own so it can't affect other test files that
happen to share the same pytest process:

    pytest test_duplicate_engine.py
"""

import hashlib
import re
import sys
import types

import numpy as np
import pytest

EMBED_DIM = 384


def _fake_vector(text: str) -> np.ndarray:
    """Deterministic bag-of-words hashing embedding: texts sharing vocabulary get pushed
    together, texts sharing none stay near-orthogonal -- enough to meaningfully exercise
    semantic-similarity-dependent logic without a real trained model."""
    words = re.findall(r"[a-z0-9]+", text.lower())
    vector = np.zeros(EMBED_DIM, dtype=np.float32)
    for word in words:
        vector[int(hashlib.md5(word.encode()).hexdigest(), 16) % EMBED_DIM] += 1.0
    norm = np.linalg.norm(vector)
    if norm == 0:
        vector[0] = 1.0
        return vector
    return (vector / norm).astype(np.float32)


class _FakeSentenceTransformer:
    def __init__(self, *_args, **_kwargs):
        pass

    def encode(self, text, normalize_embeddings=True, show_progress_bar=False):
        return _fake_vector(text)


@pytest.fixture(autouse=True, scope="module")
def stub_sentence_transformers():
    fake_module = types.ModuleType("sentence_transformers")
    fake_module.SentenceTransformer = _FakeSentenceTransformer
    sys.modules["sentence_transformers"] = fake_module
    for name in ("embeddings", "duplicate_engine"):
        sys.modules.pop(name, None)
    yield
    sys.modules.pop("sentence_transformers", None)
    for name in ("embeddings", "duplicate_engine"):
        sys.modules.pop(name, None)


import api  # noqa: E402  (import after the stub fixture is defined, before it runs -- reset below)
import problem_storage  # noqa: E402
from api import (  # noqa: E402
    ApproveMergeRequestBody,
    CreateMergeRequestBody,
    DuplicateCheckRequest,
    DuplicateReviewDecision,
    MergeRequestResponseBody,
    approve_merge_request_endpoint,
    check_duplicates_endpoint,
    create_merge_request_endpoint,
    create_problem_endpoint,
    duplicate_decision_endpoint,
    get_problem_similarities_endpoint,
    respond_to_merge_request_endpoint,
)
from problem_storage import ProblemBase, ProblemUpdate, get_problem, update_problem  # noqa: E402


@pytest.fixture(autouse=True)
def isolated_db_and_engine(tmp_path, monkeypatch):
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", str(tmp_path / "duplicates.sqlite3"))
    problem_storage.initialize_storage()
    # Force api.py's cached "engine unavailable" flag to be re-evaluated now that the fake
    # sentence_transformers is in place (a previous test process/module may have cached False).
    monkeypatch.setattr(api, "_duplicate_engine_module", None)
    import duplicate_engine
    monkeypatch.setattr(duplicate_engine, "SUBMISSION_LOCK", duplicate_engine.SUBMISSION_LOCK)  # sanity: importable
    yield


def make(text, title="Problem", **overrides):
    overrides.setdefault("citizen_name", "Rahul Sharma")
    return ProblemBase(problem_text=text, title=title, **overrides)


# --- Pure scoring functions -------------------------------------------------------------------

def test_jaccard_and_haversine():
    from duplicate_engine import _haversine_km, _jaccard

    assert _jaccard(set(), set()) == 0.0
    assert _jaccard({"a", "b"}, {"a", "b"}) == 1.0
    assert _jaccard({"a", "b"}, {"b", "c"}) == pytest.approx(1 / 3)
    # Same point -> ~0km; two points ~1 degree apart in latitude -> roughly 111km.
    assert _haversine_km(18.52, 73.85, 18.52, 73.85) == pytest.approx(0.0, abs=0.01)
    assert _haversine_km(18.52, 73.85, 19.52, 73.85) == pytest.approx(111.0, rel=0.05)


def test_location_score_prefers_finer_grained_match():
    """When both sides state a village, that's the comparison that matters -- two problems in
    different, specifically-named villages are not "the same place" just because they share a
    block, so the function must not fall through past an available finer-grained comparison."""
    from duplicate_engine import _location_score

    same_village = {"village": "Katraj", "block": "Haveli", "district": "Pune"}
    same_block_village_unspecified = {"block": "Haveli", "district": "Pune"}
    same_district_only = {"district": "Pune"}
    different_district = {"district": "Nagpur"}
    explicitly_different_village = {"village": "Kondhwa", "block": "Haveli", "district": "Pune"}

    village_score, _, village_avail = _location_score(same_village, same_village)
    block_score, _, block_avail = _location_score(same_village, same_block_village_unspecified)
    district_score, _, district_avail = _location_score(same_village, same_district_only)
    none_score, _, none_avail = _location_score(same_village, different_district)
    mismatched_village_score, _, mismatched_avail = _location_score(same_village, explicitly_different_village)

    assert village_score == 1.0 and village_avail
    assert block_score == 0.7 and block_avail
    assert district_score == 0.4 and district_avail
    assert none_score == 0.0 and none_avail
    assert village_score > block_score > district_score > none_score
    # Both sides did state a village, and they differ -- a real mismatch, not a coarser fallback.
    assert mismatched_village_score == 0.0 and mismatched_avail


def test_location_score_unavailable_when_neither_side_has_comparable_data():
    from duplicate_engine import _location_score

    score, reasons, available = _location_score({}, {"village": "Katraj"})
    assert available is False
    assert score == 0.0


def test_location_score_matches_free_text_place_despite_formatting():
    """The citizen form only ever collects one free-text location, so the same place written
    two ways ("Shivaji Nagar" / "Shivajinagar") has to count as a match."""
    from duplicate_engine import _location_score

    score, reasons, available = _location_score({"location": "Shivaji Nagar"}, {"location": "Shivajinagar"})
    assert available and score == 1.0
    assert any("Same area" in reason for reason in reasons)


def test_location_score_matches_place_named_in_the_other_reports_text():
    """People fill these forms inconsistently: one states the place in the location field, the
    other only inside the description. Same place either way."""
    from duplicate_engine import _location_score

    in_field = {"location": "Shivajinagar"}
    in_text = {"title": "No drinking water supply in Shivaji Nagar", "problem_text": "The tanker stopped coming."}

    score, reasons, available = _location_score(in_field, in_text)
    assert available and score == 1.0
    assert any("Same area" in reason for reason in reasons)
    # Symmetric -- it must not depend on which side happens to be the new submission.
    assert _location_score(in_text, in_field)[0] == 1.0


def test_location_score_ignores_structurer_placeholder_locations():
    """problem_structurer falls back to "Local community / area mentioned in report" when it
    can't find a place. Scoring that as a real location turns a genuine match into a confirmed
    mismatch, which is worse than having no location at all."""
    from duplicate_engine import _location_score

    placeholder = {"location": "Local community / area mentioned in report", "title": "Water supply failure"}
    real = {"location": "Shivajinagar"}

    score, _, available = _location_score(placeholder, real)
    assert available is False and score == 0.0  # "we don't know", not "different place"

    both_placeholders = _location_score(placeholder, {"location": "Locality as reported"})
    assert both_placeholders[2] is False


def test_location_score_still_penalizes_genuinely_different_places():
    from duplicate_engine import _location_score

    score, _, available = _location_score(
        {"location": "Shivajinagar", "title": "Pothole at the temple junction"},
        {"location": "Kothrud Depot", "title": "Pothole at the temple junction"},
    )
    assert available and score == 0.0


def test_location_score_uses_geo_distance_when_available():
    from duplicate_engine import _location_score

    close = {"latitude": 18.52, "longitude": 73.85}
    nearby = {"latitude": 18.522, "longitude": 73.852}  # a few hundred metres away
    far = {"latitude": 19.20, "longitude": 72.98}  # a different city

    near_score, _, near_avail = _location_score(close, nearby)
    far_score, _, far_avail = _location_score(close, far)
    assert near_score > 0.9 and near_avail
    assert far_score == 0.0 and far_avail


def test_domain_and_affected_area_and_characteristics_scores():
    from duplicate_engine import _affected_area_score, _characteristics_score, _domain_score

    domain_score, _, domain_avail = _domain_score({"category": "Water and Sanitation"}, {"category": "Water and Sanitation"})
    assert domain_score == 1.0 and domain_avail
    domain_score, _, domain_avail = _domain_score({"category": "Water and Sanitation"}, {"category": "Education"})
    assert domain_score == 0.0 and domain_avail
    _, _, domain_avail = _domain_score({"category": "Water and Sanitation"}, {})
    assert domain_avail is False

    a = {"affected_population": "residents of Ward 23 near the railway station"}
    b = {"affected_population": "households in Ward 23, particularly near the station"}
    area_score, _, area_avail = _affected_area_score(a, b)
    assert area_score > 0.3 and area_avail
    _, _, area_avail = _affected_area_score(a, {})
    assert area_avail is False

    caps_a = {"required_capabilities": ["GIS Mapping", "Civil Engineering"], "problem_nature": "Technical"}
    caps_b = {"required_capabilities": ["GIS Mapping", "Data Analysis"], "problem_nature": "Technical"}
    char_score, reasons, char_avail = _characteristics_score(caps_a, caps_b)
    assert char_score > 0.0 and char_avail
    assert any("gis mapping" in r.lower() for r in reasons)
    _, _, char_avail = _characteristics_score(caps_a, {})
    assert char_avail is False


def test_classify_tier_thresholds():
    from duplicate_engine import BLOCK_THRESHOLD, WARNING_THRESHOLD, classify_tier

    assert classify_tier(BLOCK_THRESHOLD) == "block"
    assert classify_tier(BLOCK_THRESHOLD - 0.001) == "warning"
    assert classify_tier(WARNING_THRESHOLD) == "warning"
    assert classify_tier(WARNING_THRESHOLD - 0.001) == "normal"


# --- duplicate_check() end-to-end ------------------------------------------------------------

def test_near_identical_problem_scores_block_tier():
    """Word-for-word (minus a trailing word) resubmission -- the common real case of someone
    re-reporting the same thing -- must clear the block threshold even though only category and
    village were filled in (affected_population/required_capabilities left blank, as they
    commonly are), proving the composite formula doesn't silently punish a sparsely-filled form."""
    from duplicate_engine import duplicate_check

    create_problem_endpoint(make(
        "Open manholes on the main road near the market are a danger to pedestrians walking at night in Kothrud.",
        title="Dangerous open manholes", category="Public Safety", village="Kothrud",
    ))

    result = duplicate_check({
        "title": "Open manholes danger",
        "problem_text": "Open manholes on the main road near the market are a danger to pedestrians walking at night in Kothrud area.",
        "category": "Public Safety", "village": "Kothrud",
    })
    assert result["tier"] == "block"
    assert result["best_match"]["overall"] >= 0.90
    assert "Same village/area: Kothrud" in result["best_match"]["reasons"]
    assert set(result["best_match"]["unavailable"]) == {"affected_area", "characteristics"}


def test_unrelated_problem_scores_normal_tier():
    from duplicate_engine import duplicate_check

    create_problem_endpoint(make(
        "Severe waterlogging occurs every monsoon near Katraj due to inadequate stormwater drainage.",
        title="Recurring Waterlogging in Katraj", category="Water and Sanitation", village="Katraj",
    ))

    result = duplicate_check({
        "title": "No streetlights on MG Road",
        "problem_text": "Several streetlights on MG Road have been non-functional for months, making the area unsafe at night.",
        "category": "Public Safety", "village": "Shivajinagar",
    })
    assert result["tier"] == "normal"


def test_different_wording_same_real_issue_still_flagged_via_composite_score():
    """Two problems sharing only a little vocabulary, but the same domain/location/capabilities,
    should still surface as at least a warning -- the whole point of not scoring on text alone."""
    from duplicate_engine import duplicate_check

    create_problem_endpoint(make(
        "Residential waste collection points in Ward 23 are overflowing and garbage has piled up for weeks.",
        title="Overflowing waste bins", category="Environment", village="Ward 23",
        required_capabilities=["Waste Management"],
    ))

    result = duplicate_check({
        "title": "Citizens unable to dispose of garbage",
        "problem_text": "Citizens in Ward 23 cannot get their garbage collected properly and waste keeps piling up.",
        "category": "Environment", "village": "Ward 23",
        "required_capabilities": ["Waste Management"],
    })
    assert result["tier"] in ("warning", "block")
    assert "affected_area" in result["best_match"]["unavailable"]


def test_excluded_statuses_are_never_compared_against():
    from duplicate_engine import duplicate_check

    rejected = create_problem_endpoint(make("Same text over and over", title="X"))
    update_problem(rejected.id, ProblemUpdate(status="rejected"))

    result = duplicate_check({"problem_text": "Same text over and over", "title": "X"})
    assert result["best_match"] is None
    assert result["tier"] == "normal"


def test_embedding_is_cached_after_first_check():
    from duplicate_engine import duplicate_check
    from problem_storage import get_problem_embedding

    created = create_problem_endpoint(make("A problem about roads", title="Roads"))
    assert get_problem_embedding(created.id) is None  # not computed until it's compared against

    duplicate_check({"problem_text": "Something else entirely about schools", "title": "Schools"})
    cached = get_problem_embedding(created.id)
    assert cached is not None and len(cached) == EMBED_DIM


# --- API wiring --------------------------------------------------------------------------------

def test_check_duplicates_endpoint_does_not_persist_anything():
    from problem_storage import list_problems

    create_problem_endpoint(make("Broken water pump in the village square", title="Broken pump"))
    before = len(list_problems(limit=500))

    result = check_duplicates_endpoint(DuplicateCheckRequest(
        problem_text="Broken water pump in the village square", title="Broken pump",
    ))
    assert result["tier"] == "block"
    assert len(list_problems(limit=500)) == before  # no phantom row created for the draft


def test_create_problem_blocks_and_persists_audit_trail():
    original = create_problem_endpoint(make(
        "Open manholes on the main road are a danger to pedestrians at night.",
        title="Dangerous open manholes", category="Public Safety", village="Kothrud",
    ))

    duplicate_attempt = create_problem_endpoint(make(
        "Uncovered manholes on the main road are dangerous for pedestrians, especially at night.",
        title="Open manholes danger", category="Public Safety", village="Kothrud",
    ))

    assert duplicate_attempt.status == "duplicate_rejected"
    assert duplicate_attempt.duplicate_decision == "duplicate"
    assert duplicate_attempt.duplicate_of_id == original.id
    assert duplicate_attempt.duplicate_score >= 0.90
    assert duplicate_attempt.duplicate_breakdown is not None

    trail = get_problem_similarities_endpoint(duplicate_attempt.id)
    assert any(row["other_problem_id"] == original.id and row["tier"] == "block" for row in trail)


def test_create_problem_flags_warning_tier_but_still_submits_for_review():
    create_problem_endpoint(make(
        "Residential waste collection points in Ward 23 are overflowing and garbage has piled up for weeks.",
        title="Overflowing waste bins", category="Environment", village="Ward 23",
        required_capabilities=["Waste Management"],
    ))

    warned = create_problem_endpoint(make(
        "Citizens in Ward 23 cannot get their garbage collected properly and waste keeps piling up.",
        title="Garbage disposal issue", category="Environment", village="Ward 23",
        required_capabilities=["Waste Management"],
    ))

    assert warned.status == "submitted"  # NOT blocked -- proceeds through the normal pipeline
    assert warned.duplicate_decision == "potential_duplicate"
    assert warned.duplicate_of_id is not None
    assert 0.60 <= warned.duplicate_score < 0.90


def test_race_like_sequential_submissions_second_one_catches_the_first():
    """Simulates two near-simultaneous submissions of the same problem: since the authoritative
    check runs at create time (not just in an earlier advisory pre-check), the second call sees
    the first one's freshly-committed row and is correctly flagged, even though a pre-check made
    before either existed would have found nothing for both."""
    first = create_problem_endpoint(make(
        "Streetlights have been out on Church Road for over a week now, making it unsafe at night.",
        title="Streetlight outage", village="Camp",
    ))
    second = create_problem_endpoint(make(
        "Streetlights have been out on Church Road for over a week now, making it unsafe at night, please fix.",
        title="Streetlights out", village="Camp",
    ))

    assert second.duplicate_decision == "duplicate"
    assert second.duplicate_of_id == first.id


def test_duplicate_decision_distinct_clears_flag_without_touching_status():
    create_problem_endpoint(make("Overflowing bins in Ward 23", title="Bins A", village="Ward 23", category="Environment"))
    flagged = create_problem_endpoint(make(
        "Garbage piling up near Ward 23 community centre", title="Bins B", village="Ward 23", category="Environment",
    ))
    assert flagged.duplicate_decision == "potential_duplicate"

    updated = duplicate_decision_endpoint(flagged.id, DuplicateReviewDecision(decision="distinct"))
    assert updated.duplicate_decision == "distinct"
    assert updated.status == "submitted"  # untouched; normal verification continues


def test_duplicate_decision_requires_a_note_for_duplicate():
    from fastapi import HTTPException

    flagged = create_problem_endpoint(make("Some problem needing a note", title="X"))
    update_problem(flagged.id, ProblemUpdate(duplicate_decision="potential_duplicate", duplicate_of_id="other"))

    with pytest.raises(HTTPException) as error:
        duplicate_decision_endpoint(flagged.id, DuplicateReviewDecision(decision="duplicate"))
    assert error.value.status_code == 400


def test_merge_request_full_negotiation_makes_candidate_a_co_owner():
    """Government proposes a merge; the candidate accepts; the primary owner approves --
    only then does the candidate's problem retire and its owner become a co-owner."""
    target = create_problem_endpoint(make("Original flooding report", title="Original", citizen_name="Asha"))
    update_problem(target.id, ProblemUpdate(supporters=5, evidence_attachments=[{"name": "photo1.jpg"}]))

    duplicate = create_problem_endpoint(make(
        "Another flooding report, different words entirely", title="Duplicate", citizen_name="Ravi",
    ))
    update_problem(duplicate.id, ProblemUpdate(
        supporters=3, evidence_attachments=[{"name": "photo2.jpg"}],
        duplicate_decision="potential_duplicate", duplicate_of_id=target.id,
    ))

    request = create_merge_request_endpoint(CreateMergeRequestBody(
        primary_problem_id=target.id, candidate_problem_ids=[duplicate.id], note="Same underlying issue",
    ))
    assert request.status == "open"
    assert request.members[0].response == "pending"

    # Before accepting, the candidate's problem is untouched.
    assert get_problem(duplicate.id).status != "merged"

    request = respond_to_merge_request_endpoint(request.id, MergeRequestResponseBody(
        problem_id=duplicate.id, citizen_name="Ravi", response="accepted",
    ))
    assert request.members[0].response == "accepted"
    # Accepting alone does not make Ravi a co-owner yet -- Asha must still approve.
    assert get_problem(duplicate.id).status != "merged"
    assert "Ravi" not in get_problem(target.id).co_owners

    request = approve_merge_request_endpoint(request.id, ApproveMergeRequestBody(
        problem_id=duplicate.id, citizen_name="Asha",
    ))
    assert request.status == "closed"

    merged_target = get_problem(target.id)
    assert merged_target.supporters == 8
    assert {a["name"] for a in merged_target.evidence_attachments} == {"photo1.jpg", "photo2.jpg"}
    assert merged_target.co_owners == ["Ravi"]

    retired = get_problem(duplicate.id)
    assert retired.status == "merged"
    assert retired.merged_into_id == target.id


def test_co_owner_gets_the_same_rights_as_the_original_owner():
    """A co-owner's report was folded into this one, so they can act on it and see its
    workspace exactly like the citizen who filed it first."""
    from problem_storage import is_owner, list_notifications, list_problems
    from project_storage import get_viewer_role

    target = create_problem_endpoint(make("Original blocked drain report", title="Original", citizen_name="Asha"))
    other = create_problem_endpoint(make("A separate blocked drain report", title="Other", citizen_name="Ravi"))

    request = create_merge_request_endpoint(CreateMergeRequestBody(
        primary_problem_id=target.id, candidate_problem_ids=[other.id],
    ))
    respond_to_merge_request_endpoint(request.id, MergeRequestResponseBody(
        problem_id=other.id, citizen_name="Ravi", response="accepted",
    ))
    approve_merge_request_endpoint(request.id, ApproveMergeRequestBody(
        problem_id=other.id, citizen_name="Asha",
    ))

    merged = get_problem(target.id)
    assert is_owner(merged, "Ravi") and is_owner(merged, "Asha")
    assert not is_owner(merged, "Someone Else")

    # The problem now lists both owners, and shows up in the co-owner's own problem list.
    assert merged.co_owners == ["Ravi"]
    assert any(p.id == merged.id for p in list_problems(citizen_name="Ravi"))

    # Workspace access: both owners get the 'owner' role, nobody else does.
    parties = [{"type": "university", "name": "ABC Institute", "role": "lead"}]
    assert get_viewer_role(merged, parties, "citizen", "Ravi") == "owner"
    assert get_viewer_role(merged, parties, "citizen", "Asha") == "owner"
    assert get_viewer_role(merged, parties, "citizen", "Someone Else") is None

    # Anything the original owner is told about the problem, the co-owner hears too.
    before = len(list_notifications("Ravi"))
    api._notify_owners(merged, type="info", title="Progress update", message="Work started.")
    after = [n for n in list_notifications("Ravi")]
    assert len(after) == before + 1
    assert any(n.title == "Progress update" for n in list_notifications("Asha"))


def test_merge_request_declined_leaves_both_problems_independent():
    target = create_problem_endpoint(make("Original pothole report", title="Original", citizen_name="Asha"))
    other = create_problem_endpoint(make("A different pothole report entirely", title="Other", citizen_name="Ravi"))

    request = create_merge_request_endpoint(CreateMergeRequestBody(
        primary_problem_id=target.id, candidate_problem_ids=[other.id],
    ))
    request = respond_to_merge_request_endpoint(request.id, MergeRequestResponseBody(
        problem_id=other.id, citizen_name="Ravi", response="declined",
    ))
    assert request.status == "closed"
    assert get_problem(other.id).status != "merged"
    assert get_problem(other.id).citizen_name == "Ravi"
    assert "Ravi" not in get_problem(target.id).co_owners


def test_merge_request_only_owner_can_respond_and_only_primary_can_approve():
    from fastapi import HTTPException

    target = create_problem_endpoint(make("Original noise complaint", title="Original", citizen_name="Asha"))
    other = create_problem_endpoint(make("A different noise complaint", title="Other", citizen_name="Ravi"))
    request = create_merge_request_endpoint(CreateMergeRequestBody(
        primary_problem_id=target.id, candidate_problem_ids=[other.id],
    ))

    with pytest.raises(HTTPException) as error:
        respond_to_merge_request_endpoint(request.id, MergeRequestResponseBody(
            problem_id=other.id, citizen_name="Someone Else", response="accepted",
        ))
    assert error.value.status_code == 403

    respond_to_merge_request_endpoint(request.id, MergeRequestResponseBody(
        problem_id=other.id, citizen_name="Ravi", response="accepted",
    ))
    with pytest.raises(HTTPException) as error:
        approve_merge_request_endpoint(request.id, ApproveMergeRequestBody(
            problem_id=other.id, citizen_name="Ravi",
        ))
    assert error.value.status_code == 403


def test_merge_request_caps_at_max_co_owners():
    from api import MAX_CO_OWNERS

    target = create_problem_endpoint(make("Original drainage report", title="Original", citizen_name="Asha"))
    candidate_ids = []
    for i in range(MAX_CO_OWNERS + 1):
        candidate = create_problem_endpoint(make(f"Drainage report variant {i}", title=f"Variant {i}", citizen_name=f"Citizen{i}"))
        candidate_ids.append(candidate.id)

    from fastapi import HTTPException
    with pytest.raises(HTTPException) as error:
        create_merge_request_endpoint(CreateMergeRequestBody(
            primary_problem_id=target.id, candidate_problem_ids=candidate_ids,
        ))
    assert error.value.status_code == 400
