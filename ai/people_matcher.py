"""
people_matcher.py

Matches a problem to the real people under each university and industry, and assembles the best
team from each organization.

Unlike university_matcher.py / mentor_matcher.py / industry_matcher.py, which score hand-maintained
JSON files, this reads the same Postgres database the web app uses (users, organization units,
skills and problem-area claims), so the cards a coordinator sees and the people the AI recommends
are one and the same set of records.

An organization is not scored by a single "expertise" tag. It is scored by how well the people under
it COLLECTIVELY cover what the problem needs: a problem needing hydrology, GIS and data science is
best served by the university whose people, together, have all three.

Steps: extract_requirements() turns the problem into "needs" (problem areas and skills),
rank_people() scores each person, build_team() greedily picks a small team that covers the needs,
and rank_organizations() ranks organizations by that team's coverage.
"""

import json
import math
import os
import re
from typing import Dict, Iterable, List, Optional, Tuple

TAXONOMY_PATH = os.path.join(os.path.dirname(__file__), "data", "taxonomy.json")
FRONTEND_ENV_PATH = os.path.join(os.path.dirname(__file__), "..", "frontend", ".env")

COVERED_STRENGTH = 0.6  # a need counts as covered by someone at proficiency >= 3 of 5
REQUIRED_WEIGHT = 1.5      # a need at or above this weight is required; lighter ones are helpful
REQUIRED_SHARE = 0.75      # how much of the coverage figure the required needs account for
TEAM_SIZE = 4
MIN_SUPPORT_RELEVANCE = 0.1  # a role-mix pick must be at least this relevant, or we would pad teams with strangers
MIN_INFERRED_SCORE = 3.0  # IDF-weighted: one distinctive word in a subdomain's name clears it, one common word does not

STOPWORDS = {
    "and", "the", "for", "with", "from", "that", "this", "are", "our", "not", "has", "have", "into",
    "over", "under", "around", "near", "all", "any", "poor", "lack", "issue", "problem", "problems",
    "area", "areas", "people", "very", "more", "many", "due", "also", "than", "there", "their",
}


class PeopleDataUnavailable(RuntimeError):
    """The people database could not be reached or read."""


# --------------------------------------------------------------------------------------- loading

# Query parameters Prisma understands but libpq does not; anything else in the URL is a real
# connection setting and must survive.
_PRISMA_ONLY_PARAMS = {"schema", "connection_limit", "pool_timeout", "pgbouncer", "connect_timeout",
                       "socket_timeout", "sslidentity", "sslpassword", "sslcert"}


def database_url() -> Optional[str]:
    """DATABASE_URL from the environment, else from the web app's .env, with Prisma-only options removed.

    Only Prisma's own parameters are stripped. Dropping the whole query string would also discard
    `sslmode` and `channel_binding`, and libpq defaults to sslmode=prefer -- which silently falls
    back to an unencrypted connection rather than failing. Against a hosted database that would send
    the password over the open internet in plaintext, so these have to be preserved.
    """
    url = os.environ.get("DATABASE_URL")
    if not url and os.path.exists(FRONTEND_ENV_PATH):
        with open(FRONTEND_ENV_PATH, "r", encoding="utf-8") as handle:
            found = re.search(r'^DATABASE_URL\s*=\s*"?([^"\r\n]+)"?', handle.read(), re.MULTILINE)
            url = found.group(1) if found else None
    if not url:
        return None
    base, separator, query = url.partition("?")
    if not separator:
        return base
    kept = [pair for pair in query.split("&")
            if pair and pair.split("=")[0].strip().lower() not in _PRISMA_ONLY_PARAMS]
    return base + ("?" + "&".join(kept) if kept else "")


