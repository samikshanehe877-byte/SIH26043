"""
people_matcher: turning a problem into needs, scoring people, and assembling a team per organization.
The pure functions are tested with hand-built people; only load_people() touches Postgres, and it is
stubbed for the endpoint tests.
"""

import pytest
from fastapi import HTTPException

import people_matcher as pm
import problem_storage
from api import organization_problem_matches_endpoint, problem_team_matches_endpoint
from problem_storage import ProblemBase, ProblemUpdate, create_problem, update_problem

@pytest.fixture(autouse=True)
def matching_ai_off(monkeypatch):
    """These tests cover the rule-based core; the model layer has its own tests and must never be reached from here."""
    monkeypatch.setenv("MATCHING_AI", "off")


TAXONOMY = pm.load_taxonomy()
_counter = iter(range(10_000))


def person(name, org, *, org_type="university", kind="faculty", skills=(), domains=(), load=None, capacity=None, spec=None):
    n = next(_counter)
    return {
        "kind": kind, "org_type": org_type, "member_id": f"m{n}", "user_id": f"u{n}", "org_id": org, "org_name": org,
        "unit_id": None, "unit_name": None, "name": name, "title": "Professor", "years": 10, "specialization": spec,
        "max_capacity": capacity, "current_load": load, "skills": list(skills), "domains": list(domains),
    }


FLOOD_PROBLEM = {
    "title": "Recurring urban flooding",
    "problem_text": "Streets flood every monsoon because drains are blocked",
    "classification": {"domain": "Water Resources", "subdomain": "Flood Management"},
    "required_capabilities": ["Hydrological Mapping", "GIS & Data Analytics"],
}
SKILLS = ["Hydrology", "GIS Mapping", "Data Analysis", "Water Treatment"]


def test_classification_becomes_the_heaviest_need():
    needs = pm.extract_requirements(FLOOD_PROBLEM, TAXONOMY, SKILLS)
    assert needs[0]["label"] == "Flood Management" and needs[0]["weight"] == 2.0 and needs[0]["source"] == "classification"


def test_capabilities_are_mapped_onto_known_skills():
    labels = {n["label"] for n in pm.extract_requirements(FLOOD_PROBLEM, TAXONOMY, SKILLS)}
    assert {"Hydrology", "GIS Mapping"} <= labels


def test_a_shared_generic_word_does_not_pull_in_an_unrelated_skill():
    problem = {"title": "Groundwater", "problem_text": "Wells dry up", "required_capabilities": ["Water Conservation Planning", "Waste Management"]}
    catalogue = ["Urban Planning", "Transport Planning", "Stormwater Management", "Waste Management", "Project Management", "Water Treatment"]
    labels = {n["label"] for n in pm.extract_requirements(problem, TAXONOMY, catalogue) if n["kind"] == "skill"}
    assert "Waste Management" in labels
    assert not labels & {"Urban Planning", "Transport Planning", "Stormwater Management", "Project Management"}


def test_an_unclassified_problem_gets_its_problem_area_from_the_text():
    problem = {"title": "No drinking water supply in Shivaji Nagar", "problem_text": "Residents have no drinking water for days"}
    needs = pm.extract_requirements(problem, TAXONOMY, SKILLS)
    assert "Drinking Water Access" in {n["label"] for n in needs}
    assert all(n["source"] == "text" for n in needs if n["kind"] == "domain")


def test_a_passing_common_word_does_not_outrank_the_real_subject():
    # "health hazard" is incidental; the problem is about drainage.
    problem = {"title": "Overflowing Drainage", "problem_text": "Drainage overflows regularly, causing a health hazard."}
    labels = [n["label"] for n in pm.extract_requirements(problem, TAXONOMY, SKILLS)]
    assert labels == ["Drainage and Waterlogging"]


def test_plurals_match_their_singular_forms():
    problem = {"title": "Potholes on Main Road", "problem_text": "Deep potholes on the main road cause accidents"}
    labels = [n["label"] for n in pm.extract_requirements(problem, TAXONOMY, SKILLS)]
    assert "Roads and Streets" in labels


def test_a_problem_with_nothing_recognisable_has_no_needs_and_no_matches():
    problem = {"title": "Zzz", "problem_text": "qqq www"}
    assert pm.extract_requirements(problem, TAXONOMY, SKILLS) == []
    assert pm.match_problem(problem, [person("A", "U1", skills=[("Hydrology", 5)])], TAXONOMY)["universities"] == []


