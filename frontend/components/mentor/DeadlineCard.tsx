"use client";

import Link from "next/link";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Task } from "@/types/mentor";
import { TaskPriorityBadge } from "./TaskStatusBadge";

interface DeadlineCardProps {
  tasks: Task[];
}

export default function DeadlineCard({ tasks }: DeadlineCardProps) {
  // Filter uncompleted tasks with upcoming deadlines
  const upcomingTasks = tasks
    .filter((t) => t.status !== "Completed" && t.status !== "Approved")
    .slice(0, 4);

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Clock size={16} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Upcoming Deadlines
          </h2>
        </div>
        <Link
          href="/mentor/tasks"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          View All Tasks
        </Link>
      </div>

      <div className="space-y-2.5">
        {upcomingTasks.map((task) => {
          const isCritical = task.priority === "Critical";
          return (
            <div
              key={task.id}
              className={`flex items-center justify-between gap-3 rounded-2xl border p-3 transition ${
                isCritical
                  ? "border-rose-200 bg-rose-50/30"
                  : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800 truncate">
                    {task.title}
                  </h4>
                  <TaskPriorityBadge priority={task.priority} />
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="truncate">{task.teamName}</span>
                  <span>•</span>
                  <span className="font-medium text-slate-700">
                    {task.assignedStudentName}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end flex-shrink-0">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                  <Calendar size={13} className="text-slate-400" />
                  <span>{task.deadline}</span>
                </div>
                {isCritical && (
                  <span className="text-[10px] font-bold text-rose-600">
                    High Urgency
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

