"use client";

import type { ReactNode } from "react";
import { CircleAlert, MapPin, Sparkles } from "lucide-react";
import SuggestedTeam from "@/components/people/SuggestedTeam";
import { useBestMatchProblems, type BestMatchProblem, type MatchLevel } from "@/lib/teamMatches";

const LEVEL_STYLE: Record<MatchLevel, string> = {
  HIGH: "bg-emerald-100 text-emerald-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  LOW: "bg-slate-100 text-slate-600",
};

function MatchCard({ item, rank, actions }: { item: BestMatchProblem; rank: number; actions?: ReactNode }) {
  const { problem, match, needs } = item;
  const percent = Math.round(match.coverage * 100);
  const covered = new Set(match.covered);

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white">#{rank}</span>
            {problem.category && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-600">{problem.category}</span>
            )}
            {(problem.location || problem.district) && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <MapPin size={12} /> {problem.location || problem.district}
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900">{problem.title}</h3>
          {problem.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{problem.description}</p>}
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${LEVEL_STYLE[match.match_level]}`}>
          {Math.round(match.score * 100)}% match
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-slate-400">
            <Sparkles size={12} /> What it needs
          </span>
          <span>Your team covers {percent}%</span>
        </div>
        <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`Your team covers ${percent}% of what this problem needs`}>
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {needs.map((need) => (
            <span
              key={`${need.kind}-${need.label}`}
              className={`rounded-lg px-2 py-1 text-xs font-medium ${
                covered.has(need.label) ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}
            >
              {need.label}
            </span>
          ))}
        </div>
        {match.missing.length > 0 && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <CircleAlert size={13} className="text-amber-500" /> Gap: nobody on your side covers {match.missing.join(", ")} yet.
          </p>
        )}
      </div>

      <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Suggested team</p>
      <SuggestedTeam team={match.team} />

      {actions && <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">{actions}</div>}
    </article>
  );
}

/**
 * Dashboard section: the open problems this organization is best placed to solve, best first, each
 * with the mixed-role team (mentors, faculty, experts, students, employees) built from its own
 * people by expertise. Renders nothing while loading, on error, or when nothing matches, so a
 * dashboard never shows a broken or empty panel for an optional recommendation.
 */
export default function BestMatchProblems({
  limit = 3,
  accent = "indigo",
  renderActions,
}: {
  limit?: number;
  accent?: "indigo" | "blue";
  renderActions?: (problemId: string) => ReactNode;
}) {
  const { matches } = useBestMatchProblems(limit);
  if (!matches || matches.length === 0) return null;

  return (
    <section className="space-y-4" aria-label="Best match problems">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles size={18} className={accent === "indigo" ? "text-indigo-600" : "text-blue-600"} />
          <h2 className="text-lg font-bold text-slate-800">Best Match Problems</h2>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${accent === "indigo" ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700"}`}>
            {matches.length}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Open problems your people are best placed to solve, with the team the AI would put together from their expertise.
        </p>
      </div>
      <div className="space-y-4">
        {matches.map((item, index) => (
          <MatchCard key={item.problem.id} item={item} rank={index + 1} actions={renderActions?.(item.problem.id)} />
        ))}
      </div>
    </section>
  );
}
