"""
seed_open_problems.py

Adds verified, still-unassigned demo problems -- the ones a university or industry can volunteer for
and that the dashboards' "Best Match Problems" section ranks against an organization's people.

Each carries a domain/subdomain classification and required capabilities, shaped like what the AI
pipeline produces for a verified problem, and together they span the taxonomy so every seeded
organization has something it is genuinely well placed to solve (and some it is not).

Calls problem_storage directly, like seed_demo_data.py. Safe to re-run: problems are tagged with
SEED_MARKER in the title and skipped if already present.

Run with: python seed_open_problems.py
"""

import problem_storage
from problem_storage import ProblemBase, ProblemUpdate

SEED_MARKER = "[SIH26043 DEMO SEED]"

# (title, category, district, area, citizen, text, (domain, subdomain), required capabilities)
OPEN_PROBLEMS = [
    ("Recurring Flooding Along Mula River", "water", "Pune", "Sangvi", "Meena Joshi",
     "Every monsoon the streets near the Mula river banks flood because stormwater drains are blocked and undersized. Homes and shops are damaged each year.",
     ("Water Resources", "Flood Management"), ["Hydrological Mapping", "GIS & Data Analytics", "Stormwater Design"]),
    ("Contaminated Borewell Water", "water", "Thane", "Bhiwandi", "Salim Ansari",
     "Borewell water in several wards is discoloured and smells of chemicals. Families report stomach illness and there is no testing or treatment.",
     ("Water Resources", "Water Quality"), ["Water Quality Testing", "Water Treatment Design", "Data Analysis"]),
    ("Tribal Hamlet Without Electricity", "energy", "Palghar", "Mokhada", "Sunita Wagh",
     "A hamlet of sixty families has no grid connection. Children study by kerosene lamp and the health sub-centre cannot store vaccines.",
     ("Energy", "Renewable Energy"), ["Solar PV Design", "Energy Auditing", "Community Engagement"]),
    ("Tomato Crop Disease Outbreak", "agriculture", "Pune", "Junnar", "Ganesh Kale",
     "Farmers are losing tomato crops to a leaf disease they cannot identify in time. Advice from the agriculture office arrives after the damage is done.",
     ("Agriculture", "Crop Disease and Pest Management"), ["Computer Vision for Crop Disease", "Machine Learning", "Precision Agriculture"]),
    ("Health Centre Without a Doctor", "healthcare", "Palghar", "Jawhar", "Kavita Gaikwad",
     "The primary health centre has had no doctor for months. Patients travel over forty kilometres for basic consultations.",
     ("Healthcare", "Telemedicine and Health Technology"), ["Telemedicine Systems", "Public Health", "Mobile App Development"]),
    ("Waste Segregation Failing in Kalyan", "sanitation", "Thane", "Kalyan West", "Rohit Bhosale",
     "Households mix wet and dry waste and collection vehicles dump it together. Landfill overflows and residents burn waste in the open.",
     ("Sanitation", "Solid Waste Management"), ["Waste Management", "Environmental Impact Assessment", "Community Engagement", "Data Analysis"]),
    ("Groundwater Depleting in Baramati Villages", "water", "Pune", "Baramati", "Arun Pawar",
     "Wells dry up by February. Farmers keep drilling deeper and the water table has fallen sharply over ten years.",
     ("Water Resources", "Groundwater Management"), ["Hydrology", "GIS Mapping", "Remote Sensing", "Water Conservation Planning"]),
    ("Digital Learning Gap in Rural Schools", "education", "Pune", "Velhe", "Anita Deshmukh",
     "Village schools have donated computers but no trained staff, no content in Marathi and unreliable internet, so the devices sit unused.",
     ("Education", "Digital Learning"), ["Web Development", "Community Engagement", "Machine Learning"]),
    ("Women's Self Help Groups Cannot Reach Markets", "livelihood", "Pune", "Purandar", "Shobha Jadhav",
     "Self help groups make quality pickles and handicrafts but sell only locally, at low prices, with no way to reach buyers in the city.",
     ("Rural Livelihoods", "Self Help Groups"), ["Community Engagement", "Project Management", "Mobile App Development"]),
    ("Air Pollution From Brick Kilns", "environment", "Pune", "Shirur", "Prakash Mane",
     "Dozens of brick kilns burn waste fuel and the smoke settles over nearby villages. Children have persistent coughs and there is no air monitoring.",
     ("Environment", "Air Pollution"), ["IoT Sensor Networks", "Environmental Impact Assessment", "Data Visualization"]),
    ("Accidents at Katraj Ghat Junction", "infrastructure", "Pune", "Katraj", "Vijay Salunkhe",
     "The junction at the bottom of the ghat has repeated serious accidents involving heavy vehicles and two-wheelers. There is no traffic study.",
     ("Urban Infrastructure", "Traffic and Road Safety"), ["Computer Vision", "Transport Planning", "Data Analysis"]),
    ("Citizens Cannot Use the Grievance Portal", "governance", "Nashik", "Nashik Road", "Deepa Kulkarni",
     "The municipal grievance portal is hard to use on a phone, has no Marathi interface and complaints vanish without a status update.",
     ("Public Administration", "Citizen Grievance Management"), ["Web Development", "Mobile App Development", "Cybersecurity"]),
]


