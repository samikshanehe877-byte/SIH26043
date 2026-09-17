"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck, XCircle, Clock, AlertTriangle, User, FileText, MapPin, BadgeCheck, Copy, GitMerge, CheckCircle2,
} from "lucide-react";
import { officials } from "@/data/governmentData";
import { EvidenceAttachment } from "@/types/problem";

type ReviewProblem = {
  id: number | string;
  title: string;
  description: string;
  location: string;
  problemType: string;
  verificationStatus: string;
  reviewNote: string;
  publicVisible: boolean;
  evidence?: string[];
  evidenceAttachments?: EvidenceAttachment[];
  verification_history?: { officer: string; timestamp: string; note: string; previous_status: string; decision: string; status: string }[];
  correctionCount?: number;
  correctionReasons?: string[];
  duplicate_decision?: string;
  duplicate_score?: number;
  duplicate_of_id?: string;
  duplicate_reasons?: string[];
  [key: string]: unknown;
};

type SimilarityRow = {
  other_problem_id: string;
  other_problem_title: string;
  other_problem_status: string | null;
  semantic_score: number;
  location_score: number;
  domain_score: number;
  affected_area_score: number;
  characteristics_score: number;
  overall_score: number;
  tier: string;
  created_at: string;
};

function SimilarityBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-0.5 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-700">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.round(value * 100)}%` }} />
      </div>
    </div>
  );
}

type QueueItem = {
  id: number | string;
  problemId: number | string;
  problemTitle: string;
  submittedBy: string;
  evidenceProvided: number;
  priority: string;
  assignedTo: string | null;
  slaHours: number;
  hoursRemaining: number;
  status?: string;
  decisionNote?: string;
};

const statusConfig: Record<string, { color: string; bg: string; icon: typeof ShieldCheck }> = {
  Pending: { color: "text-slate-600", bg: "bg-slate-100", icon: Clock },
  "Under Review": { color: "text-blue-600", bg: "bg-blue-50", icon: Clock },
  Verified: { color: "text-emerald-600", bg: "bg-emerald-50", icon: BadgeCheck },
  Rejected: { color: "text-red-600", bg: "bg-red-50", icon: XCircle },
  "Returned for Correction": { color: "text-amber-600", bg: "bg-amber-50", icon: AlertTriangle },
  Duplicate: { color: "text-slate-600", bg: "bg-slate-100", icon: Copy },
  "Merge Pending": { color: "text-blue-700", bg: "bg-blue-50", icon: GitMerge },
  Merged: { color: "text-indigo-700", bg: "bg-indigo-50", icon: GitMerge },
};

const priorityConfig: Record<string, { color: string; bg: string }> = {
  Critical: { color: "text-red-700", bg: "bg-red-100" },
  High: { color: "text-orange-700", bg: "bg-orange-100" },
  Medium: { color: "text-amber-700", bg: "bg-amber-100" },
  Low: { color: "text-slate-600", bg: "bg-slate-100" },
};

