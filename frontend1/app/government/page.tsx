"use client";

import { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FolderKanban,
  TrendingUp,
  Users,
  Building2,
} from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/government/StatsCard";
import VerificationQueue from "@/components/government/VerificationQueue";
import ProjectStatus from "@/components/government/ProjectStatus";
import PriorityDistribution from "@/components/government/PriorityDistribution";
import { currentOfficial, regionalStats, domainClusters } from "@/data/governmentData";

export default function GovernmentDashboard() {
  const [region, setRegion] = useState("Maharashtra");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Welcome back,</p>
          <h1 className="text-2xl font-bold text-slate-900">
            {currentOfficial.name} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {currentOfficial.role} · {currentOfficial.designation} · {currentOfficial.department}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            <option>Maharashtra</option>
            <option>Pune Division</option>
            <option>Thane Division</option>
            <option>Nagpur Division</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          label="Total Problems"
          value={regionalStats.totalProblems}
          sublabel="All time reported"
          icon={ShieldCheck}
          color="emerald"
          trend={8}
        />
        <StatsCard
          label="Verified"
          value={regionalStats.verified}
          sublabel="Approved & published"
          icon={CheckCircle2}
          color="blue"
          trend={12}
        />
        <StatsCard
          label="Pending Review"
          value={regionalStats.pending}
          sublabel="Awaiting decision"
          icon={Clock}
          color="amber"
          trend={-3}
        />
        <StatsCard
          label="Active Projects"
          value={regionalStats.activeProjects}
          sublabel="In implementation"
          icon={FolderKanban}
          color="purple"
          trend={15}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          label="Completed Solutions"
          value={regionalStats.completedProjects}
          sublabel="Impact delivered"
          icon={CheckCircle2}
          color="emerald"
          trend={18}
        />
        <StatsCard
          label="Critical Priority"
          value={regionalStats.critical}
          sublabel="Immediate action"
          icon={ShieldCheck}
          color="red"
        />
        <StatsCard
          label="Solver Network"
          value={regionalStats.totalSolvers}
          sublabel="Individuals + institutions"
          icon={Users}
          color="indigo"
        />
        <StatsCard
          label="Institutions Engaged"
          value={regionalStats.institutionsEngaged}
          sublabel="Universities + industry"
          icon={Building2}
          color="slate"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <VerificationQueue />
          <ProjectStatus />
        </div>
        <div className="space-y-6">
          <PriorityDistribution />
          <DomainBreakdown />
          <RegionalOverview />
        </div>
      </div>
    </div>
  );
}

function DomainBreakdown() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-slate-800">Domain Breakdown</h3>
      <div className="space-y-3">
        {domainClusters.map((d) => (
          <div key={d.domain}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 truncate">{d.domain}</span>
              <span className="text-xs text-slate-500">{d.count}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.round((d.verified / d.count) * 100)}%` }}
              />
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400">
              <span>{d.verified} verified</span>
              <span>·</span>
              <span>{d.projects} projects</span>
              <span>·</span>
              <span>{d.completed} completed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionalOverview() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp size={16} className="text-emerald-500" />
        <h3 className="text-sm font-bold text-slate-800">Regional Overview</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-xs text-emerald-600 font-medium">Completion Rate</p>
          <p className="mt-1 text-lg font-bold text-emerald-700">
            {Math.round((regionalStats.completedProjects / regionalStats.verified) * 100)}%
          </p>
        </div>
        <div className="rounded-xl bg-amber-50 p-3">
          <p className="text-xs text-amber-600 font-medium">Avg. Verification</p>
          <p className="mt-1 text-lg font-bold text-amber-700">6.2 hrs</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-3">
          <p className="text-xs text-blue-600 font-medium">Solution Rate</p>
          <p className="mt-1 text-lg font-bold text-blue-700">
            {Math.round((regionalStats.completedProjects / regionalStats.totalProblems) * 100)}%
          </p>
        </div>
        <div className="rounded-xl bg-purple-50 p-3">
          <p className="text-xs text-purple-600 font-medium">Active Officers</p>
          <p className="mt-1 text-lg font-bold text-purple-700">24</p>
        </div>
      </div>
    </div>
  );
}