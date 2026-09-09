import { TaskStatus, TaskPriority } from "@/types/mentor";

const statusStyles: Record<TaskStatus, string> = {
  "To Do": "bg-slate-100 text-slate-700 border-slate-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Submitted: "bg-purple-50 text-purple-700 border-purple-200 font-semibold",
  "Under Review": "bg-amber-50 text-amber-800 border-amber-300 font-semibold",
  "Changes Requested": "bg-rose-50 text-rose-700 border-rose-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
};

const statusDots: Record<TaskStatus, string> = {
  "To Do": "bg-slate-400",
  "In Progress": "bg-blue-500",
  Submitted: "bg-purple-500",
  "Under Review": "bg-amber-500",
  "Changes Requested": "bg-rose-500",
  Approved: "bg-emerald-500",
  Completed: "bg-green-500",
};

const priorityStyles: Record<TaskPriority, string> = {
  Low: "bg-slate-100 text-slate-600 border-slate-200",
  Medium: "bg-blue-50 text-blue-700 border-blue-200",
  High: "bg-amber-50 text-amber-700 border-amber-200",
  Critical: "bg-rose-50 text-rose-700 border-rose-200 font-bold",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
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

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const style = priorityStyles[priority] || "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${style}`}
    >
      {priority}
    </span>
  );
}

