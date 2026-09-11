import { FolderKanban, CheckCircle2, Clock, XCircle } from "lucide-react";
import { governmentProjects } from "@/data/governmentData";
import Link from "next/link";

const statusConfig: Record<string, { color: string; bg: string; icon: typeof FolderKanban }> = {
  Active: { color: "text-emerald-600", bg: "bg-emerald-50", icon: FolderKanban },
  Planning: { color: "text-blue-600", bg: "bg-blue-50", icon: Clock },
  "On Hold": { color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
  Completed: { color: "text-slate-600", bg: "bg-slate-50", icon: CheckCircle2 },
  Closed: { color: "text-slate-500", bg: "bg-slate-100", icon: CheckCircle2 },
  Cancelled: { color: "text-red-600", bg: "bg-red-50", icon: XCircle },
};

export default function ProjectStatus() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <FolderKanban size={20} className="text-emerald-500" />
          <h2 className="text-lg font-bold text-slate-800">Active Projects</h2>
        </div>
        <Link href="/government/projects" className="text-sm font-semibold text-emerald-600 hover:underline">
          View All →
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {governmentProjects.slice(0, 4).map((project) => {
          const cfg = statusConfig[project.status] || statusConfig.Planning;
          const StatusIcon = cfg.icon;
          return (
            <div key={project.id} className="px-6 py-4 hover:bg-slate-50">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusIcon size={14} className={cfg.color} />
                    <p className="truncate text-sm font-semibold text-slate-800">{project.title}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {project.leadInstitution} · {project.leadDepartment}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-1.5 rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{project.progress}%</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Milestone: {project.currentMilestone}
                  </p>
                </div>
                <span className={`flex-shrink-0 rounded-full ${cfg.bg} px-2 py-0.5 text-xs font-semibold ${cfg.color}`}>
                  {project.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
