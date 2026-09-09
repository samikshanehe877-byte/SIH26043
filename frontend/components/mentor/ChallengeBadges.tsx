import { ChallengeStatus, ChallengePriority } from "@/types/mentor";

const statusStyles: Record<ChallengeStatus, string> = {
  "Newly Assigned": "bg-slate-100 text-slate-700 border-slate-200",
  "Under Review": "bg-sky-50 text-sky-700 border-sky-200",
  "Team Creation Pending": "bg-amber-50 text-amber-800 border-amber-300 font-semibold",
  "Team Active": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  "Industry Support Required": "bg-purple-50 text-purple-700 border-purple-200",
  "Industry Collaboration Active": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Mentor Review": "bg-amber-50 text-amber-700 border-amber-200",
  "Solution Submitted": "bg-teal-50 text-teal-700 border-teal-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
};

const statusDots: Record<ChallengeStatus, string> = {
  "Newly Assigned": "bg-slate-400",
  "Under Review": "bg-sky-500",
  "Team Creation Pending": "bg-amber-500",
  "Team Active": "bg-emerald-500",
  "In Progress": "bg-blue-500",
  "Industry Support Required": "bg-purple-500",
  "Industry Collaboration Active": "bg-indigo-500",
  "Mentor Review": "bg-amber-500",
  "Solution Submitted": "bg-teal-500",
  Completed: "bg-green-500",
};

const priorityStyles: Record<ChallengePriority, string> = {
  Low: "bg-slate-100 text-slate-600 border-slate-200",
  Medium: "bg-blue-50 text-blue-700 border-blue-200",
  High: "bg-amber-50 text-amber-700 border-amber-200",
  Critical: "bg-rose-50 text-rose-700 border-rose-200 font-bold",
};

export function ChallengeStatusBadge({ status }: { status: ChallengeStatus }) {
  const style = statusStyles[status] || "bg-slate-100 text-slate-700 border-slate-200";
  const dot = statusDots[status] || "bg-slate-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {status}
    </span>
  );
}

export function ChallengePriorityBadge({ priority }: { priority: ChallengePriority }) {
  const style = priorityStyles[priority] || "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}
    >
      {priority}
    </span>
  );
}