_MEMBER_SELECTS = [
    # kind, org_type, table, org column, title, years, specialization, capacity, load, bio
    ("student", "university", "university_students", "university_id", "(m.course || ', year ' || m.year::text)", "NULL::int", "m.bio", "NULL::int", "NULL::int", "m.bio"),
    ("faculty", "university", "university_faculty", "university_id", "m.designation", "m.experience_years", "m.specialization", "NULL::int", "NULL::int", "m.bio"),
    ("mentor", "university", "university_mentors", "university_id", "m.designation", "m.experience_years", "m.specialization", "m.max_capacity", "m.current_load", "m.bio"),
    ("employee", "industry", "industry_employees", "industry_id", "m.designation", "m.experience_years", "NULL::text", "NULL::int", "NULL::int", "NULL::text"),
    ("mentor", "industry", "industry_mentors", "industry_id", "m.designation", "m.experience_years", "m.expertise", "m.max_capacity", "m.current_load", "m.bio"),
    ("expert", "industry", "industry_experts", "industry_id", "'Domain expert'", "m.experience_years", "m.expertise", "NULL::int", "NULL::int", "m.certifications"),
]

_PEOPLE_COLUMNS = (
    "SELECT p.kind, p.org_type, p.member_id, p.user_id, p.org_id, COALESCE(uo.name, io.company_name) AS org_name, "
    "p.unit_id, un.name AS unit_name, u.name, p.title, p.years, p.specialization, p.max_capacity, p.current_load, p.bio "
)

PEOPLE_SQL = _PEOPLE_COLUMNS + "FROM (" + " UNION ALL ".join(
    f"SELECT '{kind}' AS kind, '{org_type}' AS org_type, m.id AS member_id, m.user_id AS user_id, "
    f"m.{org_col} AS org_id, m.unit_id AS unit_id, {title} AS title, {years} AS years, "
    f"{spec} AS specialization, {cap} AS max_capacity, {load} AS current_load, {bio} AS bio FROM {table} m"
    for kind, org_type, table, org_col, title, years, spec, cap, load, bio in _MEMBER_SELECTS
) + """) p
JOIN users u ON u.id = p.user_id
LEFT JOIN universities uo ON p.org_type = 'university' AND uo.id = p.org_id
LEFT JOIN industries io ON p.org_type = 'industry' AND io.id = p.org_id
LEFT JOIN organization_units un ON un.id = p.unit_id
WHERE COALESCE(uo.verification_status::text, io.verification_status::text) = 'VERIFIED'
"""

def load_people(org_type: Optional[str] = None) -> List[Dict]:
    """Every person under a verified university/industry, with skills and problem-area claims."""
    url = database_url()
    if not url:
        raise PeopleDataUnavailable("DATABASE_URL is not set")
    try:
        import psycopg
        from psycopg.rows import dict_row

        with psycopg.connect(url, row_factory=dict_row, connect_timeout=5) as connection:
            query = PEOPLE_SQL
            params: Tuple = ()
            if org_type:
                query += " AND p.org_type = %s"
                params = (org_type,)
            people = [dict(row) for row in connection.execute(query, params).fetchall()]
            user_ids = [p["user_id"] for p in people]
            skills = connection.execute(
                "SELECT us.user_id, s.name, us.proficiency FROM user_skills us JOIN skills s ON s.id = us.skill_id "
                "WHERE us.user_id = ANY(%s)", (user_ids,),
            ).fetchall()
            claims = connection.execute(
                "SELECT c.user_id, d.name AS domain, sd.name AS subdomain, c.proficiency FROM member_domain_claims c "
                "JOIN domains d ON d.id = c.domain_id LEFT JOIN subdomains sd ON sd.id = c.subdomain_id "
                "WHERE c.user_id = ANY(%s)", (user_ids,),
            ).fetchall()
    except PeopleDataUnavailable:
        raise
    except Exception as error:  # driver missing, connection refused, schema not pushed yet
        raise PeopleDataUnavailable(str(error)) from error

    skills_by_user: Dict[str, List[Tuple[str, int]]] = {}
    for row in skills:
        skills_by_user.setdefault(row["user_id"], []).append((row["name"], row["proficiency"]))
    claims_by_user: Dict[str, List[Tuple[str, Optional[str], int]]] = {}
    for row in claims:
        claims_by_user.setdefault(row["user_id"], []).append((row["domain"], row["subdomain"], row["proficiency"]))
    for person in people:
        person["skills"] = skills_by_user.get(person["user_id"], [])
        person["domains"] = claims_by_user.get(person["user_id"], [])
    return people


