# SIH26043 Database Setup

## Prerequisites
- PostgreSQL 14+
- Node.js 18+
- npm/yarn/pnpm

## Database Setup

1. **Create PostgreSQL database:**
```sql
CREATE DATABASE sih26043;
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL
```

3. **Generate Prisma client:**
```bash
npm run db:generate
```

4. **Push schema to database:**
```bash
npm run db:push
```

5. **Seed database (optional):**
```bash
npm run db:seed
```

6. **Open Prisma Studio:**
```bash
npm run db:studio
```

## API Routes

| Entity | Routes |
|--------|--------|
| Users | `GET/POST /api/users`, `GET/PUT/DELETE /api/users/[id]`, `GET/POST /api/users/[userId]/skills` |
| Universities | `GET/POST /api/universities`, `GET/PUT/DELETE /api/universities/[id]` |
| Industries | `GET/POST /api/industries`, `GET/PUT/DELETE /api/industries/[id]` |
| Governments | `GET/POST /api/governments`, `GET/PUT/DELETE /api/governments/[id]` |
| Problems | `GET/POST /api/problems`, `GET/PUT/DELETE /api/problems/[id]` |
| Projects | `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/[id]`, `GET/POST /api/projects/[id]/members` |
| Matches | `GET/POST /api/matches`, `GET/PUT/DELETE /api/matches/[id]` |
| Skills | `GET/POST /api/skills` |
| Evidence | `GET/POST /api/evidence` |
| Verification | `GET/POST /api/verification` |
| Collaborations | `GET/POST /api/collaborations` |

## Database Schema Overview

### Core Entities
- **User** - Base identity with roles (CITIZEN, STUDENT, FACULTY, MENTOR, INDUSTRY_EMPLOYEE, INDUSTRY_EXPERT, GOVERNMENT_OFFICER, ADMIN)
- **Region** - Geographic regions (district, state, country)

### Organization Entities
- **University** - Educational institutions with verification
- **Industry** - Companies with industry type classification
- **Government** - Government departments

### People Entities (linked to Users + Organizations)
- **UniversityStudent** - Student profiles with course, year, CGPA
- **UniversityFaculty** - Faculty profiles
- **UniversityMentor** - University mentors
- **UniversityTeam** / **UniversityTeamMember** - Student teams
- **IndustryEmployee** - Employee profiles
- **IndustryMentor** - Industry mentors
- **IndustryExpert** - Industry experts
- **IndustryTeam** / **IndustryTeamMember** - Industry teams
- **GovernmentOfficer** - Government officers

### Problem & Project Entities
- **Problem** - Citizen-reported problems with rich metadata
- **Project** - Projects created from matched problems
- **ProjectMember** - Project team members with roles
- **Match** - AI-generated matches with scoring breakdown
- **Collaboration** - Multi-organization collaborations

### Skills & Evidence
- **Skill** - Normalized skills taxonomy
- **UserSkill** - User skill proficiencies
- **ProblemSkill** - Required skills for problems
- **Evidence** - File attachments for problems
- **VerificationHistory** - Government verification audit trail

## Development

```bash
# Start development server
npm run dev

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| NEXTAUTH_SECRET | NextAuth secret key | Yes |
| NEXTAUTH_URL | Application URL | Yes |
| GEMINI_API_KEY | Google Gemini API key | No |
| SMTP_* | Email configuration | No |
| TWILIO_* | SMS configuration | No |