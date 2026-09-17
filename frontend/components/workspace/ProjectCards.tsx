"use client";

import Link from "next/link";
import { ArrowRight, Building2, Crown, Factory, FolderKanban } from "lucide-react";
import { Accent, ACCENTS, formatRelativeTime, PROJECT_STATUS_LABELS, ProjectSummary } from "@/lib/projects";

/** Cards for accepted-problem workspaces; used on the projects page and dashboards. */
export default function ProjectCards({
  projects,
  basePath,
  accent,
  emptyText,
}: {
  projects: ProjectSummary[];
  basePath: string;
  accent: Accent;
  emptyText: string;
}) {
  const colors = ACCENTS[accent];

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
        <FolderKanban size={32} className="mb-2 text-slate-300" />
        <p className="max-w-sm text-sm text-slate-500">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`${basePath}/projects/${project.id}`}
          className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${colors.soft}`}>
              {PROJECT_STATUS_LABELS[project.status]}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
              {project.my_role === "lead" && <Crown size={11} />}
              {project.my_role === "lead" ? "Lead" : project.my_role === "owner" ? "Your problem" : "Collaborator"}
            </span>
          </div>
          <h3 className="font-bold text-slate-900">{project.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{project.description}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.parties.map((party) => (
              <span key={`${party.type}-${party.name}`} className="inline-flex items-center gap-1 rounded-lg border border-slate-100 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">
                {party.type === "university" ? <Building2 size={11} /> : <Factory size={11} />}
                {party.name}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-4">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-400">
                {project.latest_update
                  ? `Last update ${formatRelativeTime(project.latest_update.created_at)}`
                  : "No updates yet"}
              </span>
              <span className={`font-bold ${colors.text}`}>{project.progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${project.progress}%` }} />
            </div>
            <p className={`mt-3 flex items-center gap-1 text-sm font-semibold ${colors.text}`}>
              Open workspace <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
