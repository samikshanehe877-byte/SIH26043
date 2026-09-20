"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiJson } from "./projects";

/** Response of ai/api.py's GET /problems/{id}/team-matches (built by ai/people_matcher.py). */
export interface Need {
  kind: "domain" | "skill";
  label: string;
  weight: number;
  source: "classification" | "text" | "capability";
}

export interface MatchedPerson {
  id: string;
  user_id: string;
  name: string;
  kind: "student" | "faculty" | "mentor" | "employee" | "expert";
  title: string | null;
  unit_name: string | null;
  org_name: string;
  years: number | null;
  specialization: string | null;
  score?: number;
  covers?: string[];
  reasons?: string[];
  /** Team members only: the needs this person adds that no one before them covered. */
  brings?: string[];
  /** Team members added for the role mix: needs they can back up even though someone else already covers them. */
  supports?: string[];
  /** Guides advise and review (mentors, faculty, experts); contributors do the hands-on work. */
  role_group?: "guide" | "contributor";
  /** Set when the AI picked the team: the role this person plays on the project, and why they are on it. */
  role_in_team?: string | null;
  reason?: string | null;
}

export type MatchLevel = "HIGH" | "MEDIUM" | "LOW";

/** Who chose a team: "gemini" (AI-selected), "pending" (rule-based for now, AI still working) or "rules". */
export interface AiInfo {
  source: "gemini" | "pending" | "rules";
  summary?: string | null;
}

export interface OrganizationMatch {
  org_id: string;
  org_type: "university" | "industry";
  name: string;
  score: number;
  match_level: MatchLevel;
  coverage: number;
  covered: string[];
  missing: string[];
  team: MatchedPerson[];
  relevant_people: number;
  total_people: number;
  reasons: string[];
  ai?: AiInfo;
}

export interface TeamMatches {
  problem_id: string;
  ai_pending?: boolean;
  needs: Need[];
  universities: OrganizationMatch[];
  industries: OrganizationMatch[];
  people: MatchedPerson[];
}

/** The AI works in the background, so a first answer is rule-based; keep asking until it lands (about a minute at most). */
const POLL_INTERVAL_MS = 5000;
const MAX_POLLS = 12;

function isPending(body: { ai_pending?: boolean }, matches: { ai?: AiInfo }[]) {
  return body.ai_pending === true || matches.some((m) => m.ai?.source === "pending");
}

export function useTeamMatches(problemId: string | null) {
  const [data, setData] = useState<TeamMatches | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!problemId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let polls = 0;

    const load = () => {
      apiJson<TeamMatches>(`/problems/${problemId}/team-matches?top_k=3`)
        .then((result) => {
          if (cancelled) return;
          setData(result);
          setError(null);
          if (isPending(result, [...result.universities, ...result.industries]) && polls++ < MAX_POLLS) {
            timer = setTimeout(load, POLL_INTERVAL_MS);
          }
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setData(null);
          setError(err instanceof Error ? err.message : "Could not load team suggestions");
        });
    };
    load();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [problemId]);

  return { data, error, isLoading: !!problemId && !data && !error };
}

export interface BestMatchProblem {
  problem: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    district: string | null;
    location: string | null;
  };
  needs: Need[];
  match: OrganizationMatch;
  /** What this person has already done with the problem: how often it was shown, and whether they marked it not interested. */
  feedback?: { views: number; dismissed: boolean };
}

/** A problem the signed-in person marked "not interested": listed under the cards, not carded itself. */
export interface DismissedProblem {
  id: string;
  title: string;
  score: number;
}

type FeedbackAction = "seen" | "dismiss" | "restore";

/** The API takes at most this many ids per call (ai/match_feedback.py's MAX_IDS_PER_CALL). */
const MAX_IDS_PER_CALL = 20;

async function sendFeedback(action: FeedbackAction, problemIds: string[]): Promise<boolean> {
  try {
    const response = await fetch("/api/organization/problem-matches/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, problemIds }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/** Sends one action for any number of ids, in batches the API will accept. */
async function sendFeedbackBatched(action: FeedbackAction, problemIds: string[]): Promise<boolean> {
  const batches: Promise<boolean>[] = [];
  for (let i = 0; i < problemIds.length; i += MAX_IDS_PER_CALL) {
    batches.push(sendFeedback(action, problemIds.slice(i, i + MAX_IDS_PER_CALL)));
  }
  const results = await Promise.all(batches);
  return results.length > 0 && results.every(Boolean);
}

/**
 * The signed-in organization's best-matching open problems (via /api/organization/problem-matches),
 * ordered by what this person has already seen or dismissed. Showing the cards counts as a view (once
 * per visit), so problems they have looked at give way to fresh ones next time; `dismiss` and
 * `restore` are the "Not interested" button and its undo, and both re-rank the list straight away.
 *
 * Every dismissal refetches, so the ranking is recomputed over all open problems and the next best
 * problem takes the freed slot. `dismissed` is what was set aside, ranked below everything else, for
 * the list under the cards; `restore` brings one back and `restoreAll` clears the slate.
 */
export function useBestMatchProblems(limit = 3) {
  const [matches, setMatches] = useState<BestMatchProblem[] | null>(null);
  const [dismissed, setDismissed] = useState<DismissedProblem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const alive = useRef(true);
  const reportedSeen = useRef(false);

  const load = useCallback(
    (polls = 0) => {
      if (timer.current) clearTimeout(timer.current);
      fetch(`/api/organization/problem-matches?top_k=${limit}`, { cache: "no-store" })
        .then(async (response) => {
          const body = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(String(body.error ?? body.detail ?? `Request failed (${response.status})`));
          if (!alive.current) return;
          const found = (body.matches ?? []) as BestMatchProblem[];
          setMatches(found);
          setDismissed((body.dismissed ?? []) as DismissedProblem[]);
          // Only cards actually on offer count as read; a row of "not interested" strips is not a view.
          const freshlySeen = found.filter((m) => !m.feedback?.dismissed).map((m) => m.problem.id);
          if (!reportedSeen.current && freshlySeen.length > 0) {
            reportedSeen.current = true;
            void sendFeedback("seen", freshlySeen);
          }
          if (isPending(body, found.map((m) => m.match)) && polls < MAX_POLLS) {
            timer.current = setTimeout(() => load(polls + 1), POLL_INTERVAL_MS);
          }
        })
        .catch((err: unknown) => {
          if (alive.current) setError(err instanceof Error ? err.message : "Could not load matches");
        });
    },
    [limit]
  );

  useEffect(() => {
    alive.current = true;
    load();
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [load]);

  const react = useCallback(
    async (action: "dismiss" | "restore", problemIds: string[]) => {
      if (problemIds.length === 0) return false;
      const ok = await sendFeedbackBatched(action, problemIds);
      // Reloading re-reports the cards as seen, so let the fresh list count as a new view.
      if (ok && alive.current) {
        reportedSeen.current = false;
        load();
      }
      return ok;
    },
    [load]
  );

  return {
    matches,
    dismissed,
    error,
    isLoading: !matches && !error,
    dismiss: (problemId: string) => react("dismiss", [problemId]),
    restore: (problemId: string) => react("restore", [problemId]),
    restoreAll: () => react("restore", dismissed.map((d) => d.id)),
  };
}
