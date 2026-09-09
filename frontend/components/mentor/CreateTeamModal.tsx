"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  Users2,
  Check,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useMentor } from "@/context/MentorContext";
import { MentorChallenge, Student } from "@/types/mentor";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: MentorChallenge;
  onSuccess?: (teamId: string) => void;
}

export default function CreateTeamModal({
  isOpen,
  onClose,
  challenge,
  onSuccess,
}: CreateTeamModalProps) {
  const { students, createTeam, getTeamForChallenge } = useMentor();

  const [teamName, setTeamName] = useState(`Team Phoenix`);
  const [description, setDescription] = useState(
    `Dedicated interdisciplinary squad delivering prototype and field validation for ${challenge?.title || "challenge"}.`
  );
  const [objective, setObjective] = useState(
    `Develop an end-to-end working MVP and validate results with regional stakeholders.`
  );
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(["stu-1", "stu-2"]);
  const [leaderStudentId, setLeaderStudentId] = useState<string>("stu-1");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const existingTeam = getTeamForChallenge(challenge.id);

  const toggleStudent = (studentId: string) => {
    if (selectedStudentIds.includes(studentId)) {
      const updated = selectedStudentIds.filter((id) => id !== studentId);
      setSelectedStudentIds(updated);
      if (leaderStudentId === studentId && updated.length > 0) {
        setLeaderStudentId(updated[0]);
      }
    } else {
      if (selectedStudentIds.length >= 6) {
        alert("Maximum 6 students per team recommended.");
        return;
      }
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!teamName.trim()) {
      setError("Please enter a team name.");
      return;
    }
    if (selectedStudentIds.length === 0) {
      setError("Please select at least one student for the team.");
      return;
    }

    const res = createTeam({
      challengeId: challenge.id,
      name: teamName.trim(),
      description: description.trim(),
      objective: objective.trim(),
      studentIds: selectedStudentIds,
      leaderStudentId: leaderStudentId || selectedStudentIds[0],
    });

    if (!res.success) {
      setError(res.message);
      return;
    }

    if (onSuccess && res.team) {
      onSuccess(res.team.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Users2 size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create Student Team</h2>
              <p className="text-xs text-slate-500 line-clamp-1">
                For: <span className="font-semibold text-slate-700">{challenge.title}</span>
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

        {/* If team already exists, block duplicate creation */}
        {existingTeam ? (
          <div className="my-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-center">
            <AlertCircle className="mx-auto mb-2 text-amber-600" size={32} />
            <h3 className="text-base font-bold text-amber-900">Team Already Created</h3>
            <p className="mt-1 text-xs text-amber-700 max-w-md mx-auto">
              This challenge is already assigned to{" "}
              <span className="font-semibold">{existingTeam.name}</span>. Each challenge has
              strictly ONE team under the Lead Mentor.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <Link
                href={`/mentor/teams/${existingTeam.id}`}
                onClick={onClose}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                View Team ({existingTeam.name})
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="mt-5 space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Team details fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Team Phoenix"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Team Objective
                </label>
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="e.g. Develop AI detection MVP under 150MB"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Team Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the team mission..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Student Selection Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Select Students *
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Recommended: 3 to 6 students with complementary skills
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  Selected: {selectedStudentIds.length}/6
                </span>
              </div>

              {/* Students List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {students.map((student: Student) => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  const isLeader = leaderStudentId === student.id;

                  return (
                    <div
                      key={student.id}
                      onClick={() => toggleStudent(student.id)}
                      className={`cursor-pointer rounded-2xl border p-3 transition-all relative ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/50 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-xs font-bold text-white shadow-xs">
                            {student.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {student.name}
                              </p>
                              {isLeader && (
                                <span className="rounded bg-amber-100 px-1 py-0.2 text-[9px] font-bold text-amber-800">
                                  Lead
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {student.department} • {student.year}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border text-xs ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {student.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-white border border-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Workload Indicator */}
                      <div className="mt-2.5 flex items-center justify-between text-[10px] border-t border-slate-100 pt-1.5 text-slate-500">
                        <span>Workload: {student.workload}%</span>
                        <span
                          className={`font-semibold ${
                            student.workload > 80
                              ? "text-rose-600"
                              : student.workload > 50
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {student.availability}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedStudentIds.length === 0}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <Plus size={16} />
                Create Team
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

