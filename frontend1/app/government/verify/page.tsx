"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, XCircle, Clock, AlertTriangle, User, FileText, MapPin, BadgeCheck } from "lucide-react";
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
  [key: string]: unknown;
};

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

  useEffect(() => {
    let cancelled = false;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    fetch(`${apiUrl}/problems?limit=500`)
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
                      <h3 className="text-base font-bold text-slate-900">{item.problemTitle}</h3>
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
    </div>
  );
}
