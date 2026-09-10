"use client";

import {
  CheckCircle2,
  BarChart3,
  MapPinned,
  Users,
  Building2,
  ArrowRight,
} from "lucide-react";
import { regionalStats, domainClusters } from "@/data/governmentData";

const ecosystemMix = [
  { label: "Individuals", value: 38, color: "bg-sky-500" },
  { label: "Academic bodies", value: 34, color: "bg-emerald-500" },
  { label: "Industry partners", value: 28, color: "bg-violet-500" },
];

const matchingHierarchy = [
  "Same district / locality first",
  "Same state or region if the local capacity is insufficient",
  "Cross-region expert matching when the problem demands specialized capability",
  "Government review of final solver recommendations before project authorization",
];

export default function AnalyticsPage() {
  const totalDomainCount = domainClusters.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Regional intelligence</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Government analytics dashboard</h1>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={16} />
            AI-assisted overview • Human governance
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Verified problems</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{regionalStats.verified}</p>
          <p className="mt-1 text-xs text-slate-500">Approved and published to the regional network</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Active projects</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BarChart3 size={18} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{regionalStats.activeProjects}</p>
          <p className="mt-1 text-xs text-slate-500">Collaborative efforts in motion and being monitored</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Solver network</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Users size={18} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">{regionalStats.totalSolvers}</p>
          <p className="mt-1 text-xs text-slate-500">Individuals, universities, and industry partners engaged</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Problem distribution by domain</h2>
              <p className="text-xs text-slate-500">Impact and urgency shaping regional prioritization</p>
            </div>
            <MapPinned size={18} className="text-slate-400" />
          </div>
          <div className="space-y-4">
            {domainClusters.map((item) => {
              const percentage = Math.max(8, Math.round((item.count / totalDomainCount) * 100));
              return (
                <div key={item.domain}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.domain}</span>
                    <span className="text-slate-500">{item.count} · {percentage}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Solver ecosystem</h2>
            <Building2 size={18} className="text-slate-400" />
          </div>
          <div className="space-y-4">
            {ecosystemMix.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Regional matching hierarchy</h2>
          <div className="mt-4 space-y-3">
            {matchingHierarchy.map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Project delivery pipeline</h2>
          <div className="mt-4 space-y-3">
            {[
              "Problem verification and evidence review",
              "AI-assisted classification, urgency, and scope",
              "Regional solver matching and partner recommendation",
              "Formal collaboration and project authorization",
              "Monitoring, impact assessment, and closure",
            ].map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                  {index + 1}
                </div>
                <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {step}
                </div>
                {index < 4 && <ArrowRight size={14} className="text-slate-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}