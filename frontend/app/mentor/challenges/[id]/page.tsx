"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Users2,
  Building2,
  Calendar,
  MapPin,
  Sparkles,
  CheckSquare,
  Handshake,
  Clock,
  Plus,
  Send,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import MentorHeader from "@/components/mentor/MentorHeader";
import { ChallengeStatusBadge, ChallengePriorityBadge } from "@/components/mentor/ChallengeBadges";
import { TaskStatusBadge, TaskPriorityBadge } from "@/components/mentor/TaskStatusBadge";
import { CollaborationStatusBadge, HelpTypeBadge } from "@/components/mentor/CollaborationStatusBadge";
import CreateTeamModal from "@/components/mentor/CreateTeamModal";
import CreateTaskModal from "@/components/mentor/CreateTaskModal";
import TaskReviewModal from "@/components/mentor/TaskReviewModal";
import IndustryRequestModal from "@/components/mentor/IndustryRequestModal";
import ProgressUpdateModal from "@/components/mentor/ProgressUpdateModal";
import { useMentor } from "@/context/MentorContext";
import { Task } from "@/types/mentor";

export default function ChallengeDetailsPage() {
  const params = useParams();
  const challengeId = params.id as string;

  const {
    challenges,
    teams,
    students,
    tasks,
    industryRequests,
    universityUpdates,
    getTeamForChallenge,
  } = useMentor();

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<Task | null>(null);

  const challenge = challenges.find(
    (c) => c.id.toLowerCase() === challengeId.toLowerCase() || c.id === challengeId
  );

  if (!challenge) {
    return (
      <div className="space-y-6">
        <Link
          href="/mentor/challenges"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={14} />
          Back to Challenges
        </Link>
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <AlertCircle className="mx-auto mb-3 text-amber-500" size={36} />
          <h2 className="text-base font-bold text-slate-800">Challenge Not Found</h2>
          <p className="mt-1 text-xs text-slate-500">
            No challenge found matching ID &quot;{challengeId}&quot;.
          </p>
        </div>
      </div>
    );
  }

  const team = getTeamForChallenge(challenge.id);
  const challengeTasks = tasks.filter(
    (t) => t.challengeId === challenge.id || (team && t.teamId === team.id)
  );
  const challengeIndustryRequests = industryRequests.filter(
    (r) => r.challengeId === challenge.id
  );
  const challengeUpdates = universityUpdates.filter(
    (u) => u.challengeId === challenge.id
  );
  const teamMembers = team ? students.filter((s) => team.studentIds.includes(s.id)) : [];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/mentor/challenges"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition"
      >
        <ArrowLeft size={14} />
        Back to My Challenges
      </Link>

      {/* Main Challenge Header Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 font-mono">
                {challenge.id}
              </span>
              <span className="rounded-lg bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100">
                {challenge.category}
              </span>
              <ChallengePriorityBadge priority={challenge.priority} />
              <ChallengeStatusBadge status={challenge.status} />
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
              {challenge.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Building2 size={13} className="text-slate-400" />
                {challenge.assignedDepartment}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-slate-400" />
                {challenge.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-slate-400" />
                Assigned: {challenge.assignedDate}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            {team ? (
              <Link
                href={`/mentor/teams/${team.id}`}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
              >
                <Users2 size={14} />
                View Team ({team.name})
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsTeamModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
              >
                <Plus size={14} />
                Create Team
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            >
              <Send size={13} className="text-emerald-600" />
              Update University
            </button>

            <button
              type="button"
              onClick={() => setIsIndustryModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
            >
              <Handshake size={14} />
              Request Industry Help
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-700">Project Delivery Progression</span>
            <span className="font-extrabold text-emerald-600 text-sm">
              {challenge.progress}% Complete
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
              style={{ width: `${challenge.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 12 Sections Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Problem Description */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              1. Problem Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {challenge.description}
            </p>
          </div>

          {/* Section 3: AI Analysis */}
          <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-white to-sky-50/30 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-2xs">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    3. AI Technical Analysis
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Machine-assisted capability matching & architecture breakdown
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-bold text-indigo-800">
                Confidence: {challenge.aiAnalysis.confidence}%
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mb-4 bg-white/70 p-3 rounded-2xl border border-indigo-100/60">
              {challenge.aiAnalysis.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-slate-200/70 bg-white p-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  AI Classification
                </span>
                <p className="font-bold text-slate-800">
                  {challenge.aiAnalysis.classification}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-white p-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Suggested Technologies
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {challenge.aiAnalysis.suggestedTechnologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 & 5: Requirements & Required Skills */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                4. Key Technical Requirements
              </h3>
              <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-700">
                {challenge.requirements && challenge.requirements.length > 0 ? (
                  challenge.requirements.map((req, i) => (
                    <li key={i} className="leading-relaxed">
                      {req}
                    </li>
                  ))
                ) : (
                  <li>Full working prototype validated against local community metrics.</li>
                )}
              </ul>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                5. Required Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {challenge.requiredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 8: Student Team */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  8. Assigned Student Team
                </h3>
                <p className="text-xs text-slate-500">
                  Strictly ONE interdisciplinary team per challenge
                </p>
              </div>

              {team ? (
                <Link
                  href={`/mentor/teams/${team.id}`}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>Team Dashboard</span>
                  <ChevronRight size={13} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(true)}
                  className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                >
                  Create Team
                </button>
              )}
            </div>

            {team ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{team.name}</h4>
                    <p className="text-xs text-slate-500">{team.objective}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    Active Team
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-slate-200/60 pt-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-xl bg-white p-2.5 border border-slate-100 text-center shadow-2xs"
                    >
                      <div className="flex h-8 w-8 mx-auto items-center justify-center rounded-lg bg-emerald-600 text-[10px] font-bold text-white mb-1">
                        {member.avatar}
                      </div>
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {member.department}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                <Users2 size={28} className="mx-auto mb-2 text-slate-400" />
                <p className="text-xs font-bold text-slate-700">
                  No team created yet for this challenge
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm mx-auto">
                  As Lead Mentor, form an interdisciplinary team from the student roster to
                  begin milestone planning.
                </p>
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(true)}
                  className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                >
                  Create Team Now
                </button>
              </div>
            )}
          </div>

          {/* Section 9: Tasks */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  9. Challenge Tasks ({challengeTasks.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Work packages assigned to students working on this solution
                </p>
              </div>

              {team && (
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(true)}
                  className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                >
                  <Plus size={13} />
                  New Task
                </button>
              )}
            </div>

            {challengeTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                No tasks created yet for this challenge.
              </div>
            ) : (
              <div className="space-y-2.5">
                {challengeTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-slate-300 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-800">{t.title}</h4>
                        <TaskPriorityBadge priority={t.priority} />
                        <TaskStatusBadge status={t.status} />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Assigned to:{" "}
                        <span className="font-semibold text-slate-700">
                          {t.assignedStudentName}
                        </span>{" "}
                        • Due {t.deadline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTaskForReview(t)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Inspect / Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 11: Progress Updates Timeline */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  11. Updates Sent to University
                </h3>
                <p className="text-xs text-slate-500">
                  Milestone audit trail dispatched to Bharati Vidyapeeth University Coordinator
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsUpdateModalOpen(true)}
                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
              >
                <Send size={13} />
                Send New Update
              </button>
            </div>

            {challengeUpdates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                No formal updates sent to university yet for this challenge.
              </div>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {challengeUpdates.map((upd) => (
                  <div key={upd.id} className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                    {/* Circle marker */}
                    <div className="absolute -left-6 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                      <span className="h-2 w-2 rounded-full bg-white" />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <h4 className="text-xs font-bold text-slate-900">{upd.title}</h4>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100">
                        Progress: {upd.progress}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-2">Dispatched: {upd.date}</p>

                    <div className="space-y-1.5 text-xs text-slate-700">
                      <p>
                        <span className="font-semibold text-slate-900">Completed: </span>
                        {upd.workCompleted}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Current Work: </span>
                        {upd.currentWork}
                      </p>
                      {upd.blockers && (
                        <p className="text-rose-700 bg-rose-50/50 p-1.5 rounded-lg">
                          <span className="font-bold">Blocker: </span>
                          {upd.blockers}
                        </p>
                      )}
                      <p>
                        <span className="font-semibold text-slate-900">Industry: </span>
                        {upd.industrySupport}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">Next Steps: </span>
                        {upd.nextSteps}
                      </p>
                    </div>

                    {upd.attachments && upd.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-200/60 pt-2">
                        {upd.attachments.map((att, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 text-[11px] text-slate-600 rounded-lg bg-white border border-slate-200 px-2 py-1"
                          >
                            <FileText size={12} className="text-emerald-600" />
                            <span>{att}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column (Side Panels) */}
        <div className="space-y-6">
          {/* Section 2: Citizen Information */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              2. Citizen Problem Source
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xs font-bold text-white shadow-xs">
                {challenge.citizenAvatar}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{challenge.citizenName}</p>
                <p className="text-[11px] text-slate-500">{challenge.location}</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                  Backed by {challenge.supportersCount} citizens
                </p>
              </div>
            </div>
          </div>

          {/* Section 6 & 7: Assigned Department & Suggested Expertise */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                6. Assigned Department
              </h3>
              <p className="text-xs font-bold text-slate-800">
                {challenge.assignedDepartment}
              </p>
              <div className="mt-1.5">
                <span className="text-[11px] text-slate-400 block mb-1">
                  Supporting Departments:
                </span>
                <div className="flex flex-wrap gap-1">
                  {challenge.supportingDepartments.map((dept) => (
                    <span
                      key={dept}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                7. Suggested Industry Expertise
              </h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {challenge.aiAnalysis.suggestedIndustryExpertise.map((exp) => (
                  <span
                    key={exp}
                    className="rounded-lg border border-indigo-200 bg-indigo-50/50 px-2 py-0.5 text-[11px] font-semibold text-indigo-800"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 10: Industry Collaboration Requests */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                10. Industry Collaboration
              </h3>
              <button
                type="button"
                onClick={() => setIsIndustryModalOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                + Request
              </button>
            </div>

            {challengeIndustryRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                No active industry requests for this challenge.
              </div>
            ) : (
              <div className="space-y-2">
                {challengeIndustryRequests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <HelpTypeBadge type={req.helpType} />
                      <CollaborationStatusBadge status={req.status} />
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {req.organization}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {req.requestTitle}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 12: Mentor Notes */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              12. Mentor Notes
            </h3>
            <div className="rounded-2xl bg-amber-50/50 border border-amber-200/60 p-3.5 text-xs text-amber-900 leading-relaxed">
              {challenge.mentorNotes || "No specific notes logged yet."}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isTeamModalOpen && (
        <CreateTeamModal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          challenge={challenge}
        />
      )}

      {isTaskModalOpen && team && (
        <CreateTaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          defaultTeamId={team.id}
        />
      )}

      {isIndustryModalOpen && (
        <IndustryRequestModal
          isOpen={isIndustryModalOpen}
          onClose={() => setIsIndustryModalOpen(false)}
          defaultChallengeId={challenge.id}
          defaultTeamId={team?.id}
        />
      )}

      {isUpdateModalOpen && (
        <ProgressUpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          challenge={challenge}
        />
      )}

      {selectedTaskForReview && (
        <TaskReviewModal
          isOpen={!!selectedTaskForReview}
          onClose={() => setSelectedTaskForReview(null)}
          task={selectedTaskForReview}
        />
      )}
    </div>
  );
}

