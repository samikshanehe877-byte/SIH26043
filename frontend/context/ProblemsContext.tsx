"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { currentUser, initialProblems, myProblems as seededMyProblems } from "@/data/problems";
import { Problem } from "@/types/problem";

interface ProblemsContextType {
  problems: Problem[];
  myProblems: Problem[];
  addProblem: (problem: Problem) => Promise<string | number | null>;
  deleteProblem: (id: number | string) => Promise<boolean>;
  resubmitProblem: (id: number | string, files: File[], note?: string) => Promise<boolean>;
  toggleSupport: (id: number | string) => void;
  toggleSave: (id: number | string) => void;
  isLoading: boolean;
}

const ProblemsContext = createContext<ProblemsContextType | undefined>(undefined);

export function ProblemsProvider({ children }: { children: ReactNode }) {
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [myProblems, setMyProblems] = useState<Problem[]>(seededMyProblems);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    let cancelled = false;

    async function loadProblems() {
      try {
        const [publishedResponse, citizenResponse] = await Promise.all([
          fetch(`${apiUrl}/problems?status=verified`, { cache: "no-store" }),
          fetch(`${apiUrl}/problems?limit=500`, { cache: "no-store" }),
        ]);
        if (!publishedResponse.ok || !citizenResponse.ok) throw new Error("Problem API unavailable");
        const publishedRecords = await publishedResponse.json();
        const citizenRecords = await citizenResponse.json();
        if (!cancelled && Array.isArray(publishedRecords)) {
          setProblems(publishedRecords.map(toFrontendProblem));
        }
        if (!cancelled && Array.isArray(citizenRecords)) {
          setMyProblems(
            citizenRecords
              .filter((record) => String(record.citizen_name ?? "") === currentUser.name)
              .map(toFrontendProblem)
          );
        }
      } catch {
        // Keep the seeded demo data available when the optional API is offline.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProblems();
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const addProblem = async (problem: Problem): Promise<string | number | null> => {
    // Submissions remain private until a government officer verifies them.
    try {
      const response = await fetch(`${apiUrl}/problems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Ensure problem_text is sent as required by backend
          problem_text: problem.description,
          title: problem.title,
          description: problem.description,
          category: problem.category,
          location: problem.location,
          citizen_name: problem.citizenName,
          citizen_avatar: problem.citizenAvatar,
          date: problem.date,
          status: "submitted",
          supporters: problem.supporters,
          progress: problem.progress,
          current_step: problem.currentStep,
          raw_input: problem.rawInput,
          problem_nature: problem.problemNature,
          affected_population: problem.affectedPopulation,
          frequency: problem.frequency,
          required_capabilities: problem.requiredCapabilities,
          confirmed_by_giver: problem.confirmedByGiver ?? true,
          problem_giver_type: problem.problemGiverType ?? "individual",
          community_group_name: problem.communityGroupName,
        }),
      });
      if (!response.ok) return null;
      const saved = await response.json();
      setMyProblems((previous) => [toFrontendProblem(saved), ...previous]);
      return saved.id ?? null;
    } catch {
      return null;
    }
  };

  const toggleSupport = (id: number | string) => {
    setProblems((prev) =>
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
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const deleteProblem = async (id: number | string) => {
    try {
      const response = await fetch(
        `${apiUrl}/problems/${id}?citizen_name=${encodeURIComponent(currentUser.name)}`,
        { method: "DELETE" }
      );
      if (!response.ok) return false;
      setMyProblems((previous) => previous.filter((problem) => problem.id !== id));
      setProblems((previous) => previous.filter((problem) => problem.id !== id));
      return true;
    } catch {
      return false;
    }
  };

  const resubmitProblem = async (id: number | string, files: File[], note = "") => {
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
        body: JSON.stringify({ citizen_name: currentUser.name, note }),
      });
      if (!response.ok) return false;
      const saved = toFrontendProblem(await response.json());
      setMyProblems((previous) => previous.map((problem) => (problem.id === id ? saved : problem)));
      return true;
    } catch {
      return false;
    }
  };

  return (
    <ProblemsContext.Provider value={{ problems, myProblems, addProblem, deleteProblem, resubmitProblem, toggleSupport, toggleSave, isLoading }}>
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
    rawInput: record.raw_input ? String(record.raw_input) : undefined,
    problemNature: (record.problem_nature as Problem["problemNature"]) ?? undefined,
    affectedArea: record.affected_area ? String(record.affected_area) : undefined,
    affectedPopulation: record.affected_population ? String(record.affected_population) : undefined,
    frequency: record.frequency ? String(record.frequency) : undefined,
    requiredCapabilities: Array.isArray(record.required_capabilities) ? (record.required_capabilities as string[]) : [],
    confirmedByGiver: Boolean(record.confirmed_by_giver ?? true),
    problemGiverType: (record.problem_giver_type as Problem["problemGiverType"]) ?? "individual",
    communityGroupName: record.community_group_name ? String(record.community_group_name) : undefined,
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