def load_taxonomy() -> Dict:
    with open(TAXONOMY_PATH, "r", encoding="utf-8") as handle:
        return json.load(handle)


# ---------------------------------------------------------------------------------- requirements

def _stem(token: str) -> str:
    if len(token) > 3 and token.endswith("s"):
        token = token[:-1]
    return token[:5]


def _stems(text: str) -> set:
    """Word stems (plural dropped, first 5 letters), so 'hydrology'/'hydrological' and 'road'/'roads' agree."""
    return {_stem(t) for t in re.findall(r"[a-z]+", (text or "").lower()) if len(t) > 2 and t not in STOPWORDS}


def _subdomain_index(taxonomy: Dict) -> Tuple[List[Tuple[str, str, set, set]], Dict[str, float]]:
    """Every subdomain with its name stems and description stems, plus an IDF weight per stem.

    A stem that appears in many subdomains ("health", "water") tells little about which one a problem
    is about; a rare one ("drain") tells a lot. Weighting by rarity stops a passing word like "health
    hazard" from outranking the actual subject of a drainage problem.
    """
    rows = []
    document_frequency: Dict[str, int] = {}
    for domain, info in taxonomy.items():
        for subdomain, detail in info.get("subdomains", {}).items():
            name_stems = _stems(subdomain)
            detail_stems = _stems(" ".join([detail.get("description", ""), *detail.get("examples", [])])) - name_stems
            rows.append((domain, subdomain, name_stems, detail_stems))
            for stem in name_stems | detail_stems:
                document_frequency[stem] = document_frequency.get(stem, 0) + 1
    total = max(len(rows), 1)
    return rows, {stem: math.log(total / count) for stem, count in document_frequency.items()}


def _problem_text(problem: Dict) -> str:
    parts = [problem.get("title"), problem.get("problem_text"), problem.get("description")]
    return " ".join(part for part in parts if isinstance(part, str))


def extract_requirements(problem: Dict, taxonomy: Dict, skill_names: Iterable[str]) -> List[Dict]:
    """What the problem needs: problem areas (domain/subdomain) and skills, each with a weight.

    Uses the AI classification when the problem has one; otherwise infers problem areas from the
    text against the taxonomy. Skills come from the problem's required capabilities and from skill
    names mentioned in its text. Deterministic, so a recommendation can be explained and repeated.
    """
    text = _problem_text(problem)
    text_stems = _stems(text)
    needs: List[Dict] = []

    classification = problem.get("classification") or {}
    domain, subdomain = classification.get("domain"), classification.get("subdomain")
    if domain in taxonomy:
        sub = subdomain if subdomain in taxonomy[domain].get("subdomains", {}) else None
        needs.append({"kind": "domain", "label": sub or domain, "domain": domain, "subdomain": sub, "weight": 2.0, "source": "classification"})
    else:
        rows, idf = _subdomain_index(taxonomy)
        scored = []
        for dom, sub, name_stems, detail_stems in rows:
            name_hits = text_stems & name_stems
            if not name_hits:
                continue  # the text has to mention the subdomain itself, not just its neighbourhood
            score = 2 * sum(idf[s] for s in name_hits) + sum(idf[s] for s in text_stems & detail_stems)
            if score >= MIN_INFERRED_SCORE:
                scored.append((score, dom, sub))
        scored.sort(reverse=True)
        top = scored[0][0] if scored else 0
        for score, dom, sub in scored[:2]:
            if score >= 0.7 * top:
                needs.append({"kind": "domain", "label": sub, "domain": dom, "subdomain": sub, "weight": 1.5, "source": "text"})

    skill_list = sorted(set(skill_names))
    skill_stems = {name: _stems(name) for name in skill_list}
    skills_added = set()

    # A word shared by many skill names ("management", "planning", "design") says little about which skill
    # a capability means, so shared words count by rarity: a skill matches when the capability covers at
    # least half of that skill's distinctive vocabulary. Otherwise "Water Conservation Planning" would
    # pull in "Urban Planning" and "Waste Management" would pull in "Stormwater Management".
    frequency: Dict[str, int] = {}
    for stems in skill_stems.values():
        for stem in stems:
            frequency[stem] = frequency.get(stem, 0) + 1
    rarity = {stem: math.log((len(skill_list) + 1) / count) for stem, count in frequency.items()}

    for capability in problem.get("required_capabilities") or []:
        cap_stems = _stems(capability)
        # A capability can name several skills ("GIS & Data Analytics"), so take every clear match.
        for name, stems in skill_stems.items():
            if not cap_stems or not stems or name in skills_added:
                continue
            covered = sum(rarity[stem] for stem in cap_stems & stems) / sum(rarity[stem] for stem in stems)
            if covered >= 0.5:
                skills_added.add(name)
                needs.append({"kind": "skill", "label": name, "skill": name, "weight": 1.0, "source": "capability"})

    lowered = text.lower()
    for name in skill_list:
        if name not in skills_added and len(name) > 3 and name.lower() in lowered:
            skills_added.add(name)
            needs.append({"kind": "skill", "label": name, "skill": name, "weight": 1.0, "source": "text"})

    needs.sort(key=lambda n: n["weight"], reverse=True)
    return needs[:8]


