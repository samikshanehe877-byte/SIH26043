export type ChallengeStatus =
  | "Newly Assigned"
  | "Under Review"
  | "Team Creation Pending"
  | "Team Active"
  | "In Progress"
  | "Industry Support Required"
  | "Industry Collaboration Active"
  | "Mentor Review"
  | "Solution Submitted"
  | "Completed";

export type ChallengePriority = "Low" | "Medium" | "High" | "Critical";

export type StudentWorkloadStatus = "On Track" | "Needs Attention" | "Overloaded" | "Inactive";

export interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
  department: string;
  year: string;
  skills: string[];
  expertise: string;
  workload: number; // 0 - 100 percentage
  availability: "Available" | "Limited" | "Busy";
  status: StudentWorkloadStatus;
  completedTasks: number;
  pendingTasks: number;
  lastActivity: string;
}

export interface TeamProgressBreakdown {
  research: number;
  dataCollection: number;
  modelDevelopment: number;
  backend: number;
  testing: number;
  documentation: number;
}

export interface Team {
  id: string;
  name: string;
  challengeId: string;
  challengeTitle: string;
  description: string;
  objective: string;
  leaderStudentId?: string;
  studentIds: string[];
  progress: number;
  tasksTotal: number;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksPendingReview: number;
  lastActivity: string;
  industrySupport: string;
  status: "Active" | "Completed" | "Pending";
  createdAt: string;
  progressBreakdown?: TeamProgressBreakdown;
}

export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export type TaskStatus =
  | "To Do"
  | "In Progress"
  | "Submitted"
  | "Under Review"
  | "Changes Requested"
  | "Approved"
  | "Completed";

export interface TaskSubmission {
  submittedAt: string;
  description: string;
  files: string[];
  links: string[];
  comments?: string;
  feedback?: string;
  changesRequestedReason?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  teamId: string;
  teamName: string;
  challengeId: string;
  assignedStudentId: string;
  assignedStudentName: string;
  assignedStudentAvatar: string;
  priority: TaskPriority;
  deadline: string;
  status: TaskStatus;
  expectedOutput: string;
  submission?: TaskSubmission;
  createdAt: string;
}

export type IndustryHelpType =
  | "Funding"
  | "Technical Expertise"
  | "API"
  | "Software Tool"
  | "Cloud Resources"
  | "Hardware"
  | "Dataset"
  | "Domain Expert"
  | "Mentorship"
  | "Other";

export type CollaborationStatus =
  | "Draft"
  | "Sent"
  | "Under Review"
  | "Accepted"
  | "Rejected"
  | "In Progress"
  | "Completed";

export interface IndustryRequestDetails {
  fundingAmount?: string;
  purpose?: string;
  budgetDescription?: string;
  expertiseArea?: string;
  sessionsCount?: number;
  preferredDate?: string;
  apiToolName?: string;
  accessDuration?: string;
  cloudSpecs?: string;
  hardwareSpecs?: string;
  datasetType?: string;
}

export interface IndustryCollaborationRequest {
  id: string;
  challengeId: string;
  challengeTitle: string;
  teamId: string;
  teamName: string;
  helpType: IndustryHelpType;
  organization: string;
  requestTitle: string;
  requirement: string;
  whyNeeded: string;
  expectedSupport: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  requiredBy: string;
  status: CollaborationStatus;
  dateSubmitted: string;
  lastUpdate: string;
  attachmentName?: string;
  details?: IndustryRequestDetails;
  messages?: {
    id: string;
    sender: string;
    role: "mentor" | "industry";
    text: string;
    timestamp: string;
  }[];
}

export interface UniversityProgressUpdate {
  id: string;
  challengeId: string;
  challengeTitle: string;
  date: string;
  progress: number;
  title: string;
  workCompleted: string;
  currentWork: string;
  blockers?: string;
  studentPerformance: string;
  industrySupport: string;
  nextSteps: string;
  expectedCompletionDate: string;
  attachments?: string[];
}

export interface AIAnalysis {
  category: string;
  classification: string;
  requiredSkills: string[];
  suggestedTechnologies: string[];
  suggestedIndustryExpertise: string[];
  confidence: number;
  summary: string;
}

export interface MentorChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  university: string;
  assignedDepartment: string;
  supportingDepartments: string[];
  assignedDate: string;
  deadline?: string;
  priority: ChallengePriority;
  status: ChallengeStatus;
  aiAnalysis: AIAnalysis;
  requiredSkills: string[];
  requirements?: string[];
  progress: number;
  teamId?: string;
  industrySupportStatus: string;
  citizenName: string;
  citizenAvatar: string;
  location: string;
  supportersCount: number;
  mentorNotes?: string;
}

export interface MentorProfile {
  name: string;
  designation: string;
  department: string;
  university: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  expertise: string[];
  experienceYears: number;
  specializations: string[];
  assignedChallengesCount: number;
  activeTeamsCount: number;
  studentsMentoredCount: number;
  completedProjectsCount: number;
}

export type MentorNotificationType =
  | "assignment"
  | "submission"
  | "feedback_request"
  | "industry_accepted"
  | "industry_rejected"
  | "university_update"
  | "deadline"
  | "completed"
  | "message";

export interface MentorNotification {
  id: string;
  type: MentorNotificationType;
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  link?: string;
  relatedChallengeTitle?: string;
}

export interface MentorActivityItem {
  id: string;
  type: "task_submission" | "team_update" | "industry_update" | "university_update" | "task_completed" | "challenge_assigned";
  text: string;
  timestamp: string;
  actorName?: string;
  actorAvatar?: string;
  challengeTitle?: string;
  teamName?: string;
}

