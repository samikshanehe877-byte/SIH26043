"use client";

import { useState } from "react";
import { Building2, Factory, Trophy, User } from "lucide-react";
import { Accent, ACCENTS, PartyType } from "@/lib/projects";
import { LeaderboardEntry, useOrganizationLeaderboard, useUserLeaderboard } from "@/lib/points";

const PERIODS: { id: "all" | "30d" | "90d" | "365d"; label: string }[] = [
  { id: "all", label: "All Time" },
  { id: "365d", label: "This Year" },
  { id: "90d", label: "Last 90 Days" },
  { id: "30d", label: "This Month" },
];

/**
 * University/industry organisation leaderboard, with an "Individuals" tab for personal points.
 * Shared by the university and industry portal leaderboard pages -- same table, different accent
 * and which row gets highlighted as "you". Both leaderboards are independent aggregations over
 * the same point_events ledger (see ai/points_storage.py) -- an organisation's total is never the
 * sum of its members' individual totals, on purpose, so this table never sums the two views.
 */
export default function LeaderboardTable({
  accent,
  highlightOrgType,
  highlightOrgName,
}: {
  accent: Accent;
  highlightOrgType?: PartyType;
  highlightOrgName?: string;
}) {
  const colors = ACCENTS[accent];
  const [scope, setScope] = useState<"all" | PartyType>("all");
  const [period, setPeriod] = useState<"all" | "30d" | "90d" | "365d">("all");
  const [view, setView] = useState<"organizations" | "individuals">("organizations");

  // Both hooks always run (rules of hooks) -- whichever view is active decides what's shown.
  const orgBoard = useOrganizationLeaderboard(scope, { period, limit: 50 });
  const userBoard = useUserLeaderboard({ period, limit: 50 });
  const { data: rows, isLoading } = view === "organizations" ? orgBoard : userBoard;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
          {(["organizations", "individuals"] as const).map((id) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                view === id ? colors.active : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {id === "organizations" ? "Organizations" : "Individuals"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {view === "organizations" && (
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as "all" | PartyType)}
              className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ${colors.ring}`}
            >
              <option value="all">All</option>
              <option value="university">Universities</option>
              <option value="industry">Industries</option>
            </select>
          )}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            className={`rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ${colors.ring}`}
          >
            {PERIODS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {isLoading && rows.length === 0 && (
          <div className="space-y-2 p-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        )}
        {!isLoading && rows.length === 0 && (
          <p className="py-14 text-center text-sm text-slate-500">No verified milestones yet for this filter.</p>
        )}
        {rows.map((row) => (
          <LeaderboardRow
            key={`${row.actor_type}-${row.actor_id}`}
            row={row}
            accent={accent}
            isYou={
              view === "organizations" &&
              !!highlightOrgType &&
              !!highlightOrgName &&
              row.actor_type === highlightOrgType &&
              row.actor_id === highlightOrgName
            }
          />
        ))}
      </div>
    </div>
  );
}

function LeaderboardRow({ row, accent, isYou }: { row: LeaderboardEntry; accent: Accent; isYou: boolean }) {
  const colors = ACCENTS[accent];
  const Icon = row.actor_type === "university" ? Building2 : row.actor_type === "industry" ? Factory : User;
  return (
    <div className={`flex items-center gap-4 border-b border-slate-50 px-5 py-3.5 last:border-b-0 ${isYou ? colors.soft : ""}`}>
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          row.rank <= 3 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        {row.rank <= 3 ? <Trophy size={14} /> : row.rank}
      </span>
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {row.actor_name}
          {isYou && <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${colors.soft}`}>You</span>}
        </p>
        <p className="text-xs text-slate-400">
          {row.verified_milestones} verified milestone{row.verified_milestones === 1 ? "" : "s"} ·{" "}
          {row.distinct_projects} project{row.distinct_projects === 1 ? "" : "s"}
        </p>
      </div>
      <span className={`text-lg font-bold ${colors.text}`}>{row.total_points}</span>
    </div>
  );
}