# --------------------------------------------------------------------------------------- scoring

def requirement_of(need: Dict) -> str:
    """"required" or "helpful".

    The heavy needs -- the problem's own classification, and the problem areas read out of its text --
    are what it is actually about, so they are required. Individual skills are how the work gets done
    and there is usually more than one way, so they are helpful. An organization holding every
    required need should read as capable even when it lacks some of the optional extras.
    """
    return need.get("requirement") or ("required" if need.get("weight", 0) >= REQUIRED_WEIGHT else "helpful")


def split_coverage(needs: List[Dict], covered: Iterable[str]) -> Dict[str, float]:
    """Required and helpful coverage separately, plus the blended figure used for scoring.

    Reported apart so a card can say "every must-have, most of the nice-to-haves" instead of one
    number that hides which half is missing.
    """
    covered = set(covered)
    out = {}
    for group in ("required", "helpful"):
        members = [n for n in needs if requirement_of(n) == group]
        total = sum(n["weight"] for n in members)
        out[group] = (sum(n["weight"] for n in members if n["label"] in covered) / total) if total else 1.0
        out[f"has_{group}"] = bool(members)
    # With nothing of one kind, the other carries the whole figure rather than being diluted by a
    # default of 1.0 for a group the problem never had.
    if not out["has_required"]:
        blended = out["helpful"]
    elif not out["has_helpful"]:
        blended = out["required"]
    else:
        blended = REQUIRED_SHARE * out["required"] + (1 - REQUIRED_SHARE) * out["helpful"]
    return {"required_coverage": round(out["required"], 3), "helpful_coverage": round(out["helpful"], 3),
            "coverage": round(blended, 3)}


def _strength(person: Dict, need: Dict) -> float:
    """0-1: how strongly this person covers one need."""
    if need["kind"] == "domain":
        best = 0.0
        for domain, subdomain, proficiency in person.get("domains", []):
            if domain != need["domain"]:
                continue
            if need["subdomain"] is None or subdomain == need["subdomain"]:
                best = max(best, proficiency / 5)
            else:
                best = max(best, 0.5 * proficiency / 5)  # same problem area, different specialty
        return best
    best = 0.0
    for name, proficiency in person.get("skills", []):
        if name == need["skill"]:
            best = max(best, proficiency / 5)
    if best == 0.0 and person.get("specialization"):
        needed = _stems(need["skill"])
        if needed and len(_stems(person["specialization"]) & needed) / len(needed) >= 0.5:
            best = 0.4
    return best


def _availability_factor(person: Dict) -> float:
    capacity, load = person.get("max_capacity"), person.get("current_load")
    if not capacity:
        return 1.0
    remaining = max(0, capacity - (load or 0)) / capacity
    return 0.8 + 0.2 * remaining


def _match_level(score: float) -> str:
    return "HIGH" if score >= 0.70 else "MEDIUM" if score >= 0.50 else "LOW"