def test_an_organization_is_ranked_by_what_its_people_cover_together():
    # U1 has one strong hydrologist. U2 has three people who together cover every need.
    people = [
        person("Solo Hydrologist", "U1", skills=[("Hydrology", 5)], domains=[("Water Resources", "Flood Management", 5)]),
        person("Flood Expert", "U2", domains=[("Water Resources", "Flood Management", 5)]),
        person("GIS Analyst", "U2", kind="student", skills=[("GIS Mapping", 4)]),
        person("Hydrologist", "U2", skills=[("Hydrology", 4)]),
        person("Data Person", "U2", kind="student", skills=[("Data Analysis", 4)]),
    ]
    ranked = pm.rank_organizations(people, pm.extract_requirements(FLOOD_PROBLEM, TAXONOMY, SKILLS), "university")
    assert [o["org_id"] for o in ranked] == ["U2", "U1"]
    assert ranked[0]["coverage"] == 1.0 and ranked[0]["missing"] == []
    assert ranked[1]["missing"], "U1 should report what it cannot cover"


def test_each_team_member_lists_only_what_they_add():
    people = [
        person("Flood Expert", "U", skills=[("Hydrology", 5)], domains=[("Water Resources", "Flood Management", 5)]),
        person("Also Hydrology", "U", skills=[("Hydrology", 5)]),
        person("GIS Analyst", "U", kind="student", skills=[("GIS Mapping", 4)]),
    ]
    team, covered, missing = pm.build_team(people, pm.extract_requirements(FLOOD_PROBLEM, TAXONOMY, SKILLS))
    assert [m["name"] for m in team] == ["Flood Expert", "GIS Analyst"], "a second hydrologist adds nothing"
    assert set(team[0]["brings"]) == {"Flood Management", "Hydrology"}
    assert missing == ["Data Analysis"] and "GIS Mapping" in covered


def test_a_team_mixes_guides_and_contributors():
    # The student covers every need on their own, so greedy cover alone would field a team of one.
    people = [
        person("Capable Student", "U", kind="student", skills=[("Hydrology", 5), ("GIS Mapping", 5), ("Data Analysis", 5)],
               domains=[("Water Resources", "Flood Management", 5)]),
        person("Relevant Mentor", "U", kind="mentor", domains=[("Water Resources", "Flood Management", 4)], load=1, capacity=4),
    ]
    team, _, _ = pm.build_team(people, pm.extract_requirements(FLOOD_PROBLEM, TAXONOMY, SKILLS))
    assert [m["name"] for m in team] == ["Relevant Mentor", "Capable Student"], "guides are listed first"
    assert [m["role_group"] for m in team] == ["guide", "contributor"]
    assert team[0]["brings"] == [] and "Flood Management" in team[0]["supports"]


def test_the_role_mix_never_pads_a_team_with_irrelevant_people():
    people = [
        person("Capable Student", "U", kind="student", skills=[("Hydrology", 5), ("GIS Mapping", 5), ("Data Analysis", 5)],
               domains=[("Water Resources", "Flood Management", 5)]),
        person("Unrelated Mentor", "U", kind="mentor", domains=[("Energy", "Renewable Energy", 5)]),
    ]
    team, _, _ = pm.build_team(people, pm.extract_requirements(FLOOD_PROBLEM, TAXONOMY, SKILLS))
    assert [m["name"] for m in team] == ["Capable Student"]


def test_problems_are_ranked_by_fit_with_one_organizations_people():
    flood = {**FLOOD_PROBLEM, "id": "flood"}
    energy = {"id": "energy", "title": "Solar", "problem_text": "Village needs renewable energy",
              "classification": {"domain": "Energy", "subdomain": "Renewable Energy"}}
    unrelated = {"id": "noise", "title": "Zzz", "problem_text": "qqq www"}
    members = [person("Flood Expert", "U", domains=[("Water Resources", "Flood Management", 5)], skills=[("Hydrology", 5)])]
    ranked = pm.rank_problems_for_organization([energy, unrelated, flood], members, "university", TAXONOMY)
    assert [r["problem"]["id"] for r in ranked] == ["flood"], "problems nobody there can help with are left out"
    assert ranked[0]["match"]["team"][0]["name"] == "Flood Expert"


def test_a_skill_nobody_in_the_organization_has_shows_up_as_a_gap():
    # Read against the organization's own skills only, "Hydrology" would never become a need, and this
    # organization would look like a perfect fit by omission.
    members = [person("GIS Analyst", "U", kind="student", skills=[("GIS Mapping", 4)], domains=[("Water Resources", "Flood Management", 5)])]
    catalogue = {"Hydrology", "GIS Mapping", "Data Analysis"}

    blind = pm.rank_problems_for_organization([{**FLOOD_PROBLEM, "id": "p"}], members, "university", TAXONOMY)
    aware = pm.rank_problems_for_organization([{**FLOOD_PROBLEM, "id": "p"}], members, "university", TAXONOMY, skill_names=catalogue)

    assert aware[0]["match"]["coverage"] < blind[0]["match"]["coverage"]
    assert "Hydrology" in aware[0]["match"]["missing"]


