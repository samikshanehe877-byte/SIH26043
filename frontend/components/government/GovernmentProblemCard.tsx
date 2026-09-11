"use client";

import { useState } from "react";
import { MapPin, Clock, ThumbsUp, MessageCircle, Share2, Bookmark, ChevronRight, Users, Building2, CheckCircle2, Activity } from "lucide-react";
import { RegionalProblem } from "@/types/government";
import Button from "../Button";

interface GovernmentProblemCardProps {
  problem: RegionalProblem;
  onViewDetails: (problem: RegionalProblem) => void;
  onToggleSupport: (id: number) => void;
  onToggleSave: (id: number) => void;
  onAssign: (id: number) => void;
  onVerify: (id: number) => void;
}

const priorityColors: Record<string, { bg: string; text: string }> = {
  Critical: { bg: "bg-red-50", text: "text-red-600" },
  High: { bg: "bg-orange-50", text: "text-orange-600" },
  Medium: { bg: "bg-yellow-50", text: "text-yellow-600" },
  Low: { bg: "bg-blue-50", text: "text-blue-600" },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "bg-slate-50", text: "text-slate-600" },
  "Under Review": { bg: "bg-blue-50", text: "text-blue-600" },
  Verified: { bg: "bg-green-50", text: "text-green-600" },
  Rejected: { bg: "bg-red-50", text: "text-red-600" },
  "Returned for Correction": { bg: "bg-yellow-50", text: "text-yellow-600" },
};

export default function GovernmentProblemCard({
  problem,
  onViewDetails,
  onToggleSupport,
  onToggleSave,
  onAssign,
  onVerify,
}: GovernmentProblemCardProps) {
  const [shared, setShared] = useState(false);
  const { bg: priorityBg, text: priorityText } = priorityColors[problem.priority] ||
    { bg: "bg-slate-50", text: "text-slate-600" };
  const { bg: statusBg, text: statusText } =
    statusColors[problem.verificationStatus] ||
    { bg: "bg-slate-50", text: "text-slate-600" };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <article
      className="group rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-sm">
            {problem.citizenAvatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{problem.citizenName}</p>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={11} />
              <span>{problem.location}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusBg} ${statusText}`}>
            {problem.verificationStatus}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={11} />
            <span>{problem.dateSubmitted}</span>
          </div>
        </div>
      </div>

      {/* Category + Title + Description */}
      <div className="px-5 pb-3">
        <span className="mb-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          {problem.category}
        </span>
        <h3 className="mt-3 text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
          {problem.title}
        </h3>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3">
          {problem.description}
        </p>
      </div>

      {/* Image placeholder */}
      {problem.image && (
        <div className="mx-5 mb-3 flex h-36 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-5xl border border-slate-100">
          {problem.image}
        </div>
      )}

      {/* Progress bar */}
      <div className="mx-5 mb-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-slate-400">Solution Progress</span>
          <span className="text-xs font-semibold text-blue-600">{problem.progress ?? 0}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${problem.progress ?? 0}%` }}
          />
        </div>
      </div>

      {/* Government-specific info */}
      {problem.assignedTo || problem.matchedUniversities.length > 0 || problem.matchedIndustry.length > 0 && (
        <div className="mx-5 mb-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-700">Government Action</h4>
            <Button variant="outline" size="sm" onClick={() => onAssign(problem.id)}>
              Assign Officer
            </Button>
          </div>
          {problem.assignedTo && (
            <div className="flex items-center gap-2 text-sm">
              <Users size={12} className="text-slate-400" />
              <span>Assigned: {problem.assignedTo}</span>
            </div>
          )}
          {!problem.assignedTo && problem.matchedUniversities.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 size={12} className="text-slate-400" />
              <span>Ready for university matching</span>
            </div>
          )}
          {problem.matchedIndustry.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Users size={12} className="text-slate-400" />
              <span>Industry partners available</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-slate-50 px-5 py-3">
        <div className="flex items-center gap-1">
          {/* Support */}
          <button
            onClick={() => onToggleSupport(problem.id)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all
              ${problem.isSupported
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"}
            `}
          >
            <ThumbsUp size={14} className={problem.isSupported ? "fill-white" : ""} />
            <span>{problem.supporters}</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => onViewDetails(problem)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <MessageCircle size={14} />
            <span>{problem.comments?.length || 0}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm transition
              ${shared ? "bg-green-50 text-green-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}
            `}
          >
            <Share2 size={14} />
            <span className="text-xs">{shared ? "Copied!" : "Share"}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Save */}
          <button
            onClick={() => onToggleSave(problem.id)}
            className={`rounded-xl p-1.5 transition
              ${problem.isSaved ? "text-amber-500" : "text-slate-400 hover:text-amber-500"}
            `}
          >
            <Bookmark size={16} className={problem.isSaved ? "fill-amber-500" : ""} />
          </button>

          {/* Verify Button */}
          <button
            onClick={() => onVerify(problem.id)}
            className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-green-600 transition hover:bg-green-50"
          >
            Verify <CheckCircle2 size={13} />
          </button>

          {/* View Details */}
          <button
            onClick={() => onViewDetails(problem)}
            className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Details <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}