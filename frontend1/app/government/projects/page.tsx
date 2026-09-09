"use client";

import { useState } from "react";
import { FolderKanban, Filter, Search, Calendar, Users, Eye, CheckCircle2, Clock } from "lucide-react";
import { governmentProjects, regionalProblems } from "@/data/governmentData";
const statusConfig: Record<string, { color: string; bg: string }> = {
  Planning: { color: "text-blue-600", bg: "bg-blue-50" },
  Active: { color: "text-emerald-600", bg: "bg-emerald-50" },
  "On Hold": { color: "text-amber-600", bg: "bg-amber-50" },
  Completed: { color: "text-slate-600", bg: "bg-slate-50" },
  Closed: { color: "text-slate-500", bg: "bg-slate-100" },
  Cancelled: { color: "text-red-600", bg: "bg-red-50" },
};

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = governmentProjects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.leadInstitution.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Project Monitoring</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track active project progress, milestones, budgets, and team composition across all institutions.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or institutions..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        >
          <option>All Status</option>
          <option>Planning</option>
          <option>Active</option>
          <option>On Hold</option>
          <option>Completed</option>
          <option>Closed</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {filtered.map((project) => {
          const cfg = statusConfig[project.status];
          return (
            <div key={project.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
                  {project.status}
                </span>
                <span className="text-xs text-slate-400">{project.priority}</span>
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900">{project.title}</h3>
              <div className="mt-2 space-y-1 text-xs text-slate-500">
                <p>Lead: {project.leadInstitution}</p>
                <p>Dept: {project.leadDepartment}</p>
                <p>Mentor: {project.leadMentor}</p>
                <p>Partners: {project.partnerOrganizations.join(", ")}</p>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Progress</span>
                  <span className="text-xs font-semibold text-slate-600">{project.progress}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-1.5 rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
                <p className="text-xs text-slate-500">Current Milestone</p>
                <p className="text-xs font-semibold text-slate-700">{project.currentMilestone}</p>
              </div>
              {project.budgetAllocated && (
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Budget</span>
                  <span className="font-semibold text-slate-700">
                    ₹{(project.budgetUtilized || 0).toLocaleString()} / ₹{project.budgetAllocated.toLocaleString()}
                  </span>
                </div>
              )}
              {project.impactMetrics && (
                <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2">
                  <p className="text-xs text-emerald-600 font-medium">Impact</p>
                  <p className="text-xs text-emerald-700">
                    {project.impactMetrics.peopleBenefited.toLocaleString()} people · {project.impactMetrics.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
