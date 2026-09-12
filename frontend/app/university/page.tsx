"use client";

import { useState } from "react";
import {
  ClipboardList, Activity, CheckCircle2, Clock, Bell, Users,
  Building2, AlertCircle, Handshake, Send,
} from "lucide-react";
import Link from "next/link";
import UniversityStatsCard from "@/components/university/UniversityStatsCard";
import ChallengeCard from "@/components/university/ChallengeCard";
import ChallengeDetails from "@/components/university/ChallengeDetails";
import RejectChallengeModal from "@/components/university/RejectChallengeModal";
import MentorAssignmentModal from "@/components/university/MentorAssignmentModal";
import {
  universityCoordinator,
  universityDepartments,
  universityNotifications,
} from "@/data/universityAppData";
import { universityChallenges as initialChallenges } from "@/data/universityChallenges";
import { UniversityChallenge } from "@/types/universityChallenge";
import { useProblems } from "@/context/ProblemsContext";

const ACTIVITY = [
  { dot: "bg-green-500",  text: "Traffic Signal Optimization challenge completed successfully",    time: "4 days ago"  },
  { dot: "bg-indigo-500", text: "Dr. Ritu Verma assigned as mentor for Digital Literacy Program", time: "1 day ago"   },
  { dot: "bg-amber-500",  text: "Flood Early Warning System progress updated to 78%",             time: "2 days ago"  },
  { dot: "bg-purple-500", text: "Industry collaboration request submitted for FloodGuard",        time: "3 days ago"  },
  { dot: "bg-blue-500",   text: "AI department analysis completed for Solar Street Lighting",     time: "5 hours ago" },
  { dot: "bg-red-500",    text: "New challenge assigned: Healthcare Access in Rural Villages",    time: "2 hours ago" },
];

