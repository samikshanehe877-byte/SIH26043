"use client";

import Link from "next/link";
import { Users2, ArrowRight, Handshake } from "lucide-react";
import { Team } from "@/types/mentor";
import { useMentor } from "@/context/MentorContext";

interface TeamCardProps {
  team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
  const { students } = useMentor();

  const teamMembers = students.filter((s) => team.studentIds.includes(s.id));
  const leader = students.find((s) => s.id === team.leaderStudentId);

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-bold">
              <Users2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {team.name}
              </h3>
              <p className="text-[11px] font-mono text-slate-400">{team.id}</p>
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
              team.status === "Completed"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {team.status}
          </span>
        </div>

        {/* Associated Challenge */}
        <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
            Assigned Challenge
          </p>
          <p className="text-xs font-bold text-slate-800 line-clamp-1">
            {team.challengeTitle}
          </p>
        </div>

        {/* Members Avatars & Leader */}
        <div className="mt-3.5 flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            {teamMembers.slice(0, 4).map((member) => (
              <div
                key={member.id}
                title={`${member.name} (${member.department})`}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-emerald-600 to-teal-700 text-[10px] font-bold text-white shadow-xs"
              >
                {member.avatar}
              </div>
            ))}
            {teamMembers.length > 4 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-600">
                +{teamMembers.length - 4}
              </div>
            )}
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400">Team Leader: </span>
            <span className="text-xs font-bold text-slate-800">
              {leader ? leader.name : "Unassigned"}
            </span>
          </div>
        </div>

        {/* Tasks Stats Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-2.5 text-center">
          <div>
            <p className="text-sm font-bold text-slate-800">{team.tasksTotal}</p>
            <p className="text-[10px] text-slate-400">Total Tasks</p>
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-600">{team.tasksCompleted}</p>
            <p className="text-[10px] text-slate-400">Completed</p>
          </div>
          <div>
            <p className="text-sm font-bold text-amber-600">
              {team.tasksInProgress + team.tasksPendingReview}
            </p>
            <p className="text-[10px] text-slate-400">In Progress</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-600">Team Delivery Progress</span>
            <span className="font-bold text-emerald-600">{team.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${team.progress}%` }}
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
          <div className="flex items-center gap-1 truncate">
            <Handshake size={12} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{team.industrySupport}</span>
          </div>
          <span className="text-[10px] text-slate-400 flex-shrink-0">{team.lastActivity}</span>
        </div>
      </div>

      {/* Action */}
      <div className="mt-5 border-t border-slate-100 pt-3 text-right">
        <Link
          href={`/mentor/teams/${team.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800"
        >
          <span>View Team Details</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

