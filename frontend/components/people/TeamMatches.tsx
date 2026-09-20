"use client";

import { useState } from "react";
import { CircleAlert, Handshake, Sparkles } from "lucide-react";
import AiRationale from "@/components/people/AiRationale";
import SuggestedTeam from "@/components/people/SuggestedTeam";
import PartnershipCard from "@/components/people/PartnershipCard";
import { useTeamMatches, type MatchLevel, type OrganizationMatch } from "@/lib/teamMatches";

const LEVEL_STYLE: Record<MatchLevel, string> = {
  HIGH: "bg-emerald-100 text-emerald-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  LOW: "bg-slate-100 text-slate-600",
};

function OrganizationCard({ match, rank }: { match: OrganizationMatch; rank: number }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">#{rank}</p>
          <p className="text-lg font-bold text-slate-900">{match.name}</p>
          <p className="text-xs text-slate-500">
            {match.relevant_people} of {match.total_people} people have relevant experience
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${LEVEL_STYLE[match.match_level]}`}>
          {Math.round(match.score * 100)}% - {match.match_level}
        </span>
      </div>

      <div className="mt-3">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`Covers ${Math.round(match.coverage * 100)}% of what the problem needs`}>
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.round(match.coverage * 100)}%` }} />
        </div>
        <p className="mt-1 text-xs text-slate-500">Team covers {Math.round(match.coverage * 100)}% of what this problem needs</p>
      </div>

      {match.missing.length > 0 && (
        <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <CircleAlert size={13} className="text-amber-500" /> Not covered:
          {match.missing.map((label) => (
            <span key={label} className="rounded-md bg-red-50 px-1.5 py-0.5 font-medium text-red-700">
              {label}
            </span>
          ))}
        </p>
      )}

      <AiRationale ai={match.ai} />
      <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Suggested team</p>
      <SuggestedTeam team={match.team} />
    </div>
  );
}

/**
 * For one problem: what it needs, and the universities and industries whose real people (from the
 * shared directory) would together cover those needs, each with the team the AI would assemble.
 */
export default function TeamMatches({ problemId }: { problemId: string }) {
  const { data, error, isLoading } = useTeamMatches(problemId);
  const [chosenTab, setTab] = useState<"universities" | "industries" | null>(null);

  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />;
  if (error) return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!data) return null;

  if (data.needs.length === 0) {
    return (
      <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Not enough detail in this problem yet to tell which skills or problem areas it needs.
      </p>
    );
  }

  // Until the viewer picks a tab, open the first one that actually has matches.
  const tab = chosenTab ?? (data.universities.length === 0 && data.industries.length > 0 ? "industries" : "universities");
  const matches = data[tab];
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <Sparkles size={12} /> What this problem needs
        </p>
        <div className="flex flex-wrap gap-1.5">
          {data.needs.map((need) => {
            const mustHave = (need.requirement ?? (need.weight >= 1.5 ? "required" : "helpful")) === "required";
            return (
              <span
                key={`${need.kind}-${need.label}`}
                title={mustHave ? "Must-have: what this problem is about" : "Helpful: one way of doing the work"}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                  mustHave ? "bg-indigo-100 font-semibold text-indigo-800 ring-1 ring-indigo-200" : "bg-slate-100 text-slate-700"
                }`}
              >
                {need.label}
                {mustHave && <span className="ml-1 text-indigo-500">*</span>}
              </span>
            );
          })}
        </div>
      </div>

      {data.partnerships?.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <Handshake size={12} /> Stronger together
          </p>
          <p className="mb-3 text-xs text-slate-500">
            Pairs that cover what neither covers alone. Each side is listed with what only it brings.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {data.partnerships.map((pair, index) => (
              <PartnershipCard key={pair.organizations.map((o) => o.org_id).join("+")} pair={pair} rank={index + 1} />
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 text-sm font-semibold" role="tablist">
        {(["universities", "industries"] as const).map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-lg px-3 py-1.5 transition ${tab === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {key === "universities" ? "Universities" : "Industries"} ({data[key].length})
          </button>
        ))}
      </div>

      {matches.length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          No {tab} have people with relevant experience for this problem yet.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {matches.map((match, index) => (
            <OrganizationCard key={match.org_id} match={match} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
