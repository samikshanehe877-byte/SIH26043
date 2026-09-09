"use client";

import { useState } from "react";
import { X, XCircle, CheckCircle2 } from "lucide-react";
import { UniversityChallenge } from "@/types/universityChallenge";

const REJECTION_REASONS = [
  "University does not have required expertise",
  "Insufficient resources or capacity",
  "Challenge outside university capability",
  "Department capacity unavailable",
  "Challenge requires specialized equipment not available",
  "Other",
];

interface RejectChallengeModalProps {
  challenge: UniversityChallenge;
  onClose: () => void;
  onReject: (challengeId: number, reason: string) => void;
}

export default function RejectChallengeModal({
  challenge,
  onClose,
  onReject,
}: RejectChallengeModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const finalReason = selectedReason === "Other" ? customReason : selectedReason;

  const handleReject = () => {
    onReject(challenge.id, finalReason);
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <CheckCircle2 size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Challenge Rejected</h3>
          <p className="mt-2 text-sm text-slate-500">
            The challenge has been rejected and the admin team has been notified.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-slate-700 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <XCircle size={18} className="text-red-500" />
            <h3 className="text-lg font-bold text-slate-900">Reject Challenge</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl bg-red-50 px-4 py-3">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wide">Challenge</p>
            <p className="mt-0.5 text-sm font-semibold text-red-800">{challenge.title}</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Reason for Rejection
            </label>
            <div className="space-y-2">
              {REJECTION_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                    selectedReason === reason
                      ? "border-red-300 bg-red-50 font-semibold text-red-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {selectedReason === "Other" && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Please specify
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Describe the reason for rejection..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={!finalReason.trim()}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-40"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}
