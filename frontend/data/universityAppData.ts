import {
  UniversityDepartment,
  UniversityMentor,
  UniversityNotification,
  UniversityProfile,
  UniversityCoordinator,
} from "@/types/universityChallenge";

// Empty university coordinator - will be populated from database
export const universityCoordinator: UniversityCoordinator = {
  name: "",
  avatar: "",
  role: "University Coordinator",
  email: "",
  department: "",
  university: "",
};

// Empty university profile - will be populated from database
export const universityProfile: UniversityProfile = {
  name: "",
  shortName: "",
  location: "",
  type: "",
  description: "",
  contactEmail: "",
  website: "",
  establishedYear: 0,
  departmentCount: 0,
  mentorCount: 0,
  studentCount: "",
  activeChallenges: 0,
  completedChallenges: 0,
  avatar: "",
};

// Empty arrays - data will be fetched from database
export const universityDepartments: UniversityDepartment[] = [];
export const universityMentors: UniversityMentor[] = [];
export const universityNotifications: UniversityNotification[] = [];