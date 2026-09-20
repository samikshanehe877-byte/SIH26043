"use client";

import { useState, type ReactNode } from "react";
import { CircleAlert, EyeOff, MapPin, Sparkles, Undo2 } from "lucide-react";
import AiRationale from "@/components/people/AiRationale";
import SuggestedTeam from "@/components/people/SuggestedTeam";
import { useBestMatchProblems, type BestMatchProblem, type MatchLevel } from "@/lib/teamMatches";

const LEVEL_STYLE: Record<MatchLevel, string> = {
  HIGH: "bg-emerald-100 text-emerald-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  LOW: "bg-slate-100 text-slate-600",
};

function MatchCard({
  item,
  rank,
  actions,
  onDismiss,
  onRestore,
}: {
  item: BestMatchProblem;
  rank: number;
  actions?: ReactNode;
  onDismiss: (problemId: string) => void;
  onRestore: (problemId: string) => void;
}) {
  const { problem, match, needs } = item;
  const percent = Math.round(match.coverage * 100);
  const covered = new Set(match.covered);

  if (item.feedback?.dismissed) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-3">
        <p className="min-w-0 text-sm text-slate-500">
          <span className="font-semibold text-slate-600">{problem.title}</span> - you marked this not interested.
        </p>
        <button
          onClick={() => onRestore(problem.id)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white"
        >
          <Undo2 size={12} /> Show again
        </button>
      </div>
    );
  }

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

      <AiRationale ai={match.ai} />
      <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Suggested team</p>
      <SuggestedTeam team={match.team} />

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        {actions}
        <button
          onClick={() => onDismiss(problem.id)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          title="Show this lower down, so other problems get a turn"
        >
          <EyeOff size={12} /> Not interested
        </button>
      </div>
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
  const { matches, dismissed, dismiss, restore, restoreAll } = useBestMatchProblems(limit);
  const [hidden, setHidden] = useState<{ id: string; title: string } | null>(null);
  if (!matches || matches.length === 0) return null;
  // Nothing undismissed left to offer: the server falls back to the set-aside problems, and rather
  // than a column of grey strips the panel says so and offers to bring them all back.
  const exhausted = matches.every((m) => m.feedback?.dismissed);

  const handleDismiss = async (problemId: string) => {
    const title = matches.find((m) => m.problem.id === problemId)?.problem.title ?? "That problem";
    if (await dismiss(problemId)) setHidden({ id: problemId, title });
  };
  const handleRestore = async (problemId: string) => {
    if (await restore(problemId)) setHidden(null);
  };

  return (
    <section className="space-y-4" aria-label="Best match problems">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles size={18} className={accent === "indigo" ? "text-indigo-600" : "text-blue-600"} />
          <h2 className="text-lg font-bold text-slate-800">Best Match Problems</h2>
          {!exhausted && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${accent === "indigo" ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700"}`}>
              {matches.length}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Open problems your people are best placed to solve, with the team the AI would put together from their expertise.
        </p>
      </div>

      {exhausted ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center">
          <p className="text-sm font-semibold text-slate-700">You have set aside every problem we can match you to.</p>
          <p className="mt-1 text-xs text-slate-500">
            {dismissed.length} problem{dismissed.length === 1 ? "" : "s"} marked not interested. New ones appear here as
            citizens report them - or bring these back to look again.
          </p>
          <button
            onClick={() => void restoreAll()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
          >
            <Undo2 size={12} /> Show all again
          </button>
        </div>
      ) : (
        <>
          {hidden && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-600" role="status">
              <span>
                Moved <span className="font-semibold">{hidden.title}</span> to the bottom and re-ranked the rest.
              </span>
              <button onClick={() => void handleRestore(hidden.id)} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:underline">
                <Undo2 size={12} /> Undo
              </button>
            </div>
          )}
          <div className="space-y-4">
            {matches.map((item, index) => (
              <MatchCard
                key={item.problem.id}
                item={item}
                rank={index + 1}
                actions={renderActions?.(item.problem.id)}
                onDismiss={(id) => void handleDismiss(id)}
                onRestore={(id) => void handleRestore(id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Ranked below every problem still on offer: set aside, not discarded, and one click from returning. */}
      {!exhausted && dismissed.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <EyeOff size={12} /> Not interested ({dismissed.length})
            </p>
            {dismissed.length > 1 && (
              <button onClick={() => void restoreAll()} className="text-xs font-bold text-slate-600 hover:underline">
                Show all again
              </button>
            )}
          </div>
          <ul className="space-y-1">
            {dismissed.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-white">
                <span className="min-w-0 truncate text-sm text-slate-500">{item.title}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-xs tabular-nums text-slate-400">{Math.round(item.score * 100)}%</span>
                  <button
                    onClick={() => void handleRestore(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:underline"
                  >
                    <Undo2 size={12} /> Show again
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
