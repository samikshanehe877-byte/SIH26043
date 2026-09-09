"""
app.py

Streamlit UI for SIH26043 AI module.
"""

import logging
import os
import tempfile

import streamlit as st

from ai_pipeline import analyze_problem
from mentor_matcher import match_mentors
from translation_utils import SUPPORTED_LANGUAGES, LOW_CONFIDENCE_LANGUAGES
from notification_service import notify_fanout

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

st.set_page_config(page_title="SIH26043 — Societal Problem AI Module", layout="wide")

st.title("🧭 Societal Problem AI Analysis — SIH26043")
st.caption("Demo MVP. University/industry data is placeholder and pending verification.")

with st.sidebar:
    debug_mode = st.checkbox("🔧 Debug mode (show internal errors)")

with st.form("problem_form"):
    source_language = st.selectbox(
        "Language of the problem description",
        options=list(SUPPORTED_LANGUAGES.keys()),
        index=0,
    )
    if source_language in LOW_CONFIDENCE_LANGUAGES:
        st.caption(
            "⚠️ Machine translation for this language is not yet verified by a "
            "native speaker — please double-check the translated text shown "
            "after analysis."
        )

    problem_text = st.text_area(
        "Describe the problem", height=150,
        placeholder="e.g. The village road is badly damaged and ambulances cannot reach the hospital."
    )

    with st.expander("➕ Add more details (optional)"):
        col1, col2 = st.columns(2)
        with col1:
            latitude = st.number_input("Latitude", value=0.0, format="%.6f")
            district = st.text_input("District")
            village = st.text_input("Village")
        with col2:
            longitude = st.number_input("Longitude", value=0.0, format="%.6f")
            block = st.text_input("Block")

    with st.expander("📨 Contact info (optional — enables notifications)"):
        st.caption(
            "If provided, we can email/SMS you a confirmation once this is "
            "routed. Notifications are only sent if you click the button "
            "below after analysis — nothing is sent automatically."
        )
        col3, col4 = st.columns(2)
        with col3:
            citizen_email = st.text_input("Your email")
        with col4:
            citizen_phone = st.text_input("Your phone number (with country code)")

    uploaded_image = st.file_uploader("Upload supporting image (optional)", type=["jpg", "jpeg", "png"])
    if uploaded_image is not None:
        st.image(uploaded_image, caption="Preview", use_container_width=True)

    submitted = st.form_submit_button("Run AI Analysis")

if submitted:
    if not problem_text or not problem_text.strip():
        st.warning("Please enter a problem description.")
    else:
        image_path = None
        try:
            if uploaded_image is not None:
                suffix = os.path.splitext(uploaded_image.name)[1] or ".jpg"
                with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                    tmp.write(uploaded_image.getbuffer())
                    image_path = tmp.name

            with st.spinner("Running AI analysis..."):
                result = analyze_problem(
                    problem_text=problem_text,
                    existing_problems=None,
                    latitude=latitude or None,
                    longitude=longitude or None,
                    district=district or None,
                    block=block or None,
                    village=village or None,
                    image_path=image_path,
                    source_language=source_language,
                )
        except Exception as e:
            logger.exception("Pipeline failed: %s", e)
            st.error("Something went wrong during analysis. Please try again.")
            result = None
        finally:
            if image_path and os.path.exists(image_path):
                try:
                    os.remove(image_path)
                except OSError:
                    pass

        if result:
            # Persist across reruns (e.g. the university picker below triggers
            # a rerun when changed — without this, that rerun would wipe out
            # the analysis since it's no longer inside `if submitted`).
            st.session_state["analysis_result"] = result
            # Use the English working text (translated, if applicable) for any
            # live re-matching triggered by widgets below — the matchers only
            # understand English.
            st.session_state["problem_text_en"] = result.get("translated_text") or result.get("original_text")
            st.session_state["citizen_contact"] = {
                "email": citizen_email.strip() or None,
                "phone": citizen_phone.strip() or None,
            }
            # Reset any previously selected university from an earlier analysis.
            st.session_state.pop("selected_university_id", None)

result = st.session_state.get("analysis_result")
problem_text_for_display = st.session_state.get("problem_text_en", "")

