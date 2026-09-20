"use client";

import { useState } from "react";
import { Award, CheckCircle2, Clock, XCircle } from "lucide-react";
import MilestoneEvidence from "@/components/points/MilestoneEvidence";
import { MILESTONE_LABELS, MilestoneRecord, usePendingMilestones, verifyMilestone } from "@/lib/points";
import { formatRelativeTime } from "@/lib/projects";

/**
 * The officer's review queue for milestones university/industry teams submitted on their
 * projects. Unfiltered by party, the same as the existing problem-verification queue -- the
 * government portal isn't gated at the FastAPI layer, only at this app's own session layer.
 * Approving/rejecting goes through /api/government/milestones/[id]/verify, which resolves the
 * acting officer from the real signed-in session, never from anything typed here.
 */
export default function GovernmentMilestonesPage() {
  const { data: pending, isLoading, refresh } = usePendingMilestones();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const decide = async (milestone: MilestoneRecord, decision: "approve" | "reject") => {
    if (decision === "reject" && !note.trim()) {
      setError("A note is required to reject a milestone.");
      return;
    }
    setBusyId(milestone.id);
    setError(null);
    setNotice(null);
    try {
      await verifyMilestone(milestone.id, decision, note.trim() || undefined);
      setNotice(`"${MILESTONE_LABELS[milestone.milestone_type]}" ${decision === "approve" ? "verified" : "rejected"}.`);
      setActiveId(null);
      setNote("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record the decision");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Milestone Verification</h1>
        <p className="mt-1 text-slate-500">
          Review milestones university and industry teams submitted on their projects. Points are only awarded once you verify one here.
        </p>
      </div>

      {notice && <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">{notice}</p>}
      {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

      {isLoading && pending.length === 0 && (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      )}

      {!isLoading && pending.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-14 text-center">
          <CheckCircle2 className="mx-auto mb-2 text-emerald-500" size={28} />
          <p className="text-sm font-semibold text-slate-600">No milestones are waiting for review.</p>
        </div>
      )}

      <div className="space-y-3">
        {pending.map((milestone) => (
          <div key={milestone.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Award size={15} className="text-emerald-600" />
                  <p className="font-bold text-slate-900">{MILESTONE_LABELS[milestone.milestone_type]}</p>
                </div>
                <p className="text-sm text-slate-600">
                  Submitted by <span className="font-semibold">{milestone.submitted_by_name}</span> ({milestone.submitted_by_org_name})
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} /> {formatRelativeTime(milestone.submitted_at)}
                </p>
                {milestone.submitted_note && <p className="mt-2 text-sm text-slate-600">{milestone.submitted_note}</p>}
                <MilestoneEvidence milestone={milestone} />
                {milestone.submitted_attachments.length === 0 && milestone.submitted_links.length === 0 && (
                  <p className="mt-2 text-xs italic text-slate-400">No evidence attached.</p>
                )}
              </div>
            </div>

            {activeId === milestone.id ? (
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Note (required to reject, optional to approve)"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() => {
                      setActiveId(null);
                      setNote("");
                      setError(null);
                    }}
                    disabled={busyId === milestone.id}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => void decide(milestone, "reject")}
                    disabled={busyId === milestone.id}
                    className="flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-40"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    onClick={() => void decide(milestone, "approve")}
                    disabled={busyId === milestone.id}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-40"
                  >
                    <CheckCircle2 size={14} /> Verify
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    setActiveId(milestone.id);
                    setNote("");
                    setError(null);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Review
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
