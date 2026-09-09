"""
translation_utils.py

Local-language support for citizen-facing input/output.

Uses Gemini as the translation engine rather than a dedicated MT library,
because there is no reliable offline/open translation model with good
coverage of Jharkhand's tribal languages (Santali, Mundari, Ho, Kurukh).
This keeps the same call pattern as the rest of the project.

IMPORTANT CAVEAT -- read before demoing or deploying:
    Gemini's translation quality for Santali, Mundari, Ho, and Kurukh is
    NOT verified against native speakers. These are low-resource languages
    with comparatively little training data available to any LLM. Nagpuri
    / Sadri and Hindi are much closer to mainstream Indo-Aryan languages
    the model has seen far more of, so quality there is likely (but still
    not guaranteed) to be better.

    Before any real deployment: have a native speaker of each language
    review sample translations both directions (local -> English and
    English -> local) before trusting this for citizens who may not
    read English well enough to catch a mistranslation themselves.

Public functions:
    translate_to_english(text, source_language) -> str
    translate_from_english(text, target_language) -> str

Connects to:
    - gemini_utils.py
    - ai_pipeline.py
    - app.py
"""

from gemini_utils import generate_text

# Display name -> language/script hint given to the model. Order here is
# also the order shown in the UI dropdown.
SUPPORTED_LANGUAGES = {
    "English": None,
    "Hindi": "Hindi, Devanagari script",
    "Nagpuri / Sadri": (
        "Nagpuri (also called Sadri), a widely spoken lingua franca in "
        "rural Jharkhand, close to Bhojpuri/Hindi, usually written in "
        "Devanagari script"
    ),
    "Santali": (
        "Santali. It may be written in either Ol Chiki script or "
        "Devanagari script -- detect which script the input uses and "
        "respond appropriately"
    ),
    "Mundari": (
        "Mundari, an Austroasiatic Munda language spoken in Jharkhand, "
        "usually written in Devanagari script"
    ),
    "Ho": (
        "Ho, an Austroasiatic Munda language spoken in Jharkhand, "
        "usually written in Devanagari or Warang Citi script"
    ),
    "Kurukh (Oraon)": (
        "Kurukh (also called Oraon), a Dravidian language spoken in "
        "Jharkhand, usually written in Devanagari script"
    ),
}

# Languages where translation quality is a bigger open question -- surfaced
# in the UI so operators know to double-check these more carefully.
LOW_CONFIDENCE_LANGUAGES = {"Santali", "Mundari", "Ho", "Kurukh (Oraon)"}


def translate_to_english(text: str, source_language: str) -> str:
    """
    Translates citizen-submitted text into English so the rest of the
    (English-only) AI pipeline -- classifier taxonomy, matchers, etc. --
    can work on it unchanged.

    Returns the original text unchanged if source_language is English/None.
    Raises on Gemini failure -- callers should wrap in _safe_call.
    """
    if not text or not text.strip():
        return text
    if not source_language or source_language == "English":
        return text

    hint = SUPPORTED_LANGUAGES.get(source_language, source_language)
    prompt = f"""Translate the following citizen-submitted text into clear, plain English.
The text is in {hint}.
Preserve all factual details exactly: place names, person names, numbers, and dates.
Return ONLY the English translation. No preamble, no notes, no quotation marks.

TEXT:
{text}
"""
    return generate_text(prompt).strip()


def translate_from_english(text: str, target_language: str) -> str:
    """
    Translates English text (e.g. an AI-generated summary) into the
    citizen's local language, for display back to them.

    Returns the original text unchanged if target_language is English/None.
    Raises on Gemini failure -- callers should wrap in _safe_call.
    """
    if not text or not text.strip():
        return text
    if not target_language or target_language == "English":
        return text

    hint = SUPPORTED_LANGUAGES.get(target_language, target_language)
    prompt = f"""Translate the following English text into {hint}.
Keep it simple and clear -- it will be read by a citizen on a phone screen.
Return ONLY the translation. No preamble, no notes, no quotation marks.

TEXT:
{text}
"""
    return generate_text(prompt).strip()
