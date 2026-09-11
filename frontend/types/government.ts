export type GovernmentRole =
  | "State Coordinator"
  | "District Officer"
  | "Verification Officer"
  | "Impact Analyst"
  | "Super Admin";

export type VerificationStatus =
  | "Pending"
  | "Under Review"
  | "Verified"
  | "Rejected"
  | "Returned for Correction";

export type ProblemPriority = "Critical" | "High" | "Medium" | "Low";

export type ProblemType = "Technical" | "Non-Technical" | "Hybrid";

export type ProjectStatus =
  | "Planning"
  | "Active"
  | "On Hold"
  | "Completed"
  | "Closed"
  | "Cancelled";

export interface GovernmentOfficial {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: GovernmentRole;
  region: string;
  designation: string;
  department: string;
  totalVerified: number;
  totalRejected: number;
  activeAssignments: number;
  joinedDate: string;
}

export interface GovernmentComment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
}

export interface RegionalProblem {
  id: number;
  title: string;
  description: string;
  category: string;
  problemType: ProblemType;
  domain: string;
  subdomain: string;
  location: string;
  district: string;
  state: string;
  citizenName: string;
  citizenAvatar: string;
  dateSubmitted: string;
  verificationStatus: VerificationStatus;
  priority: ProblemPriority;
  aiPriorityScore: number;
  aiFactors: {
    populationAffected: number;
    urgency: number;
    severity: number;
    recurrence: number;
    regionalRelevance: number;
    evidenceConfidence: number;
  };
  supporters: number;
  evidence: string[];
  problemOwner: {
    type: string;
    name: string;
    members?: number;
  };
  assignedTo?: string;
  assignedDepartment?: string;
  assignedMentor?: string;
  matchedUniversities: { name: string; score: number }[];
  matchedIndustry: { name: string; score: number }[];
  matchedMentors: { name: string; score: number }[];
  hasProject: boolean;
  projectId?: number;
  image?: string;
  progress?: number;
  isSupported?: boolean;
  isSaved?: boolean;
  comments?: GovernmentComment[];
}

export interface GovernmentProject {
  id: number;
  problemId: number;
  title: string;
  status: ProjectStatus;
  priority: ProblemPriority;
  problemOwner: string;
  leadInstitution: string;
  leadDepartment: string;
  leadMentor: string;
  partnerOrganizations: string[];
  startDate: string;
  expectedCompletion: string;
  actualCompletion?: string;
  progress: number;
  currentMilestone: string;
  milestones: {
    name: string;
    status: "Completed" | "In Progress" | "Pending" | "Overdue";
    date?: string;
  }[];
  budgetAllocated?: number;
  budgetUtilized?: number;
  teamSize: number;
  updates: {
    id: number;
    author: string;
    date: string;
    text: string;
    status: string;
  }[];
  impactMetrics?: {
    peopleBenefited: number;
    description: string;
    verified: boolean;
  };
}

export interface VerificationRequest {
  id: number;
  problemId: number;
  problemTitle: string;
  submittedBy: string;
  dateSubmitted: string;
  evidenceProvided: number;
  priority: ProblemPriority;
  assignedTo: string | null;
  slaHours: number;
  hoursRemaining: number;
}

export interface RegionalStats {
  state: string;
  totalProblems: number;
  verified: number;
  pending: number;
  rejected: number;
  activeProjects: number;
  completedProjects: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  totalSolvers: number;
  institutionsEngaged: number;
}

export interface DomainCluster {
  domain: string;
  count: number;
  verified: number;
  projects: number;
  completed: number;
}