"""
problem_structurer.py

Transforms unstructured, messy citizen input (text or speech transcript)
into a structured, professional societal problem statement with:
- Standardized title
- Objective problem statement
- Category & Problem Nature (Technical / Non-Technical / Hybrid)
- Affected area & Estimated population scope
- Frequency / Recurrence pattern
- Required solver capabilities & skills
- Suggested intervention vector

Includes Gemini LLM processing + robust offline heuristic fallback.
"""

import json
import logging
import re
from typing import List, Literal, Optional
from pydantic import BaseModel, Field

from gemini_utils import generate_text, strip_json_fence
from translation_utils import translate_to_english

logger = logging.getLogger(__name__)

VALID_CATEGORIES = [
    "Infrastructure",
    "Water and Sanitation",
    "Environment",
    "Healthcare",
    "Transportation",
    "Public Safety",
    "Education",
    "Technology",
    "Other",
]

VALID_NATURES = ["Technical", "Non-Technical", "Hybrid"]


class StructuredProblemDraft(BaseModel):
    title: str
    problem_statement: str
    category: str
    problem_nature: Literal["Technical", "Non-Technical", "Hybrid"]
    affected_area: str
    affected_population: str
    frequency: str
    required_capabilities: List[str] = Field(default_factory=list)
    suggested_intervention: str
    raw_input: str
    source_language: str = "English"
    translated_input: Optional[str] = None
    engine: str = "gemini"


def _fallback_structure(
    raw_text: str, source_language: str = "English", location_hint: Optional[str] = None
) -> StructuredProblemDraft:
    """Intelligent rule-based fallback when Gemini API key is missing or offline."""
    text_lower = raw_text.lower()

    # Determine category
    category = "Other"
    if any(w in text_lower for w in ["water", "pipe", "well", "drain", "sewage", "drinking", "leak"]):
        category = "Water and Sanitation"
    elif any(w in text_lower for w in ["road", "bridge", "building", "pothole", "slope", "culvert", "collapse", "landslide"]):
        category = "Infrastructure"
    elif any(w in text_lower for w in ["garbage", "waste", "pollution", "forest", "plastic", "tree", "river"]):
        category = "Environment"
    elif any(w in text_lower for w in ["hospital", "doctor", "medicine", "health", "clinic", "disease", "patient"]):
        category = "Healthcare"
    elif any(w in text_lower for w in ["bus", "traffic", "transport", "station", "train", "signal"]):
        category = "Transportation"
    elif any(w in text_lower for w in ["safety", "crime", "light", "theft", "police", "fire", "danger"]):
        category = "Public Safety"
    elif any(w in text_lower for w in ["school", "teacher", "student", "class", "education", "book"]):
        category = "Education"
    elif any(w in text_lower for w in ["network", "internet", "signal", "app", "digital", "online"]):
        category = "Technology"

    # Determine nature
    problem_nature: Literal["Technical", "Non-Technical", "Hybrid"] = "Hybrid"
    tech_keywords = ["sensor", "iot", "model", "prediction", "software", "machine", "construction", "civil", "structural", "camera", "gis"]
    social_keywords = ["awareness", "policy", "staff", "teacher", "doctor", "volunteer", "meeting", "protocol", "campaign", "complaint"]

    has_tech = any(w in text_lower for w in tech_keywords) or category in ["Technology", "Infrastructure"]
    has_social = any(w in text_lower for w in social_keywords) or category in ["Education", "Public Safety"]

    if has_tech and has_social:
        problem_nature = "Hybrid"
    elif has_tech:
        problem_nature = "Technical"
    elif has_social:
        problem_nature = "Non-Technical"
    else:
        problem_nature = "Hybrid"

    # Clean sentence for title
    cleaned = re.sub(r"[^\w\s]", " ", raw_text).strip()
    words = cleaned.split()
    first_few = " ".join(words[:7]).capitalize()
    if len(first_few) > 10:
        title = f"{category} Challenge: {first_few}"
    else:
        title = f"Community {category} Resolution"

    # Frequency
    frequency = "Continuous / Recurring"
    if any(w in text_lower for w in ["monsoon", "rain", "summer", "winter"]):
        frequency = "Seasonal (Weather-dependent)"
    elif any(w in text_lower for w in ["night", "evening", "morning", "daily"]):
        frequency = "Daily recurring"

    # Location
    affected_area = location_hint if location_hint else "Local community / area mentioned in report"

    # Capabilities
    capabilities = []
    if category == "Infrastructure":
        capabilities = ["Civil Engineering", "Structural Assessment", "Field Drainage Analysis"]
    elif category == "Water and Sanitation":
        capabilities = ["Water Quality Testing", "Hydrological Mapping", "Sanitation Infrastructure"]
    elif category == "Healthcare":
        capabilities = ["Public Health Outreach", "Medical Resource Allocation", "Telemedicine Support"]
    elif category == "Environment":
        capabilities = ["Environmental Assessment", "Waste Management", "Ecology Conservation"]
    elif category == "Public Safety":
        capabilities = ["Civic Infrastructure", "Public Lighting", "Community Safety Protocol"]
    else:
        capabilities = ["Domain Expertise", "Field Assessment", "Community Coordination"]

    if problem_nature in ["Technical", "Hybrid"]:
        capabilities.append("GIS & Data Analytics")

    return StructuredProblemDraft(
        title=title,
        problem_statement=raw_text.strip(),
        category=category,
        problem_nature=problem_nature,
        affected_area=affected_area,
        affected_population="Local residents and community members",
        frequency=frequency,
        required_capabilities=capabilities[:5],
        suggested_intervention=f"Conduct field assessment and develop collaborative {problem_nature.lower()} solution.",
        raw_input=raw_text,
        source_language=source_language,
        translated_input=None,
        engine="heuristic_fallback",
    )


