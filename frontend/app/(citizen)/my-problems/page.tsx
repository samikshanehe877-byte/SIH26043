"use client";

import { useEffect, useState } from "react";
import { Calendar, Building2, Eye, FileText, Clock, CheckCircle2, Trash2, Upload, GitMerge, Check, X } from "lucide-react";
import { MergeRequest, Problem } from "@/types/problem";
import StatusBadge from "@/components/StatusBadge";
import ProblemDetails from "@/components/ProblemDetails";
import StatsCard from "@/components/StatsCard";
import { useProblems } from "@/context/ProblemsContext";
import { useAuth } from "@/context/AuthContext";

function MergeRequestsPanel({ citizenName, onResolved }: { citizenName: string; onResolved: () => void }) {
  const [requests, setRequests] = useState<MergeRequest[]>([]);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const load = () => {
    fetch(`${apiUrl}/merge-requests?citizen_name=${encodeURIComponent(citizenName)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => { if (Array.isArray(data)) setRequests(data.filter((r: MergeRequest) => r.status === "open")); })
      .catch(() => undefined);
  };

  useEffect(load, [citizenName]);

  const respond = async (request: MergeRequest, problemId: string, response: "accepted" | "declined") => {
    setBusyKey(`${request.id}-${problemId}`);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/merge-requests/${request.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem_id: problemId, citizen_name: citizenName, response }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Could not respond to this merge request");
      load();
      onResolved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not respond to this merge request");
    } finally {
      setBusyKey(null);
    }
  };

  const approve = async (request: MergeRequest, problemId: string) => {
    setBusyKey(`${request.id}-${problemId}`);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/merge-requests/${request.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem_id: problemId, citizen_name: citizenName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Could not approve this co-owner");
      load();
      onResolved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not approve this co-owner");
    } finally {
      setBusyKey(null);
    }
  };

  if (requests.length === 0) return null;

  return (
    <div className="space-y-3">
      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
      {requests.map((request) => {
        const asCandidate = request.members.find((m) => m.citizen_name === citizenName);
        const isPrimary = request.primary_citizen_name === citizenName;
        return (
          <div key={request.id} className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-blue-800">
              <GitMerge size={13} /> Merge request
            </div>

            {!isPrimary && asCandidate && asCandidate.response === "pending" && (
              <>
                <p className="mt-2 text-sm text-slate-700">
                  A government officer thinks your report{" "}
                  <span className="font-semibold">&ldquo;{asCandidate.problem_title}&rdquo;</span> may be the same
                  problem as <span className="font-semibold">&ldquo;{request.primary_problem_title}&rdquo;</span>{" "}
                  (reported by {request.primary_citizen_name}). If you agree, you can join as a co-owner of that
                  report.
                </p>
                {request.note && <p className="mt-1 text-xs italic text-slate-500">Officer&apos;s note: {request.note}</p>}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => respond(request, asCandidate.problem_id, "accepted")}
                    disabled={busyKey === `${request.id}-${asCandidate.problem_id}`}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Check size={13} /> Agree, this is the same problem
                  </button>
                  <button
                    onClick={() => respond(request, asCandidate.problem_id, "declined")}
                    disabled={busyKey === `${request.id}-${asCandidate.problem_id}`}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <X size={13} /> No, keep separate
                  </button>
                </div>
              </>
            )}

            {!isPrimary && asCandidate && asCandidate.response !== "pending" && (
              <p className="mt-2 text-sm text-slate-600">
                You {asCandidate.response} this request
                {asCandidate.response === "accepted" && !asCandidate.approved
                  ? " -- waiting for the original owner to approve you as a co-owner."
                  : ""}
              </p>
            )}

            {isPrimary && (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-slate-700">
                  You proposed merging {request.members.length} similar report(s) into{" "}
                  <span className="font-semibold">&ldquo;{request.primary_problem_title}&rdquo;</span>.
                </p>
                {request.members.map((member) => (
                  <div key={member.problem_id} className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{member.problem_title}</p>
                      <p className="text-xs text-slate-500">{member.citizen_name} -- {member.response}{member.approved ? ", approved" : ""}</p>
                    </div>
                    {member.response === "accepted" && !member.approved && (
                      <button
                        onClick={() => approve(request, member.problem_id)}
                        disabled={busyKey === `${request.id}-${member.problem_id}`}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Check size={13} /> Approve as co-owner
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function MyProblemsPage() {
  const { myProblems, toggleSupport, deleteProblem, resubmitProblem, refreshProblems } = useProblems();
  const { user } = useAuth();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [proofFiles, setProofFiles] = useState<Record<string, File[]>>({});
  const [proofNotes, setProofNotes] = useState<Record<string, string>>({});
  const problems = myProblems;

  useEffect(() => {
    const problemId = new URLSearchParams(window.location.search).get("problemId");
    if (!problemId) return;
    const selectionTimer = window.setTimeout(() => {
      const problem = problems.find((item) => String(item.id) === problemId);
      if (problem) setSelectedProblem(problem);
    }, 0);
    return () => window.clearTimeout(selectionTimer);
  }, [problems]);

  const handleToggleSupport = (id: number | string) => {
    toggleSupport(id);
    setSelectedProblem((prev) =>
      prev?.id === id
        ? { ...prev, isSupported: !prev.isSupported, supporters: prev.isSupported ? prev.supporters - 1 : prev.supporters + 1 }
        : prev
    );
  };

  const handleDelete = async (problem: Problem) => {
    if (!window.confirm("Delete this unverified problem? This cannot be undone.")) return;
    await deleteProblem(problem.id);
  };

  const handleResubmit = async (problem: Problem) => {
    const success = await resubmitProblem(
      problem.id,
      proofFiles[String(problem.id)] ?? [],
      proofNotes[String(problem.id)] ?? ""
    );
    if (success) {
      setProofFiles((previous) => ({ ...previous, [String(problem.id)]: [] }));
      setProofNotes((previous) => ({ ...previous, [String(problem.id)]: "" }));
    }
  };

  const progressColor = (p: number) => {
    if (p === 100) return "bg-green-500";
    if (p >= 60)   return "bg-blue-500";
    if (p >= 30)   return "bg-amber-500";
    return "bg-slate-300";
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Problems</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track the status and progress of all problems you have submitted.
          </p>
        </div>

        {user && <MergeRequestsPanel citizenName={user.name} onResolved={refreshProblems} />}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatsCard label="Total Submitted" value={problems.length} icon={FileText} color="blue" />
          <StatsCard
            label="In Progress"
            value={problems.filter((problem) => ["Under Review", "Assigned to University", "In Progress", "Collaboration with Industry"].includes(problem.status)).length}
            icon={Clock}
            color="amber"
          />
          <StatsCard
            label="Completed"
            value={problems.filter((problem) => problem.status === "Completed").length}
            icon={CheckCircle2}
            color="green"
          />
        </div>

        <div className="space-y-4">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {problem.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                      {problem.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar size={11} />
                      {problem.date}
                    </span>
                  </div>
                </div>
                <StatusBadge status={problem.status} />
              </div>

              {problem.assignedUniversity && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2">
                  <Building2 size={13} className="flex-shrink-0 text-blue-500" />
                  <p className="text-xs text-blue-700">
                    <span className="font-semibold">{problem.assignedUniversity}</span>
                    {problem.assignedDepartment && (
                      <span className="text-blue-500"> — {problem.assignedDepartment}</span>
                    )}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Solution Progress</span>
                  <span className="text-xs font-bold text-slate-700">{problem.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${progressColor(problem.progress)}`}
                    style={{ width: `${problem.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedProblem(problem)}
                    className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                  {problem.status === "Needs Proof" && (
                    <div className="w-full rounded-xl border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs font-semibold text-amber-800">Additional proof requested</p>
                      <textarea
                        value={proofNotes[String(problem.id)] ?? ""}
                        onChange={(event) => setProofNotes((previous) => ({ ...previous, [String(problem.id)]: event.target.value }))}
                        placeholder="Add a note for the reviewing officer"
                        rows={2}
                        className="mt-2 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-amber-400"
                      />
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100">
                          <Upload size={13} />
                          Choose evidence
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*,.pdf,.doc,.docx"
                            className="hidden"
                            onChange={(event) => setProofFiles((previous) => ({ ...previous, [String(problem.id)]: Array.from(event.target.files ?? []) }))}
                          />
                        </label>
                        <button
                          onClick={() => handleResubmit(problem)}
                          className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700"
                        >
                          Resubmit for review
                        </button>
                        {(proofFiles[String(problem.id)]?.length ?? 0) > 0 && (
                          <span className="text-xs text-amber-700">{proofFiles[String(problem.id)].length} file(s) selected</span>
                        )}
                      </div>
                    </div>
                  )}
                  {problem.status !== "Verified" && (
                    <button
                      onClick={() => handleDelete(problem)}
                      className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProblem && (
        <ProblemDetails
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onToggleSupport={handleToggleSupport}
        />
      )}
    </>
  );
}
