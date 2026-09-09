"""
test_ai_pipeline.py

Sanity tests for the end-to-end pipeline. Focus on sensible ranking
and valid structured output -- NOT exact cosine similarity values.
"""

from ai_pipeline import analyze_problem


def _top_names(result_key_list):
    return [r["name"] for r in result_key_list]


def test_road_damage_favors_infrastructure():
    text = "The village road is badly damaged and ambulances cannot reach the hospital."
    result = analyze_problem(text)

    assert result["classification"] is not None
    assert result["universities"], "Expected at least one university match"

    top_names = _top_names(result["universities"])
    infra_keywords = ["Institute of Technology", "NIT", "Civil", "NIFFT"]
    assert any(any(k.lower() in name.lower() for k in infra_keywords) for name in top_names), (
        f"Expected an infrastructure-focused institution near the top, got: {top_names}"
    )


def test_healthcare_problem_flags_priority_and_health_institution():
    text = "Village hospital has no doctor and pregnant women travel 40 km for delivery care."
    result = analyze_problem(text)

    assert result["priority"] is not None
    assert result["universities"], "Expected at least one university match"

    top_names = _top_names(result["universities"])
    assert any("Medical" in name or "RIMS" in name or "MGM" in name for name in top_names), (
        f"Expected a healthcare institution near the top, got: {top_names}"
    )


def test_irrigation_problem_favors_agriculture():
    text = "Farmers cannot irrigate crops because of severe water shortage in the region."
    result = analyze_problem(text)

    assert result["universities"], "Expected at least one university match"
    top_names = _top_names(result["universities"])
    assert any("Agricultural" in name for name in top_names), (
        f"Expected an agricultural institution near the top, got: {top_names}"
    )


def test_electricity_outage_produces_valid_output():
    text = "The village has frequent and prolonged electricity outages affecting daily life."
    result = analyze_problem(text)
    assert result["universities"] or result["industry_partners"], "Expected some match"


def test_teacher_shortage_produces_valid_summary_structure():
    text = "The government school does not have enough teachers for all the students."
    result = analyze_problem(text)

    assert result["summary"] is not None
    for key in ["title", "summary", "key_issues", "affected_groups", "suggested_intervention"]:
        assert key in result["summary"]


def test_pipeline_does_not_crash_on_minimal_input():
    text = "There is a problem."
    result = analyze_problem(text)
    assert isinstance(result, dict)
    assert "classification" in result
    assert "location" in result
