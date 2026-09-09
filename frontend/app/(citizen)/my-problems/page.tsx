"use client";

import { useState } from "react";
import { Calendar, Building2, Eye, FileText, Clock, CheckCircle2 } from "lucide-react";
import { myProblems } from "@/data/problems";
import { Problem } from "@/types/problem";
import StatusBadge from "@/components/StatusBadge";
import ProblemDetails from "@/components/ProblemDetails";
import StatsCard from "@/components/StatsCard";
import { currentUser } from "@/data/problems";

export default function MyProblemsPage() {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [problems, setProblems] = useState<Problem[]>(myProblems);

  const handleToggleSupport = (id: number) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, isSupported: !p.isSupported, supporters: p.isSupported ? p.supporters - 1 : p.supporters + 1 }
          : p
      )
    );
    setSelectedProblem((prev) =>
      prev?.id === id
        ? { ...prev, isSupported: !prev.isSupported, supporters: prev.isSupported ? prev.supporters - 1 : prev.supporters + 1 }
        : prev
    );
  };

  const progressColor = (p: number) => {
    if (p === 100) return "bg-green-500";
    if (p >= 60)   return "bg-blue-500";
    if (p >= 30)   return "bg-amber-500";
    return "bg-slate-300";
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Problems</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track the status and progress of all problems you have submitted.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatsCard label="Total Submitted" value={currentUser.totalSubmitted} icon={FileText}      color="blue"   />
          <StatsCard label="In Progress"      value={currentUser.inProgress}     icon={Clock}        color="amber"  />
          <StatsCard label="Completed"        value={currentUser.completed}       icon={CheckCircle2} color="green"  />
        </div>

        <div className="space-y-4">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {problem.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                      {problem.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar size={11} />
                      {problem.date}
                    </span>
                  </div>
                </div>
                <StatusBadge status={problem.status} />
              </div>

              {problem.assignedUniversity && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2">
                  <Building2 size={13} className="flex-shrink-0 text-blue-500" />
                  <p className="text-xs text-blue-700">
                    <span className="font-semibold">{problem.assignedUniversity}</span>
                    {problem.assignedDepartment && (
                      <span className="text-blue-500"> — {problem.assignedDepartment}</span>
                    )}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Solution Progress</span>
                  <span className="text-xs font-bold text-slate-700">{problem.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${progressColor(problem.progress)}`}
                    style={{ width: `${problem.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setSelectedProblem(problem)}
                  className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                >
                  <Eye size={14} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProblem && (
        <ProblemDetails
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onToggleSupport={handleToggleSupport}
        />
      )}
    </>
  );
}
