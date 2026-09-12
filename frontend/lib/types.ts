import {
  User,
  Region,
  University,
  UniversityStudent,
  UniversityFaculty,
  UniversityMentor,
  UniversityTeam,
  UniversityTeamMember,
  Industry,
  IndustryEmployee,
  IndustryMentor,
  IndustryExpert,
  IndustryTeam,
  IndustryTeamMember,
  Government,
  GovernmentOfficer,
  Problem,
  Project,
  ProjectMember,
  Match,
  Skill,
  UserSkill,
  ProblemSkill,
  Evidence,
  VerificationHistory,
  Collaboration,
  UserRole,
  AccountStatus,
  VerificationStatus,
  ProblemStatus,
  ProblemType,
  ProblemGiverType,
  SolverType,
  VolunteerStatus,
  MatchStatus,
  ProjectStatus,
  ProjectMemberRole,
  EvidenceType,
} from '@prisma/client'

export type {
  User,
  Region,
  University,
  UniversityStudent,
  UniversityFaculty,
  UniversityMentor,
  UniversityTeam,
  UniversityTeamMember,
  Industry,
  IndustryEmployee,
  IndustryMentor,
  IndustryExpert,
  IndustryTeam,
  IndustryTeamMember,
  Government,
  GovernmentOfficer,
  Problem,
  Project,
  ProjectMember,
  Match,
  Skill,
  UserSkill,
  ProblemSkill,
  Evidence,
  VerificationHistory,
  Collaboration,
}

export type {
  UserRole,
  AccountStatus,
  VerificationStatus,
  ProblemStatus,
  ProblemType,
  ProblemGiverType,
  SolverType,
  VolunteerStatus,
  MatchStatus,
  ProjectStatus,
  ProjectMemberRole,
  EvidenceType,
}

export type UserWithRelations = User & {
  universityStudents?: UniversityStudent[]
  universityMentors?: UniversityMentor[]
  universityFaculty?: UniversityFaculty[]
  industryEmployees?: IndustryEmployee[]
  industryMentors?: IndustryMentor[]
  industryExperts?: IndustryExpert[]
  governmentOfficers?: GovernmentOfficer[]
}

export type UniversityWithRelations = University & {
  region?: Region
  students?: UniversityStudent[]
  faculty?: UniversityFaculty[]
  mentors?: UniversityMentor[]
  teams?: UniversityTeam[]
}

export type IndustryWithRelations = Industry & {
  region?: Region
  employees?: IndustryEmployee[]
  mentors?: IndustryMentor[]
  experts?: IndustryExpert[]
  teams?: IndustryTeam[]
}

export type ProblemWithRelations = Problem & {
  ownerUser?: User
  region?: Region
  project?: Project | null
  matches?: Match[]
  evidence?: Evidence[]
  verificationHistory?: VerificationHistory[]
  skills?: (ProblemSkill & { skill: Skill })[]
}

export type ProjectWithRelations = Project & {
  problem?: Problem
  members?: (ProjectMember & { user: User })[]
  university?: University | null
  industry?: Industry | null
}

export type MatchWithRelations = Match & {
  problem?: Problem
  user?: User
}

export type SkillWithRelations = Skill & {
  userSkills?: (UserSkill & { user: User })[]
  problemSkills?: (ProblemSkill & { problem: Problem })[]
}