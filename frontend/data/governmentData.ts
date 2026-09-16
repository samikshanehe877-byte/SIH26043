// Empty government data structures - all mock data removed
// User data will be populated from the database based on authenticated user

import {
  GovernmentOfficial,
  RegionalProblem,
  GovernmentProject,
  VerificationRequest,
  RegionalStats,
  DomainCluster,
} from "@/types/government";

export const currentOfficial: GovernmentOfficial = {
  id: 0,
  name: "",
  email: "",
  avatar: "",
  role: "State Coordinator",
  region: "",
  designation: "",
  department: "",
  totalVerified: 0,
  totalRejected: 0,
  activeAssignments: 0,
  joinedDate: "",
};

export const regionalStats: RegionalStats = {
  state: "",
  totalProblems: 0,
  verified: 0,
  pending: 0,
  rejected: 0,
  activeProjects: 0,
  completedProjects: 0,
  critical: 0,
  high: 0,
  medium: 0,
  low: 0,
  totalSolvers: 0,
  institutionsEngaged: 0,
};

export const verificationQueue: VerificationRequest[] = [];
export const regionalProblems: RegionalProblem[] = [];
export const governmentProjects: GovernmentProject[] = [];
export const domainClusters: DomainCluster[] = [];
export const districtData: { district: string; problems: number; critical: number; active: number; completed: number }[] = [];
export const officials: GovernmentOfficial[] = [];