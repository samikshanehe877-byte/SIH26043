# Project Progress Tracking — Data Schema (for backend/web team)

This is **not** an AI feature — no matching, scoring, or Gemini calls involved.
It's a plain CRUD/workflow feature. This doc defines the fields the tracker
needs so it lines up cleanly with what the AI module already produces
(`universities`, `mentors`, `industry_partners` from `ai_pipeline.analyze_problem()`).

The AI module does not read or write any of this — it only supplies the
`university_id`, `mentor_id`, and `partner_id` values below at the point a
citizen's problem is triaged and assigned.

## 1. `projects` table

One row per problem that has been accepted and assigned for solving.

| Field                | Type          | Notes                                                                 |
|----------------------|---------------|------------------------------------------------------------------------|
| `project_id`         | string (PK)   | e.g. `proj_00001`                                                     |
| `problem_id`         | string (FK)   | links back to the original citizen submission                         |
| `title`              | string        | from `summary.title` (AI-generated) or manually edited                |
| `domain` / `subdomain` | string      | from `classification`                                                 |
| `university_id`      | string (FK)   | which HEI it's assigned to (from `universities[0].id`, or reassigned) |
| `mentor_id`          | string (FK)   | faculty mentor (from `mentors.mentors[0].id`, or reassigned)          |
| `industry_partner_id`| string (FK), nullable | if an industry/CSR partner is involved                       |
| `status`             | enum          | see status list below                                                 |
| `assigned_at`        | datetime      | when university+mentor assignment was confirmed                       |
| `expected_completion`| date, nullable| target date set by university                                        |
| `actual_completion`  | date, nullable|                                                                        |
| `created_at` / `updated_at` | datetime |                                                                    |

**Status enum:**
`SUBMITTED` → `UNDER_REVIEW` → `ASSIGNED` → `TEAM_FORMED` → `IN_PROGRESS` → `TESTING` → `COMPLETED` → `DEPLOYED`
(plus `REJECTED`, `ON_HOLD` as exits from any state)

## 2. `project_team_members` table

| Field         | Type        | Notes                                  |
|---------------|-------------|------------------------------------------|
| `id`          | string (PK) |                                          |
| `project_id`  | string (FK) |                                          |
| `name`        | string      | student or faculty name                 |
| `role`        | enum        | `STUDENT`, `FACULTY_MENTOR`, `INDUSTRY_MENTOR` |
| `email`       | string      |                                          |
| `joined_at`   | datetime    |                                          |

## 3. `project_milestones` table

Drives the actual "progress" percentage shown in dashboards.

| Field           | Type          | Notes                                                    |
|-----------------|---------------|-----------------------------------------------------------|
| `milestone_id`  | string (PK)   |                                                             |
| `project_id`    | string (FK)   |                                                             |
| `title`         | string        | e.g. "Requirements finalized", "Prototype v1"              |
| `sequence`      | int           | ordering                                                    |
| `status`        | enum          | `PENDING`, `IN_PROGRESS`, `DONE`, `BLOCKED`                 |
| `due_date`      | date, nullable|                                                             |
| `completed_at`  | datetime, nullable |                                                       |
| `weight`        | float, default 1.0 | for weighted % completion if milestones aren't equal  |

**Suggested default milestone template** (can be customized per project):
`Problem Understanding` → `Solution Design` → `Prototype` → `Pilot Testing` → `Refinement` → `Deployment/Handover`

Overall `progress_percent` for a project = `sum(weight of DONE milestones) / sum(all weights)`.
This is arithmetic the backend can compute on read — no need to store it
redundantly, though a cached column is fine for dashboard query performance.

## 4. `project_updates` table

Free-text status updates / logs, separate from milestones (for narrative
progress notes, blockers, mentor comments).

| Field         | Type        | Notes                                    |
|---------------|-------------|---------------------------------------------|
| `update_id`   | string (PK) |                                              |
| `project_id`  | string (FK) |                                              |
| `posted_by`   | string      | name or user_id                             |
| `posted_by_role` | enum     | `STUDENT`, `MENTOR`, `INDUSTRY`, `ADMIN`    |
| `message`     | text        |                                              |
| `attachment_url` | string, nullable |                                       |
| `created_at`  | datetime    |                                              |

## 5. Dashboard aggregation fields (derived, not stored per-project)

For the government-facing analytics dashboard mentioned in the SIH problem
statement, these are just `GROUP BY` queries over the tables above — no new
schema needed:
- Challenges received / assigned / in-progress / completed, by domain and district
- University-wise and mentor-wise active project counts (this is exactly
  `current_load` in `mentors.json` — **the web team's `project_team_members`
  + `projects` tables should become the real source of truth for mentor
  load once this ships**, replacing the static demo numbers in
  `data/mentors.json`)
- Industry engagement counts by partner
- Average time-to-completion by domain

## Integration note on mentor load

Right now `mentor_matcher.py` reads `current_load` / `max_capacity` from the
static demo file `data/mentors.json`. Once the tracker above is live, that
should instead be a live query:

```sql
SELECT mentor_id, COUNT(*) AS current_load
FROM projects
WHERE mentor_id = ? AND status NOT IN ('COMPLETED', 'DEPLOYED', 'REJECTED')
GROUP BY mentor_id;
```

The AI module's contract doesn't need to change for this — whoever wires
the backend just needs to pass real `(current_load, max_capacity)` pairs
into a mentors table/endpoint that `mentor_matcher.py` reads from instead
of the JSON file. The matching/scoring logic itself is unaffected.
