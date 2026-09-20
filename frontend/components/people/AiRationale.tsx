"use client";

import { Loader2, Sparkles } from "lucide-react";
import type { AiInfo } from "@/lib/teamMatches";

/**
 * Says who chose a team. An AI-selected team shows the model's one-line rationale; while the AI is
 * still working, the (rule-based) team already on screen is labelled as such and will upgrade itself.
 * Nothing is shown for a plain rule-based team, so the label never overstates what the AI did.
 */
export default function AiRationale({ ai }: { ai?: AiInfo }) {
  if (!ai || ai.source === "rules") return null;

  if (ai.source === "pending") {
    return (
      <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500" role="status">
        <Loader2 size={12} className="animate-spin" /> AI is refining this team...
      </p>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/60 px-3 py-2.5">
      <p className="mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-violet-700">
        <Sparkles size={12} /> AI-selected team
      </p>
      {ai.summary && <p className="text-sm text-slate-700">{ai.summary}</p>}
    </div>
  );
}
