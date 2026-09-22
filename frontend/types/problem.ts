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
  | "Completed"
  | "Duplicate"
  | "Merged";

/** Where a problem stands in the duplicate-detection pipeline; "none" for the overwhelming
 * majority of problems that never resembled anything else on file. */
export type DuplicateDecision = "none" | "potential_duplicate" | "duplicate" | "distinct" | "merged";

export interface DuplicateBreakdown {
  semantic: number;
  location: number;
  domain: number;
  affected_area: number;
  characteristics: number;
  overall: number;
  reasons: string[];
  /** Components not counted toward `overall` because neither/one report had that data. */
  unavailable: string[];
}

export interface SimilarProblemMatch {
  problem_id: string;
  title: string;
  status: string;
  citizen_name: string;
  supporters: number;
  semantic: number;
  location: number;
  domain: number;
  affected_area: number;
  characteristics: number;
  overall: number;
  reasons: string[];
  unavailable: string[];
}

export interface DuplicateCheckResult {
  tier: "block" | "warning" | "normal";
  best_match: SimilarProblemMatch | null;
  candidates: SimilarProblemMatch[];
}

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
  assignedIndustry?: string;
  assignedDepartment?: string;
  assignedMentorName?: string;
  image?: string;
  evidenceAttachments?: EvidenceAttachment[];
  verificationHistory?: VerificationHistoryEntry[];
  correctionCount?: number;
  correctionReasons?: string[];
  isSupported?: boolean;
  isSaved?: boolean;
  // Duplicate-detection pipeline
  duplicateDecision?: DuplicateDecision;
  duplicateScore?: number;
  duplicateOfId?: string;
  duplicateReasons?: string[];
  duplicateBreakdown?: DuplicateBreakdown;
  mergedIntoId?: string;
  /** Other citizens who jointly own this problem, gained through an approved merge request.
   * `citizenName` remains the original/primary owner; capped at 2 co-owners (3 owners total). */
  coOwners?: string[];
}

export type MergeRequestMemberResponse = "pending" | "accepted" | "declined";

export interface MergeRequestMember {
  problem_id: string;
  citizen_name: string;
  problem_title: string;
  response: MergeRequestMemberResponse;
  approved: boolean;
  responded_at?: string | null;
  approved_at?: string | null;
}

export interface MergeRequest {
  id: string;
  primary_problem_id: string;
  primary_citizen_name: string;
  primary_problem_title: string;
  initiated_by: string;
  note?: string | null;
  status: "open" | "closed";
  members: MergeRequestMember[];
  created_at: string;
  updated_at: string;
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
  type: "success" | "info" | "warning" | "update" | "error" | "proof";
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  problemTitle?: string;
  problemId?: number | string;
  /** "problem" | "volunteer" | "collaboration" | "project"; project alerts open the workspace. */
  category?: string;
}
