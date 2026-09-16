import {
  MentorProfile,
  Student,
  MentorChallenge,
  Team,
  Task,
  IndustryCollaborationRequest,
  UniversityProgressUpdate,
  MentorNotification,
  MentorActivityItem,
} from "@/types/mentor";

export const emptyMentorProfile: MentorProfile = {
  name: "",
  designation: "",
  department: "",
  university: "",
  email: "",
  phone: "",
  avatar: "",
  bio: "",
  expertise: [],
  experienceYears: 0,
  specializations: [],
  assignedChallengesCount: 0,
  activeTeamsCount: 0,
  studentsMentoredCount: 0,
  completedProjectsCount: 0,
};

export const emptyStudents: Student[] = [];
export const emptyChallenges: MentorChallenge[] = [];
export const emptyTeams: Team[] = [];
export const emptyTasks: Task[] = [];
export const emptyIndustryRequests: IndustryCollaborationRequest[] = [];
export const emptyUniversityUpdates: UniversityProgressUpdate[] = [];
export const emptyMentorNotifications: MentorNotification[] = [];
export const emptyActivities: MentorActivityItem[] = [];