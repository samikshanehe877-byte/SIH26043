"use client";

import { X, CheckCircle2, Clock, FileText, CheckSquare, Plus } from "lucide-react";
import { Student, Task } from "@/types/mentor";
import { useMentor } from "@/context/MentorContext";
import { TaskStatusBadge, TaskPriorityBadge } from "./TaskStatusBadge";

interface StudentWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onAssignTask?: () => void;
}

export default function StudentWorkModal({
  isOpen,
  onClose,
  student,
  onAssignTask,
}: StudentWorkModalProps) {
  const { tasks } = useMentor();

  if (!isOpen) return null;

  const studentTasks = tasks.filter((t) => t.assignedStudentId === student.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-sm font-bold text-white shadow-sm">
              {student.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{student.name}</h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    student.status === "On Track"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : student.status === "Overloaded"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {student.department} • {student.year} • {student.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
            <p className="text-xl font-bold text-slate-800">{student.workload}%</p>
            <p className="text-[11px] text-slate-500">Workload Capacity</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
            <p className="text-xl font-bold text-emerald-600">{student.completedTasks}</p>
            <p className="text-[11px] text-slate-500">Completed Tasks</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
            <p className="text-xl font-bold text-amber-600">{student.pendingTasks}</p>
            <p className="text-[11px] text-slate-500">Pending Tasks</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
            <p className="text-xs font-bold text-slate-700 truncate">{student.availability}</p>
            <p className="text-[11px] text-slate-500">Availability</p>
          </div>
        </div>

        {/* Skills & Expertise */}
        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Technical Expertise & Skills
          </p>
          <p className="text-xs font-semibold text-slate-800 mb-2">{student.expertise}</p>
          <div className="flex flex-wrap gap-1.5">
            {student.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Tasks Assigned to Student */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Assigned Work Packages ({studentTasks.length})
            </h3>
            {onAssignTask && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAssignTask();
                }}
                className="flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
              >
                <Plus size={13} />
                Assign Task
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {studentTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                No active tasks assigned to this student yet.
              </div>
            ) : (
              studentTasks.map((task: Task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 transition hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                      <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
                        {task.description}
                      </p>
                    </div>
                    <TaskStatusBadge status={task.status} />
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                    <span>Due: {task.deadline}</span>
                    <TaskPriorityBadge priority={task.priority} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-end border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