if result:
    if debug_mode and result.get("_debug_errors"):
        with st.expander("⚠️ Debug: pipeline errors", expanded=True):
            st.json(result["_debug_errors"])

    if result.get("source_language", "English") != "English":
        with st.expander("🌐 Translation used for analysis", expanded=False):
            st.write("**Original text:**")
            st.write(result.get("original_text", ""))
            if result.get("translated_text"):
                st.write("**Translated to English (this is what the AI analyzed):**")
                st.write(result["translated_text"])
                st.caption(
                    "⚠️ Please verify this translation is accurate. If it looks "
                    "wrong, the classification, priority, and matches below may "
                    "be based on a mistranslation."
                )
            else:
                st.warning(
                    "Translation to English failed — the analysis below ran on "
                    "the original-language text as-is and may be unreliable."
                )

    tabs = st.tabs([
        "Classification", "Priority", "Duplicates", "Summary",
        "University & Mentor Assignment", "Industry/CSR", "Image Evidence", "Location",
        "Notifications"
    ])

    with tabs[0]:
        if result["classification"]:
            st.json(result["classification"])
        else:
            st.info("Classification unavailable.")

    with tabs[1]:
        if result["priority"]:
            p = result["priority"]
            col1, col2 = st.columns(2)
            with col1:
                st.metric("Priority Score", f"{p.get('score', '—')}")
            with col2:
                level = p.get("priority", "—")
                color = {"CRITICAL": "🔴", "HIGH": "🟠", "MEDIUM": "🟡", "LOW": "🟢"}.get(level, "⚪")
                st.metric("Priority Level", f"{color} {level}")

            st.write("**Factor breakdown:**")
            factor_labels = {
                "severity": "Severity",
                "people_affected": "People Affected",
                "urgency": "Urgency",
                "essential_service": "Essential Service Impact",
                "vulnerable_groups": "Vulnerable Groups",
                "duration": "Duration",
            }
            for key, label in factor_labels.items():
                if key in p:
                    st.progress(p[key] / 10, text=f"{label}: {p[key]}/10")
        else:
            st.info("Priority analysis unavailable.")

    with tabs[2]:
        if result["duplicates"]:
            for dup in result["duplicates"]:
                st.write(dup)
        else:
            st.info("No duplicates found (or not checked).")

    with tabs[3]:
        if result["summary"]:
            s = result["summary"]
            localized = result.get("summary_localized")
            if localized:
                st.subheader(localized.get("title", ""))
                st.write(localized.get("summary", ""))
                st.write("**Suggested intervention:**", localized.get("suggested_intervention", "unknown"))
                st.caption(f"⚠️ Machine-translated into {result.get('source_language')} — not verified by a native speaker.")
                with st.expander("View original English summary"):
                    st.subheader(s.get("title", ""))
                    st.write(s.get("summary", ""))
                    st.write("**Key issues:**", ", ".join(s.get("key_issues", [])) or "unknown")
                    st.write("**Affected groups:**", ", ".join(s.get("affected_groups", [])) or "unknown")
                    st.write("**Suggested intervention:**", s.get("suggested_intervention", "unknown"))
            else:
                st.subheader(s.get("title", ""))
                st.write(s.get("summary", ""))
                st.write("**Key issues:**", ", ".join(s.get("key_issues", [])) or "unknown")
                st.write("**Affected groups:**", ", ".join(s.get("affected_groups", [])) or "unknown")
                st.write("**Suggested intervention:**", s.get("suggested_intervention", "unknown"))
            if s.get("source") == "fallback":
                st.caption("⚠️ Generated via fallback (Gemini unavailable).")
        else:
            st.info("Summary unavailable.")

    with tabs[4]:
        universities = result.get("universities") or []
        if not universities:
            st.info("No matching universities found.")
        else:
            level_icon = {"HIGH": "🟢", "MEDIUM": "🟡", "LOW": "🔴"}
            uni_by_id = {u["id"]: u for u in universities}
            options = [u["id"] for u in universities]

            def _format_uni(uid):
                u = uni_by_id[uid]
                return f"{level_icon.get(u['match_level'], '⚪')} {u['name']}"

            st.write("**Assign to university:**")
            selected_id = st.selectbox(
                "Select the university this problem should be routed to "
                "(ranked best match first — you can override):",
                options=options,
                format_func=_format_uni,
                key="selected_university_id",
            )
            selected_uni = uni_by_id[selected_id]

            with st.expander(f"Why '{selected_uni['name']}'? (match reasoning)"):
                st.write("Reasons:", selected_uni["reasons"])
                st.write("Expertise:", selected_uni["expertise"])
                st.write("Capabilities:", selected_uni["capabilities"])
                if selected_uni.get("data_status") == "demo":
                    st.caption("⚠️ Demo/placeholder institutional data.")

            st.divider()
            st.write("**Assign a mentor from this university:**")

            domain = (result.get("classification") or {}).get("domain")
            subdomain = (result.get("classification") or {}).get("subdomain")
            mentor_result = match_mentors(
                problem_text_for_display, domain, subdomain,
                university_id=selected_id, top_k=5,
            )

            if mentor_result.get("scope") == "university_fallback":
                st.caption(
                    "⚠️ No mentors on file yet for this university — "
                    "showing best matches across all universities instead."
                )

            mentors = mentor_result.get("mentors") or []
            if not mentors:
                st.info("No matching mentors found.")
            else:
                avail_icon = {"light": "🟢", "moderate": "🟡", "full": "🔴", "unknown": "⚪"}
                mentor_by_id = {m["id"]: m for m in mentors}
                mentor_options = [m["id"] for m in mentors]

                def _format_mentor(mid):
                    m = mentor_by_id[mid]
                    return f"{avail_icon.get(m['availability_status'], '⚪')} {m['name']} — {m['department']}"

                selected_mentor_id = st.selectbox(
                    "Select mentor:",
                    options=mentor_options,
                    format_func=_format_mentor,
                    key="selected_mentor_id",
                )
                selected_mentor = mentor_by_id[selected_mentor_id]

                with st.expander(f"Why '{selected_mentor['name']}'? (match reasoning)"):
                    st.write("Reasons:", selected_mentor["reasons"])
                    st.write("Expertise:", selected_mentor["expertise"])
                    st.write("Research areas:", selected_mentor["research_areas"])
                    st.write(
                        f"Current load: {selected_mentor.get('current_load')} / "
                        f"{selected_mentor.get('max_capacity')} projects"
                    )
                    if selected_mentor.get("data_status") == "demo":
                        st.caption("⚠️ Demo/placeholder faculty data — fictional names.")

                st.success(
                    f"Assigned: **{selected_uni['name']}** — mentor **{selected_mentor['name']}**"
                )

    with tabs[5]:
        if result["industry_partners"]:
            for p in result["industry_partners"]:
                with st.expander(f"{p['name']} — {p['match_level']} ({p['score']})"):
                    st.write("Reasons:", p["reasons"])
                    st.write("Support types:", p["support_types"])
                    st.write("Expertise:", p["expertise"])
                    if p.get("data_status") == "demo":
                        st.caption("⚠️ Demo/placeholder partner data.")
        else:
            st.info("No matching industry/CSR partners found.")

    with tabs[6]:
        if result["image_analysis"]:
            st.json(result["image_analysis"])
        else:
            st.info("No image analysis performed.")

    with tabs[7]:
        if result["location"]:
            st.json(result["location"])
        else:
            st.info("No location data provided.")

    with tabs[8]:
        st.caption(
            "Sends an email/SMS to the citizen (if contact info was given), "
            "the assigned mentor, university, and industry partner (if they "
            "have contact_email/contact_phone on file). Nothing here sends "
            "automatically — this only runs when you click the button below. "
            "Without SMTP/SMS credentials in .env this runs in dry-run mode "
            "and just logs what would have been sent (see NOTIFICATIONS.md)."
        )

        citizen_contact = st.session_state.get("citizen_contact") or {"email": None, "phone": None}
        st.write(
            f"**Citizen contact:** "
            f"{citizen_contact.get('email') or '—'} / {citizen_contact.get('phone') or '—'}"
        )

        universities = result.get("universities") or []
        uni_by_id = {u["id"]: u for u in universities}
        selected_uni_for_notify = uni_by_id.get(st.session_state.get("selected_university_id"))
        st.write(f"**University to notify:** {selected_uni_for_notify['name'] if selected_uni_for_notify else '—'}")

        mentor_result = result.get("mentors") or {}
        mentor_by_id = {m["id"]: m for m in (mentor_result.get("mentors") or [])}
        selected_mentor_for_notify = mentor_by_id.get(st.session_state.get("selected_mentor_id"))
        st.write(f"**Mentor to notify:** {selected_mentor_for_notify['name'] if selected_mentor_for_notify else '—'}")

        partners = result.get("industry_partners") or []
        partner_options = ["(none)"] + [p["id"] for p in partners]
        partner_by_id = {p["id"]: p for p in partners}
        selected_partner_id = st.selectbox(
            "Industry/CSR partner to notify (optional):",
            options=partner_options,
            format_func=lambda pid: "(none)" if pid == "(none)" else partner_by_id[pid]["name"],
        )
        selected_partner_for_notify = partner_by_id.get(selected_partner_id)

        if st.button("📨 Send notifications now"):
            with st.spinner("Sending..."):
                statuses = notify_fanout(
                    result=result,
                    citizen_contact=citizen_contact,
                    selected_university=selected_uni_for_notify,
                    selected_mentor=selected_mentor_for_notify,
                    selected_industry_partner=selected_partner_for_notify,
                )
            if not statuses:
                st.info("Nothing to send — no citizen contact given and no recipients have contact info on file.")
            else:
                for s in statuses:
                    icon = "🟡" if s["dry_run"] else ("✅" if s["ok"] else "❌")
                    st.write(f"{icon} **{s['channel'].upper()}** → {s['to']}: {s['detail']}")
