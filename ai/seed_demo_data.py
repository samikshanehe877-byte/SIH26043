"""
seed_demo_data.py

Populates realistic, staggered demo data for the milestone points ledger: verified problems with
accepted volunteers/collaborators, team rosters, and milestones at every stage from "just
submitted" to "fully verified through impact" -- so the leaderboard, badges, and certificates all
have real, varied data to show immediately, instead of an empty state.

Calls problem_storage / project_storage / points_storage functions directly, the same way
ai/test_project_workspace.py's fixtures already build test data -- not over HTTP, and so bypassing
the heavier AI classification/duplicate-detection pipeline create_problem_endpoint would otherwise
run, which a seed script has no need for.

It deliberately reuses the SAME organisation names frontend/prisma/seed.ts already creates in
Postgres ("ABC Institute of Technology", "XYZ University of Engineering", "TechSolutions Pvt Ltd",
"GreenEnergy Corp") -- organisation identity in this app is just a name string shared between the
two databases, so a signed-in coordinator/faculty/employee immediately sees real points for their
real organisation with no further wiring.

Three "team members" below use the real Postgres user ids of the three demo accounts
frontend/prisma/seed.ts creates with actual login credentials (see mockprofiles.md): Priya Patel
the student, Dr. Priya Coordinator the faculty member, and Amit Kumar the industry employee.
Signing in as any of them during a demo shows real, personal points, badges and certificates.
Every other "team member" is a synthetic id with no login of its own, only there so team rosters
and the individual leaderboard look like a populated platform rather than a 3-person pilot.

NOTE: the three real user ids below were read from Postgres via GET /api/auth/me while signed in
as each account. If that database is ever wiped and reseeded, Prisma generates new ids and these
three constants must be refreshed the same way.

Run with: python seed_demo_data.py
Safe to re-run: each problem is tagged with SEED_MARKER in its title and skipped if already present.
"""

import problem_storage
import project_storage
import points_storage
from problem_storage import ProblemBase, ProblemUpdate

SEED_MARKER = "[SIH26043 DEMO SEED]"

UNIVERSITIES = ["ABC Institute of Technology", "XYZ University of Engineering"]
INDUSTRIES = ["TechSolutions Pvt Ltd", "GreenEnergy Corp"]

OFFICER_ID = "cmu44ir9o000l12qkqeoa8sks"
OFFICER_NAME = "Officer Rajesh Patil"

REAL_STUDENT = {
    "user_id": "cmu44ir8s000d12qk42q47nrx", "name": "Priya Patel",
    "org_type": "university", "org_name": UNIVERSITIES[0], "role": "student",
}
REAL_FACULTY = {
    "user_id": "cmu44ir9x000n12qklk34u1lc", "name": "Dr. Priya Coordinator",
    "org_type": "university", "org_name": UNIVERSITIES[0], "role": "faculty",
}
REAL_EMPLOYEE = {
    "user_id": "cmu44ir9c000h12qk89z14w27", "name": "Amit Kumar",
    "org_type": "industry", "org_name": INDUSTRIES[0], "role": "employee",
}


def synthetic_member(tag: str, org_type: str, org_name: str, role: str, name: str) -> dict:
    return {"user_id": f"demo-{tag}", "name": name, "org_type": org_type, "org_name": org_name, "role": role}


SYNTHETIC_UNIV1 = [
    synthetic_member("univ1-1", "university", UNIVERSITIES[0], "student", "Rohan Deshmukh"),
    synthetic_member("univ1-2", "university", UNIVERSITIES[0], "student", "Ananya Joshi"),
]
SYNTHETIC_UNIV2 = [
    synthetic_member("univ2-1", "university", UNIVERSITIES[1], "student", "Kabir Mehta"),
    synthetic_member("univ2-2", "university", UNIVERSITIES[1], "faculty", "Dr. Neha Kulkarni"),
]
SYNTHETIC_IND1 = [synthetic_member("ind1-1", "industry", INDUSTRIES[0], "employee", "Vikram Nair")]
SYNTHETIC_IND2 = [
    synthetic_member("ind2-1", "industry", INDUSTRIES[1], "employee", "Sneha Rao"),
    synthetic_member("ind2-2", "industry", INDUSTRIES[1], "employee", "Arjun Iyer"),
]

CITIZENS = [
    ("Meera Iyer", "Pune", "Shivaji Nagar"), ("Rahul Sharma", "Pune", "Khadakwasla"),
    ("Anita Desai", "Mumbai", "Andheri East"), ("Suresh Patil", "Pune", "Hadapsar"),
    ("Kavita Joshi", "Mumbai", "Bandra"), ("Ramesh Gupta", "Pune", "Kothrud"),
    ("Pooja Nair", "Mumbai", "Dadar"), ("Vikas Kulkarni", "Pune", "Baner"),
    ("Sanjay Verma", "Mumbai", "Kurla"), ("Divya Menon", "Pune", "Wakad"),
]

