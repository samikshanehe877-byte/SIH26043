"use client";

import { useEffect, useState } from "react";
import TeamMatches from "@/components/people/TeamMatches";
import { apiJson } from "@/lib/projects";

interface ProblemRow {
  id: string;
  title?: string | null;
  problem_text: string;
  district?: string | null;
  status?: string | null;
}

/**
 * Pick a verified problem and see which universities and industries have the people to solve it,
 * with the team the AI would assemble from each. Reads real people from the shared directory.
 */
export default function GovernmentMatchmakingPage() {
  const [problems, setProblems] = useState<ProblemRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    apiJson<ProblemRow[]>("/problems?limit=100")
      .then((rows) => {
        setProblems(rows);
        setSelectedId((current) => current ?? rows[0]?.id ?? null);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load problems"));
  }, []);

  const selected = problems?.find((p) => p.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Team Matchmaking</h1>
        <p className="mt-1 text-slate-500">
          Universities and industries are ranked by how well their people, together, cover what a problem needs.
        </p>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {!problems && !error && <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />}
      {problems && problems.length === 0 && (
        <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">There are no verified problems to match yet.</p>
      )}

      {problems && problems.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <ul className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
            {problems.map((problem) => (
              <li key={problem.id}>
                <button
                  onClick={() => setSelectedId(problem.id)}
                  aria-current={problem.id === selectedId}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    problem.id === selectedId ? "border-emerald-400 bg-emerald-50" : "border-slate-100 bg-white hover:border-slate-300"
                  }`}
                >
                  <p className="line-clamp-2 text-sm font-semibold text-slate-900">{problem.title || problem.problem_text}</p>
                  {problem.district && <p className="mt-0.5 text-xs text-slate-500">{problem.district}</p>}
                </button>
              </li>
            ))}
          </ul>

          <section aria-live="polite">
            {selected && (
              <>
                <h2 className="mb-4 text-lg font-bold text-slate-900">{selected.title || selected.problem_text}</h2>
                <TeamMatches key={selected.id} problemId={selected.id} />
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
