"use client";

import { useState } from "react";
import {
  X,
  Send,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
} from "lucide-react";
import { useMentor } from "@/context/MentorContext";
import { MentorChallenge } from "@/types/mentor";

interface ProgressUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: MentorChallenge;
}

export default function ProgressUpdateModal({
  isOpen,
  onClose,
  challenge,
}: ProgressUpdateModalProps) {
  const { sendUniversityUpdate } = useMentor();

  const [progress, setProgress] = useState<number>(challenge ? Math.min(100, challenge.progress + 10) : 50);
  const [title, setTitle] = useState(
    `Stage Milestone Review & Deployment Progress for ${challenge?.title || "Challenge"}`
  );
  const [workCompleted, setWorkCompleted] = useState(
    "Completed core model architecture benchmarks, dataset validation, and backend service integration."
  );
  const [currentWork, setCurrentWork] = useState(
    "Conducting real-world pilot simulation and edge device latency profiling."
  );
  const [blockers, setBlockers] = useState(
    "Need coordination with local municipal field officers for on-site validation access."
  );
  const [studentPerformance, setStudentPerformance] = useState(
    "Student team is demonstrating proactive initiative and commendable technical velocity."
  );
  const [industrySupport, setIndustrySupport] = useState(
    challenge?.industrySupportStatus || "Active industry mentorship"
  );
  const [nextSteps, setNextSteps] = useState(
    "Complete pilot user feedback study and prepare final presentation deck for university review."
  );
  const [expectedCompletionDate, setExpectedCompletionDate] = useState("2025-05-15");
  const [attachment, setAttachment] = useState<string>("Milestone_Deliverables_Summary.pdf");

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    sendUniversityUpdate({
      challengeId: challenge.id,
      progress,
      title: title.trim(),
      workCompleted: workCompleted.trim(),
      currentWork: currentWork.trim(),
      blockers: blockers.trim() || undefined,
      studentPerformance: studentPerformance.trim(),
      industrySupport: industrySupport.trim(),
      nextSteps: nextSteps.trim(),
      expectedCompletionDate,
      attachments: attachment ? [attachment] : undefined,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Send Update to University
              </h2>
              <p className="text-xs text-slate-500">
                Formal project progress dispatch to BVU University Coordinator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="my-10 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 text-center">
            <CheckCircle2 size={42} className="mx-auto mb-3 text-emerald-600" />
            <h3 className="text-lg font-bold text-emerald-900">
              Progress update sent to University.
            </h3>
            <p className="mt-1 text-xs text-emerald-700">
              The update has been recorded in the Challenge Timeline and dispatched to the
              University Coordinator.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="mt-5 space-y-4">
            {/* Challenge & Progress % */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Challenge
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 truncate">
                  {challenge.title}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Progress
                  </label>
                  <span className="text-xs font-bold text-emerald-600">{progress}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>

            {/* Update Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Update Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Work Completed */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Work Completed *
              </label>
              <textarea
                rows={2}
                required
                value={workCompleted}
                onChange={(e) => setWorkCompleted(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Current Work */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Current Work in Progress *
              </label>
              <textarea
                rows={2}
                required
                value={currentWork}
                onChange={(e) => setCurrentWork(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Blockers / Problems */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Problems / Blockers (if any)
              </label>
              <input
                type="text"
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                placeholder="e.g. Need additional compute credits or municipal permissions"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Student Performance & Industry Support */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Student Performance
                </label>
                <input
                  type="text"
                  value={studentPerformance}
                  onChange={(e) => setStudentPerformance(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Industry Support Status
                </label>
                <input
                  type="text"
                  value={industrySupport}
                  onChange={(e) => setIndustrySupport(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Next Steps & Target Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Next Steps
                </label>
                <input
                  type="text"
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Expected Completion Date
                </label>
                <input
                  type="date"
                  value={expectedCompletionDate}
                  onChange={(e) => setExpectedCompletionDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Attachment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Attachment (Optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={attachment}
                  onChange={(e) => setAttachment(e.target.value)}
                  placeholder="e.g. stage_deliverables_summary.pdf"
                  className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setAttachment("milestone_evaluation_data.pdf")}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <UploadCloud size={14} />
                  Browse
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <Send size={15} />
                Send Update
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

