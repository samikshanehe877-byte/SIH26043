import { StudentDashboardData, StudentProfile, StudentChallenge } from "@/types/student";

export const emptyStudentProfile: StudentProfile = {
  id: "",
  name: "",
  email: "",
  department: "",
  year: "",
  avatar: "",
  skills: [],
  interests: [],
  completedChallenges: 0,
  certificates: 0,
  achievements: [],
};

export const emptyStudentChallenge: StudentChallenge = {
  id: "",
  title: "",
  problemStatement: "",
  citizenRequirement: "",
  category: "",
  primaryDepartment: "",
  supportingDepartments: [],
  leadMentor: "",
  teamName: "",
  progress: 0,
  status: "",
  deadlineDays: 0,
  aiAnalysis: {
    problemCategory: "",
    requiredSkills: [],
    suggestedTechnologies: [],
    expectedOutcome: "",
  },
};

export const emptyStudentDashboardData: StudentDashboardData = {
  profile: emptyStudentProfile,
  activeChallenge: emptyStudentChallenge,
  team: {
    name: "",
    leadMentor: "",
    members: [],
  },
  tasks: [],
  recentFiles: [],
  resources: [],
  certificates: [],
  notifications: [],
};