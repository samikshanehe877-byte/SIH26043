import { Problem, ProblemStatus } from "@/types/problem";
import {
  UniversityChallenge,
  ChallengeStatus,
  ChallengePriority,
  IndustryCollabStatus,
  AIDepartmentAssignment,
} from "@/types/universityChallenge";

const problemStatusToChallengeStatus: Record<ProblemStatus, ChallengeStatus> = {
  Submitted: "Awaiting Decision",
  Verified: "Awaiting Decision",
  "Needs Proof": "Awaiting Decision",
  "Under Review": "Awaiting Decision",
  Rejected: "Rejected",
  "Assigned to University": "Accepted",
  "In Progress": "Active",
  "Collaboration with Industry": "Active",
  "Solution Implemented": "Active",
  Completed: "Completed",
  // A university never actually sees these -- both are dead-end statuses reached before a
  // problem is ever assigned -- but the map must stay exhaustive over ProblemStatus.
  Duplicate: "Rejected",
  Merged: "Rejected",
};

export function toUniversityChallenge(problem: Problem): UniversityChallenge {
  const challengeStatus: ChallengeStatus =
    problemStatusToChallengeStatus[problem.status] ?? "Awaiting Decision";

  const defaultAiAssignment: AIDepartmentAssignment = {
    primaryDepartment: { id: 0, name: problem.assignedDepartment ?? "General Studies" },
    supportingDepartments: [],
    confidence: 0,
    reason: "Department assignment pending AI analysis.",
  };

  return {
    id: typeof problem.id === "number" ? problem.id : Number(problem.id) || 0,
    title: problem.title,
    description: problem.description,
    category: problem.category,
    location: problem.location,
    citizenName: problem.citizenName,
    citizenAvatar: problem.citizenAvatar,
    dateSubmitted: problem.date,
    status: challengeStatus,
    priority: "Medium" as ChallengePriority,
    aiMatchScore: 0,
    supporters: problem.supporters ?? 0,
    aiDepartmentAssignment: problem.assignedDepartment
      ? {
          primaryDepartment: { id: 1, name: problem.assignedDepartment },
          supportingDepartments: [],
          confidence: 0,
          reason: `Mapped from legacy assignedDepartment: ${problem.assignedDepartment}`,
        }
      : defaultAiAssignment,
    assignedDepartmentId: undefined,
    assignedDepartmentName: problem.assignedDepartment,
    assignedMentorId: undefined,
    assignedMentorName: problem.assignedMentorName,
    progress: problem.progress ?? 0,
    currentStep: problem.currentStep ?? 1,
    industryCollabStatus: "Not Required" as IndustryCollabStatus,
    rejectionReason: undefined,
    notes: undefined,
    image: problem.image,
  };
}