export default function VerifyPage() {
  const [filter, setFilter] = useState("All");
  const [problemState, setProblemState] = useState<ReviewProblem[]>([]);
  const [queueState, setQueueState] = useState<QueueItem[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState<number | string | null>(null);
  const [decisionNote, setDecisionNote] = useState("");
  const [similarities, setSimilarities] = useState<SimilarityRow[]>([]);
  const [duplicateNote, setDuplicateNote] = useState("");
  const [isResolvingDuplicate, setIsResolvingDuplicate] = useState(false);
  const [duplicateActionError, setDuplicateActionError] = useState("");
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeCandidateIds, setMergeCandidateIds] = useState<Set<string>>(new Set());
  const [mergeNote, setMergeNote] = useState("");
  const [isSubmittingMerge, setIsSubmittingMerge] = useState(false);
  const [mergeError, setMergeError] = useState("");
  const [mergeRequestSent, setMergeRequestSent] = useState(false);
  const MAX_MERGE_CANDIDATES = 2; // must match problem_storage.MAX_CO_OWNERS on the backend

  useEffect(() => {
    let cancelled = false;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    // Unverified problems are hidden from browsing lists; the review queue asks for them explicitly.
    fetch(`${apiUrl}/problems?limit=500&include_unverified=true`)
      .then((response) => (response.ok ? response.json() : []))
      .then((records) => {
        if (cancelled || !Array.isArray(records)) return;
        const reviewRecords = records.filter((record) => ["submitted", "under_review", "returned_for_correction"].includes(record.status));
        setProblemState((previous) => {
          const existingIds = new Set(previous.map((problem) => String(problem.id)));
          return [
            ...previous,
            ...reviewRecords
              .filter((record) => !existingIds.has(String(record.id)))
              .map((record) => ({
                ...record,
                id: record.id,
                title: record.title ?? record.problem_text,
                description: record.description ?? record.problem_text,
                location: record.location ?? record.district ?? "Location pending",
                problemType: record.category ?? "Other",
                verificationStatus: record.status === "returned_for_correction" ? "Returned for Correction" : "Pending",
                publicVisible: false,
                evidence: record.evidence_provided ?? [],
                evidenceAttachments: record.evidence_attachments ?? [],
                correctionCount: (record.verification_history ?? []).filter((entry: { decision: string }) => entry.decision === "proof").length,
                correctionReasons: (record.verification_history ?? [])
                  .filter((entry: { decision: string }) => entry.decision === "proof")
                  .map((entry: { note?: string }) => entry.note ?? "Additional proof requested"),
              })),
          ];
        });
        setQueueState((previous) => {
          const existingIds = new Set(previous.map((item) => String(item.problemId)));
          return [
            ...previous,
            ...reviewRecords
              .filter((record) => !existingIds.has(String(record.id)))
              .map((record) => ({
                id: `backend-${record.id}`,
                problemId: record.id,
                problemTitle: record.title ?? record.problem_text,
                submittedBy: record.citizen_name,
                evidenceProvided: (record.evidence_attachments ?? []).length,
                priority: ({ CRITICAL: "Critical", HIGH: "High", MEDIUM: "Medium", LOW: "Low" } as Record<string, string>)[record.priority?.priority] ?? "Medium",
                assignedTo: null,
                hoursRemaining: 48,
                slaHours: 72,
                status: record.status === "returned_for_correction" ? "Returned for Correction" : "Pending",
              })),
          ];
        });
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedProblem = useMemo(
    () => problemState.find((problem) => problem.id === selectedProblemId) ?? problemState[0] ?? null,
    [problemState, selectedProblemId]
  );

  // Fetch the similarity audit trail only for a problem that's actually flagged -- the
  // overwhelming majority of problems never resembled anything else on file.
  useEffect(() => {
    setSimilarities([]);
    setDuplicateNote("");
    setDuplicateActionError("");
    if (!selectedProblem || selectedProblem.duplicate_decision !== "potential_duplicate") return;
    let cancelled = false;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    fetch(`${apiUrl}/problems/${selectedProblem.id}/similarities`)
      .then((response) => (response.ok ? response.json() : []))
      .then((rows) => { if (!cancelled && Array.isArray(rows)) setSimilarities(rows); })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [selectedProblem]);

  const resolveDuplicate = async (decision: "distinct" | "duplicate") => {
    if (!selectedProblem) return;
    if (decision === "duplicate" && !duplicateNote.trim()) {
      setDuplicateActionError("A note explaining the decision is required.");
      return;
    }
    setIsResolvingDuplicate(true);
    setDuplicateActionError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const response = await fetch(`${apiUrl}/problems/${selectedProblem.id}/duplicate-decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          note: duplicateNote.trim() || undefined,
          officer: "Dr. Anita Sharma",
        }),
      });
      const saved = await response.json();
      if (!response.ok) throw new Error(saved.detail || "Could not save the decision");

      setProblemState((prev) =>
        prev.map((problem) =>
          problem.id === selectedProblem.id
            ? {
                ...problem,
                duplicate_decision: saved.duplicate_decision,
                verificationStatus: decision === "duplicate" ? "Duplicate" : problem.verificationStatus,
              }
            : problem
        )
      );
      if (decision === "duplicate") {
        // Ends the problem's life in the normal queue -- same dead-end as a rejection,
        // but labeled distinctly so it isn't confused with a content-quality rejection.
        setQueueState((prev) =>
          prev.map((item) => (item.problemId === selectedProblem.id ? { ...item, status: "Duplicate" } : item))
        );
      }
      setDuplicateNote("");
    } catch (err) {
      setDuplicateActionError(err instanceof Error ? err.message : "Could not save the decision.");
    } finally {
      setIsResolvingDuplicate(false);
    }
  };

  const openMergeModal = () => {
    if (!selectedProblem) return;
    setMergeCandidateIds(new Set([String(selectedProblem.id)]));
    setMergeNote("");
    setMergeError("");
    setMergeRequestSent(false);
    setShowMergeModal(true);
  };

  const toggleMergeCandidate = (problemId: string) => {
    setMergeCandidateIds((prev) => {
      const next = new Set(prev);
      if (next.has(problemId)) {
        next.delete(problemId);
      } else if (next.size < MAX_MERGE_CANDIDATES) {
        next.add(problemId);
      }
      return next;
    });
  };

  const submitMergeRequest = async () => {
    if (!selectedProblem || !selectedProblem.duplicate_of_id) return;
    setIsSubmittingMerge(true);
    setMergeError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const response = await fetch(`${apiUrl}/merge-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primary_problem_id: selectedProblem.duplicate_of_id,
          candidate_problem_ids: Array.from(mergeCandidateIds),
          officer: "Dr. Anita Sharma",
          note: mergeNote.trim() || undefined,
        }),
      });
      const saved = await response.json();
      if (!response.ok) throw new Error(saved.detail || "Could not send the merge request");
      setMergeRequestSent(true);
    } catch (err) {
      setMergeError(err instanceof Error ? err.message : "Could not send the merge request");
    } finally {
      setIsSubmittingMerge(false);
    }
  };

  const filtered = queueState.filter((item) => {
    if (filter === "All") return true;
    return item.priority === filter;
  });

  const updateDecision = async (decision: "approve" | "reject" | "proof") => {
    if (!selectedProblem) return;
    if (decision === "reject" && !decisionNote.trim()) {
      alert("A rejection reason is required.");
      return;
    }

    const nextStatus =
      decision === "approve"
        ? "Verified"
        : decision === "reject"
          ? "Rejected"
          : "Returned for Correction";

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const response = await fetch(`${apiUrl}/problems/${selectedProblem.id}/verification`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          note: decisionNote.trim() || undefined,
          officer: "Dr. Anita Sharma",
          evidence_requested: decision === "proof"
            ? [decisionNote.trim() || "Additional proof requested"]
            : undefined,
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || "Could not save verification decision");
      }
      const saved = await response.json();
      setProblemState((prev) =>
        prev.map((problem) =>
          problem.id === selectedProblem.id
            ? {
                ...problem,
                verificationStatus: nextStatus,
                publicVisible: decision === "approve",
                reviewNote: decisionNote.trim(),
                verification_history: saved.verification_history ?? [],
              }
            : problem
        )
      );
      setQueueState((prev) =>
        prev.map((item) =>
          item.problemId === selectedProblem.id
            ? { ...item, status: nextStatus, decisionNote: decisionNote.trim() }
            : item
        )
      );
    } catch {
      alert("The verification decision could not be saved. Please try again.");
      return;
    }

    setDecisionNote("");
  };

  const pendingCount = queueState.filter((item) => item.status !== "Verified" && item.status !== "Rejected").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Verification Queue</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review and verify citizen-submitted problems before they enter the solver matching pipeline.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {"All, Critical, High, Medium, Low".split(", ").map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filter === p
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p}
            {p !== "All" && (
              <span className="ml-1 opacity-70">
                ({queueState.filter((q) => q.priority === p).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          {filtered.map((item) => {
            const problem = problemState.find((p) => p.id === item.problemId) ?? null;
            const currentStatus = item.status || "Pending";
            const cfg = statusConfig[currentStatus] || statusConfig.Pending;
            const StatusIcon = cfg.icon;

            return (
              <div
                key={item.id}
                className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${
                  selectedProblem?.id === item.problemId ? "border-emerald-200 bg-emerald-50/30" : "border-slate-100 bg-white"
                }`}
                onClick={() => setSelectedProblemId(item.problemId)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <StatusIcon size={20} className={`mt-0.5 flex-shrink-0 ${cfg.color}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{item.problemTitle}</h3>
                        {problem?.duplicate_decision === "potential_duplicate" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            <Copy size={10} /> {Math.round((problem.duplicate_score ?? 0) * 100)}% similar
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">{problem?.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <User size={12} /> {item.submittedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {problem?.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText size={12} /> {item.evidenceProvided} evidence
                        </span>
                        <span className="font-semibold text-amber-600">
                          {problem?.correctionCount ?? 0} correction request{(problem?.correctionCount ?? 0) === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
                      {currentStatus}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityConfig[item.priority].color} ${priorityConfig[item.priority].bg}`}>
                      {item.priority}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    {item.assignedTo ? (
                      <span className="text-xs text-slate-500">Officer: {item.assignedTo}</span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        Unassigned
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock size={12} className="text-slate-400" />
                    <span className={item.hoursRemaining <= item.slaHours * 0.25 ? "text-red-600 font-semibold" : "text-slate-500"}>
                      {item.hoursRemaining}h remaining
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          {selectedProblem && (
            <>
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Problem review</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">{selectedProblem.title}</h3>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusConfig[selectedProblem.verificationStatus]?.color || "text-slate-600"} ${statusConfig[selectedProblem.verificationStatus]?.bg || "bg-slate-100"}`}>
                    {selectedProblem.verificationStatus}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">{selectedProblem.description}</p>

                {(selectedProblem.correctionCount ?? 0) > 0 && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-800">
                      Sent back for correction {selectedProblem.correctionCount} time{selectedProblem.correctionCount === 1 ? "" : "s"}
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-amber-900">
                      {selectedProblem.correctionReasons?.map((reason, index) => <li key={`${reason}-${index}`}>{reason}</li>)}
                    </ul>
                  </div>
                )}

                {/* Similarity review: the AI only ever flags a 60-89% match -- it never
                    auto-decides. This problem still goes through the normal approve/reject/proof
                    pipeline above independently; this section just resolves the similarity flag. */}
                {selectedProblem.duplicate_decision === "potential_duplicate" && (
                  <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50/70 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-amber-800">
                        <Copy size={13} /> Similarity Review
                      </p>
                      <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                        {Math.round((selectedProblem.duplicate_score ?? 0) * 100)}% match
                      </span>
                    </div>

                    {similarities
                      .filter((row) => row.other_problem_id === selectedProblem.duplicate_of_id)
                      .slice(0, 1)
                      .map((row) => (
                        <div key={row.other_problem_id} className="space-y-3">
                          <div className="rounded-lg bg-white p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                              Existing report
                            </p>
                            <p className="mt-0.5 text-sm font-semibold text-slate-800">{row.other_problem_title}</p>
                            {row.other_problem_status && (
                              <p className="mt-0.5 text-xs text-slate-500">Status: {row.other_problem_status}</p>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                            <SimilarityBar label="Text similarity" value={row.semantic_score} />
                            <SimilarityBar label="Location" value={row.location_score} />
                            <SimilarityBar label="Category" value={row.domain_score} />
                            <SimilarityBar label="Affected area" value={row.affected_area_score} />
                            <SimilarityBar label="Capabilities" value={row.characteristics_score} />
                          </div>
                        </div>
                      ))}

                    {selectedProblem.duplicate_reasons && selectedProblem.duplicate_reasons.length > 0 && (
                      <ul className="mt-3 space-y-1 border-t border-amber-200 pt-2 text-xs text-amber-900">
                        {selectedProblem.duplicate_reasons.map((reason, index) => (
                          <li key={index} className="flex items-start gap-1.5">
                            <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-amber-500" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-3 space-y-2">
                      <textarea
                        value={duplicateNote}
                        onChange={(e) => setDuplicateNote(e.target.value)}
                        rows={2}
                        placeholder="Required for Reject as Duplicate -- explain the decision..."
                        className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                      />
                      {duplicateActionError && <p className="text-xs font-semibold text-red-600">{duplicateActionError}</p>}
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <button
                          type="button"
                          onClick={() => resolveDuplicate("distinct")}
                          disabled={isResolvingDuplicate}
                          className="flex items-center justify-center gap-1.5 rounded-lg bg-white border border-emerald-200 px-2 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                        >
                          <CheckCircle2 size={13} /> Accept as Distinct
                        </button>
                        <button
                          type="button"
                          onClick={openMergeModal}
                          disabled={isResolvingDuplicate}
                          className="flex items-center justify-center gap-1.5 rounded-lg bg-white border border-blue-200 px-2 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-50"
                        >
                          <GitMerge size={13} /> Propose Merge
                        </button>
                        <button
                          type="button"
                          onClick={() => resolveDuplicate("duplicate")}
                          disabled={isResolvingDuplicate}
                          className="flex items-center justify-center gap-1.5 rounded-lg bg-white border border-red-200 px-2 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle size={13} /> Reject as Duplicate
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedProblem.duplicate_decision === "distinct" && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 size={14} /> Similarity reviewed and cleared as a distinct problem.
                  </div>
                )}

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Location</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{selectedProblem.location}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Problem type</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{selectedProblem.problemType}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Evidence summary</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                    {selectedProblem.evidence?.map((evidence: string, index: number) => (
                      <li key={`${evidence}-${index}`}>{evidence}</li>
                    )) || <li>No evidence attached yet.</li>}
                  </ul>
                  {(selectedProblem.evidenceAttachments?.length ?? 0) > 0 && (
                    <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                      <p className="text-xs font-semibold text-slate-600">Uploaded files</p>
                      {selectedProblem.evidenceAttachments?.map((attachment) => (
                        <a
                          key={attachment.url}
                          href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}${attachment.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs text-blue-700 hover:bg-blue-50"
                        >
                          <span className="truncate">{attachment.name}</span>
                          <span className="ml-3 flex-shrink-0 text-slate-400">{attachment.content_type ?? "file"}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {(selectedProblem.verification_history?.length ?? 0) > 0 && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Verification history</p>
                    <div className="mt-3 space-y-3">
                      {selectedProblem.verification_history?.map((entry, index) => (
                        <div key={`${entry.timestamp}-${index}`} className="border-l-2 border-emerald-200 pl-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="font-semibold text-slate-700">{entry.officer}</span>
                            <span className="text-slate-400">{new Date(entry.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-600">
                            {entry.previous_status} to {entry.status}: {entry.note || "No note"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <label className="block text-xs font-medium text-slate-600">Government decision note</label>
                  <textarea
                    value={decisionNote}
                    onChange={(e) => setDecisionNote(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Add verification note, evidence request, or rejection reason..."
                  />
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  <button
                    onClick={() => updateDecision("approve")}
                    className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Approve & Publish
                  </button>
                  <button
                    onClick={() => updateDecision("proof")}
                    className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                  >
                    Ask for Proof
                  </button>
                  <button
                    onClick={() => updateDecision("reject")}
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-slate-800">Assignment</h3>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-600">Assign to Officer</label>
                  <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
                    <option>Select officer...</option>
                    {officials.map((o) => (
                      <option key={o.id} value={o.name}>
                        {o.name} · {o.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-slate-800">Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Pending review</span>
                <span className="text-sm font-bold text-slate-900">{pendingCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Approved</span>
                <span className="text-sm font-bold text-emerald-600">
                  {queueState.filter((q) => q.status === "Verified").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Needs proof</span>
                <span className="text-sm font-bold text-amber-600">
                  {queueState.filter((q) => q.status === "Returned for Correction").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Rejected</span>
                <span className="text-sm font-bold text-red-600">
                  {queueState.filter((q) => q.status === "Rejected").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMergeModal && selectedProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            {mergeRequestSent ? (
              <>
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 size={18} />
                  <h3 className="text-sm font-bold">Merge request sent</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Each candidate owner will be asked to accept or decline. The original owner will need to
                  approve anyone who accepts before they become a co-owner -- nothing is merged automatically.
                </p>
                <button
                  type="button"
                  onClick={() => setShowMergeModal(false)}
                  className="mt-4 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-blue-800">
                  <GitMerge size={16} />
                  <h3 className="text-sm font-bold">Propose a merge</h3>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  This sends a request to each candidate&apos;s owner to accept or decline joining
                  {" "}
                  <span className="font-semibold text-slate-700">
                    {similarities.find((row) => row.other_problem_id === selectedProblem.duplicate_of_id)?.other_problem_title ?? "the existing report"}
                  </span>
                  {" "}as a co-owner. Nothing merges until the original owner approves each acceptance.
                </p>

                <div className="mt-3 space-y-1.5">
                  {similarities.filter((row) => row.tier !== "normal").map((row) => {
                    const isCurrentProblem = row.other_problem_id === selectedProblem.duplicate_of_id;
                    const candidateId = isCurrentProblem ? String(selectedProblem.id) : row.other_problem_id;
                    const label = isCurrentProblem
                      ? `${selectedProblem.title} (this report)`
                      : row.other_problem_title;
                    const checked = mergeCandidateIds.has(candidateId);
                    return (
                      <label
                        key={candidateId}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${checked ? "border-blue-300 bg-blue-50" : "border-slate-200"}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={isCurrentProblem || (!checked && mergeCandidateIds.size >= MAX_MERGE_CANDIDATES)}
                          onChange={() => toggleMergeCandidate(candidateId)}
                        />
                        <span className="flex-1 truncate text-slate-700">{label}</span>
                        <span className="text-slate-400">{Math.round(row.overall_score * 100)}%</span>
                      </label>
                    );
                  })}
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Up to {MAX_MERGE_CANDIDATES} candidates per request (3 owners total, including the original).</p>

                <textarea
                  value={mergeNote}
                  onChange={(e) => setMergeNote(e.target.value)}
                  rows={2}
                  placeholder="Optional note for the affected owners..."
                  className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                {mergeError && <p className="mt-2 text-xs font-semibold text-red-600">{mergeError}</p>}

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMergeModal(false)}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submitMergeRequest}
                    disabled={isSubmittingMerge || mergeCandidateIds.size === 0}
                    className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Send merge request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
