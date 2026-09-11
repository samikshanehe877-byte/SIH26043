import { Clock, ShieldCheck } from "lucide-react";
import { verificationQueue } from "@/data/governmentData";
import Link from "next/link";

const slaColor = (remaining: number, total: number) => {
  const pct = remaining / total;
  if (pct <= 0.25) return "text-red-600 bg-red-50";
  if (pct <= 0.5) return "text-amber-600 bg-amber-50";
  return "text-emerald-600 bg-emerald-50";
};

const priorityDot: Record<string, string> = {
  Critical: "bg-red-500",
  High: "bg-orange-500",
  Medium: "bg-amber-400",
  Low: "bg-slate-400",
};

export default function VerificationQueue() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-emerald-500" />
          <h2 className="text-lg font-bold text-slate-800">Verification Queue</h2>
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
            {verificationQueue.length}
          </span>
        </div>
        <Link href="/government/verify" className="text-sm font-semibold text-emerald-600 hover:underline">
          View All →
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {verificationQueue.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50">
            <span className={`h-3 w-3 flex-shrink-0 rounded-full ${priorityDot[item.priority]}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{item.problemTitle}</p>
              <p className="text-xs text-slate-400">
                {item.submittedBy} · {item.dateSubmitted} · {item.evidenceProvided} evidence files
              </p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              {item.assignedTo ? (
                <span className="text-xs text-slate-500">Officer: {item.assignedTo}</span>
              ) : (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  Unassigned
                </span>
              )}
              <span className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${slaColor(item.hoursRemaining, item.slaHours)}`}>
                <Clock size={12} /> {item.hoursRemaining}h
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}