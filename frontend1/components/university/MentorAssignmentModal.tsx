"use client";

import { useState, useMemo } from "react";
import { X, Search, UserPlus, CheckCircle2, Users } from "lucide-react";
import { UniversityChallenge, UniversityMentor, MentorAvailability } from "@/types/universityChallenge";
import { universityMentors } from "@/data/universityAppData";

interface MentorAssignmentModalProps {
  challenge: UniversityChallenge;
  onClose: () => void;
  onAssign: (challengeId: number, mentorId: number, mentorName: string) => void;
}

const availabilityStyle: Record<MentorAvailability, string> = {
  Available:         "bg-green-50 text-green-700 border border-green-200",
  "Limited Capacity":"bg-amber-50 text-amber-700 border border-amber-200",
  "Fully Assigned":  "bg-red-50 text-red-700 border border-red-200",
  Unavailable:       "bg-slate-100 text-slate-500",
};

export default function MentorAssignmentModal({
  challenge,
  onClose,
  onAssign,
}: MentorAssignmentModalProps) {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterAvail, setFilterAvail] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<UniversityMentor | null>(null);
  const [success, setSuccess] = useState(false);

  const primaryDeptId = challenge.aiDepartmentAssignment?.primaryDepartment?.id;

  const filtered = useMemo(() => {
    let r = [...universityMentors];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.expertise.some((e) => e.toLowerCase().includes(q))
      );
    }
    if (filterDept)  r = r.filter((m) => m.departmentName === filterDept);
    if (filterAvail) r = r.filter((m) => m.availability === filterAvail);

    // Sort: primary dept first, then by availability
    const order: MentorAvailability[] = ["Available", "Limited Capacity", "Fully Assigned", "Unavailable"];
    r.sort((a, b) => {
      const aPrimary = a.departmentId === primaryDeptId ? 0 : 1;
      const bPrimary = b.departmentId === primaryDeptId ? 0 : 1;
      if (aPrimary !== bPrimary) return aPrimary - bPrimary;
      return order.indexOf(a.availability) - order.indexOf(b.availability);
    });
    return r;
  }, [search, filterDept, filterAvail, primaryDeptId]);

  const uniqueDepts = Array.from(new Set(universityMentors.map((m) => m.departmentName)));

  const handleAssign = () => {
    if (!selectedMentor) return;
    onAssign(challenge.id, selectedMentor.id, selectedMentor.name);
    setSuccess(true);
  };

  if (success && selectedMentor) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Mentor Assigned Successfully!</h3>
          <p className="mt-2 text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{selectedMentor.name}</span> has been
            assigned as Lead Mentor for this challenge.
          </p>
          <div className="mt-3 rounded-xl bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
            The mentor will now form a student team and begin work.
          </div>
          <button
            onClick={onClose}
            className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">Assign Lead Mentor</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-4">
            {/* Challenge info */}
            <div className="rounded-xl bg-indigo-50 px-4 py-3">
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
                Challenge
              </p>
              <p className="mt-0.5 text-sm font-semibold text-indigo-800">{challenge.title}</p>
              {challenge.assignedDepartmentName && (
                <p className="mt-0.5 text-xs text-indigo-600">
                  Primary Department: {challenge.assignedDepartmentName}
                </p>
              )}
            </div>

            {primaryDeptId && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
                <span className="font-semibold">Tip:</span> Mentors from the primary department (
                {challenge.aiDepartmentAssignment?.primaryDepartment?.name}) are shown first.
              </div>
            )}

            {/* Filters */}
            <div className="space-y-2">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by name or expertise..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-indigo-400 transition"
                >
                  <option value="">All Departments</option>
                  {uniqueDepts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={filterAvail}
                  onChange={(e) => setFilterAvail(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-indigo-400 transition"
                >
                  <option value="">All Availability</option>
                  <option value="Available">Available</option>
                  <option value="Limited Capacity">Limited Capacity</option>
                  <option value="Fully Assigned">Fully Assigned</option>
                </select>
              </div>
            </div>

            {/* Mentor list */}
            <div className="space-y-2">
              {filtered.map((mentor) => {
                const isPrimary = mentor.departmentId === primaryDeptId;
                const isSelected = selectedMentor?.id === mentor.id;
                const isDisabled =
                  mentor.availability === "Fully Assigned" ||
                  mentor.availability === "Unavailable";

                return (
                  <button
                    key={mentor.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setSelectedMentor(mentor)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200"
                        : isDisabled
                        ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                        : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-sm font-bold text-white shadow-sm">
                        {mentor.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">{mentor.name}</p>
                          {isPrimary && (
                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                              Primary Dept
                            </span>
                          )}
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${availabilityStyle[mentor.availability]}`}
                          >
                            {mentor.availability}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {mentor.designation} · {mentor.departmentName}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {mentor.expertise.map((e) => (
                            <span
                              key={e}
                              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                            >
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Users size={11} />
                          <span>
                            {mentor.challengesAssigned}/{mentor.maxCapacity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">capacity</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-slate-100 px-6 py-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedMentor}
            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-40"
          >
            Assign Mentor
          </button>
        </div>
      </div>
    </div>
  );
}
