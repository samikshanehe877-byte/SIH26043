export type ProblemStatus =
  | "Submitted"
  | "Verified"
  | "Needs Proof"
  | "Rejected"
  | "Under Review"
  | "Assigned to University"
  | "In Progress"
  | "Collaboration with Industry"
  | "Solution Implemented"
  | "Completed";

export type ProblemCategory =
  | "Infrastructure"
  | "Environment"
  | "Education"
  | "Healthcare"
  | "Transportation"
  | "Public Safety"
  | "Technology"
  | "Water and Sanitation"
  | "Other";

export type ProblemNature = "Technical" | "Non-Technical" | "Hybrid";

export type ProblemGiverType = "individual" | "community_group" | "ngo" | "local_authority";

export type SolverType = "university" | "industry";

export type VolunteerStatus = "volunteered" | "accepted" | "rejected" | "withdrawn";

export interface ProblemVolunteer {
  solverType: SolverType;
  solverName: string;
  proposal: string;
  submittedAt: string;
  status: VolunteerStatus;
}

export interface StructuredProblemDraft {
  title: string;
  problem_statement: string;
  category: ProblemCategory;
  problem_nature: ProblemNature;
  affected_area: string;
  affected_population: string;
  frequency: string;
  required_capabilities: string[];
  suggested_intervention: string;
  raw_input: string;
  source_language?: string;
  translated_input?: string | null;
  engine?: string;
}

export interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
}

export interface Problem {
  id: number | string;
  title: string;
  description: string;
  category: ProblemCategory;
  location: string;
  citizenName: string;
  citizenAvatar: string;
  date: string;
  status: ProblemStatus;
  supporters: number;
  comments: Comment[];
  progress: number;
  currentStep: number;
  // Structured problem attributes
  rawInput?: string;
  problemNature?: ProblemNature;
  affectedArea?: string;
  affectedPopulation?: string;
  frequency?: string;
  requiredCapabilities?: string[];
  suggestedIntervention?: string;
  confirmedByGiver?: boolean;
  problemGiverType?: ProblemGiverType;
  communityGroupName?: string;
  volunteers?: ProblemVolunteer[];
  assignedVolunteer?: ProblemVolunteer;
  assignedByGiver?: boolean;
  // Assignment & evidence
  assignedUniversity?: string;
  assignedDepartment?: string;
  image?: string;
  evidenceAttachments?: EvidenceAttachment[];
  verificationHistory?: VerificationHistoryEntry[];
  correctionCount?: number;
  correctionReasons?: string[];
  isSupported?: boolean;
  isSaved?: boolean;
}

export interface EvidenceAttachment {
  name: string;
  content_type: string;
  size: number;
  url: string;
}

export interface VerificationHistoryEntry {
  officer: string;
  timestamp: string;
  note: string;
  previous_status: string;
  decision: "approve" | "reject" | "proof" | "resubmit";
  status: string;
}

export interface User {
  name: string;
  email: string;
  city: string;
  avatar: string;
  role: string;
  totalSubmitted: number;
  inProgress: number;
  completed: number;
  joinedDate: string;
}

export interface Notification {
  id: number | string;
  type: "success" | "info" | "warning" | "update";
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  problemTitle?: string;
  problemId?: number | string;
}
