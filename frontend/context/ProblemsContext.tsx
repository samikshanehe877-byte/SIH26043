"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Problem } from "@/types/problem";

interface ProblemsContextType {
  publicProblems: Problem[];
  myProblems: Problem[];
  addProblem: (problem: Problem) => Promise<string | number | null>;
  deleteProblem: (id: number | string) => Promise<boolean>;
  resubmitProblem: (id: number | string, files: File[], note?: string) => Promise<boolean>;
  volunteerForProblem: (id: number | string, solverType: "university" | "industry", solverName: string, proposal?: string) => Promise<boolean>;
  withdrawVolunteerRequest: (id: number | string, solverType: "university" | "industry", solverName: string) => Promise<boolean>;
  selectVolunteer: (id: number | string, solverType: "university" | "industry", solverName: string) => Promise<boolean>;
  toggleSupport: (id: number | string) => void;
  toggleSave: (id: number | string) => void;
  isLoading: boolean;
  refreshProblems: () => Promise<void>;
}

const ProblemsContext = createContext<ProblemsContextType | undefined>(undefined);

/** Statuses shown when browsing (mirrors PUBLIC_PROBLEM_STATUSES in the API). Earlier or rejected problems stay in "My Problems". */
const PUBLIC_STATUSES = ["verified", "assigned", "in_progress", "completed"];

