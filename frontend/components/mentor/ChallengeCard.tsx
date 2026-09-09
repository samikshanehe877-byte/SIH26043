"use client";

import Link from "next/link";
import {
  MapPin,
  Calendar,
  Building2,
  Users,
  Sparkles,
  ArrowRight,
  Handshake,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { MentorChallenge } from "@/types/mentor";
import { ChallengePriorityBadge, ChallengeStatusBadge } from "./ChallengeBadges";
import { useMentor } from "@/context/MentorContext";

interface ChallengeCardProps {
  challenge: MentorChallenge;
  onCreateTeam?: (challenge: MentorChallenge) => void;
}

export default function ChallengeCard({
  challenge,
  onCreateTeam,
}: ChallengeCardProps) {
  const { getTeamForChallenge } = useMentor();
  const team = getTeamForChallenge(challenge.id);

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md">
      <div>
        {/* Top meta */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 font-mono">
              {challenge.id}
            </span>
            <span className="rounded-lg bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
              {challenge.category}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <ChallengePriorityBadge priority={challenge.priority} />
            <ChallengeStatusBadge status={challenge.status} />
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
          {challenge.title}
        </h3>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
          {challenge.description}
        </p>

        {/* AI Analysis Pill */}
        <div className="mt-3.5 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-2.5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900">
              <Sparkles size={13} className="text-indigo-600" />
              <span>AI Analysis Summary</span>
            </div>
            <span className="text-[10px] font-bold text-indigo-700">
              {challenge.aiAnalysis.confidence}% match
            </span>
          </div>
          <p className="text-[11px] text-slate-600 line-clamp-1">
            {challenge.aiAnalysis.summary}
          </p>
        </div>

        {/* Info Grid */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5 truncate">
            <Building2 size={13} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{challenge.assignedDepartment}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Calendar size={13} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">Assigned: {challenge.assignedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin size={13} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{challenge.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Handshake size={13} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{challenge.industrySupportStatus}</span>
          </div>
        </div>

        {/* Skills preview */}
        <div className="mt-3 flex flex-wrap gap-1">
          {challenge.requiredSkills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}
          {challenge.requiredSkills.length > 3 && (
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 font-medium">
              +{challenge.requiredSkills.length - 3} more
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-600">Overall Progress</span>
            <span className="font-bold text-emerald-600">{challenge.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
              style={{ width: `${challenge.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
        {team ? (
          <Link
            href={`/mentor/teams/${team.id}`}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            <Users size={14} />
            <span>{team.name} (Active)</span>
          </Link>
        ) : (
          <button
            onClick={() => onCreateTeam && onCreateTeam(challenge)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
          >
            <Plus size={14} />
            Create Team
          </button>
        )}

        <Link
          href={`/mentor/challenges/${challenge.id}`}
          className="flex items-center gap-1 text-xs font-bold text-slate-700 transition hover:text-emerald-600"
        >
          <span>View Challenge</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

