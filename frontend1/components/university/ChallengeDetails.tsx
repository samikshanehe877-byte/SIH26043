"use client";

import { useState } from "react";
import {
  X, MapPin, Calendar, Users, Brain, Building2, User, Factory,
  CheckCircle2, XCircle, UserPlus, RefreshCw, Sparkles,
} from "lucide-react";
import { UniversityChallenge } from "@/types/universityChallenge";
import { ChallengeStatusBadge, ChallengePriorityBadge } from "./ChallengeBadges";
import ChallengeProgressTracker from "./ChallengeProgressTracker";
import IndustryCollabModal from "./IndustryCollabModal";

interface ChallengeDetailsProps {
  challenge: UniversityChallenge;
  onClose: () => void;
  onAccept?: (id: number) => void;
  onReject?: (challenge: UniversityChallenge) => void;
  onAssignMentor?: (challenge: UniversityChallenge) => void;
}

const currentActionText: Record<string, string> = {
  "Awaiting Decision":
    "This challenge has been assigned to Bharati Vidyapeeth University and is awaiting your review. Please accept or reject the challenge.",
  Accepted:
    "Challenge accepted. AI has completed department analysis. Please assign a Lead Mentor from the recommended primary department to proceed.",
  Rejected:
    "This challenge has been rejected by the university. The admin team has been notified.",
  "Mentor Assigned":
    "A Lead Mentor has been assigned and is reviewing the challenge. The mentor will form a student team and begin work shortly.",
  Active:
    "The student team is actively working on the solution. Monitor progress and provide support as needed.",
  Completed:
    "This challenge has been fully resolved. The solution has been successfully implemented and verified.",
};

export default function ChallengeDetails({
  challenge,
  onClose,
  onAccept,
  onReject,
  onAssignMentor,
}: ChallengeDetailsProps) {
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [reanalysisRequested, setReanalysisRequested] = useState(false);

  const ai = challenge.aiDepartmentAssignment;

  return (
    <>
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
                <ChallengeStatusBadge status={challenge.status} />
                <ChallengePriorityBadge priority={challenge.priority} />
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  {challenge.category}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">{challenge.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-5 p-5">
              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-slate-400" />
                  {challenge.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  Submitted {challenge.dateSubmitted}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} className="text-slate-400" />
                  {challenge.supporters} supporters
                </span>
                <span className="flex items-center gap-1.5">
                  <Brain size={14} className="text-indigo-400" />
                  AI Match:{" "}
                  <strong className="text-indigo-600">{challenge.aiMatchScore}%</strong>
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 className="mb-2 text-sm font-bold text-slate-700">Challenge Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{challenge.description}</p>
              </div>

              {/* AI Department Assignment */}
              {ai && (
                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-indigo-600" />
                      <h4 className="text-sm font-bold text-indigo-800">
                        AI Department Analysis
                      </h4>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-bold text-indigo-700">
                      {ai.confidence}% Confidence
                    </span>
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded-xl bg-white border border-indigo-200 px-4 py-3">
                      <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">
                        Primary Department
                      </p>
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-indigo-600" />
                        <p className="text-sm font-bold text-indigo-800">
                          {ai.primaryDepartment.name}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-white border border-slate-200 px-4 py-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        Supporting Departments
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {ai.supportingDepartments.map((d) => (
                          <span
                            key={d.id}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                          >
                            {d.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-indigo-700 leading-relaxed bg-indigo-50 rounded-xl px-3 py-2">
                    <span className="font-semibold">AI Reasoning: </span>
                    {ai.reason}
                  </p>

                  {!reanalysisRequested ? (
                    <button
                      onClick={() => setReanalysisRequested(true)}
                      className="mt-3 flex items-center gap-1.5 rounded-xl border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition"
                    >
                      <RefreshCw size={12} /> Request Department Re-analysis
                    </button>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                      <RefreshCw size={12} className="animate-spin" />
                      Re-analysis requested. AI is processing a new recommendation...
                    </div>
                  )}
                </div>
              )}

              {/* Assigned Mentor */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <h4 className="mb-3 text-sm font-bold text-slate-700">Lead Mentor</h4>
                {challenge.assignedMentorName ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 text-sm font-bold text-white">
                        {challenge.assignedMentorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {challenge.assignedMentorName}
                        </p>
                        {challenge.assignedDepartmentName && (
                          <p className="text-xs text-slate-500">
                            {challenge.assignedDepartmentName}
                          </p>
                        )}
                      </div>
                    </div>
                    {onAssignMentor &&
                      (challenge.status === "Mentor Assigned" ||
                        challenge.status === "Active") && (
                        <button
                          onClick={() => { onAssignMentor(challenge); onClose(); }}
                          className="flex items-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 transition"
                        >
                          <UserPlus size={12} /> Change
                        </button>
                      )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <User size={16} />
                      <span>No mentor assigned yet</span>
                    </div>
                    {onAssignMentor && challenge.status === "Accepted" && (
                      <button
                        onClick={() => { onAssignMentor(challenge); onClose(); }}
                        className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
                      >
                        <UserPlus size={12} /> Assign Mentor
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Current Action */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-indigo-500">
                  Current Action
                </p>
                <p className="text-sm text-indigo-700 leading-relaxed">
                  {currentActionText[challenge.status] ?? "Status update pending."}
                </p>
              </div>

              {/* Industry Collab Status */}
              {challenge.industryCollabStatus && challenge.industryCollabStatus !== "Not Required" && (
                <div className="flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50 px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide">
                      Industry Collaboration
                    </p>
                    <p className="text-sm font-semibold text-purple-800 mt-0.5">
                      {challenge.industryCollabStatus}
                    </p>
                  </div>
                  {challenge.industryCollabStatus === "Not Requested" && (
                    <button
                      onClick={() => setShowIndustryModal(true)}
                      className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 transition"
                    >
                      <Factory size={12} /> Request
                    </button>
                  )}
                </div>
              )}

              {/* Progress */}
              <ChallengeProgressTracker
                currentStep={challenge.currentStep}
                progress={challenge.progress}
              />

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                {challenge.status === "Awaiting Decision" && onAccept && (
                  <button
                    onClick={() => { onAccept(challenge.id); onClose(); }}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
                  >
                    <CheckCircle2 size={14} /> Accept Challenge
                  </button>
                )}
                {challenge.status === "Awaiting Decision" && onReject && (
                  <button
                    onClick={() => { onReject(challenge); onClose(); }}
                    className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                  >
                    <XCircle size={14} /> Reject Challenge
                  </button>
                )}
                {!["Awaiting Decision", "Rejected", "Completed"].includes(challenge.status) &&
                  challenge.industryCollabStatus === "Not Requested" && (
                    <button
                      onClick={() => setShowIndustryModal(true)}
                      className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100 transition"
                    >
                      <Factory size={14} /> Request Industry Collaboration
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showIndustryModal && (
        <IndustryCollabModal
          challengeTitle={challenge.title}
          onClose={() => setShowIndustryModal(false)}
        />
      )}
    </>
  );
}
