import { ProblemCategory, Problem } from "./problem";

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
  id: number | string;
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

const CATEGORY_DEPARTMENTS: Record<string, { id: number; name: string }> = {
  "Water and Sanitation": { id: 3, name: "Civil Engineering" },
  "Environment": { id: 3, name: "Civil Engineering" },
  "Transportation": { id: 3, name: "Civil Engineering" },
  "Infrastructure": { id: 3, name: "Civil Engineering" },
  "Education": { id: 6, name: "Information Technology" },
  "Technology": { id: 1, name: "Computer Engineering" },
  "Public Safety": { id: 1, name: "Computer Engineering" },
  "Healthcare": { id: 1, name: "Computer Engineering" },
  "Other": { id: 1, name: "Computer Engineering" },
};

function toChallengeStatus(status: Problem["status"]): ChallengeStatus {
  switch (status) {
    case "Assigned to University":
    case "Submitted":
    case "Verified":
    case "Under Review":
    case "Needs Proof":
      return "Awaiting Decision";
    case "In Progress":
    case "Collaboration with Industry":
      return "Active";
    case "Completed":
    case "Solution Implemented":
      return "Completed";
    case "Rejected":
      return "Rejected";
    default:
      return "Awaiting Decision";
  }
}

function toChallengePriority(supporters: number): ChallengePriority {
  if (supporters >= 200) return "Critical";
  if (supporters >= 100) return "High";
  if (supporters >= 30) return "Medium";
  return "Low";
}

export function toUniversityChallenge(p: Problem): UniversityChallenge {
  const primaryDept = CATEGORY_DEPARTMENTS[p.category] ?? { id: 1, name: "Computer Engineering" };
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    location: p.location,
    citizenName: p.citizenName,
    citizenAvatar: p.citizenAvatar || (p.citizenName ? p.citizenName.slice(0, 2).toUpperCase() : "C"),
    dateSubmitted: p.date || "Recently",
    status: toChallengeStatus(p.status),
    priority: toChallengePriority(p.supporters || 0),
    aiMatchScore: Math.min(98, 80 + ((p.supporters || 0) % 19)),
    supporters: p.supporters || 0,
    aiDepartmentAssignment: {
      primaryDepartment: primaryDept,
      supportingDepartments: [{ id: 2, name: "AI & Machine Learning" }],
      confidence: Math.min(95, 78 + ((p.supporters || 0) % 18)),
      reason: `Based on the ${p.category} domain, ${primaryDept.name} is recommended as the primary department for technical evaluation and solution development.`,
    },
    assignedDepartmentId: primaryDept.id,
    assignedDepartmentName: p.assignedDepartment || primaryDept.name,
    assignedMentorName: undefined,
    progress: p.progress ?? 0,
    currentStep: p.currentStep ?? 1,
    industryCollabStatus: "Not Requested",
    image: p.image,
  };
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
  id: number | string;
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