export default function UniversityDashboard() {
  const { problems, volunteerForProblem, withdrawVolunteerRequest } = useProblems();
  const [challenges, setChallenges] = useState<UniversityChallenge[]>(initialChallenges);
  const [selectedChallenge, setSelectedChallenge] = useState<UniversityChallenge | null>(null);
  const [rejectingChallenge, setRejectingChallenge] = useState<UniversityChallenge | null>(null);
  const [assigningMentorChallenge, setAssigningMentorChallenge] = useState<UniversityChallenge | null>(null);

  const unread = universityNotifications.filter((n) => !n.isRead).length;

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

  const [volunteeredIds, setVolunteeredIds] = useState<Set<string>>(new Set());

  const handleVolunteer = async (problemId: string, universityName: string, proposal: string) => {
    const success = await volunteerForProblem(problemId, "university", universityName, proposal);
    if (success) {
      setVolunteeredIds((prev) => new Set(prev).add(problemId));
    }
    return success;
  };

  const handleWithdrawVolunteer = async (problemId: string) => {
    const success = await withdrawVolunteerRequest(problemId, "university", universityCoordinator.university);
    if (success) {
      setVolunteeredIds((prev) => {
        const next = new Set(prev);
        next.delete(problemId);
        return next;
      });
    }
    return success;
  };

  const availableProblems = problems.filter(
    (p) =>
      p.status === "Verified" &&
      !p.volunteers?.some(
        (v) => v.solverType === "university" && v.solverName === universityCoordinator.university && v.status === "accepted"
      )
  );

  const stats = {
    total:    challenges.length,
    awaiting: challenges.filter((c) => c.status === "Awaiting Decision").length,
    active:   challenges.filter((c) => ["Accepted", "Mentor Assigned", "Active"].includes(c.status)).length,
    completed:challenges.filter((c) => c.status === "Completed").length,
  };

  const awaitingDecision = challenges.filter((c) => c.status === "Awaiting Decision");
  const activeChallenges = challenges.filter((c) =>
    ["Accepted", "Mentor Assigned", "Active"].includes(c.status)
  );

  // Mentor availability summary
  const mentorStats = { available: 5, limited: 3, fullyAssigned: 2 };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Welcome back,</p>
            <h1 className="text-2xl font-bold text-slate-900">
              {universityCoordinator.name} 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage assigned societal challenges, mentor allocation, and solution progress.
            </p>
          </div>
          <Link
            href="/university/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <UniversityStatsCard label="Total Assigned"    value={stats.total}     icon={ClipboardList} color="indigo" sublabel="All time"         />
          <UniversityStatsCard label="Awaiting Decision" value={stats.awaiting}  icon={Clock}         color="amber"  sublabel="Need attention"   />
          <UniversityStatsCard label="Active Challenges" value={stats.active}    icon={Activity}      color="purple" sublabel="In progress"       />
          <UniversityStatsCard label="Completed"         value={stats.completed} icon={CheckCircle2}  color="green"  sublabel="Successfully done" />
        </div>

        {/* Available Problems — Volunteer Opportunities */}
        {availableProblems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Handshake size={18} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-800">
                Available Problems — Volunteer Opportunities
              </h2>
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                {availableProblems.length}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              These verified problems are open for university volunteer proposals. Review and volunteer your department's solution.
            </p>
            <div className="space-y-4">
              {availableProblems.map((problem) => {
                const hasVolunteered = volunteeredIds.has(String(problem.id));
                const existingVolunteer = problem.volunteers?.find(
                  (v) => v.solverName === universityCoordinator.university
                );
                const showVolunteer = !hasVolunteered && !existingVolunteer;
                const showWithdraw = hasVolunteered || (existingVolunteer && existingVolunteer.status === "volunteered");
                return (
                  <div key={problem.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-indigo-50 text-indigo-700 px-2.5 py-0.5 text-xs font-semibold">
                        {problem.category}
                      </span>
                      {existingVolunteer && existingVolunteer.status === "accepted" && (
                        <span className="rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-xs font-bold">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">{problem.title}</h3>
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">{problem.description}</p>
                    {problem.volunteers && problem.volunteers.filter((v) => v.status === "volunteered" || v.status === "accepted").length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {problem.volunteers
                          .filter((v) => v.status === "volunteered" || v.status === "accepted")
                          .map((v, i) => (
                            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                              {v.solverName}
                              {v.status === "accepted" && <span className="text-emerald-600">✓</span>}
                            </span>
                          ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {showVolunteer && (
                        <button
                          onClick={() => handleVolunteer(String(problem.id), universityCoordinator.university, problem.requiredCapabilities?.join(", ") || "")}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                        >
                          <Handshake size={12} />
                          Volunteer
                        </button>
                      )}
                      {showWithdraw && (
                        <button
                          onClick={() => handleWithdrawVolunteer(String(problem.id))}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          <span className="text-amber-600">↶</span>
                          {existingVolunteer?.status === "accepted" ? "Withdrawn" : "Withdraw"}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedChallenge(problem as unknown as UniversityChallenge)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        <Send size={12} />
                        Proposal
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Awaiting Decision — most important section */}
        {awaitingDecision.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-500" />
              <h2 className="text-lg font-bold text-slate-800">
                Challenges Awaiting Your Decision
              </h2>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                {awaitingDecision.length}
              </span>
            </div>
            <div className="space-y-4">
              {awaitingDecision.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onViewDetails={setSelectedChallenge}
                  onAccept={handleAccept}
                  onReject={setRejectingChallenge}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Main content */}
          <div className="xl:col-span-2 space-y-5">
            {/* Active Challenges */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Active Challenges</h2>
                <Link
                  href="/university/assigned-challenges"
                  className="text-sm font-semibold text-indigo-600 hover:underline"
                >
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {activeChallenges.slice(0, 4).map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                    onClick={() => setSelectedChallenge(challenge)}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg">
                      {challenge.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{challenge.title}</p>
                      <p className="text-xs text-slate-500">
                        {challenge.assignedDepartmentName ?? "Dept. not assigned"} ·{" "}
                        {challenge.assignedMentorName ?? "No mentor"}
                      </p>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-1.5 rounded-full bg-indigo-500 transition-all"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold text-indigo-600">{challenge.progress}%</p>
                      <p className="text-xs text-slate-400">{challenge.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-5">
            {/* Department Workload */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Department Workload</h3>
                <Link
                  href="/university/departments"
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  View →
                </Link>
              </div>
              <div className="space-y-3">
                {universityDepartments.map((dept) => (
                  <div key={dept.id}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">{dept.shortName}</span>
                      <span className="text-xs text-slate-500">
                        {dept.primaryChallenges}P · {dept.supportingChallenges}S
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-1.5 rounded-full bg-indigo-500 transition-all"
                        style={{
                          width: `${Math.min(
                            ((dept.primaryChallenges + dept.supportingChallenges) /
                              (dept.primaryChallenges + dept.supportingChallenges + dept.completedChallenges)) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor Availability */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Mentor Availability</h3>
                <Link
                  href="/university/mentors"
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  View →
                </Link>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Available",       value: mentorStats.available,     color: "bg-green-500",  text: "text-green-700",  bg: "bg-green-50"  },
                  { label: "Limited Capacity",value: mentorStats.limited,       color: "bg-amber-500",  text: "text-amber-700",  bg: "bg-amber-50"  },
                  { label: "Fully Assigned",  value: mentorStats.fullyAssigned, color: "bg-red-500",    text: "text-red-700",    bg: "bg-red-50"    },
                ].map(({ label, value, color, text, bg }) => (
                  <div key={label} className={`flex items-center justify-between rounded-xl ${bg} px-3 py-2.5`}>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${color}`} />
                      <span className={`text-xs font-semibold ${text}`}>{label}</span>
                    </div>
                    <span className={`text-sm font-bold ${text}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-slate-800">Recent Activity</h3>
              <div className="space-y-3">
                {ACTIVITY.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${item.dot}`} />
                    <div>
                      <p className="text-xs text-slate-600 leading-snug">{item.text}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-slate-800">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/university/assigned-challenges"
                  className="flex items-center gap-2 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
                >
                  <ClipboardList size={15} /> Review All Challenges
                </Link>
                <Link
                  href="/university/mentors"
                  className="flex items-center gap-2 w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                >
                  <Users size={15} /> Manage Mentors
                </Link>
                <Link
                  href="/university/departments"
                  className="flex items-center gap-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Building2 size={15} /> View Departments
                </Link>
              </div>
            </div>
          </div>
        </div>
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
