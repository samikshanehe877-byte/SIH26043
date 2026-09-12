"use client";

import { useState } from "react";
import { X, MapPin, Calendar, Building2, ThumbsUp, Send, Users, Clock, Activity, CheckCircle2, Shield } from "lucide-react";
import { RegionalProblem } from "@/types/government";

interface GovernmentProblemDetailsProps {
  problem: RegionalProblem;
  onClose: () => void;
  onToggleSupport: (id: number) => void;
  onAssignOfficer: (id: number, officer: string) => void;
  onVerify: (id: number) => void;
  onReject: (id: number, reason: string) => void;
}

export default function GovernmentProblemDetails({
  problem,
  onClose,
  onToggleSupport,
  onAssignOfficer,
  onVerify,
  onReject,
}: GovernmentProblemDetailsProps) {
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(problem.comments || []);
  const [verificationReason, setVerificationReason] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setLocalComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: "Current Officer",
        avatar: "CO",
        text: commentText.trim(),
        timeAgo: "Just now",
      },
    ]);
    setCommentText("");
  };

  const handleVerify = () => {
    if (verificationReason.trim()) {
      onVerify(problem.id);
      // In a real app, this would close the modal or show success
      alert(`Problem ${problem.id} verified successfully!`);
    } else {
      alert("Please provide a reason for verification");
    }
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(problem.id, rejectionReason);
      // In a real app, this would close the modal
      alert(`Problem ${problem.id} rejected.`);
    } else {
      alert("Please provide a reason for rejection");
    }
  };

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
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {problem.priority}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {problem.verificationStatus}
              </span>
              {Boolean(problem.problem_nature) && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  problem.problem_nature === "Technical"
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : problem.problem_nature === "Non-Technical"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  {problem.problem_nature === "Technical" ? "⚙️ Technical" : problem.problem_nature === "Non-Technical" ? "🤝 Non-Technical" : "🌐 Hybrid"}
                </span>
              )}
              {Boolean(problem.problem_giver_type && problem.problem_giver_type !== "individual") && (
                <span className="rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold">
                  👥 {String(problem.community_group_name || "Community Group")}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">{problem.title}</h2>
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
                {problem.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" />
                Posted {problem.dateSubmitted}
              </span>
              <span className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {problem.citizenAvatar}
                </div>
                {problem.citizenName}
              </span>
            </div>

            {/* Image */}
            {problem.image && (
              <div className="flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 text-6xl border border-slate-100">
                {problem.image}
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="mb-2 text-sm font-bold text-slate-700">Description</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{problem.description}</p>
            </div>

            {/* Problem Details */}
            {/* AI-Structured Scope & Requirements */}
            {(problem.affectedPopulation || problem.frequency || problem.suggestedIntervention || (problem.requiredCapabilities && problem.requiredCapabilities.length > 0)) && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    AI-Structured Scope & Requirements
                  </h4>
                  {problem.confirmedByGiver && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      ✓ Citizen Confirmed
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {problem.affectedPopulation && (
                    <div className="rounded-xl bg-white p-2.5 border border-slate-100">
                      <span className="font-semibold text-slate-400 block mb-0.5">Affected Population</span>
                      <span className="font-medium text-slate-800">{problem.affectedPopulation}</span>
                    </div>
                  )}
                  {problem.frequency && (
                    <div className="rounded-xl bg-white p-2.5 border border-slate-100">
                      <span className="font-semibold text-slate-400 block mb-0.5">Recurrence Pattern</span>
                      <span className="font-medium text-slate-800">{problem.frequency}</span>
                    </div>
                  )}
                </div>
                {problem.requiredCapabilities && problem.requiredCapabilities.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-500 text-[11px] block mb-1.5">Required Capabilities & Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {problem.requiredCapabilities.map((cap, i) => (
                        <span key={i} className="rounded-lg bg-white border border-blue-100 text-blue-700 px-2 py-0.5 text-[11px] font-semibold shadow-2xs">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {problem.suggestedIntervention && (
                  <div className="rounded-xl bg-blue-50/60 border border-blue-100/80 p-2.5 text-xs text-blue-900">
                    <span className="font-bold block mb-0.5">Suggested Intervention Vector:</span>
                    <span>{problem.suggestedIntervention}</span>
                  </div>
                )}
                {problem.rawInput && problem.rawInput !== problem.description && (
                  <details className="text-xs text-slate-500 cursor-pointer pt-1">
                    <summary className="font-semibold hover:text-slate-800">View original raw citizen report</summary>
                    <p className="mt-1.5 rounded-lg bg-white p-2.5 border border-slate-200/80 italic text-slate-700">
                      “{problem.rawInput}”
                    </p>
                  </details>
                )}
              </div>
            )}
            <div className="space-y-4">
              <div className="border-t border-slate-100 pt-4">
                <h4 className="mb-2 text-sm font-bold text-slate-700">Problem Classification</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Activity size={14} />
                    </div>
                    <span className="font-medium text-slate-900">Problem Type</span>
                  </div>
                  <div className="text-sm text-slate-600">{problem.problemType}</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-600">
                      <Building2 size={14} />
                    </div>
                    <span className="font-medium text-slate-900">Domain</span>
                  </div>
                  <div className="text-sm text-slate-600">{problem.domain}</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                      <MapPin size={14} />
                    </div>
                    <span className="font-medium text-slate-900">Sub-Domain</span>
                  </div>
                  <div className="text-sm text-slate-600">{problem.subdomain}</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
                      <Users size={14} />
                    </div>
                    <span className="font-medium text-slate-900">District</span>
                  </div>
                  <div className="text-sm text-slate-600">{problem.district}</div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            {problem.aiFactors && (
              <div className="border-t border-slate-100 mt-4 pt-4">
                <h4 className="mb-2 text-sm font-bold text-slate-700">AI Priority Analysis (Score: {problem.aiPriorityScore}/100)</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Users size={12} />
                      </div>
                      <span className="font-medium text-slate-900">Population Affected</span>
                    </div>
                    <p className="text-sm text-slate-600">{problem.aiFactors.populationAffected}/10</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                        <Clock size={12} />
                      </div>
                      <span className="font-medium text-slate-900">Urgency</span>
                    </div>
                    <p className="text-sm text-slate-600">{problem.aiFactors.urgency}/10</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <Shield size={12} />
                      </div>
                      <span className="font-medium text-slate-900">Severity</span>
                    </div>
                    <p className="text-sm text-slate-600">{problem.aiFactors.severity}/10</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
                        <Activity size={12} />
                      </div>
                      <span className="font-medium text-slate-900">Recurrence</span>
                    </div>
                    <p className="text-sm text-slate-600">{problem.aiFactors.recurrence}/10</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-600">
                        <MapPin size={12} />
                      </div>
                      <span className="font-medium text-slate-900">Regional Relevance</span>
                    </div>
                    <p className="text-sm text-slate-600">{problem.aiFactors.regionalRelevance}/10</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="font-medium text-slate-900">Evidence Confidence</span>
                    </div>
                    <p className="text-sm text-slate-600">{problem.aiFactors.evidenceConfidence}/10</p>
                  </div>
                </div>
              </div>
            )}

            {/* Evidence */}
            {problem.evidence && problem.evidence.length > 0 && (
              <div className="border-t border-slate-100 mt-4 pt-4">
                <h4 className="mb-2 text-sm font-bold text-slate-700">Evidence Provided ({problem.evidence.length})</h4>
                <div className="space-y-2">
                  {problem.evidence.map((evidence, index) => (
                    <div key={index} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50">
                      <div className="flex-shrink-0">
                        <Activity size={14} className="text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-1">{evidence}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Assignment */}
            {problem.assignedTo && (
              <div className="border-t border-slate-100 mt-4 pt-4">
                <h4 className="mb-2 text-sm font-bold text-slate-700">Current Assignment</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Users size={14} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Assigned Officer</h4>
                      <p className="text-sm text-slate-600">{problem.assignedTo}</p>
                    </div>
                  </div>
                  {problem.assignedDepartment && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-600">
                        <Building2 size={14} />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">Department</h4>
                        <p className="text-sm text-slate-600">{problem.assignedDepartment}</p>
                      </div>
                    </div>
                  )}
                  {problem.assignedMentor && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                        <Activity size={14} />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">Assigned Mentor</h4>
                        <p className="text-sm text-slate-600">{problem.assignedMentor}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Matches */}
            {(problem.matchedUniversities.length > 0 || problem.matchedIndustry.length > 0 || problem.matchedMentors.length > 0) && (
              <div className="border-t border-slate-100 mt-4 pt-4">
                <h4 className="mb-2 text-sm font-bold text-slate-700">Potential Matches</h4>
                <div className="space-y-4">
                  {problem.matchedUniversities.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <Building2 size={12} />
                        </div>
                        <span className="font-medium text-slate-900">Matched Universities</span>
                      </div>
                      <div className="space-y-2">
                        {problem.matchedUniversities.map((match, index) => (
                          <div key={index} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50">
                            <div className="flex-shrink-0">
                              <Building2 size={12} className="text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-1">{match.name} (Score: {match.score})</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {problem.matchedIndustry.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-600">
                          <Users size={12} />
                        </div>
                        <span className="font-medium text-slate-900">Matched Industry Partners</span>
                      </div>
                      <div className="space-y-2">
                        {problem.matchedIndustry.map((match, index) => (
                          <div key={index} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50">
                            <div className="flex-shrink-0">
                              <Users size={12} className="text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-1">{match.name} (Score: {match.score})</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {problem.matchedMentors.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                          <Activity size={12} />
                        </div>
                        <span className="font-medium text-slate-900">Matched Mentors</span>
                      </div>
                      <div className="space-y-2">
                        {problem.matchedMentors.map((match, index) => (
                          <div key={index} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50">
                            <div className="flex-shrink-0">
                              <Activity size={12} className="text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-1">{match.name} (Score: {match.score})</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Support */}
            <div className="border-t border-slate-100 mt-4 pt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleSupport(problem.id)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all
                    ${problem.isSupported
                      ? "bg-blue-600 text-white shadow-md"
                      : "border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"}
                  `}
                >
                  <ThumbsUp size={15} className={problem.isSupported ? "fill-white" : ""} />
                  {problem.isSupported ? "Supported" : "Support this Problem"} Ãƒâ€šÃ‚Â· {problem.supporters}
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="border-t border-slate-100 mt-4 pt-4">
              <h4 className="mb-3 text-sm font-bold text-slate-700">
                Officer Comments ({localComments.length})
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
                  CO
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

            {/* Action Buttons */}
            <div className="border-t border-slate-100 mt-4 pt-4">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium
                    ${!rejectionReason.trim()
                      ? "border border-red-300 text-red-600 hover:bg-red-50"
                      : "bg-red-600 text-white hover:bg-red-700"}
                  `}
                >
                  Reject
                </button>
                <button
                  onClick={handleVerify}
                  disabled={!verificationReason.trim()}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium
                    ${!verificationReason.trim()
                      ? "border border-blue-300 text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"}
                  `}
                >
                  Verify
                </button>
              </div>
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-slate-400" />
                  <span className="text-sm font-medium">
                    Verification Reason:
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Reason for verification..."
                  value={verificationReason}
                  onChange={(e) => setVerificationReason(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-slate-400" />
                  <span className="text-sm font-medium">
                    Rejection Reason:
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}