def rank_people(people: List[Dict], needs: List[Dict]) -> List[Dict]:
    """Individually scored people with at least some relevance, best first."""
    if not needs:
        return []
    total_weight = sum(n["weight"] for n in needs)
    ranked = []
    for person in people:
        strengths = [_strength(person, n) for n in needs]
        relevance = sum(n["weight"] * s for n, s in zip(needs, strengths)) / total_weight
        if relevance <= 0:
            continue
        score = round(relevance * _availability_factor(person), 3)
        reasons = []
        covers = [n["label"] for n, s in zip(needs, strengths) if s >= COVERED_STRENGTH]
        if covers:
            reasons.append(f"Covers: {', '.join(covers)}")
        partial = [n["label"] for n, s in zip(needs, strengths) if 0 < s < COVERED_STRENGTH]
        if partial:
            reasons.append(f"Related experience: {', '.join(partial)}")
        capacity, load = person.get("max_capacity"), person.get("current_load")
        if capacity and (load or 0) >= capacity:
            reasons.append("At full project capacity")
        elif capacity and (load or 0) <= capacity / 2:
            reasons.append("Good current availability")
        ranked.append({**_public_person(person), "score": score, "match_level": _match_level(score), "covers": covers, "reasons": reasons})
    ranked.sort(key=lambda r: r["score"], reverse=True)
    return ranked


def _public_person(person: Dict) -> Dict:
    return {
        "id": person["member_id"],
        "user_id": person["user_id"],
        "name": person["name"],
        "kind": person["kind"],
        "title": person.get("title"),
        "unit_name": person.get("unit_name"),
        "org_type": person["org_type"],
        "org_id": person["org_id"],
        "org_name": person["org_name"],
        "years": person.get("years"),
        "specialization": person.get("specialization"),
        "bio": person.get("bio"),
        "skills": [{"name": n, "proficiency": p} for n, p in sorted(person.get("skills", []), key=lambda s: -s[1])],
        "domains": [{"domain": d, "subdomain": s, "proficiency": p} for d, s, p in sorted(person.get("domains", []), key=lambda c: -c[2])],
        "max_capacity": person.get("max_capacity"),
        "current_load": person.get("current_load"),
    }


GUIDE_KINDS = {"mentor", "faculty", "expert"}


def _role_group(kind: str) -> str:
    """Guides advise and review (mentors, faculty, experts); contributors do the hands-on work."""
    return "guide" if kind in GUIDE_KINDS else "contributor"


def build_team(org_people: List[Dict], needs: List[Dict], size: int = TEAM_SIZE) -> Tuple[List[Dict], List[str], List[str]]:
    """Greedy cover, then a role mix.

    Repeatedly adds the person who covers the most still-uncovered weight, so each member lists only
    the needs they newly add ("brings"), not four people with the same skill. A team of only students
    or only mentors is not a plan, so if nobody of a role group (guide / contributor) made the team
    but someone of that group is relevant, the most relevant one joins as support ("supports").

    Returns (team, covered need labels, missing need labels), guides listed first.
    """
    remaining = list(needs)
    team: List[Dict] = []
    used = set()
    while remaining and len(team) < size:
        best, best_gain, best_new = None, 0.0, []
        for person in org_people:
            if person["member_id"] in used:
                continue
            new = [n for n in remaining if _strength(person, n) >= COVERED_STRENGTH]
            gain = sum(n["weight"] * _strength(person, n) for n in new) * _availability_factor(person)
            if gain > best_gain:
                best, best_gain, best_new = person, gain, new
        if best is None:
            break
        used.add(best["member_id"])
        team.append({**_public_person(best), "brings": [n["label"] for n in best_new], "supports": []})
        remaining = [n for n in remaining if n not in best_new]
    covered = [n["label"] for n in needs if n not in remaining]

    if team:
        relevance = {r["id"]: r["score"] for r in rank_people(org_people, needs)}
        for group in ("guide", "contributor"):
            if any(_role_group(m["kind"]) == group for m in team) or len(team) > size:
                continue
            candidates = [
                p for p in org_people
                if p["member_id"] not in used and _role_group(p["kind"]) == group and relevance.get(p["member_id"], 0) >= MIN_SUPPORT_RELEVANCE
            ]
            if candidates:
                pick = max(candidates, key=lambda p: relevance[p["member_id"]])
                used.add(pick["member_id"])
                supports = [n["label"] for n in needs if _strength(pick, n) >= COVERED_STRENGTH]
                team.append({**_public_person(pick), "brings": [], "supports": supports})

    for member in team:
        member["role_group"] = _role_group(member["kind"])
    team.sort(key=lambda m: m["role_group"] != "guide")
    return team, covered, [n["label"] for n in remaining]


