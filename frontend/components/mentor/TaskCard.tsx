"use client";

import { Calendar, FileCheck, FileText } from "lucide-react";
import { Task, TaskStatus } from "@/types/mentor";
import { TaskStatusBadge, TaskPriorityBadge } from "./TaskStatusBadge";

interface TaskCardProps {
  task: Task;
  onReview?: (task: Task) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

export default function TaskCard({
  task,
  onReview,
}: TaskCardProps) {
  const isAwaitingReview = task.status === "Submitted" || task.status === "Under Review";

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border p-4 shadow-xs transition hover:shadow-sm ${
        isAwaitingReview
          ? "border-purple-200 bg-purple-50/20"
          : task.status === "Changes Requested"
          ? "border-rose-200 bg-rose-50/20"
          : "border-slate-200/80 bg-white"
      }`}
    >
      <div>
        {/* Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[10px] font-mono font-bold text-slate-400">
            {task.id}
          </span>
          <div className="flex items-center gap-1.5">
            <TaskPriorityBadge priority={task.priority} />
            <TaskStatusBadge status={task.status} />
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
          {task.title}
        </h4>

        {/* Description */}
        <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        {/* Team Tag */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600 truncate max-w-[140px]">
            {task.teamName}
          </span>
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar size={12} />
            <span>Due: {task.deadline}</span>
          </div>
        </div>

        {/* Assignee */}
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 p-2 border border-slate-100">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-[10px] font-bold text-white">
            {task.assignedStudentAvatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {task.assignedStudentName}
            </p>
          </div>
          {task.submission && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
              <FileText size={11} />
              <span>Has Files</span>
            </div>
          )}
        </div>

        {/* Review feedback highlight if changes requested or approved */}
        {task.submission?.changesRequestedReason && (
          <div className="mt-2 rounded-xl bg-rose-50 border border-rose-100 p-2 text-[11px] text-rose-800">
            <span className="font-bold">Changes Requested: </span>
            {task.submission.changesRequestedReason}
          </div>
        )}
        {task.submission?.feedback && (
          <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-100 p-2 text-[11px] text-emerald-800">
            <span className="font-bold">Mentor Feedback: </span>
            {task.submission.feedback}
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        {isAwaitingReview ? (
          <button
            type="button"
            onClick={() => onReview && onReview(task)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition"
          >
            <FileCheck size={14} />
            <span>Review Submission</span>
          </button>
        ) : (
          <div className="flex w-full items-center justify-between">
            <span className="text-[10px] text-slate-400">
              Created: {task.createdAt}
            </span>
            <button
              type="button"
              onClick={() => onReview && onReview(task)}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-600"
            >
              Inspect Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

