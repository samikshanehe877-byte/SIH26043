"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users2,
  Calendar,
  CheckSquare,
  Award,
  Plus,
  BarChart3,
  Clock,
  Activity,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import MentorHeader from "@/components/mentor/MentorHeader";
import StudentCard from "@/components/mentor/StudentCard";
import TaskCard from "@/components/mentor/TaskCard";
import CreateTaskModal from "@/components/mentor/CreateTaskModal";
import TaskReviewModal from "@/components/mentor/TaskReviewModal";
import StudentWorkModal from "@/components/mentor/StudentWorkModal";
import { useMentor } from "@/context/MentorContext";
import { Student, Task } from "@/types/mentor";

export default function TeamDetailsPage() {
  const params = useParams();
  const teamId = params.id as string;

  const { teams, students, tasks, challenges } = useMentor();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedStudentForTask, setSelectedStudentForTask] = useState<Student | null>(null);
  const [selectedStudentForWork, setSelectedStudentForWork] = useState<Student | null>(null);
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<Task | null>(null);

  const team = teams.find((t) => t.id === teamId);

  if (!team) {
    return (
      <div className="space-y-6">
        <Link
          href="/mentor/teams"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={14} />
          Back to Teams
        </Link>
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <AlertCircle className="mx-auto mb-3 text-amber-500" size={36} />
          <h2 className="text-base font-bold text-slate-800">Team Not Found</h2>
          <p className="mt-1 text-xs text-slate-500">
            No team found matching ID &quot;{teamId}&quot;.
          </p>
        </div>
      </div>
    );
  }

  const teamMembers = students.filter((s) => team.studentIds.includes(s.id));
  const teamTasks = tasks.filter((t) => t.teamId === team.id);
  const challenge = challenges.find((c) => c.id === team.challengeId);

  // Breakdown metrics
  const breakdown = team.progressBreakdown || {
    research: 100,
    dataCollection: 80,
    modelDevelopment: 60,
    backend: 50,
    testing: 30,
    documentation: 20,
  };

  const progressItems = [
    { label: "Research & Literature", value: breakdown.research, color: "bg-emerald-500" },
    { label: "Data Collection & Curation", value: breakdown.dataCollection, color: "bg-teal-500" },
    { label: "Model Development & Algorithmic MVP", value: breakdown.modelDevelopment, color: "bg-indigo-500" },
    { label: "Backend Architecture & APIs", value: breakdown.backend, color: "bg-blue-500" },
    { label: "Testing, QA & Field Simulation", value: breakdown.testing, color: "bg-amber-500" },
    { label: "Documentation & Technical Writeup", value: breakdown.documentation, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/mentor/teams"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition"
      >
        <ArrowLeft size={14} />
        Back to Teams
      </Link>

      {/* Team Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 font-mono">
                {team.id}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100">
                {team.status}
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {team.name}
            </h1>
            <p className="mt-1 text-xs text-slate-500 max-w-xl">{team.description}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <Link
                href={`/mentor/challenges/${team.challengeId}`}
                className="flex items-center gap-1 font-bold text-emerald-600 hover:underline"
              >
                <Award size={13} />
                <span>{team.challengeTitle}</span>
              </Link>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar size={13} />
                Created {team.createdAt}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedStudentForTask(null);
                setIsTaskModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <Plus size={14} />
              Assign Task
            </button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-700">Overall Team Delivery Progress</span>
            <span className="font-extrabold text-emerald-600 text-sm">
              {team.progress}%
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${team.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Progress Breakdown & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Breakdown */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <BarChart3 size={16} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Milestone Progress Breakdown
              </h2>
            </div>
            <span className="text-[11px] font-bold text-emerald-600">
              Avg: {team.progress}%
            </span>
          </div>

          <div className="space-y-3.5">
            {progressItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="font-bold text-slate-800">{item.value}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Student Activity Stream */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <Activity size={16} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Recent Student Activity
              </h2>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Team Log</span>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-[10px] font-bold text-white shadow-2xs">
                  {member.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800">{member.name}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">{member.lastActivity}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    member.status === "On Track"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Team Members ({teamMembers.length})
            </h2>
            <p className="text-xs text-slate-500">
              Monitor individual workload capacities, assigned work packages, and completion velocity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onViewWork={(s) => setSelectedStudentForWork(s)}
              onAssignTask={(s) => {
                setSelectedStudentForTask(s);
                setIsTaskModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Team Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Team Tasks ({teamTasks.length})
            </h2>
            <p className="text-xs text-slate-500">
              Work items assigned to members of {team.name}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedStudentForTask(null);
              setIsTaskModalOpen(true);
            }}
            className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs"
          >
            <Plus size={13} />
            Create Task
          </button>
        </div>

        {teamTasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-xs text-slate-400">
            No tasks created yet for this team. Click &quot;Assign Task&quot; above to delegate work.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onReview={(t) => setSelectedTaskForReview(t)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {isTaskModalOpen && (
        <CreateTaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          defaultTeamId={team.id}
          defaultStudentId={selectedStudentForTask?.id}
        />
      )}

      {selectedStudentForWork && (
        <StudentWorkModal
          isOpen={!!selectedStudentForWork}
          onClose={() => setSelectedStudentForWork(null)}
          student={selectedStudentForWork}
          onAssignTask={() => {
            setSelectedStudentForTask(selectedStudentForWork);
            setIsTaskModalOpen(true);
          }}
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