def team_from_choice(members: List[Dict], needs: List[Dict], chosen: List[Dict]) -> Tuple[List[Dict], List[str], List[str]]:
    """Builds a team from an explicit selection (member id, optional role and reason, in order).

    Coverage is recomputed from the people actually chosen, never taken on trust from whoever chose
    them, so a team picked by a model reports exactly what it does and does not cover.
    """
    by_id = {m["member_id"]: m for m in members}
    remaining = list(needs)
    team: List[Dict] = []
    for pick in chosen:
        person = by_id[pick["id"]]
        newly = [n for n in remaining if _strength(person, n) >= COVERED_STRENGTH]
        backs_up = [n["label"] for n in needs if n not in newly and _strength(person, n) >= COVERED_STRENGTH]
        team.append({
            **_public_person(person),
            "brings": [n["label"] for n in newly],
            "supports": backs_up,
            "role_group": _role_group(person["kind"]),
            "role_in_team": pick.get("role"),
            "reason": pick.get("reason"),
        })
        remaining = [n for n in remaining if n not in newly]
    team.sort(key=lambda m: m["role_group"] != "guide")
    return team, [n["label"] for n in needs if n not in remaining], [n["label"] for n in remaining]


def score_organization(members: List[Dict], needs: List[Dict], org_type: str, chosen: Optional[List[Dict]] = None) -> Optional[Dict]:
    """How well one organization's people, as a team, cover the needs. None if nobody is relevant.

    `chosen` (member ids with roles and reasons) replaces the greedy team, e.g. one picked by a model.
    """
    if not needs or not members:
        return None
    team, covered, missing = team_from_choice(members, needs, chosen) if chosen else build_team(members, needs)
    if not team:
        return None
    split = split_coverage(needs, covered)
    coverage = split["coverage"]
    individual = rank_people(members, needs)
    score = _score_from(coverage, individual)

    reasons = [f"Team covers {len(covered)} of {len(needs)} needs: {', '.join(covered)}" if covered else "No need fully covered"]
    missing_required = [n["label"] for n in needs if n["label"] in missing and requirement_of(n) == "required"]
    if missing_required:
        reasons.append(f"Missing must-haves: {', '.join(missing_required)}")
    elif missing:
        reasons.append(f"Has every must-have; missing optional: {', '.join(missing)}")
    reasons.append(f"{len(individual)} of {len(members)} people have relevant experience")
    return {
        "org_id": members[0]["org_id"],
        "org_type": org_type,
        "name": members[0]["org_name"],
        "score": score,
        "match_level": _match_level(score),
        "coverage": coverage,
        "required_coverage": split["required_coverage"],
        "helpful_coverage": split["helpful_coverage"],
        "covered": covered,
        "missing": missing,
        "missing_required": [n["label"] for n in needs if n["label"] in missing and requirement_of(n) == "required"],
        "team": team,
        "relevant_people": len(individual),
        "total_people": len(members),
        "reasons": reasons,
    }


def group_by_org(people: List[Dict], org_type: str) -> Dict[str, List[Dict]]:
    grouped: Dict[str, List[Dict]] = {}
    for person in people:
        if person["org_type"] == org_type:
            grouped.setdefault(person["org_id"], []).append(person)
    return grouped


def rank_organizations(people: List[Dict], needs: List[Dict], org_type: str, top_k: int = 3) -> List[Dict]:
    """Organizations ranked by how well their people together cover the needs."""
    by_org = group_by_org(people, org_type)
    results = [r for r in (score_organization(members, needs, org_type) for members in by_org.values()) if r]
    results.sort(key=lambda r: r["score"], reverse=True)
    return results[:top_k]


# ------------------------------------------------------------------------------- complementarity

