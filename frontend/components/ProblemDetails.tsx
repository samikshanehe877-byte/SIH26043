"use client";

import { useState } from "react";
import { X, MapPin, Calendar, Building2, ThumbsUp, Send, Users, Handshake, CheckCircle2, Trash2 } from "lucide-react";
import { Problem } from "@/types/problem";
import { currentUser } from "@/data/problems";
import { useProblems } from "@/context/ProblemsContext";
import StatusBadge from "./StatusBadge";
import ProgressTracker from "./ProgressTracker";

interface ProblemDetailsProps {
  problem: Problem;
  onClose: () => void;
  onToggleSupport: (id: number | string) => void;
}

export default function ProblemDetails({ problem, onClose, onToggleSupport }: ProblemDetailsProps) {
  const { selectVolunteer, withdrawVolunteerRequest } = useProblems();
  const [localProblem, setLocalProblem] = useState<Problem | null>(null);
  const displayProblem = localProblem ?? problem;
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(problem.comments);
  const isGiver = displayProblem.citizenName === currentUser.name;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setLocalComments((prev) => [
      ...prev,
      { id: Date.now(), author: "Sarthak Nehe", avatar: "SN", text: commentText.trim(), timeAgo: "Just now" },
    ]);
    setCommentText("");
  };

  const handleSelectVolunteer = async (solverType: "university" | "industry", solverName: string) => {
    const success = await selectVolunteer(displayProblem.id, solverType, solverName);
    if (success) {
      const updatedVolunteers = (displayProblem.volunteers ?? []).map((v) => {
        if (v.solverType === solverType && v.solverName === solverName) {
          return { ...v, status: "accepted" as const };
        }
        if (v.status === "volunteered") {
          return { ...v, status: "rejected" as const };
        }
        return v;
      });
      setLocalProblem({
        ...displayProblem,
        volunteers: updatedVolunteers,
        status: "Assigned to University",
        assignedByGiver: true,
      });
    }
  };

  const handleWithdrawVolunteer = async (solverType: "university" | "industry", solverName: string) => {
    const success = await withdrawVolunteerRequest(displayProblem.id, solverType, solverName);
    if (success) {
      const updatedVolunteers = (displayProblem.volunteers ?? []).map((v) =>
        v.solverType === solverType && v.solverName === solverName
          ? { ...v, status: "withdrawn" as const }
          : v
      );
      setLocalProblem({ ...displayProblem, volunteers: updatedVolunteers });
    }
  };

  const activeVolunteers = (displayProblem.volunteers ?? []).filter((v) => v.status === "volunteered" || v.status === "accepted");
  const acceptedVolunteer = (displayProblem.volunteers ?? []).find((v) => v.status === "accepted");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b border-slate-100 p-5">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={displayProblem.status} />
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {displayProblem.category}
              </span>
              {displayProblem.problemNature && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  displayProblem.problemNature === "Technical"
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : displayProblem.problemNature === "Non-Technical"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  {displayProblem.problemNature === "Technical" ? "⚙️ Technical" : displayProblem.problemNature === "Non-Technical" ? "🤝 Non-Technical" : "🌐 Hybrid"}
                </span>
              )}
              {displayProblem.problemGiverType && displayProblem.problemGiverType !== "individual" && (
                <span className="rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold">
                  👥 {displayProblem.communityGroupName || "Community Group"}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">{displayProblem.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-5 p-5">
            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-400" />
                {displayProblem.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" />
                Posted {displayProblem.date}
              </span>
              <span className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {displayProblem.citizenAvatar}
                </div>
                {displayProblem.citizenName}
              </span>
            </div>

            {/* Structured Scope Card (if available) */}
            {(displayProblem.affectedPopulation || displayProblem.frequency || displayProblem.suggestedIntervention || (displayProblem.requiredCapabilities && displayProblem.requiredCapabilities.length > 0)) && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    AI-Structured Scope & Requirements
                  </h4>
                  {displayProblem.confirmedByGiver && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      ✓ Citizen Confirmed
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {displayProblem.affectedPopulation && (
                    <div className="rounded-xl bg-white p-2.5 border border-slate-100">
                      <span className="font-semibold text-slate-400 block mb-0.5">Affected Population</span>
                      <span className="font-medium text-slate-800">{displayProblem.affectedPopulation}</span>
                    </div>
                  )}
                  {displayProblem.frequency && (
                    <div className="rounded-xl bg-white p-2.5 border border-slate-100">
                      <span className="font-semibold text-slate-400 block mb-0.5">Recurrence Pattern</span>
                      <span className="font-medium text-slate-800">{displayProblem.frequency}</span>
                    </div>
                  )}
                </div>

                {displayProblem.requiredCapabilities && displayProblem.requiredCapabilities.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-500 text-[11px] block mb-1.5">Required Capabilities & Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {displayProblem.requiredCapabilities.map((cap, i) => (
                        <span key={i} className="rounded-lg bg-white border border-blue-100 text-blue-700 px-2 py-0.5 text-[11px] font-semibold shadow-2xs">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {displayProblem.suggestedIntervention && (
                  <div className="rounded-xl bg-blue-50/60 border border-blue-100/80 p-2.5 text-xs text-blue-900">
                    <span className="font-bold block mb-0.5">Suggested Intervention Vector:</span>
                    <span>{displayProblem.suggestedIntervention}</span>
                  </div>
                )}

                {displayProblem.rawInput && displayProblem.rawInput !== displayProblem.description && (
                  <details className="text-xs text-slate-500 cursor-pointer pt-1">
                    <summary className="font-semibold hover:text-slate-800">View original raw citizen report</summary>
                    <p className="mt-1.5 rounded-lg bg-white p-2.5 border border-slate-200/80 italic text-slate-700">
                      &ldquo;{displayProblem.rawInput}&rdquo;
                    </p>
                  </details>
                )}
              </div>
            )}

            {/* Image */}
            {displayProblem.image && (
              <div className="flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 text-6xl border border-slate-100">
                {displayProblem.image}
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="mb-2 text-sm font-bold text-slate-700">Detailed Statement</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{displayProblem.description}</p>
            </div>

            {/* Current Assignment (if a volunteer was accepted) */}
            {acceptedVolunteer && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  {acceptedVolunteer.solverType === "university" ? (
                    <Building2 size={16} className="text-emerald-600" />
                  ) : (
                    <Users size={16} className="text-emerald-600" />
                  )}
                  <span className="text-sm font-bold text-emerald-800">Assigned Solver</span>
                </div>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  <span className="font-semibold">{acceptedVolunteer.solverName}</span> (
                  {acceptedVolunteer.solverType}) has been selected to solve this problem.
                  {acceptedVolunteer.proposal && (
                    <>
                      <br />
                      <span className="mt-1 block italic">&ldquo;{acceptedVolunteer.proposal}&rdquo;</span>
                    </>
                  )}
                </p>
              </div>
            )}

            {/* Previous Assignment (government-assigned, if any) */}
            {displayProblem.assignedUniversity && !acceptedVolunteer && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  <Building2 size={16} className="text-blue-600" />
                  <span className="text-sm font-bold text-blue-700">Current Action</span>
                </div>
                <p className="text-sm text-blue-600 leading-relaxed">
                  This problem has been assigned to{" "}
                  <span className="font-semibold">{displayProblem.assignedUniversity}</span> and is
                  currently being reviewed by the{" "}
                  <span className="font-semibold">{displayProblem.assignedDepartment}</span>.
                </p>
              </div>
            )}

            {/* Volunteer Applications (shown to problem giver when there are pending volunteers) */}
            {isGiver && activeVolunteers.length > 0 && !acceptedVolunteer && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Handshake size={18} className="text-amber-600" />
                  <h4 className="text-sm font-bold text-amber-900">Volunteer Solutions</h4>
                </div>
                <p className="text-xs text-amber-800">
                  {activeVolunteers.length} {activeVolunteers.length === 1 ? "institution has" : "institutions have"} volunteered. Review and accept the best fit — the selected solver and the others will be notified.
                </p>

                {activeVolunteers.map((v, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {v.solverType === "university" ? (
                          <Building2 size={14} className="text-blue-600" />
                        ) : (
                          <Users size={14} className="text-green-600" />
                        )}
                        <span className="text-sm font-semibold text-slate-900">
                          {v.solverName} <span className="text-xs text-slate-500 font-normal">({v.solverType})</span>
                        </span>
                      </div>
                      {isGiver && (
                        <button
                          onClick={() => handleSelectVolunteer(v.solverType, v.solverName)}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                          <CheckCircle2 size={12} />
                          Accept
                        </button>
                      )}
                    </div>
                    {v.proposal && (
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        &ldquo;{v.proposal}&rdquo;
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Calendar size={10} />
                      <span>Volunteered {v.submittedAt ? new Date(v.submittedAt).toLocaleDateString() : "recently"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Volunteer Applications (view-only for non-givers) */}
            {!isGiver && activeVolunteers.length > 0 && !acceptedVolunteer && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Handshake size={16} className="text-slate-600" />
                  <h4 className="text-sm font-bold text-slate-700">Volunteer Solutions</h4>
                </div>
                {activeVolunteers.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                    {v.solverType === "university" ? (
                      <Building2 size={12} className="text-blue-600" />
                    ) : (
                      <Users size={12} className="text-green-600" />
                    )}
                    <span className="font-medium">{v.solverName}</span>
                    <span className="text-slate-400">({v.solverType})</span>
                    <span className="text-amber-600 font-medium">• Pending giver selection</span>
                  </div>
                ))}
              </div>
            )}

            {/* My own volunteer application (for university/industry viewers) */}
            {!isGiver && displayProblem.volunteers && displayProblem.volunteers.length > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-xs text-slate-600">Your proposal is awaiting the problem giver's decision.</span>
                {displayProblem.volunteers.some((v) => v.status === "volunteered") && (
                  <button
                    onClick={() => displayProblem.volunteers?.forEach((v) => v.status === "volunteered" && handleWithdrawVolunteer(v.solverType, v.solverName))}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={12} />
                    Withdraw
                  </button>
                )}
              </div>
            )}

            {/* Support */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleSupport(displayProblem.id)}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  displayProblem.isSupported
                    ? "bg-blue-600 text-white shadow-md"
                    : "border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <ThumbsUp size={15} className={displayProblem.isSupported ? "fill-white" : ""} />
                {displayProblem.isSupported ? "Supported" : "Support this Problem"} · {displayProblem.supporters}
              </button>
            </div>

            {/* Progress Tracker */}
            <ProgressTracker currentStep={displayProblem.currentStep} progress={displayProblem.progress} />

            {/* Comments */}
            <div>
              <h4 className="mb-3 text-sm font-bold text-slate-700">
                Community Comments ({localComments.length})
              </h4>

              {localComments.length === 0 ? (
                <p className="rounded-xl bg-slate-50 py-6 text-center text-sm text-slate-400">
                  No comments yet. Be the first to comment.
                </p>
              ) : (
                <div className="space-y-3">
                  {localComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-600 text-xs font-bold text-white">
                        {comment.avatar}
                      </div>
                      <div className="flex-1 rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700">{comment.author}</span>
                          <span className="text-xs text-slate-400">{comment.timeAgo}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment */}
              <div className="mt-4 flex gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  SN
                </div>
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="flex-shrink-0 rounded-lg p-1 text-blue-600 transition hover:bg-blue-100 disabled:opacity-30"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
