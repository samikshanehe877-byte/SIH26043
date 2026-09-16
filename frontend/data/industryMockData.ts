import { IndustryDashboardData, IndustryCompany, ProjectMilestone } from "@/types/industry";

export const emptyIndustryCompany: IndustryCompany = {
  id: "",
  name: "",
  logo: "",
  industryDomain: "",
  website: "",
  description: "",
  location: "",
  contactEmail: "",
  contactPhone: "",
  expertise: {
    technologies: [],
    domains: [],
  },
  resources: [],
};

export const emptyProjectMilestones: ProjectMilestone[] = [
  { label: "Problem Accepted", desc: "Challenge assigned" },
  { label: "Team Created", desc: "Students grouped" },
  { label: "Development Started", desc: "Initial coding" },
  { label: "Industry Support Required", desc: "Collaboration requested" },
  { label: "Testing", desc: "QA phase" },
  { label: "Completion", desc: "Project finished" },
];

export const emptyIndustryDashboardData: IndustryDashboardData = {
  company: emptyIndustryCompany,
  requests: [],
  collaborations: [],
  supportedChallenges: [],
  notifications: [],
  impact: {
    projectsSupported: 0,
    universitiesCollaborated: 0,
    studentsReached: 0,
    technicalExpertsInvolved: 0,
    resourcesProvided: 0,
    completedSolutions: 0,
    supportDistribution: [],
  },
};