import { User, Problem, Notification } from "@/types/problem";

// Current authenticated user - this will be populated from auth context
export const currentUser: User = {
  name: "",
  email: "",
  city: "",
  avatar: "",
  role: "Citizen",
  totalSubmitted: 0,
  inProgress: 0,
  completed: 0,
  joinedDate: "",
};

// Empty arrays - data will be fetched from API
export const initialProblems: Problem[] = [];
export const myProblems: Problem[] = [];
export const notifications: Notification[] = [];