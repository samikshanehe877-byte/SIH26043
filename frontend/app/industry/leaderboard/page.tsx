"use client";

import { getOrganizationName, useAuth } from "@/context/AuthContext";
import LeaderboardTable from "@/components/points/LeaderboardTable";

export default function IndustryLeaderboardPage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leaderboard</h1>
        <p className="mt-1 text-slate-500">
          Ranked by government-verified points. Taking on a project earns little on its own --
          seeing it through to implementation and impact is what counts.
        </p>
      </div>
      <LeaderboardTable accent="blue" highlightOrgType="industry" highlightOrgName={getOrganizationName(user)} />
    </div>
  );
}
