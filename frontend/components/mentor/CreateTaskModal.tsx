"use client";

import { useState } from "react";
import { X, CheckSquare, Plus, AlertCircle } from "lucide-react";
import { useMentor } from "@/context/MentorContext";
import { TaskPriority } from "@/types/mentor";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTeamId?: string;
  defaultStudentId?: string;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  defaultTeamId,
  defaultStudentId,
}: CreateTaskModalProps) {
  const { teams, students, createTask } = useMentor();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamId, setTeamId] = useState(defaultTeamId || (teams[0] ? teams[0].id : ""));
  const [assignedStudentId, setAssignedStudentId] = useState(defaultStudentId || (students[0] ? students[0].id : ""));
  const [priority, setPriority] = useState<TaskPriority>("High");
  const [deadline, setDeadline] = useState("2025-02-28");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter students who are in the selected team
  const selectedTeam = teams.find((t) => t.id === teamId);
  const eligibleStudents = selectedTeam
    ? students.filter((s) => selectedTeam.studentIds.includes(s.id))
    : students;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }
    if (!teamId) {
      setError("Please select a team.");
      return;
    }
    if (!assignedStudentId) {
      setError("Please assign a student to this task.");
      return;
    }

    const res = createTask({
      title: title.trim(),
      description: description.trim(),
      teamId,
      assignedStudentId,
      priority,
      deadline,
      expectedOutput: expectedOutput.trim() || "Working code / deliverable and documentation.",
    });

    if (res.success) {
      setTitle("");
      setDescription("");
      setExpectedOutput("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckSquare size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create & Assign Task</h2>
              <p className="text-xs text-slate-500">
                Delegate work package to student with clear output targets
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Model Quantization for Mobile Inference"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide technical requirements, constraints, and instructions..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Select Team *
              </label>
              <select
                value={teamId}
                onChange={(e) => {
                  setTeamId(e.target.value);
                  const selectedT = teams.find((t) => t.id === e.target.value);
                  if (selectedT && selectedT.studentIds.length > 0) {
                    setAssignedStudentId(selectedT.studentIds[0]);
                  }
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.challengeTitle.slice(0, 20)}...)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Assign Student *
              </label>
              <select
                value={assignedStudentId}
                onChange={(e) => setAssignedStudentId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                {eligibleStudents.length > 0 ? (
                  eligibleStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.department}, {s.year})
                    </option>
                  ))
                ) : (
                  <option value="">No students in this team</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Expected Output
            </label>
            <input
              type="text"
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              placeholder="e.g. TFLite model file < 25MB and benchmark script"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus size={16} />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

