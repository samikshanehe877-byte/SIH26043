import { ChallengeStatus, ChallengePriority } from "@/types/universityChallenge";

const statusStyles: Record<ChallengeStatus, string> = {
  "Awaiting Decision": "bg-slate-100 text-slate-600",
  "Accepted":          "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "Rejected":          "bg-red-50 text-red-700 border border-red-200",
  "Mentor Assigned":   "bg-cyan-50 text-cyan-700 border border-cyan-200",
  "Active":            "bg-amber-50 text-amber-700 border border-amber-200",
  "Completed":         "bg-green-50 text-green-700 border border-green-200",
};

const statusDots: Record<ChallengeStatus, string> = {
  "Awaiting Decision": "bg-slate-400",
  "Accepted":          "bg-indigo-500",
  "Rejected":          "bg-red-500",
  "Mentor Assigned":   "bg-cyan-500",
  "Active":            "bg-amber-500",
  "Completed":         "bg-green-500",
};

const priorityStyles: Record<ChallengePriority, string> = {
  Low:      "bg-slate-100 text-slate-600",
  Medium:   "bg-blue-50 text-blue-700",
  High:     "bg-amber-50 text-amber-700",
  Critical: "bg-red-50 text-red-700 border border-red-200",
};

export function ChallengeStatusBadge({ status }: { status: ChallengeStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${statusStyles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${statusDots[status]}`} />
      {status}
    </span>
  );
}

export function ChallengePriorityBadge({ priority }: { priority: ChallengePriority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${priorityStyles[priority]}`}
    >
      {priority}
    </span>
  );
}
