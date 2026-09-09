import { ProblemCategory } from "./problem";

export type ChallengeStatus =
  | "Awaiting Decision"
  | "Accepted"
  | "Rejected"
  | "Mentor Assigned"
  | "Active"
  | "Completed";

export type ChallengePriority = "Low" | "Medium" | "High" | "Critical";

export type IndustryCollabStatus =
  | "Not Required"
  | "Not Requested"
  | "Collaboration Requested"
  | "Awaiting Industry Partner"
  | "Collaboration Active"
  | "Completed";

export type MentorAvailability = "Available" | "Limited Capacity" | "Fully Assigned" | "Unavailable";

export interface AIDepartmentAssignment {
  primaryDepartment: { id: number; name: string };
  supportingDepartments: { id: number; name: string }[];
  confidence: number;
  reason: string;
}

export interface UniversityChallenge {
  id: number;
  title: string;
  description: string;
  category: ProblemCategory;
  location: string;
  citizenName: string;
  citizenAvatar: string;
  dateSubmitted: string;
  status: ChallengeStatus;
  priority: ChallengePriority;
  aiMatchScore: number;
  supporters: number;
  aiDepartmentAssignment: AIDepartmentAssignment;
  assignedDepartmentId?: number;
  assignedDepartmentName?: string;
  assignedMentorId?: number;
  assignedMentorName?: string;
  progress: number;
  currentStep: number;
  industryCollabStatus: IndustryCollabStatus;
  rejectionReason?: string;
  notes?: string;
  image?: string;
}

export interface UniversityDepartment {
  id: number;
  name: string;
  shortName: string;
  head: string;
  headAvatar: string;
  primaryChallenges: number;
  supportingChallenges: number;
  availableMentors: number;
  busyMentors: number;
  completedChallenges: number;
  description: string;
  areasOfExpertise: string[];
  color: string;
}

export interface UniversityMentor {
  id: number;
  name: string;
  avatar: string;
  departmentId: number;
  departmentName: string;
  designation: string;
  expertise: string[];
  bio: string;
  challengesAssigned: number;
  maxCapacity: number;
  completedProjects: number;
  availability: MentorAvailability;
  email: string;
  phone: string;
}

export interface UniversityNotification {
  id: number;
  type: "assignment" | "success" | "update" | "warning" | "info";
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  relatedChallengeTitle?: string;
}

export interface UniversityProfile {
  name: string;
  shortName: string;
  location: string;
  type: string;
  description: string;
  contactEmail: string;
  website: string;
  establishedYear: number;
  departmentCount: number;
  mentorCount: number;
  studentCount: string;
  activeChallenges: number;
  completedChallenges: number;
  avatar: string;
}

export interface UniversityCoordinator {
  name: string;
  avatar: string;
  role: string;
  email: string;
  department: string;
  university: string;
}
