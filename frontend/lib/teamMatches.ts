"use client";

import { useEffect, useState } from "react";
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
}

export type MatchLevel = "HIGH" | "MEDIUM" | "LOW";

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
}

export interface TeamMatches {
  problem_id: string;
  needs: Need[];
  universities: OrganizationMatch[];
  industries: OrganizationMatch[];
  people: MatchedPerson[];
}

export function useTeamMatches(problemId: string | null) {
  const [data, setData] = useState<TeamMatches | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!problemId) return;
    let cancelled = false;
    apiJson<TeamMatches>(`/problems/${problemId}/team-matches?top_k=3`)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setData(null);
          setError(err instanceof Error ? err.message : "Could not load team suggestions");
        }
      });
    return () => {
      cancelled = true;
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
}

/** The signed-in organization's best-matching open problems (via /api/organization/problem-matches). */
export function useBestMatchProblems(limit = 3) {
  const [matches, setMatches] = useState<BestMatchProblem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/organization/problem-matches?top_k=${limit}`, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(String(body.error ?? body.detail ?? `Request failed (${response.status})`));
        if (!cancelled) setMatches((body.matches ?? []) as BestMatchProblem[]);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load matches");
      });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { matches, error, isLoading: !matches && !error };
}