def structure_raw_problem(
    raw_text: str,
    source_language: str = "English",
    location_hint: Optional[str] = None,
) -> StructuredProblemDraft:
    """
    Main function to structure unstructured citizen problem input.
    Uses Gemini LLM if available; gracefully falls back to heuristics.
    """
    if not raw_text or not raw_text.strip():
        raise ValueError("Problem text cannot be empty")

    raw_text = raw_text.strip()
    translated_text = None

    # Step 1: Translate to English if needed
    raw_text_en = raw_text
    if source_language and source_language != "English":
        try:
            translated = translate_to_english(raw_text, source_language)
            if translated and translated.strip():
                raw_text_en = translated.strip()
                translated_text = raw_text_en
        except Exception as e:
            logger.warning("Translation failed in structurer: %s", e)

    # Step 2: Build LLM Prompt
    categories_str = ", ".join(f'"{c}"' for c in VALID_CATEGORIES)
    prompt = f"""You are an expert civic intelligence AI for a government problem-solving platform.
Your task is to transform unstructured, messy citizen input into a clear, structured, and actionable societal problem statement.

RAW CITIZEN INPUT:
\"\"\"{raw_text_en}\"\"\"

{f"LOCATION HINT: {location_hint}" if location_hint else ""}

Analyze the citizen input and return a JSON object with EXACTLY these keys:
- "title": A concise, formal, and objective problem title (6 to 12 words). Example: "Predictive Landslide Risk Monitoring for Village Road Connectivity"
- "problem_statement": A professional, objective description of the challenge (2-4 sentences explaining what happens, circumstances, and community impact).
- "category": Must be one of exactly: {categories_str}.
- "problem_nature": Must be one of exactly: "Technical", "Non-Technical", "Hybrid".
    * "Technical": Primarily requires engineering, software, sensors, ML, civil construction, or technical hardware.
    * "Non-Technical": Primarily requires community awareness, social work, policy adjustment, volunteer organizing, or administrative enforcement.
    * "Hybrid": Requires both technical tools (e.g. early warning systems or sensor networks) AND community/policy action (e.g. village disaster response committees).
- "affected_area": Detected specific location, landmark, village, ward, or region (use location hint if provided or extrapolate from context).
- "affected_population": Estimated population or scope affected (e.g. "~1,200 village residents and emergency vehicles", "Ward 4 commuters", "Over 500 schoolchildren").
- "frequency": Recurrence pattern (e.g. "Recurring during heavy monsoon rainfall", "Continuous daily issue", "Seasonal during summer dry months").
- "required_capabilities": List of 3 to 6 specific skills or disciplines required to solve it (e.g. ["GIS Mapping", "Geotechnical Sensing", "Early Warning System", "Community Evacuation Protocol"]).
- "suggested_intervention": 1-2 sentence high-level solution vector or recommendation.

Return ONLY the raw JSON object. No markdown formatting, no ```json fences, no preamble."""

    try:
        response_text = generate_text(prompt)
        cleaned = strip_json_fence(response_text)
        data = json.loads(cleaned)

        # Validate category
        category = data.get("category", "Other")
        if category not in VALID_CATEGORIES:
            category = "Other"

        # Validate nature
        nature = data.get("problem_nature", "Hybrid")
        if nature not in VALID_NATURES:
            nature = "Hybrid"

        capabilities = data.get("required_capabilities") or []
        if isinstance(capabilities, str):
            capabilities = [capabilities]
        elif not isinstance(capabilities, list):
            capabilities = []

        return StructuredProblemDraft(
            title=data.get("title") or "Community Societal Challenge",
            problem_statement=data.get("problem_statement") or raw_text_en,
            category=category,
            problem_nature=nature,
            affected_area=data.get("affected_area") or (location_hint or "Locality as reported"),
            affected_population=data.get("affected_population") or "Local community residents",
            frequency=data.get("frequency") or "Recurring issue",
            required_capabilities=capabilities,
            suggested_intervention=data.get("suggested_intervention") or "Collaborative problem-solving required.",
            raw_input=raw_text,
            source_language=source_language,
            translated_input=translated_text,
            engine="gemini",
        )
    except Exception as e:
        logger.warning("Gemini problem structuring failed or client unavailable: %s. Using heuristic fallback.", e)
        fallback = _fallback_structure(raw_text_en, source_language, location_hint)
        fallback.raw_input = raw_text
        fallback.translated_input = translated_text
        return fallback