COMPLEMENT_TEAM_SIZE = 6       # a joint team is larger than one organization's, but still not a crowd
MIN_COMPLEMENT_UPLIFT = 0.10   # a partnership has to beat the better side alone by this much in coverage
MAX_PARTNER_CANDIDATES = 8     # organizations considered for pairing, best first; pairs grow as the square


def covered_by(members: List[Dict], needs: List[Dict]) -> set:
    """Every need anyone in this group covers, ignoring team size.

    Deliberately not the team's coverage: for judging whether two organizations complement each
    other, what matters is what each side *can* cover, not who happened to make a team of four.
    """
    return {n["label"] for n in needs if any(_strength(person, n) >= COVERED_STRENGTH for person in members)}


def build_joint_team(groups: List[List[Dict]], needs: List[Dict], size: int = COMPLEMENT_TEAM_SIZE) -> Tuple[List[Dict], List[str], List[str]]:
    """The same greedy marginal-gain cover as build_team, run over several organizations' people at once.

    Each member still lists only the needs nobody before them covered, so a joint team shows exactly
    what the second organization added. Greedy can fill every slot from the stronger side, so any
    organization with nobody on the team contributes its most relevant person as support: a
    partnership that nobody from one side joins is not a partnership.
    """
    pooled = [person for group in groups for person in group]
    remaining = list(needs)
    team: List[Dict] = []
    used = set()
    while remaining and len(team) < size:
        best, best_gain, best_new = None, 0.0, []
        for person in pooled:
            if person["member_id"] in used:
                continue
            new = [n for n in remaining if _strength(person, n) >= COVERED_STRENGTH]
            gain = sum(n["weight"] * _strength(person, n) for n in new) * _availability_factor(person)
            if gain > best_gain:
                best, best_gain, best_new = person, gain, new
        if best is None:
            break
        used.add(best["member_id"])
        team.append({**_public_person(best), "brings": [n["label"] for n in best_new], "supports": []})
        remaining = [n for n in remaining if n not in best_new]

    for group in groups:
        if not group or any(member["org_id"] == group[0]["org_id"] for member in team):
            continue
        relevance = {r["id"]: r["score"] for r in rank_people(group, needs)}
        candidates = [p for p in group if p["member_id"] not in used and relevance.get(p["member_id"], 0) >= MIN_SUPPORT_RELEVANCE]
        if candidates:
            pick = max(candidates, key=lambda p: relevance[p["member_id"]])
            used.add(pick["member_id"])
            team.append({
                **_public_person(pick),
                "brings": [],
                "supports": [n["label"] for n in needs if _strength(pick, n) >= COVERED_STRENGTH],
            })

    for member in team:
        member["role_group"] = _role_group(member["kind"])
    team.sort(key=lambda m: m["role_group"] != "guide")
    return team, [n["label"] for n in needs if n not in remaining], [n["label"] for n in remaining]


def _score_from(coverage: float, individual: List[Dict]) -> float:
    """The organization score formula, shared so a partnership is measured on the same scale as one org."""
    team_relevance = sum(m["score"] for m in individual[:TEAM_SIZE]) / TEAM_SIZE
    depth = min(1.0, len(individual) / 4)
    return round(min(1.0, 0.65 * coverage + 0.25 * min(1.0, team_relevance * 2) + 0.10 * depth), 3)


