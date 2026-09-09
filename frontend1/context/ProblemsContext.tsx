"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { initialProblems } from "@/data/problems";
import { Problem } from "@/types/problem";

interface ProblemsContextType {
  problems: Problem[];
  addProblem: (problem: Problem) => void;
  toggleSupport: (id: number) => void;
  toggleSave: (id: number) => void;
}

const ProblemsContext = createContext<ProblemsContextType | undefined>(undefined);

export function ProblemsProvider({ children }: { children: ReactNode }) {
  const [problems, setProblems] = useState<Problem[]>(initialProblems);

  const addProblem = (problem: Problem) => {
    setProblems((prev) => [problem, ...prev]);
  };

  const toggleSupport = (id: number) => {
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

  const toggleSave = (id: number) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  return (
    <ProblemsContext.Provider value={{ problems, addProblem, toggleSupport, toggleSave }}>
      {children}
    </ProblemsContext.Provider>
  );
}

export function useProblems() {
  const context = useContext(ProblemsContext);
  if (!context) throw new Error("useProblems must be used inside ProblemsProvider");
  return context;
}
