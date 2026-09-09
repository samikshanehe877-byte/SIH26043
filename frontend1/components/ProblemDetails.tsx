"use client";

import { useState } from "react";
import { X, MapPin, Calendar, Building2, ThumbsUp, Send } from "lucide-react";
import { Problem } from "@/types/problem";
import StatusBadge from "./StatusBadge";
import ProgressTracker from "./ProgressTracker";

interface ProblemDetailsProps {
  problem: Problem;
  onClose: () => void;
  onToggleSupport: (id: number) => void;
}

export default function ProblemDetails({ problem, onClose, onToggleSupport }: ProblemDetailsProps) {
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(problem.comments);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setLocalComments((prev) => [
      ...prev,
      { id: Date.now(), author: "Sarthak Nehe", avatar: "SN", text: commentText.trim(), timeAgo: "Just now" },
    ]);
    setCommentText("");
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
              <StatusBadge status={problem.status} />
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {problem.category}
              </span>
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
                Posted {problem.date}
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

            {/* Current Action */}
            {problem.assignedUniversity && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="mb-1.5 flex items-center gap-2">
                  <Building2 size={16} className="text-blue-600" />
                  <span className="text-sm font-bold text-blue-700">Current Action</span>
                </div>
                <p className="text-sm text-blue-600 leading-relaxed">
                  This problem has been assigned to{" "}
                  <span className="font-semibold">{problem.assignedUniversity}</span> and is
                  currently being reviewed by the{" "}
                  <span className="font-semibold">{problem.assignedDepartment}</span>.
                </p>
              </div>
            )}

            {/* Support */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleSupport(problem.id)}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  problem.isSupported
                    ? "bg-blue-600 text-white shadow-md"
                    : "border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <ThumbsUp size={15} className={problem.isSupported ? "fill-white" : ""} />
                {problem.isSupported ? "Supported" : "Support this Problem"} · {problem.supporters}
              </button>
            </div>

            {/* Progress Tracker */}
            <ProgressTracker currentStep={problem.currentStep} progress={problem.progress} />

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