def pair_organizations(people: List[Dict], needs: List[Dict], top_k: int = 3) -> List[Dict]:
    """Pairs of organizations that together cover what neither covers alone, best first.

    A pair is only proposed when each side covers at least one need the other cannot: that is what
    makes it a partnership rather than a strong organization with a passenger. Pairs adding less than
    MIN_COMPLEMENT_UPLIFT of coverage over the better side alone are dropped, because bringing in a
    second organization has a real coordination cost and should have to earn it.

    Cross-type pairs (a university with an industry) are not privileged by the scoring; they simply
    tend to win, because research capability and deployment capability sit in different places.
    """
    if not needs or not people:
        return []
    groups: Dict[Tuple[str, str], List[Dict]] = {}
    for person in people:
        groups.setdefault((person["org_type"], person["org_id"]), []).append(person)

    total_weight = sum(n["weight"] for n in needs)
    solo = []
    for (org_type, org_id), members in groups.items():
        covers = covered_by(members, needs)
        if not covers:
            continue
        solo.append({
            "members": members,
            "covers": covers,
            "coverage": sum(n["weight"] for n in needs if n["label"] in covers) / total_weight,
            "name": members[0]["org_name"],
            "org_type": org_type,
            "org_id": org_id,
        })
    solo.sort(key=lambda entry: entry["coverage"], reverse=True)
    solo = solo[:MAX_PARTNER_CANDIDATES]

    partnerships = []
    for index, first in enumerate(solo):
        for second in solo[index + 1:]:
            first_only = first["covers"] - second["covers"]
            second_only = second["covers"] - first["covers"]
            if not first_only or not second_only:
                continue  # one side adds nothing the other lacks: not complementary
            best_alone = max(first["coverage"], second["coverage"])
            reachable = sum(n["weight"] for n in needs if n["label"] in first["covers"] | second["covers"]) / total_weight
            if reachable - best_alone < MIN_COMPLEMENT_UPLIFT:
                continue
            team, covered, missing = build_joint_team([first["members"], second["members"]], needs)
            if not team:
                continue
            members = first["members"] + second["members"]
            split = split_coverage(needs, covered)
            coverage = split["coverage"]
            individual = rank_people(members, needs)
            partnerships.append({
                "organizations": [
                    {"org_id": entry["org_id"], "org_type": entry["org_type"], "name": entry["name"],
                     "coverage_alone": round(entry["coverage"], 3), "brings": sorted(only)}
                    for entry, only in ((first, first_only), (second, second_only))
                ],
                "score": _score_from(coverage, individual),
                "coverage": coverage,
                "required_coverage": split["required_coverage"],
                "helpful_coverage": split["helpful_coverage"],
                "reachable_coverage": round(reachable, 3),
                "uplift": round(reachable - best_alone, 3),
                "best_alone": round(best_alone, 3),
                "covered": covered,
                "missing": missing,
                "team": team,
                "cross_type": first["org_type"] != second["org_type"],
                "reasons": [
                    "{} brings {}".format(first["name"], ", ".join(sorted(first_only))),
                    "{} brings {}".format(second["name"], ", ".join(sorted(second_only))),
                    "Together they reach {}% of what the problem needs, against {}% for the stronger of the two alone".format(
                        round(reachable * 100), round(best_alone * 100)
                    ),
                ],
            })
    partnerships.sort(key=lambda entry: (entry["score"], entry["uplift"]), reverse=True)
    return partnerships[:top_k]


def rank_problems_for_organization(
    problems: List[Dict], members: List[Dict], org_type: str, taxonomy: Dict, top_k: int = 5, skill_names: Optional[Iterable[str]] = None,
    resolve_needs=None,
) -> List[Dict]:
    """The problems one organization is best placed to take on, each with the team it would field.

    `members` are that organization's people only. `skill_names` is the skill catalogue problems are
    read against and should cover EVERYONE's skills: taken from the members alone, a skill nobody in
    the organization has could never show up as a gap, and coverage would read as 100% by omission.
    Problems whose needs nobody there can meet at all are left out rather than shown with a 0% score.
    """
    if skill_names is None:
        skill_names = {name for person in members for name, _ in person.get("skills", [])}
    resolve = resolve_needs or extract_requirements
    results = []
    for problem in problems:
        needs = resolve(problem, taxonomy, skill_names)
        match = score_organization(members, needs, org_type)
        if match:
            results.append({"problem": problem, "needs": needs, "match": match})
    results.sort(key=lambda r: r["match"]["score"], reverse=True)
    return results[:top_k]


def match_problem(problem: Dict, people: List[Dict], taxonomy: Dict, top_k: int = 3, resolve_needs=None) -> Dict:
    """Everything the UI needs for one problem: its needs, ranked universities and industries, top individuals."""
    skill_names = {name for person in people for name, _ in person.get("skills", [])}
    needs = (resolve_needs or extract_requirements)(problem, taxonomy, skill_names)
    return {
        "needs": needs,
        "universities": rank_organizations(people, needs, "university", top_k),
        "industries": rank_organizations(people, needs, "industry", top_k),
        "people": rank_people(people, needs)[:10],
    }
