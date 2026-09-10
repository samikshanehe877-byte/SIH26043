export type SupportStatus = "Planned" | "In Progress" | "Delivered" | "Completed";

export type CollaborationRequestStatus = "Received" | "Under Review" | "Clarification Needed" | "Approved" | "Rejected";

export type CollaborationStatus = "In Progress" | "Support Delivered" | "Completed";

export type SupportType =
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

export interface ProjectMilestone {
  label: string;
  desc: string;
}

export interface UniversitySummary {
  id: string;
  name: string;
  department: string;
  location: string;
}

export interface MentorSummary {
  id: string;
  name: string;
  department: string;
  expertise: string[];
}

export interface StudentTeamSummary {
  id: string;
  name: string;
  size: number;
  skills: string[];
}

export interface IndustrySupport {
  id: string;
  type: SupportType;
  status: SupportStatus;
  description: string;
  expectedDeliveryDate: string;
}

export interface AIAnalysis {
  problemCategory: string;
  requiredSkills: string[];
  suggestedTechnologies: string[];
  difficulty: string;
  suggestedSupportRequirements: string[];
  matchScore?: number;
  matchingSkills?: string[];
}

export interface CollaborationRequest {
  id: string;
  challengeTitle: string;
  problemDescription: string;
  category: string;
  expectedOutcome: string;
  university: UniversitySummary;
  mentor: MentorSummary;
  studentTeam: StudentTeamSummary;
  aiAnalysis: AIAnalysis;
  requestedSupportTypes: SupportType[];
  whySupportIsNeeded: string;
  expectedIndustryContribution: string;
  projectProgress: number;
  currentMilestoneIndex: number;
  milestones: ProjectMilestone[];
  requestDate: string;
  status: CollaborationRequestStatus;
}

export interface Collaboration {
  id: string;
  requestId: string;
  challengeTitle: string;
  problemDescription: string;
  category: string;
  university: UniversitySummary;
  mentor: MentorSummary;
  studentTeam: StudentTeamSummary;
  projectProgress: number;
  currentMilestoneIndex: number;
  milestones: ProjectMilestone[];
  industrySupport: IndustrySupport[];
  collaborationStatus: CollaborationStatus;
  lastUpdate: string;
}

export interface IndustryExpertise {
  technologies: string[];
  domains: string[];
}

export interface IndustryResource {
  type: string;
  available: boolean;
  description: string;
}

export interface IndustryCompany {
  id: string;
  name: string;
  logo: string;
  industryDomain: string;
  website: string;
  description: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  expertise: IndustryExpertise;
  resources: IndustryResource[];
}

export interface IndustryNotification {
  id: number;
  type: "info" | "success" | "warning" | "update";
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
}

export interface IndustryImpact {
  projectsSupported: number;
  universitiesCollaborated: number;
  studentsReached: number;
  technicalExpertsInvolved: number;
  resourcesProvided: number;
  completedSolutions: number;
  supportDistribution: { label: string; value: number }[];
}

export interface SupportedChallenge {
  id: string;
  challengeTitle: string;
  universityName: string;
  mentorName: string;
  year: string;
  supportProvided: string[];
  finalStatus: string;
  completionDate: string;
  impactResult: string;
}

export interface IndustryDashboardData {
  company: IndustryCompany;
  requests: CollaborationRequest[];
  collaborations: Collaboration[];
  supportedChallenges: SupportedChallenge[];
  notifications: IndustryNotification[];
  impact: IndustryImpact;
}