PROBLEM_TEMPLATES = [
    ("Streetlight Outage", "streetlight", "Streetlights have been out for weeks, unsafe at night."),
    ("Waterlogging After Rain", "waterlogging", "Roads flood after every heavy rain, blocking traffic."),
    ("Waste Collection Delays", "waste", "Garbage isn't collected on schedule, piling up in the area."),
    ("Broken Public Toilet", "sanitation", "The public toilet facility has been broken for months."),
    ("Potholes on Main Road", "roads", "Large potholes are damaging vehicles and causing accidents."),
    ("Irregular Water Supply", "water", "Water supply is unpredictable, some days none at all."),
    ("Unsafe Pedestrian Crossing", "safety", "No signal or zebra crossing at a busy junction."),
    ("Stray Animal Menace", "safety", "Stray dogs are becoming aggressive, residents are worried."),
    ("Overflowing Drainage", "sanitation", "Drainage overflows regularly, causing a health hazard."),
    ("Park Maintenance Needed", "infrastructure", "The local park is overgrown and unsafe for children."),
]

# One entry per project: who leads, an optional collaborator, which team members join, how far
# through the milestone sequence to verify, and any milestones left pending for the officer queue.
PROJECT_PLANS = [
    {  # 0: barely started -- sits in the officer's pending queue, nothing verified yet.
        "lead": ("university", UNIVERSITIES[0]), "collaborator": None,
        "members": [REAL_FACULTY, *SYNTHETIC_UNIV1],
        "verified_through": None, "pending": ["project_accepted"],
    },
    {  # 1: the flagship demo project -- all three real accounts, well into the sequence, so
        # signing in as any of them shows real progress.
        "lead": ("university", UNIVERSITIES[0]), "collaborator": ("industry", INDUSTRIES[0]),
        "members": [REAL_STUDENT, REAL_FACULTY, REAL_EMPLOYEE, *SYNTHETIC_UNIV1],
        "verified_through": "prototype_completed", "pending": ["testing_completed"],
    },
    {  # 2: industry-led, mid-way.
        "lead": ("industry", INDUSTRIES[0]), "collaborator": None,
        "members": [REAL_EMPLOYEE, *SYNTHETIC_IND1],
        "verified_through": "testing_completed", "pending": [],
    },
    {  # 3: the second university, further along.
        "lead": ("university", UNIVERSITIES[1]), "collaborator": None,
        "members": SYNTHETIC_UNIV2,
        "verified_through": "government_validation", "pending": [],
    },
    {  # 4: fully verified through impact -- the "Project Champion" showcase.
        "lead": ("industry", INDUSTRIES[1]), "collaborator": ("university", UNIVERSITIES[1]),
        "members": [*SYNTHETIC_IND2, *SYNTHETIC_UNIV2],
        "verified_through": "impact_demonstrated", "pending": [],
    },
    {  # 5: a rejected-then-resubmitted milestone, to show that flow exists.
        "lead": ("university", UNIVERSITIES[0]), "collaborator": None,
        "members": SYNTHETIC_UNIV1,
        "verified_through": None, "rejected_first": True, "pending": ["project_accepted"],
    },
    {  # 6: minimal -- accepted and barely planned, no team beyond whoever submitted.
        "lead": ("industry", INDUSTRIES[0]), "collaborator": None,
        "members": [], "verified_through": "initial_planning", "pending": [],
    },
    {  # 7: a second cross-org collaboration, implemented but not yet impact-verified.
        "lead": ("university", UNIVERSITIES[1]), "collaborator": ("industry", INDUSTRIES[1]),
        "members": [*SYNTHETIC_UNIV2, *SYNTHETIC_IND2],
        "verified_through": "implementation", "pending": [],
    },
]

# Two more verified-but-unassigned problems (10 total), purely for citizen-side variety -- a real
# "waiting for a volunteer" problem has no project or points, and neither do these.
EXTRA_UNASSIGNED_PROBLEMS = 2


def _problem_title(index: int) -> str:
    title_base, _category, _text = PROBLEM_TEMPLATES[index % len(PROBLEM_TEMPLATES)]
    _citizen_name, _district, area = CITIZENS[index % len(CITIZENS)]
    return f"{title_base} - {area} {SEED_MARKER}"


def _problem_exists(title: str) -> bool:
    return any(p.title == title for p in problem_storage.list_problems(limit=500))


