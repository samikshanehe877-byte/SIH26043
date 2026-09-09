"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ChallengeCard from "@/components/university/ChallengeCard";
import ChallengeDetails from "@/components/university/ChallengeDetails";
import RejectChallengeModal from "@/components/university/RejectChallengeModal";
import MentorAssignmentModal from "@/components/university/MentorAssignmentModal";
import { universityChallenges as initialChallenges } from "@/data/universityChallenges";
import { universityDepartments } from "@/data/universityAppData";
import { UniversityChallenge, ChallengeStatus, ChallengePriority } from "@/types/universityChallenge";

const STATUSES: ChallengeStatus[] = [
  "Awaiting Decision", "Accepted", "Mentor Assigned", "Active", "Completed", "Rejected",
];
const PRIORITIES: ChallengePriority[] = ["Low", "Medium", "High", "Critical"];

export default function AssignedChallengesPage() {
  const [challenges, setChallenges] = useState<UniversityChallenge[]>(initialChallenges);
  const [selectedChallenge, setSelectedChallenge] = useState<UniversityChallenge | null>(null);
  const [rejectingChallenge, setRejectingChallenge] = useState<UniversityChallenge | null>(null);
  const [assigningMentorChallenge, setAssigningMentorChallenge] = useState<UniversityChallenge | null>(null);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const filtered = useMemo(() => {
    let r = [...challenges];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.citizenName.toLowerCase().includes(q)
      );
    }
    if (filterDept)     r = r.filter((c) => c.assignedDepartmentName === filterDept);
    if (filterStatus)   r = r.filter((c) => c.status === filterStatus);
    if (filterPriority) r = r.filter((c) => c.priority === filterPriority);
    r.sort((a, b) =>
      sortBy === "supporters"
        ? b.supporters - a.supporters
        : sortBy === "ai"
        ? b.aiMatchScore - a.aiMatchScore
        : sortBy === "priority"
        ? ["Critical", "High", "Medium", "Low"].indexOf(a.priority) -
          ["Critical", "High", "Medium", "Low"].indexOf(b.priority)
        : b.id - a.id
    );
    return r;
  }, [challenges, search, filterDept, filterStatus, filterPriority, sortBy]);

  const handleAccept = (id: number) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Accepted" as const } : c))
    );
  };

  const handleReject = (id: number, reason: string) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "Rejected" as const, rejectionReason: reason } : c
      )
    );
    setRejectingChallenge(null);
  };

  const handleAssignMentor = (challengeId: number, mentorId: number, mentorName: string) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId
          ? {
              ...c,
              status: "Mentor Assigned" as const,
              assignedMentorId: mentorId,
              assignedMentorName: mentorName,
              currentStep: 7,
              progress: Math.max(c.progress, 30),
            }
          : c
      )
    );
    setAssigningMentorChallenge(null);
  };

  const hasFilters = search || filterDept || filterStatus || filterPriority;

  // Status tab counts
  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s] = challenges.filter((c) => c.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assigned Challenges</h1>
          <p className="mt-1 text-sm text-slate-500">
            All societal challenges assigned to Bharati Vidyapeeth University.
          </p>
        </div>

        {/* Status summary pills */}
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "" : s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filterStatus === s
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s}{" "}
              <span
                className={`ml-1 rounded-full px-1.5 py-0.5 text-xs ${
                  filterStatus === s ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {statusCounts[s]}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by title, location, or citizen name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={13} className="text-slate-400" />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-indigo-400 transition"
            >
              <option value="">All Departments</option>
              {universityDepartments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-indigo-400 transition"
            >
              <option value="">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-indigo-400 transition"
            >
              <option value="recent">Most Recent</option>
              <option value="priority">Highest Priority</option>
              <option value="ai">Highest AI Match</option>
              <option value="supporters">Most Supported</option>
            </select>
            {hasFilters && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterDept("");
                  setFilterStatus("");
                  setFilterPriority("");
                }}
                className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100 transition"
              >
                <X size={12} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">{filtered.length}</span>{" "}
          challenge{filtered.length !== 1 ? "s" : ""}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white py-20 text-center shadow-sm">
            <p className="text-3xl mb-2">🔍</p>
            <p className="font-semibold text-slate-600">No challenges found</p>
            <p className="mt-1 text-sm text-slate-400">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onViewDetails={setSelectedChallenge}
                onAccept={handleAccept}
                onReject={setRejectingChallenge}
                onAssignMentor={setAssigningMentorChallenge}
              />
            ))}
          </div>
        )}
      </div>

      {selectedChallenge && (
        <ChallengeDetails
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onAccept={handleAccept}
          onReject={(c) => { setSelectedChallenge(null); setRejectingChallenge(c); }}
          onAssignMentor={(c) => { setSelectedChallenge(null); setAssigningMentorChallenge(c); }}
        />
      )}
      {rejectingChallenge && (
        <RejectChallengeModal
          challenge={rejectingChallenge}
          onClose={() => setRejectingChallenge(null)}
          onReject={handleReject}
        />
      )}
      {assigningMentorChallenge && (
        <MentorAssignmentModal
          challenge={assigningMentorChallenge}
          onClose={() => setAssigningMentorChallenge(null)}
          onAssign={handleAssignMentor}
        />
      )}
    </>
  );
}
