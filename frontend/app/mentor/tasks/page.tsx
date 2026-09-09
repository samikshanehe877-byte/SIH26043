"use client";

import { useState, useMemo } from "react";
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  LayoutGrid,
  List,
  Clock,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import MentorHeader from "@/components/mentor/MentorHeader";
import TaskCard from "@/components/mentor/TaskCard";
import CreateTaskModal from "@/components/mentor/CreateTaskModal";
import TaskReviewModal from "@/components/mentor/TaskReviewModal";
import { useMentor } from "@/context/MentorContext";
import { Task, TaskStatus } from "@/types/mentor";

const allStatuses: TaskStatus[] = [
  "To Do",
  "In Progress",
  "Submitted",
  "Under Review",
  "Changes Requested",
  "Approved",
  "Completed",
];

export default function MentorTasksPage() {
  const { tasks, teams } = useMentor();

  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<Task | null>(null);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignedStudentName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTeam = teamFilter === "all" || t.teamId === teamFilter;
      const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;

      return matchesSearch && matchesTeam && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, teamFilter, priorityFilter, statusFilter]);

  // Submissions count awaiting review
  const awaitingReviewCount = tasks.filter(
    (t) => t.status === "Submitted" || t.status === "Under Review"
  ).length;

  return (
    <div className="space-y-6">
      <MentorHeader
        title="Task Management & Reviews"
        subtitle="Create, delegate, track and review student technical deliverables"
      >
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
        >
          <Plus size={15} />
          Create Task
        </button>
      </MentorHeader>

      {/* Review Banner if items awaiting review */}
      {awaitingReviewCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-purple-200 bg-purple-50/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-2xs">
              <FileCheck size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-purple-900">
                {awaitingReviewCount} Student Deliverable{awaitingReviewCount > 1 ? "s" : ""}{" "}
                Awaiting Mentor Sign-off
              </h3>
              <p className="text-[11px] text-purple-700">
                Inspect code, dataset benchmarks, and provide feedback or approval.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStatusFilter("Submitted")}
            className="rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-700 transition shadow-2xs self-start sm:self-auto"
          >
            Filter Submissions
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks by title, description, or student name..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setViewMode("board")}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                  viewMode === "board"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <LayoutGrid size={14} />
                <span>Board</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <List size={14} />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter size={12} />
            Filter:
          </span>

          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"
          >
            <option value="all">All Teams</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"
          >
            <option value="all">All Statuses</option>
            {allStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {(teamFilter !== "all" ||
            statusFilter !== "all" ||
            priorityFilter !== "all" ||
            searchQuery) && (
            <button
              onClick={() => {
                setTeamFilter("all");
                setStatusFilter("all");
                setPriorityFilter("all");
                setSearchQuery("");
              }}
              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Board or List Display */}
      {viewMode === "board" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {/* Column 1: To Do & In Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                To Do / In Progress
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.2 text-[10px] font-bold text-slate-600">
                {
                  filteredTasks.filter(
                    (t) => t.status === "To Do" || t.status === "In Progress"
                  ).length
                }
              </span>
            </div>
            <div className="space-y-3">
              {filteredTasks
                .filter((t) => t.status === "To Do" || t.status === "In Progress")
                .map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onReview={(task) => setSelectedTaskForReview(task)}
                  />
                ))}
            </div>
          </div>

          {/* Column 2: Submitted / Under Review */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Awaiting Review
              </span>
              <span className="rounded-full bg-purple-100 px-2 py-0.2 text-[10px] font-bold text-purple-800">
                {
                  filteredTasks.filter(
                    (t) => t.status === "Submitted" || t.status === "Under Review"
                  ).length
                }
              </span>
            </div>
            <div className="space-y-3">
              {filteredTasks
                .filter((t) => t.status === "Submitted" || t.status === "Under Review")
                .map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onReview={(task) => setSelectedTaskForReview(task)}
                  />
                ))}
            </div>
          </div>

          {/* Column 3: Changes Requested */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                Changes Requested
              </span>
              <span className="rounded-full bg-rose-100 px-2 py-0.2 text-[10px] font-bold text-rose-800">
                {
                  filteredTasks.filter((t) => t.status === "Changes Requested").length
                }
              </span>
            </div>
            <div className="space-y-3">
              {filteredTasks
                .filter((t) => t.status === "Changes Requested")
                .map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onReview={(task) => setSelectedTaskForReview(task)}
                  />
                ))}
            </div>
          </div>

          {/* Column 4: Approved & Completed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Approved / Completed
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-800">
                {
                  filteredTasks.filter(
                    (t) => t.status === "Approved" || t.status === "Completed"
                  ).length
                }
              </span>
            </div>
            <div className="space-y-3">
              {filteredTasks
                .filter((t) => t.status === "Approved" || t.status === "Completed")
                .map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onReview={(task) => setSelectedTaskForReview(task)}
                  />
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onReview={(task) => setSelectedTaskForReview(task)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
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

