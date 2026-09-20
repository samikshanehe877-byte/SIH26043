import { prisma } from "@/lib/prisma";

export type OrgType = "university" | "industry";
export type PersonKind = "student" | "faculty" | "mentor" | "employee" | "expert";
export type Availability = "light" | "moderate" | "full";

export interface PersonCard {
  id: string;
  userId: string;
  name: string;
  kind: PersonKind;
  title: string;
  unitId: string | null;
  unitName: string | null;
  yearsExperience: number | null;
  bio: string | null;
  specialization: string | null;
  certifications: string | null;
  skills: { name: string; proficiency: number }[];
  domains: { domain: string; subdomain: string | null; proficiency: number }[];
  /** Mentors only. Derived from load against capacity, the same rule ai/mentor_matcher.py uses. */
  availability: Availability | null;
  currentLoad: number | null;
  maxCapacity: number | null;
}

export interface OrganizationSummary {
  id: string;
  type: OrgType;
  name: string;
  district: string | null;
  state: string;
  description: string | null;
  memberCount: number;
  units: { id: string; name: string; memberCount: number }[];
}

export interface OrganizationPeople {
  organization: OrganizationSummary;
  people: PersonCard[];
}

export function availabilityFor(load: number, capacity: number): Availability {
  if (load >= capacity) return "full";
  return load <= capacity / 2 ? "light" : "moderate";
}

const userSelect = {
  select: {
    id: true,
    name: true,
    skills: { select: { proficiency: true, skill: { select: { name: true } } } },
    domainClaims: { select: { proficiency: true, domain: { select: { name: true } }, subdomain: { select: { name: true } } } },
  },
} as const;

type UserWithClaims = {
  id: string;
  name: string;
  skills: { proficiency: number; skill: { name: string } }[];
  domainClaims: { proficiency: number; domain: { name: string }; subdomain: { name: string } | null }[];
};

function shape(user: UserWithClaims) {
  return {
    userId: user.id,
    name: user.name,
    skills: user.skills
      .map((s) => ({ name: s.skill.name, proficiency: s.proficiency }))
      .sort((a, b) => b.proficiency - a.proficiency),
    domains: user.domainClaims
      .map((d) => ({ domain: d.domain.name, subdomain: d.subdomain?.name ?? null, proficiency: d.proficiency }))
      .sort((a, b) => b.proficiency - a.proficiency),
  };
}

const unitSelect = { select: { id: true, name: true } } as const;

/** Every person under one university or industry, with their unit, skills and problem-area claims. */
export async function getOrganizationPeople(type: OrgType, orgId: string): Promise<OrganizationPeople | null> {
  const people: PersonCard[] = [];
  let organization: Omit<OrganizationSummary, "memberCount" | "units">;

  if (type === "university") {
    const uni = await prisma.university.findUnique({ where: { id: orgId } });
    if (!uni) return null;
    organization = { id: uni.id, type, name: uni.name, district: uni.district, state: uni.state, description: uni.description };

    const [students, faculty, mentors] = await Promise.all([
      prisma.universityStudent.findMany({ where: { universityId: orgId }, include: { user: userSelect, unit: unitSelect } }),
      prisma.universityFaculty.findMany({ where: { universityId: orgId }, include: { user: userSelect, unit: unitSelect } }),
      prisma.universityMentor.findMany({ where: { universityId: orgId }, include: { user: userSelect, unit: unitSelect } }),
    ]);
    for (const s of students) {
      people.push({
        id: s.id, ...shape(s.user), kind: "student", title: `${s.course}, year ${s.year}`,
        unitId: s.unit?.id ?? null, unitName: s.unit?.name ?? s.department, yearsExperience: null, bio: s.bio,
        specialization: null, certifications: null, availability: null, currentLoad: null, maxCapacity: null,
      });
    }
    for (const f of faculty) {
      people.push({
        id: f.id, ...shape(f.user), kind: "faculty", title: f.designation,
        unitId: f.unit?.id ?? null, unitName: f.unit?.name ?? f.department, yearsExperience: f.experienceYears, bio: f.bio,
        specialization: f.specialization, certifications: null, availability: null, currentLoad: null, maxCapacity: null,
      });
    }
    for (const m of mentors) {
      people.push({
        id: m.id, ...shape(m.user), kind: "mentor", title: m.designation,
        unitId: m.unit?.id ?? null, unitName: m.unit?.name ?? m.department, yearsExperience: m.experienceYears, bio: m.bio,
        specialization: m.specialization, certifications: null,
        availability: availabilityFor(m.currentLoad, m.maxCapacity), currentLoad: m.currentLoad, maxCapacity: m.maxCapacity,
      });
    }
  } else {
    const ind = await prisma.industry.findUnique({ where: { id: orgId } });
    if (!ind) return null;
    organization = { id: ind.id, type, name: ind.companyName, district: ind.district, state: ind.state, description: ind.description };

    const [employees, mentors, experts] = await Promise.all([
      prisma.industryEmployee.findMany({ where: { industryId: orgId }, include: { user: userSelect, unit: unitSelect } }),
      prisma.industryMentor.findMany({ where: { industryId: orgId }, include: { user: userSelect, unit: unitSelect } }),
      prisma.industryExpert.findMany({ where: { industryId: orgId }, include: { user: userSelect, unit: unitSelect } }),
    ]);
    for (const e of employees) {
      people.push({
        id: e.id, ...shape(e.user), kind: "employee", title: e.designation,
        unitId: e.unit?.id ?? null, unitName: e.unit?.name ?? e.department, yearsExperience: e.experienceYears, bio: null,
        specialization: null, certifications: null, availability: null, currentLoad: null, maxCapacity: null,
      });
    }
    for (const m of mentors) {
      people.push({
        id: m.id, ...shape(m.user), kind: "mentor", title: m.designation,
        unitId: m.unit?.id ?? null, unitName: m.unit?.name ?? m.department, yearsExperience: m.experienceYears, bio: m.bio,
        specialization: m.expertise, certifications: null,
        availability: availabilityFor(m.currentLoad, m.maxCapacity), currentLoad: m.currentLoad, maxCapacity: m.maxCapacity,
      });
    }
    for (const x of experts) {
      people.push({
        id: x.id, ...shape(x.user), kind: "expert", title: "Domain expert",
        unitId: x.unit?.id ?? null, unitName: x.unit?.name ?? null, yearsExperience: x.experienceYears, bio: null,
        specialization: x.expertise, certifications: x.certifications,
        availability: null, currentLoad: null, maxCapacity: null,
      });
    }
  }

  const unitRows = await prisma.organizationUnit.findMany({
    where: type === "university" ? { universityId: orgId } : { industryId: orgId },
    orderBy: { name: "asc" },
  });
  const units = unitRows.map((u) => ({ id: u.id, name: u.name, memberCount: people.filter((p) => p.unitId === u.id).length }));

  people.sort((a, b) => (a.unitName ?? "").localeCompare(b.unitName ?? "") || a.name.localeCompare(b.name));
  return { organization: { ...organization, memberCount: people.length, units }, people };
}