def test_weakly_skilled_people_do_not_count_as_covering_a_need():
    people = [person("Novice", "U", skills=[("Hydrology", 2)])]
    needs = pm.extract_requirements(FLOOD_PROBLEM, TAXONOMY, SKILLS)
    _, covered, _ = pm.build_team(people, needs)
    assert covered == []
    assert pm.rank_people(people, needs)[0]["covers"] == []


def test_a_fully_booked_mentor_scores_lower_than_an_available_one():
    free = person("Free", "U", kind="mentor", skills=[("Hydrology", 5)], load=0, capacity=4)
    busy = person("Busy", "U", kind="mentor", skills=[("Hydrology", 5)], load=4, capacity=4)
    ranked = pm.rank_people([busy, free], pm.extract_requirements(FLOOD_PROBLEM, TAXONOMY, SKILLS))
    assert [r["name"] for r in ranked] == ["Free", "Busy"]
    assert "At full project capacity" in ranked[1]["reasons"]
    assert "Good current availability" in ranked[0]["reasons"]


def test_people_with_no_relevant_experience_are_left_out():
    people = [person("Unrelated", "U", skills=[("Cybersecurity", 5)], domains=[("Energy", "Renewable Energy", 5)])]
    assert pm.rank_people(people, pm.extract_requirements(FLOOD_PROBLEM, TAXONOMY, SKILLS)) == []


def test_universities_and_industries_are_ranked_separately():
    people = [
        person("Uni Hydrologist", "U1", skills=[("Hydrology", 5)]),
        person("Industry Hydrologist", "I1", org_type="industry", kind="expert", skills=[("Hydrology", 5)]),
    ]
    result = pm.match_problem(FLOOD_PROBLEM, people, TAXONOMY)
    assert [o["org_id"] for o in result["universities"]] == ["U1"]
    assert [o["org_id"] for o in result["industries"]] == ["I1"]


def test_database_url_drops_prismas_schema_suffix(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "postgresql://user:pw@localhost:5432/db?schema=public")
    assert pm.database_url() == "postgresql://user:pw@localhost:5432/db"


@pytest.fixture
def isolated_db(tmp_path, monkeypatch):
    monkeypatch.setattr(problem_storage, "DATABASE_PATH", str(tmp_path / "team_matches.sqlite3"))
    problem_storage.initialize_storage()


def test_endpoint_returns_needs_and_ranked_teams(isolated_db, monkeypatch):
    problem = create_problem(ProblemBase(problem_text="Streets flood every monsoon", title="Urban flooding", citizen_name="Rahul"))
    update_problem(problem.id, ProblemUpdate(classification={"domain": "Water Resources", "subdomain": "Flood Management"}))
    people = [person("Flood Expert", "U1", domains=[("Water Resources", "Flood Management", 5)])]
    monkeypatch.setattr(pm, "load_people", lambda org_type=None: people)

    result = problem_team_matches_endpoint(problem.id, top_k=3)

    assert result["problem_id"] == problem.id
    assert result["needs"][0]["label"] == "Flood Management"
    assert result["universities"][0]["team"][0]["name"] == "Flood Expert"
    assert result["industries"] == []


def test_endpoint_404s_for_an_unknown_problem(isolated_db):
    with pytest.raises(HTTPException) as caught:
        problem_team_matches_endpoint("no-such-problem", top_k=3)
    assert caught.value.status_code == 404


def test_endpoint_reports_503_when_the_people_directory_is_down(isolated_db, monkeypatch):
    problem = create_problem(ProblemBase(problem_text="Streets flood", title="Flooding", citizen_name="Rahul"))

    def down(org_type=None):
        raise pm.PeopleDataUnavailable("connection refused")

    monkeypatch.setattr(pm, "load_people", down)
    with pytest.raises(HTTPException) as caught:
        problem_team_matches_endpoint(problem.id, top_k=3)
    assert caught.value.status_code == 503
    assert "connection refused" not in caught.value.detail, "internal error text must not reach the client"


def _verified_problem(text, title, classification=None):
    problem = create_problem(ProblemBase(problem_text=text, title=title, citizen_name="Rahul"))
    update_problem(problem.id, ProblemUpdate(status="verified", classification=classification))
    return problem


