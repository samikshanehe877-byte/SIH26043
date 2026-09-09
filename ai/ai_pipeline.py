"""
ai_pipeline.py

Orchestrates the full AI pipeline for a submitted problem.
Each stage is wrapped in error handling so a failure in one
optional feature never crashes the whole pipeline.

Errors per stage are captured into result["_debug_errors"] so the
UI can optionally show them (see app.py debug mode) without ever
crashing or exposing raw tracebacks to normal users by default.

Public function:
    analyze_problem(problem_text, existing_problems=None,
                     latitude=None, longitude=None,
                     district=None, block=None, village=None,
                     image_path=None) -> dict
"""

import logging
from typing import List, Optional

from classifier import classify_with_review
from priority_ai import analyze_priority
from priority import calculate_priority
from duplicate_detector import find_duplicates

from university_matcher import match_universities
from industry_matcher import match_industry_partners
from mentor_matcher import match_mentors
from problem_summary import generate_problem_summary
from image_analyzer import analyze_image
from location_utils import location_summary
from translation_utils import translate_to_english, translate_from_english

logger = logging.getLogger(__name__)


def _safe_call(fn, default, *args, **kwargs):
    """Runs fn(*args, **kwargs); returns (result, error_message_or_None)."""
    try:
        return fn(*args, **kwargs), None
    except Exception as e:
        logger.exception("Pipeline stage '%s' failed: %s", getattr(fn, "__name__", "unknown"), e)
        return default, str(e)


def analyze_problem(
    problem_text: str,
    existing_problems: Optional[List[str]] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    district: Optional[str] = None,
    block: Optional[str] = None,
    village: Optional[str] = None,
    image_path: Optional[str] = None,
    source_language: Optional[str] = None,
) -> dict:

    result = {
        "classification": None,
        "priority": None,
        "duplicates": [],
        "summary": None,
        "summary_localized": None,
        "universities": [],
        "industry_partners": [],
        "mentors": None,
        "image_analysis": None,
        "location": None,
        "source_language": source_language or "English",
        "original_text": problem_text,
        "translated_text": None,
        "_debug_errors": {},
    }

    # 0. Translate citizen input to English, if needed. Everything downstream
    # (taxonomy classifier, matchers) is English-only, so this has to happen
    # before stage 1, not alongside it.
    problem_text_en = problem_text
    if source_language and source_language != "English":
        (translated, err) = _safe_call(
            translate_to_english, problem_text, problem_text, source_language
        )
        if err:
            result["_debug_errors"]["translation_to_english"] = err
        else:
            problem_text_en = translated
            result["translated_text"] = translated

    # 1. Classification
    (classification_tuple, err) = _safe_call(
        classify_with_review, (None, "NEEDS_HUMAN_REVIEW"), problem_text_en
    )
    if err:
        result["_debug_errors"]["classification"] = err
    classification_result, status = classification_tuple
    if classification_result is not None:
        result["classification"] = {
            **(classification_result.dict() if hasattr(classification_result, "dict") else classification_result),
            "status": status,
        }

    domain = result["classification"].get("domain") if result["classification"] else None
    subdomain = result["classification"].get("subdomain") if result["classification"] else None

    # 2. Priority
    (priority_factors, err) = _safe_call(analyze_priority, None, problem_text_en)
    if err:
        result["_debug_errors"]["priority"] = err
    if priority_factors is not None:
        try:
            factors_dict = priority_factors.dict() if hasattr(priority_factors, "dict") else priority_factors
            priority_result = calculate_priority(**factors_dict)
            result["priority"] = (
                priority_result.dict() if hasattr(priority_result, "dict") else priority_result
            )
        except Exception as e:
            logger.exception("Priority calculation failed: %s", e)
            result["_debug_errors"]["priority_calculation"] = str(e)

    # 3. Duplicate detection
    if existing_problems:
        (dupes, err) = _safe_call(find_duplicates, [], problem_text_en, existing_problems)
        if err:
            result["_debug_errors"]["duplicates"] = err
        result["duplicates"] = dupes

    # 4. Problem summary
    (summary, err) = _safe_call(generate_problem_summary, None, problem_text_en)
    if err:
        result["_debug_errors"]["summary"] = err
    result["summary"] = summary

    # 4b. Localize the citizen-facing summary back to their language
    if source_language and source_language != "English" and summary:
        try:
            result["summary_localized"] = {
                "title": translate_from_english(summary.get("title", ""), source_language),
                "summary": translate_from_english(summary.get("summary", ""), source_language),
                "suggested_intervention": translate_from_english(
                    summary.get("suggested_intervention", ""), source_language
                ),
            }
        except Exception as e:
            logger.exception("Summary localization failed: %s", e)
            result["_debug_errors"]["summary_localization"] = str(e)

    # 5. University matching
    if domain:
        (unis, err) = _safe_call(
            match_universities, [], problem_text_en, domain, subdomain,
            top_k=5, latitude=latitude, longitude=longitude,
        )
        if err:
            result["_debug_errors"]["universities"] = err
        result["universities"] = unis

    # 5b. Mentor matching (scoped to the top-matched university, if any)
    top_university_id = None
    if result["universities"]:
        top_university_id = result["universities"][0].get("id")

    (mentor_result, err) = _safe_call(
        match_mentors, {"scope": "error", "university_id": None, "mentors": []},
        problem_text_en, domain, subdomain,
        university_id=top_university_id, top_k=3,
    )
    if err:
        result["_debug_errors"]["mentors"] = err
    result["mentors"] = mentor_result

    # 6. Industry matching
    if domain:
        (partners, err) = _safe_call(
            match_industry_partners, [], problem_text_en, domain, subdomain, top_k=3
        )
        if err:
            result["_debug_errors"]["industry_partners"] = err
        result["industry_partners"] = partners

    # 7. Optional image analysis
    if image_path:
        (image_result, err) = _safe_call(analyze_image, None, image_path, problem_text_en)
        if err:
            result["_debug_errors"]["image_analysis"] = err
        result["image_analysis"] = image_result

    # 8. Location
    (loc, err) = _safe_call(
        location_summary, None, latitude, longitude, district, block, village
    )
    if err:
        result["_debug_errors"]["location"] = err
    result["location"] = loc

    return result
