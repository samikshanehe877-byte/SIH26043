"use client";

import Link from "next/link";
import { Users2, Award, Plus, CheckCircle2 } from "lucide-react";
import MentorHeader from "@/components/mentor/MentorHeader";
import TeamCard from "@/components/mentor/TeamCard";
import { useMentor } from "@/context/MentorContext";

export default function MyTeamsPage() {
  const { teams, challenges } = useMentor();

  const activeTeams = teams.filter((t) => t.status === "Active");
  const completedTeams = teams.filter((t) => t.status === "Completed");

  return (
    <div className="space-y-6">
      <MentorHeader
        title="My Student Teams"
        subtitle="Interdisciplinary student project squads formed and guided under your mentorship"
      />

      {/* Summary Banner */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Active Mentorship Squads ({teams.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Each student team is dedicated to exactly one societal challenge.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700 border border-emerald-100">
            {activeTeams.length} Active
          </span>
          <span className="rounded-full bg-green-50 px-3 py-1 font-bold text-green-700 border border-green-100">
            {completedTeams.length} Completed
          </span>
          <Link
            href="/mentor/challenges"
            className="rounded-xl bg-emerald-600 px-3.5 py-1.5 font-bold text-white shadow-2xs hover:bg-emerald-700 transition"
          >
            Assign New Team
          </Link>
        </div>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Users2 size={36} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">No teams created yet</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            Review your assigned challenges and click &quot;Create Team&quot; to form an interdisciplinary student squad.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}