def test_organization_endpoint_returns_only_that_organizations_best_problems(isolated_db, monkeypatch):
    flood = _verified_problem("Streets flood", "Urban flooding", {"domain": "Water Resources", "subdomain": "Flood Management"})
    _verified_problem("No power", "Village electricity", {"domain": "Energy", "subdomain": "Electricity Access"})
    unverified = create_problem(ProblemBase(problem_text="Streets flood again", title="Unverified flood", citizen_name="Rahul"))
    people = [
        person("Flood Expert", "U1", domains=[("Water Resources", "Flood Management", 5)]),
        person("Other University Person", "U2", domains=[("Energy", "Electricity Access", 5)]),
    ]
    monkeypatch.setattr(pm, "load_people", lambda org_type=None: [p for p in people if org_type in (None, p["org_type"])])

    result = organization_problem_matches_endpoint("university", "U1", top_k=3, user_id=None)

    assert result["organization"]["name"] == "U1"
    assert [m["problem"]["id"] for m in result["matches"]] == [flood.id], "only verified problems this organization can serve"
    assert unverified.id not in [m["problem"]["id"] for m in result["matches"]]
    assert result["matches"][0]["match"]["team"][0]["name"] == "Flood Expert"
    assert {"id", "title", "description", "category", "district", "location"} == set(result["matches"][0]["problem"])


def test_organization_endpoint_with_no_people_returns_no_matches(isolated_db, monkeypatch):
    monkeypatch.setattr(pm, "load_people", lambda org_type=None: [])
    assert organization_problem_matches_endpoint("industry", "nobody", top_k=3, ai="background", user_id=None) == {"organization": None, "ai_pending": False, "matches": []}


def test_organization_endpoint_rejects_an_unknown_organization_type(isolated_db):
    with pytest.raises(HTTPException) as caught:
        organization_problem_matches_endpoint("government", "x", top_k=3, user_id=None)
    assert caught.value.status_code == 400


# ------------------------------------------------------------------- complementarity between orgs

NEEDS = [
    {"kind": "skill", "label": "Hydrology", "skill": "Hydrology", "weight": 2.0, "source": "capability"},
    {"kind": "skill", "label": "GIS Mapping", "skill": "GIS Mapping", "weight": 1.0, "source": "capability"},
    {"kind": "skill", "label": "IoT Sensor Networks", "skill": "IoT Sensor Networks", "weight": 1.0, "source": "capability"},
    {"kind": "skill", "label": "Water Treatment", "skill": "Water Treatment", "weight": 1.0, "source": "capability"},
]


def _research_and_deployment():
    """A university strong on analysis, an industry strong on hardware: neither covers the problem alone."""
    return [
        person("Hydrologist", "Uni", kind="faculty", skills=[("Hydrology", 5)]),
        person("Mapper", "Uni", kind="student", skills=[("GIS Mapping", 4)]),
        person("Sensor Lead", "Ind", org_type="industry", kind="expert", skills=[("IoT Sensor Networks", 5)]),
        person("Plant Engineer", "Ind", org_type="industry", kind="employee", skills=[("Water Treatment", 4)]),
    ]


def test_a_partnership_beats_either_organization_alone():
    people = _research_and_deployment()
    pairs = pm.pair_organizations(people, NEEDS)
    assert pairs, "a university and an industry each holding half the needs is a partnership"
    best = pairs[0]
    assert best["coverage"] > best["best_alone"], "the pair must cover more than the stronger side alone"
    assert best["cross_type"] is True
    assert not best["missing"], "between them they cover everything"


def test_each_side_is_named_with_what_only_it_brings():
    best = pm.pair_organizations(_research_and_deployment(), NEEDS)[0]
    brings = {org["name"]: set(org["brings"]) for org in best["organizations"]}
    assert brings["Uni"] == {"Hydrology", "GIS Mapping"}
    assert brings["Ind"] == {"IoT Sensor Networks", "Water Treatment"}


def test_the_joint_team_has_people_from_both_organizations():
    best = pm.pair_organizations(_research_and_deployment(), NEEDS)[0]
    assert {m["org_id"] for m in best["team"]} == {"Uni", "Ind"}, "a partnership nobody from one side joins is not a partnership"


def test_an_organization_that_adds_nothing_is_not_offered_as_a_partner():
    """The passenger test: a second organization has to cover something the first cannot."""
    people = [
        person("Hydrologist", "Uni", kind="faculty", skills=[("Hydrology", 5)]),
        person("Mapper", "Uni", kind="student", skills=[("GIS Mapping", 4)]),
        person("Sensor Lead", "Uni", kind="mentor", skills=[("IoT Sensor Networks", 5)]),
        person("Plant Engineer", "Uni", kind="faculty", skills=[("Water Treatment", 4)]),
        # Everything this industry can do, the university already does.
        person("Second Hydrologist", "Ind", org_type="industry", kind="expert", skills=[("Hydrology", 5)]),
    ]
    assert pm.pair_organizations(people, NEEDS) == []