export function ProblemsProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [publicProblems, setPublicProblems] = useState<Problem[]>([]);
  const [myProblems, setMyProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const fetchProblems = async () => {
    if (!isAuthenticated || !user) {
      setPublicProblems([]);
      setMyProblems([]);
      setIsLoading(false);
      return;
    }

    try {
      const [publishedResponse, myResponse] = await Promise.all([
        // Browsing list: the API leaves out unverified problems (they only appear under "my problems").
        fetch(`${apiUrl}/problems?limit=500`, { cache: "no-store" }),
        fetch(`${apiUrl}/problems?citizen_name=${encodeURIComponent(user.name)}&limit=500`, { cache: "no-store" }),
      ]);

      if (!publishedResponse.ok || !myResponse.ok) throw new Error("Problem API unavailable");

      const publishedRecords = await publishedResponse.json();
      const myRecords = await myResponse.json();

      if (Array.isArray(publishedRecords)) {
        setPublicProblems(
          publishedRecords
            .filter((record) => PUBLIC_STATUSES.includes(String(record.status)))
            .map(toFrontendProblem),
        );
      }
      if (Array.isArray(myRecords)) {
        setMyProblems(myRecords.map(toFrontendProblem));
      }
    } catch (error) {
      console.error("Failed to fetch problems:", error);
      setPublicProblems([]);
      setMyProblems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [apiUrl, isAuthenticated, user?.name]);

  const addProblem = async (problem: Problem): Promise<string | number | null> => {
    if (!user) return null;
    
    try {
      const response = await fetch(`${apiUrl}/problems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_text: problem.description,
          title: problem.title,
          description: problem.description,
          category: problem.category,
          location: problem.location,
          citizen_name: user.name,
          citizen_avatar: user.name.charAt(0).toUpperCase(),
          date: new Date().toISOString(),
          status: "submitted",
          supporters: 0,
          progress: 0,
          current_step: 1,
          raw_input: problem.rawInput,
          problem_nature: problem.problemNature,
          affected_population: problem.affectedPopulation,
          frequency: problem.frequency,
          required_capabilities: problem.requiredCapabilities,
          confirmed_by_giver: problem.confirmedByGiver,
          problem_giver_type: problem.problemGiverType,
          community_group_name: problem.communityGroupName,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") ?? "";
        let message = "";
        if (contentType.includes("application/json")) {
          const errorBody = await response.json();
          message = errorBody.detail ?? errorBody.error ?? "";
        } else {
          message = (await response.text()).slice(0, 200);
        }
        throw new Error(message || `Problem submission failed (${response.status})`);
      }

      const saved = await response.json();
      const newProblem = toFrontendProblem(saved);
      setMyProblems((previous) => [newProblem, ...previous]);
      return saved.id ?? null;
    } catch (error) {
      console.error("Failed to submit problem:", error);
      throw error instanceof Error ? error : new Error("Failed to submit problem");
    }
  };

  const toggleSupport = (id: number | string) => {
    setPublicProblems((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              supporters: p.isSupported ? p.supporters - 1 : p.supporters + 1,
              isSupported: !p.isSupported,
            }
          : p
      )
    );
    setMyProblems((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              supporters: p.isSupported ? p.supporters - 1 : p.supporters + 1,
              isSupported: !p.isSupported,
            }
          : p
      )
    );
  };

  const toggleSave = (id: number | string) => {
    setPublicProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    );
    setMyProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const deleteProblem = async (id: number | string) => {
    if (!user) return false;
    try {
      const response = await fetch(
        `${apiUrl}/problems/${id}?citizen_name=${encodeURIComponent(user.name)}`,
        { method: "DELETE" }
      );
      if (!response.ok) return false;
      setMyProblems((previous) => previous.filter((problem) => problem.id !== id));
      setPublicProblems((previous) => previous.filter((problem) => problem.id !== id));
      return true;
    } catch {
      return false;
    }
  };

  const resubmitProblem = async (id: number | string, files: File[], note = "") => {
    if (!user) return false;
    try {
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        const evidenceResponse = await fetch(`${apiUrl}/problems/${id}/evidence`, {
          method: "POST",
          body: formData,
        });
        if (!evidenceResponse.ok) return false;
      }
      const response = await fetch(`${apiUrl}/problems/${id}/resubmit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ citizen_name: user.name, note }),
      });
      if (!response.ok) return false;
      const saved = toFrontendProblem(await response.json());
      setMyProblems((previous) => previous.map((problem) => (problem.id === id ? saved : problem)));
      return true;
    } catch {
      return false;
    }
  };

  const volunteerForProblem = async (
    id: number | string,
    solverType: "university" | "industry",
    solverName: string,
    proposal = ""
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${apiUrl}/problems/${id}/volunteer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solver_type: solverType, solver_name: solverName, proposal }),
      });
      if (!response.ok) return false;
      const saved = toFrontendProblem(await response.json());
      setPublicProblems((prev) => prev.map((p) => (p.id === id ? saved : p)));
      setMyProblems((prev) => prev.map((p) => (p.id === id ? saved : p)));
      return true;
    } catch {
      return false;
    }
  };

  const withdrawVolunteerRequest = async (
    id: number | string,
    solverType: "university" | "industry",
    solverName: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${apiUrl}/problems/${id}/volunteer`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solver_type: solverType, solver_name: solverName }),
      });
      if (!response.ok) return false;
      return true;
    } catch {
      return false;
    }
  };

  const selectVolunteer = async (
    id: number | string,
    solverType: "university" | "industry",
    solverName: string
  ): Promise<boolean> => {
    if (!user) return false;
    try {
      // Only the problem giver may accept; the API checks this name against the problem's owner.
      const response = await fetch(`${apiUrl}/problems/${id}/select-volunteer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solver_type: solverType, solver_name: solverName, citizen_name: user.name }),
      });
      if (!response.ok) return false;
      const saved = toFrontendProblem(await response.json());
      setPublicProblems((prev) => prev.map((p) => (p.id === id ? saved : p)));
      setMyProblems((prev) => prev.map((p) => (p.id === id ? saved : p)));
      return true;
    } catch {
      return false;
    }
  };

  return (
    <ProblemsContext.Provider
      value={{
        publicProblems,
        myProblems,
        addProblem,
        deleteProblem,
        resubmitProblem,
        volunteerForProblem,
        withdrawVolunteerRequest,
        selectVolunteer,
        toggleSupport,
        toggleSave,
        isLoading,
        refreshProblems: fetchProblems,
      }}
    >
      {children}
    </ProblemsContext.Provider>
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

export function useProblems() {
  const context = useContext(ProblemsContext);
  if (!context) throw new Error("useProblems must be used inside ProblemsProvider");
  return context;
}