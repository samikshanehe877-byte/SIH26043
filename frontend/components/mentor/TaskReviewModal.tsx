"use client";

import { useState } from "react";
import {
  X,
  FileCheck,
  ExternalLink,
  FileText,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useMentor } from "@/context/MentorContext";
import { Task } from "@/types/mentor";
import { TaskPriorityBadge, TaskStatusBadge } from "./TaskStatusBadge";

interface TaskReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export default function TaskReviewModal({
  isOpen,
  onClose,
  task,
}: TaskReviewModalProps) {
  const { reviewTask } = useMentor();
  const [feedback, setFeedback] = useState(
    task.submission?.feedback ||
      "Well done! Dataset balance and preprocessing pipeline meet quality standards."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleReview = (type: "approve" | "request_changes") => {
    setIsSubmitting(true);
    reviewTask(task.id, type, feedback);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const submission = task.submission || {
    submittedAt: "Feb 06, 2025 at 11:30 AM",
    description: "Work completed according to specified guidelines and requirements.",
    files: ["dataset_report.pdf", "metrics.png"],
    links: ["https://github.com/bvu-sih/challenge-work"],
    comments: "Ready for mentor inspection and sign-off.",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <FileCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Task Submission Review</h2>
                <TaskStatusBadge status={task.status} />
              </div>
              <p className="text-xs text-slate-500">{task.teamName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Task Info */}
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
                <p className="mt-1 text-xs text-slate-600">{task.description}</p>
              </div>
              <TaskPriorityBadge priority={task.priority} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-t border-slate-200/60 pt-2.5">
              <div>
                <span className="text-slate-400">Student: </span>
                <span className="font-semibold text-slate-800">
                  {task.assignedStudentName}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Submitted: </span>
                <span className="font-medium text-slate-700">
                  {submission.submittedAt}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Deadline: </span>
                <span className="font-medium text-slate-700">{task.deadline}</span>
              </div>
            </div>
          </div>

          {/* Submission Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Student Deliverables & Description
            </h4>
            <div className="rounded-2xl border border-slate-200/80 p-4 space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed">
                {submission.description}
              </p>

              {submission.files && submission.files.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-500 mb-1.5">
                    Attached Deliverable Files:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {submission.files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
                        onClick={() => alert(`Opening ${file}`)}
                      >
                        <FileText size={13} className="text-slate-400" />
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {submission.links && submission.links.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-500 mb-1.5">
                    Work Links:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {submission.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      >
                        <ExternalLink size={12} />
                        <span className="truncate max-w-xs">{link}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {submission.comments && (
                <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-2.5 text-xs text-amber-900">
                  <span className="font-bold">Student Note: </span>
                  {submission.comments}
                </div>
              )}
            </div>
          </div>

          {/* Feedback & Decision Form */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mentor Review Feedback *
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide constructive feedback, notes, or required amendments..."
              className="w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleReview("request_changes")}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
              >
                <AlertTriangle size={15} />
                Request Changes
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleReview("approve")}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <CheckCircle2 size={15} />
                Approve Submission
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