def _create_and_verify_problem(index: int) -> problem_storage.ProblemInDB:
    title_base, category, text = PROBLEM_TEMPLATES[index % len(PROBLEM_TEMPLATES)]
    citizen_name, district, area = CITIZENS[index % len(CITIZENS)]
    problem = problem_storage.create_problem(ProblemBase(
        problem_text=text, title=_problem_title(index), description=text, category=category,
        location=area, district=district, citizen_name=citizen_name,
    ))
    return problem_storage.update_problem(problem.id, ProblemUpdate(status="verified"))


def _accept_volunteer(problem, org_type: str, org_name: str) -> None:
    problem_storage.add_volunteer(problem.id, org_type, org_name, "We'd like to help with this.")
    problem_storage.select_volunteer(problem.id, org_type, org_name)


def _add_collaborator(problem, lead_type: str, lead_name: str, other_type: str, other_name: str) -> None:
    request = problem_storage.create_collaboration_request(problem_storage.CollaborationRequestRecord(
        requested_by=lead_type,
        university_name=lead_name if lead_type == "university" else other_name,
        industry_name=lead_name if lead_type == "industry" else other_name,
        problem_id=problem.id, challenge_title=problem.title or problem.problem_text,
        support_types=["Technical Expertise"], progress_summary="Good progress so far.",
    ))
    problem_storage.transition_collaboration_request(request.id, other_type, other_name, "accept")


def _run_milestones(problem, plan: dict) -> None:
    sequence = points_storage.MILESTONE_SEQUENCE
    lead_type, lead_name = plan["lead"]
    collaborator = plan.get("collaborator")

    for member in plan["members"]:
        is_lead_org = member["org_type"] == lead_type and member["org_name"] == lead_name
        is_collaborator_org = collaborator and (member["org_type"], member["org_name"]) == collaborator
        if is_lead_org or is_collaborator_org:
            points_storage.join_project(
                problem.id, member["user_id"], member["name"], member["org_type"], member["org_name"],
                role=member["role"],
            )

    # Whoever submits is auto-credited as a team member (see points_storage.submit_milestone), so
    # a project with no explicit members still gets a real submitter -- the lead org's own name,
    # tagged so it's obviously not a real login.
    submitter = plan["members"][0] if plan["members"] else {
        "user_id": f"demo-{lead_type}-lead-{problem.id[:8]}", "name": f"{lead_name} Project Lead",
    }

    if plan.get("rejected_first"):
        milestone = points_storage.submit_milestone(
            problem.id, sequence[0], submitter["user_id"], submitter["name"], lead_type, lead_name,
            note="First attempt.",
        )
        points_storage.verify_milestone(milestone.id, "reject", "Needs more detail before approval.", OFFICER_ID, OFFICER_NAME)

    verified_through = plan.get("verified_through")
    verified_count = sequence.index(verified_through) + 1 if verified_through else 0
    for milestone_type in sequence[:verified_count]:
        milestone = points_storage.submit_milestone(
            problem.id, milestone_type, submitter["user_id"], submitter["name"], lead_type, lead_name,
            note=f"Evidence for {milestone_type.replace('_', ' ')}.",
        )
        points_storage.verify_milestone(milestone.id, "approve", "Verified on site.", OFFICER_ID, OFFICER_NAME)

    for milestone_type in plan.get("pending", []):
        points_storage.submit_milestone(
            problem.id, milestone_type, submitter["user_id"], submitter["name"], lead_type, lead_name,
            note=f"Evidence for {milestone_type.replace('_', ' ')}.",
        )


def main() -> None:
    print("Seeding demo problems, projects and milestones...")
    created = 0

    for index, plan in enumerate(PROJECT_PLANS):
        title = _problem_title(index)
        if _problem_exists(title):
            print(f"  [{index}] already seeded, skipping: {title}")
            continue
        problem = _create_and_verify_problem(index)
        lead_type, lead_name = plan["lead"]
        _accept_volunteer(problem, lead_type, lead_name)
        if plan.get("collaborator"):
            other_type, other_name = plan["collaborator"]
            _add_collaborator(problem, lead_type, lead_name, other_type, other_name)
        _run_milestones(problem, plan)
        created += 1
        print(f"  [{index}] seeded: {problem.title}")

    for index in range(len(PROJECT_PLANS), len(PROJECT_PLANS) + EXTRA_UNASSIGNED_PROBLEMS):
        title = _problem_title(index)
        if _problem_exists(title):
            print(f"  [{index}] already seeded, skipping: {title}")
            continue
        _create_and_verify_problem(index)
        created += 1
        print(f"  [{index}] seeded (unassigned, no project): {title}")

    print(f"Done. {created} new problem(s) created this run.")


if __name__ == "__main__":
    main()
