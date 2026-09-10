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
