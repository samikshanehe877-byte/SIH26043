import { CollaborationStatus, IndustryHelpType } from "@/types/mentor";

const collabStatusStyles: Record<CollaborationStatus, string> = {
  Draft: "bg-slate-100 text-slate-600 border-slate-200",
  Sent: "bg-blue-50 text-blue-700 border-blue-200",
  "Under Review": "bg-amber-50 text-amber-800 border-amber-300 font-semibold",
  Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  "In Progress": "bg-indigo-50 text-indigo-700 border-indigo-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
};

const collabStatusDots: Record<CollaborationStatus, string> = {
  Draft: "bg-slate-400",
  Sent: "bg-blue-500",
  "Under Review": "bg-amber-500",
  Accepted: "bg-emerald-500",
  Rejected: "bg-rose-500",
  "In Progress": "bg-indigo-500",
  Completed: "bg-green-500",
};

export function CollaborationStatusBadge({ status }: { status: CollaborationStatus }) {
  const style = collabStatusStyles[status] || "bg-slate-100 text-slate-700 border-slate-200";
  const dot = collabStatusDots[status] || "bg-slate-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${dot}`} />
      {status}
    </span>
  );
}

export function HelpTypeBadge({ type }: { type: IndustryHelpType }) {
  const colors: Record<IndustryHelpType, string> = {
    Funding: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Technical Expertise": "bg-indigo-50 text-indigo-700 border-indigo-200",
    API: "bg-sky-50 text-sky-700 border-sky-200",
    "Software Tool": "bg-purple-50 text-purple-700 border-purple-200",
    "Cloud Resources": "bg-blue-50 text-blue-700 border-blue-200",
    Hardware: "bg-orange-50 text-orange-700 border-orange-200",
    Dataset: "bg-teal-50 text-teal-700 border-teal-200",
    "Domain Expert": "bg-amber-50 text-amber-700 border-amber-200",
    Mentorship: "bg-violet-50 text-violet-700 border-violet-200",
    Other: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const style = colors[type] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-semibold ${style}`}
    >
      {type}
    </span>
  );
}

