"use client";

import { MapPin, Calendar, Users, Brain, Info, CheckCircle2, XCircle, UserPlus } from "lucide-react";
import { UniversityChallenge } from "@/types/universityChallenge";
import { ChallengeStatusBadge, ChallengePriorityBadge } from "./ChallengeBadges";

interface ChallengeCardProps {
  challenge: UniversityChallenge;
  onViewDetails: (challenge: UniversityChallenge) => void;
  onAccept?: (id: number) => void;
  onReject?: (challenge: UniversityChallenge) => void;
  onAssignMentor?: (challenge: UniversityChallenge) => void;
}

const categoryColors: Record<string, string> = {
  Infrastructure:         "bg-slate-100 text-slate-700",
  Environment:            "bg-green-50 text-green-700",
  Education:              "bg-indigo-50 text-indigo-700",
  Healthcare:             "bg-red-50 text-red-700",
  Transportation:         "bg-yellow-50 text-yellow-700",
  "Public Safety":        "bg-orange-50 text-orange-700",
  Technology:             "bg-cyan-50 text-cyan-700",
  "Water and Sanitation": "bg-blue-50 text-blue-700",
  Other:                  "bg-slate-100 text-slate-600",
};

export default function ChallengeCard({
  challenge,
  onViewDetails,
  onAccept,
  onReject,
  onAssignMentor,
}: ChallengeCardProps) {
  const progressColor =
    challenge.progress === 100
      ? "bg-green-500"
      : challenge.progress >= 60
      ? "bg-indigo-500"
      : challenge.progress >= 30
      ? "bg-amber-500"
      : "bg-slate-300";

  const showAccept  = challenge.status === "Awaiting Decision" && onAccept;
  const showReject  = challenge.status === "Awaiting Decision" && onReject;
  const showMentor  =
    (challenge.status === "Accepted" && !challenge.assignedMentorId) && onAssignMentor;
  const showChange  =
    (challenge.status === "Mentor Assigned" || challenge.status === "Active") &&
    onAssignMentor;

  return (
    <article className="group rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-sm font-bold text-white shadow-sm">
            {challenge.citizenAvatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{challenge.citizenName}</p>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={11} />
              <span>{challenge.location}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <ChallengeStatusBadge status={challenge.status} />
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={11} />
            <span>{challenge.dateSubmitted}</span>
          </div>
        </div>
      </div>

      {/* Category + Title + Description */}
      <div className="px-5 pb-3">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              categoryColors[challenge.category] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            {challenge.category}
          </span>
          <ChallengePriorityBadge priority={challenge.priority} />
        </div>
        <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
          {challenge.title}
        </h3>
        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed line-clamp-2">
          {challenge.description}
        </p>
      </div>

      {/* AI Score + Supporters + Dept */}
      <div className="mx-5 mb-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5">
          <Brain size={13} className="text-indigo-500" />
          <span className="text-xs font-bold text-indigo-700">
            AI Match: {challenge.aiMatchScore}%
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Users size={13} />
          <span>{challenge.supporters} supporters</span>
        </div>
        {challenge.assignedDepartmentName && (
          <span className="text-xs text-slate-500">
            Dept:{" "}
            <span className="font-medium text-slate-700">
              {challenge.assignedDepartmentName}
            </span>
          </span>
        )}
        {challenge.assignedMentorName && (
          <span className="text-xs text-slate-500">
            Mentor:{" "}
            <span className="font-medium text-slate-700">
              {challenge.assignedMentorName}
            </span>
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="mx-5 mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs text-slate-400">Progress</span>
          <span className="text-xs font-semibold text-slate-600">{challenge.progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${challenge.progress}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-50 px-5 py-3">
        <button
          onClick={() => onViewDetails(challenge)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <Info size={13} /> View Details
        </button>

        {showAccept && (
          <button
            onClick={() => onAccept!(challenge.id)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <CheckCircle2 size={13} /> Accept
          </button>
        )}

        {showReject && (
          <button
            onClick={() => onReject!(challenge)}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          >
            <XCircle size={13} /> Reject
          </button>
        )}

        {showMentor && (
          <button
            onClick={() => onAssignMentor!(challenge)}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-cyan-700"
          >
            <UserPlus size={13} /> Assign Mentor
          </button>
        )}

        {showChange && (
          <button
            onClick={() => onAssignMentor!(challenge)}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
          >
            <UserPlus size={13} /> Change Mentor
          </button>
        )}
      </div>
    </article>
  );
}
