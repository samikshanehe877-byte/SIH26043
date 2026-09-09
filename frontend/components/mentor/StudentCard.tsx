"use client";

import { Eye, Plus, CheckSquare, Clock } from "lucide-react";
import { Student } from "@/types/mentor";

interface StudentCardProps {
  student: Student;
  onViewWork?: (student: Student) => void;
  onAssignTask?: (student: Student) => void;
}

export default function StudentCard({
  student,
  onViewWork,
  onAssignTask,
}: StudentCardProps) {
  const statusStyles: Record<string, string> = {
    "On Track": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Needs Attention": "bg-amber-50 text-amber-800 border-amber-300",
    Overloaded: "bg-rose-50 text-rose-700 border-rose-200 font-bold",
    Inactive: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-sm">
      <div>
        {/* Top Info */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-xs font-bold text-white shadow-xs">
              {student.avatar}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{student.name}</h4>
              <p className="text-xs text-slate-500">
                {student.department} • {student.year}
              </p>
            </div>
          </div>

          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${
              statusStyles[student.status] || "bg-slate-100 text-slate-600"
            }`}
          >
            {student.status}
          </span>
        </div>

        {/* Expertise */}
        <p className="mt-2.5 text-xs text-slate-600 font-medium line-clamp-1">
          {student.expertise}
        </p>

        {/* Skills */}
        <div className="mt-2 flex flex-wrap gap-1">
          {student.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-600"
            >
              {skill}
            </span>
          ))}
          {student.skills.length > 3 && (
            <span className="rounded-md border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400">
              +{student.skills.length - 3}
            </span>
          )}
        </div>

        {/* Workload Progress Bar */}
        <div className="mt-3.5 border-t border-slate-100 pt-2.5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500 text-[11px]">Workload Capacity</span>
            <span
              className={`font-bold ${
                student.workload > 80
                  ? "text-rose-600"
                  : student.workload > 50
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}
            >
              {student.workload}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${
                student.workload > 80
                  ? "bg-rose-500"
                  : student.workload > 50
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${student.workload}%` }}
            />
          </div>
        </div>

        {/* Task Metrics */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <CheckSquare size={13} className="text-emerald-600" />
            <span>{student.completedTasks} completed</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={13} className="text-amber-500" />
            <span>{student.pendingTasks} pending</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => onViewWork && onViewWork(student)}
          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
        >
          <Eye size={13} />
          <span>View Work</span>
        </button>

        <button
          type="button"
          onClick={() => onAssignTask && onAssignTask(student)}
          className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-2xs"
        >
          <Plus size={13} />
          <span>Assign Task</span>
        </button>
      </div>
    </div>
  );
}