def test_a_partner_worth_less_than_the_coordination_is_dropped(monkeypatch):
    """A pair has to clear MIN_COMPLEMENT_UPLIFT, because a second organization is not free."""
    people = [
        person("Hydrologist", "Uni", kind="faculty", skills=[("Hydrology", 5)]),
        person("Mapper", "Uni", kind="student", skills=[("GIS Mapping", 4)]),
        person("Treater", "Uni", kind="mentor", skills=[("Water Treatment", 4)]),
        person("Sensor Lead", "Ind", org_type="industry", kind="expert", skills=[("IoT Sensor Networks", 5)]),
        person("Hydro Two", "Ind", org_type="industry", kind="employee", skills=[("Hydrology", 4)]),
    ]
    assert pm.pair_organizations(people, NEEDS), "one need out of five weight is worth the partner by default"
    monkeypatch.setattr(pm, "MIN_COMPLEMENT_UPLIFT", 0.5)
    assert pm.pair_organizations(people, NEEDS) == [], "raise the bar and the same pair stops being worth proposing"


def test_partnership_coverage_is_recomputed_from_the_team_that_was_built():
    """Coverage is never the union of what the two sides claim; it is what the joint team actually delivers."""
    best = pm.pair_organizations(_research_and_deployment(), NEEDS)[0]
    delivered = {label for member in best["team"] for label in member["brings"]}
    assert set(best["covered"]) == delivered
    total = sum(n["weight"] for n in NEEDS)
    assert best["coverage"] == round(sum(n["weight"] for n in NEEDS if n["label"] in best["covered"]) / total, 3)


def test_a_partnership_is_scored_on_the_same_scale_as_a_single_organization():
    people = _research_and_deployment()
    best = pm.pair_organizations(people, NEEDS)[0]
    alone = max(m["score"] for m in (
        pm.score_organization([p for p in people if p["org_id"] == org], NEEDS, p_type)
        for org, p_type in (("Uni", "university"), ("Ind", "industry"))
    ) if m)
    assert best["score"] > alone, "the same formula, so the numbers on the two cards are comparable"


def test_no_needs_or_no_people_gives_no_partnerships():
    assert pm.pair_organizations(_research_and_deployment(), []) == []
    assert pm.pair_organizations([], NEEDS) == []


# ------------------------------------------------------------------- required vs helpful needs


def test_problem_areas_are_required_and_skills_are_helpful():
    needs = pm.extract_requirements(FLOOD_PROBLEM, TAXONOMY, SKILLS)
    kinds = {n["label"]: pm.requirement_of(n) for n in needs}
    assert kinds["Flood Management"] == "required", "what the problem is about is a must-have"
    assert kinds["Hydrology"] == "helpful", "there is usually more than one way to do the work"


def test_holding_every_must_have_reads_as_capable_despite_missing_extras():
    """The point of the split: optional gaps should not drag a fully-qualified organization down."""
    needs = pm.extract_requirements(FLOOD_PROBLEM, TAXONOMY, SKILLS)
    covered = [n["label"] for n in needs if pm.requirement_of(n) == "required"]
    split = pm.split_coverage(needs, covered)
    assert split["required_coverage"] == 1.0
    assert split["helpful_coverage"] == 0.0
    assert split["coverage"] == pytest.approx(pm.REQUIRED_SHARE), "must-haves carry most of the figure"


def test_a_missing_must_have_is_called_out_separately_from_a_missing_extra():
    people = [person("GIS Only", "U", kind="student", skills=[("GIS Mapping", 5)])]
    needs = pm.extract_requirements(FLOOD_PROBLEM, TAXONOMY, SKILLS)
    match = pm.score_organization(people, needs, "university")
    assert "Flood Management" in match["missing_required"], "the problem area is a must-have and is not covered"
    assert match["required_coverage"] == 0.0
    assert any("Missing must-haves" in r for r in match["reasons"])


def test_a_problem_with_only_skills_is_not_diluted_by_an_absent_required_group():
    """With no problem area at all, the skills carry the whole figure rather than a phantom 100%."""
    needs = [{"kind": "skill", "label": "Hydrology", "skill": "Hydrology", "weight": 1.0, "source": "capability"}]
    assert pm.split_coverage(needs, [])["coverage"] == 0.0
    assert pm.split_coverage(needs, ["Hydrology"])["coverage"] == 1.0
