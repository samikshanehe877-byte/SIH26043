"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getOrganizationName, useAuth } from "@/context/AuthContext";
import { Problem } from "@/types/problem";

import { UniversityChallenge, toUniversityChallenge } from "@/types/universityChallenge";

interface UniversityProblemsContextType {
  assignedProblems: UniversityChallenge[];
  isLoading: boolean;
  refreshProblems: () => Promise<void>;
}

const UniversityProblemsContext = createContext<UniversityProblemsContextType | undefined>(undefined);

export function UniversityProblemsProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [assignedProblems, setAssignedProblems] = useState<UniversityChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const fetchProblems = async () => {
    if (!isAuthenticated || !user) {
      setAssignedProblems([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/problems?assigned_university=${encodeURIComponent(getOrganizationName(user))}&limit=500`,
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error("Problem API unavailable");

      const records = await response.json();
      if (Array.isArray(records)) {
        setAssignedProblems(records.map((r) => toUniversityChallenge(toFrontendProblem(r))));
      }
    } catch (error) {
      console.error("Failed to fetch university problems:", error);
      setAssignedProblems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [apiUrl, isAuthenticated, user?.name, user?.organizationName]);

  return (
    <UniversityProblemsContext.Provider
      value={{
        assignedProblems,
        isLoading,
        refreshProblems: fetchProblems,
      }}
    >
      {children}
    </UniversityProblemsContext.Provider>
  );
}

function toFrontendProblem(record: Record<string, unknown>): Problem {
  return {
    id: String(record.id),
    title: String(record.title ?? record.problem_text ?? "Community problem"),
    description: String(record.description ?? record.problem_text ?? ""),
    category: (record.category as Problem["category"]) ?? "Other",
    location: String(record.location ?? record.district ?? "Location pending"),
    citizenName: String(record.citizen_name ?? "Citizen"),
    citizenAvatar: String(record.citizen_avatar ?? "C"),
    date: String(record.date ?? record.created_at ?? "Recently"),
    status: toFrontendStatus(String(record.status ?? "submitted")),
    supporters: Number(record.supporters ?? 0),
    comments: [],
    progress: Number(record.progress ?? 0),
    currentStep: Number(record.current_step ?? 1),
    evidenceAttachments: Array.isArray(record.evidence_attachments) ? record.evidence_attachments : [],
    verificationHistory: Array.isArray(record.verification_history) ? record.verification_history : [],
    correctionCount: Array.isArray(record.verification_history)
      ? record.verification_history.filter((entry) => entry.decision === "proof").length
      : 0,
    correctionReasons: Array.isArray(record.verification_history)
      ? record.verification_history
          .filter((entry) => entry.decision === "proof")
          .map((entry) => String(entry.note ?? "Additional proof requested"))
      : [],
    volunteers: Array.isArray(record.volunteers)
      ? record.volunteers.map((v: Record<string, unknown>) => ({
          solverType: v.solver_type as "university" | "industry",
          solverName: String(v.solver_name ?? ""),
          proposal: String(v.proposal ?? ""),
          submittedAt: String(v.submitted_at ?? ""),
          status: v.status as "volunteered" | "accepted" | "rejected" | "withdrawn",
        }))
      : undefined,
    assignedByGiver: record.assigned_by_giver as boolean | undefined,
    assignedUniversity: record.assigned_university as string | undefined,
    assignedIndustry: record.assigned_industry as string | undefined,
  };
}

function toFrontendStatus(status: string): Problem["status"] {
  const statuses: Record<string, Problem["status"]> = {
    submitted: "Submitted",
    under_review: "Under Review",
    assigned: "Assigned to University",
    in_progress: "In Progress",
    completed: "Completed",
    verified: "Verified",
    returned_for_correction: "Needs Proof",
    rejected: "Rejected",
  };
  return statuses[status] ?? "Submitted";
}

export function useUniversityProblems() {
  const context = useContext(UniversityProblemsContext);
  if (!context) throw new Error("useUniversityProblems must be used inside UniversityProblemsProvider");
  return context;
}