# The earlier milestone demo problems (seed_demo_data.py) were created without a classification, so
# text inference would guess their problem area from stray words ("unsafe for children" reads as
# child health). Give them the classification the AI pipeline would have produced.
LEGACY_CLASSIFICATIONS = {
    "Broken Public Toilet": ("Sanitation", "Toilet Access"),
    "Potholes on Main Road": ("Urban Infrastructure", "Roads and Streets"),
    "Park Maintenance Needed": ("Urban Infrastructure", "Public Infrastructure"),
    "Stray Animal Menace": ("Urban Infrastructure", "Public Infrastructure"),
    "Unsafe Pedestrian Crossing": ("Urban Infrastructure", "Traffic and Road Safety"),
    "Streetlight Outage": ("Urban Infrastructure", "Street Lighting"),
    "Waste Collection Delays": ("Sanitation", "Solid Waste Management"),
    "Overflowing Drainage": ("Sanitation", "Drainage and Waterlogging"),
    "Irregular Water Supply": ("Water Resources", "Water Supply Infrastructure"),
    "Waterlogging After Rain": ("Sanitation", "Drainage and Waterlogging"),
}


def classify_legacy_problems() -> int:
    updated = 0
    for problem in problem_storage.list_problems(limit=1000):
        if SEED_MARKER not in (problem.title or "") or (problem.classification or {}).get("domain"):
            continue
        base = problem.title.split(" - ")[0]
        if base in LEGACY_CLASSIFICATIONS:
            domain, subdomain = LEGACY_CLASSIFICATIONS[base]
            problem_storage.update_problem(problem.id, ProblemUpdate(
                classification={**(problem.classification or {}), "domain": domain, "subdomain": subdomain, "ai_status": "CONFIDENT"},
            ))
            updated += 1
    return updated


def main() -> None:
    problem_storage.initialize_storage()
    existing = {p.title for p in problem_storage.list_problems(limit=1000)}
    created = 0
    for title_base, category, district, area, citizen, text, (domain, subdomain), capabilities in OPEN_PROBLEMS:
        title = f"{title_base} - {area} {SEED_MARKER}"
        if title in existing:
            continue
        problem = problem_storage.create_problem(ProblemBase(
            problem_text=text, title=title, description=text, category=category, location=area,
            district=district, citizen_name=citizen, required_capabilities=capabilities,
        ))
        problem_storage.update_problem(problem.id, ProblemUpdate(
            status="verified",
            classification={"domain": domain, "subdomain": subdomain, "ai_status": "CONFIDENT"},
        ))
        created += 1
    print(f"Open demo problems: {created} created, {len(OPEN_PROBLEMS) - created} already present.")
    print(f"Legacy demo problems classified: {classify_legacy_problems()}.")


if __name__ == "__main__":
    main()
