export type TaskStatus =
  | "To Do"
  | "In Progress"
  | "Submitted"
  | "Under Review"
  | "Changes Requested"
  | "Approved"
  | "Completed";

export type TaskPriority = "High" | "Medium" | "Low";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "Working" | "Offline" | "Away" | "In a meeting";
  currentTask?: string;
  contributionPercent?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  requirements?: string[];
  assignedBy: string; // Mentor name
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  mentorFeedback?: string;
  attachments?: FileItem[];
  submissionHistory?: any[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "student" | "mentor";
  avatar: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachments?: any[];
}

export interface FileItem {
  id: string;
  name: string;
  type: "document" | "code" | "image" | "dataset" | "other";
  size: string;
  uploadedBy: string;
  uploadDate: string;
  url: string;
  folder: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  dateEarned: string;
  icon: string; // Icon name string for lucide-react
}

export interface Certificate {
  id: string;
  challengeTitle: string;
  studentName: string;
  completionDate: string;
  status: "Verified" | "Pending";
  certificateId: string;
  issueAuthority: string;
}

export interface StudentResource {
  id: string;
  title: string;
  type: "Research Paper" | "Article" | "Tutorial" | "Documentation" | "Dataset" | "API" | "Tool" | "Mentor Resource";
  description: string;
  relatedSkill: string;
  source: string;
  url: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  avatar: string;
  skills: string[];
  interests: string[];
  completedChallenges: number;
  certificates: number;
  achievements: Achievement[];
}

export interface StudentChallenge {
  id: string;
  title: string;
  problemStatement: string;
  citizenRequirement: string;
  category: string;
  primaryDepartment: string;
  supportingDepartments: string[];
  leadMentor: string;
  teamName: string;
  progress: number;
  status: string;
  deadlineDays: number;
  aiAnalysis: {
    problemCategory: string;
    requiredSkills: string[];
    suggestedTechnologies: string[];
    expectedOutcome: string;
  };
}

export interface StudentDashboardData {
  profile: StudentProfile;
  activeChallenge: StudentChallenge;
  team: {
    name: string;
    leadMentor: string;
    members: TeamMember[];
  };
  tasks: Task[];
  recentFiles: FileItem[];
  resources: StudentResource[];
  certificates: Certificate[];
  notifications: any[];
}

