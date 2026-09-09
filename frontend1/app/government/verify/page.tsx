"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle, User, FileText, MapPin } from "lucide-react";
import { verificationQueue, regionalProblems, officials } from "@/data/governmentData";

const statusConfig: Record<string, { color: string; bg: string; icon: typeof ShieldCheck }> = {
  Pending: { color: "text-slate-600", bg: "bg-slate-100", icon: Clock },
  "Under Review": { color: "text-blue-600", bg: "bg-blue-50", icon: Clock },
  Verified: { color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
  Rejected: { color: "text-red-600", bg: "bg-red-50", icon: XCircle },
  "Returned for Correction": { color: "text-amber-600", bg: "bg-amber-50", icon: AlertTriangle },
};

const priorityConfig: Record<string, { color: string; bg: string }> = {
  Critical: { color: "text-red-700", bg: "bg-red-100" },
  High: { color: "text-orange-700", bg: "bg-orange-100" },
  Medium: { color: "text-amber-700", bg: "bg-amber-100" },
  Low: { color: "text-slate-600", bg: "bg-slate-100" },
};

export default function VerifyPage() {
  const [filter, setFilter] = useState("All");
  const [selectedProblem, setSelectedProblem] = useState<any>(null);

  const filtered = verificationQueue.filter((item) => {
    if (filter === "All") return true;
    return item.priority === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Verification Queue</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review and verify citizen-submitted problems before they enter the solver matching pipeline.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "Critical", "High", "Medium", "Low"].map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filter === p
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p}
            {p !== "All" && (
              <span className="ml-1 opacity-70">
                ({verificationQueue.filter((q) => q.priority === p).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          {filtered.map((item) => {
            const cfg = statusConfig.Pending;
            const StatusIcon = cfg.icon;
            const problem = regionalProblems.find((p) => p.id === item.problemId);

            return (
              <div
                key={item.id}
                className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                onClick={() => setSelectedProblem(problem)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <StatusIcon size={20} className={`mt-0.5 flex-shrink-0 ${cfg.color}`} />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-900">{item.problemTitle}</h3>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                        {problem?.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <User size={12} /> {item.submittedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {problem?.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText size={12} /> {item.evidenceProvided} evidence
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
                      Pending
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityConfig[item.priority].color} ${priorityConfig[item.priority].bg}`}>
                      {item.priority}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    {item.assignedTo ? (
                      <span className="text-xs text-slate-500">Officer: {item.assignedTo}</span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        Unassigned
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock size={12} className="text-slate-400" />
                    <span className={item.hoursRemaining <= item.slaHours * 0.25 ? "text-red-600 font-semibold" : "text-slate-500"}>
                      {item.hoursRemaining}h remaining
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-slate-800">Assignment</h3>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600">Assign to Officer</label>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
                <option>Select officer...</option>
                {officials.map((o) => (
                  <option key={o.id} value={o.name}>
                    {o.name} · {o.role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-slate-800">Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Total Pending</span>
                <span className="text-sm font-bold text-slate-900">{verificationQueue.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Unassigned</span>
                <span className="text-sm font-bold text-amber-600">
                  {verificationQueue.filter((q) => !q.assignedTo).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">SLA Breached</span>
                <span className="text-sm font-bold text-red-600">
                  {verificationQueue.filter((q) => q.hoursRemaining <= 0).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
