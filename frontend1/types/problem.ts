export type ProblemStatus =
  | "Submitted"
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
  id: number;
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
  isSupported?: boolean;
  isSaved?: boolean;
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
  id: number;
  type: "success" | "info" | "warning" | "update";
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  problemTitle?: string;
}
