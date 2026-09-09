"use client";

import { useState } from "react";
import { CheckCircle2, X, Building2, BookOpen, UserCheck } from "lucide-react";
import { universityDepartments, universityMentors } from "@/data/universityAppData";
import { universityChallenges } from "@/data/universityChallenges";
import { UniversityDepartment } from "@/types/universityChallenge";

const colorMap: Record<string, { bg: string; text: string; border: string; avatar: string }> = {
  blue:   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-100",   avatar: "bg-blue-600"   },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100", avatar: "bg-purple-600" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-100",  avatar: "bg-amber-600"  },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-100", avatar: "bg-orange-600" },
  teal:   { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-100",   avatar: "bg-teal-600"   },
  green:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-100",  avatar: "bg-green-600"  },
};

export default function DepartmentsPage() {
  const [selectedDept, setSelectedDept] = useState<UniversityDepartment | null>(null);

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
          <p className="mt-1 text-sm text-slate-500">
            High-level overview of all university departments and their challenge workload.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {universityDepartments.map((dept) => {
            const c = colorMap[dept.color] ?? colorMap.blue;
            return (
              <div
                key={dept.id}
                className={`rounded-2xl border ${c.border} bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${c.avatar} text-white text-xs font-bold shadow-sm`}
                  >
                    {dept.shortName}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{dept.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Head: {dept.head}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{dept.description}</p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { icon: BookOpen,     label: "Primary",    value: dept.primaryChallenges    },
                    { icon: BookOpen,     label: "Supporting", value: dept.supportingChallenges },
                    { icon: UserCheck,    label: "Available",  value: dept.availableMentors     },
                    { icon: CheckCircle2, label: "Completed",  value: dept.completedChallenges  },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className={`flex items-center gap-2 rounded-xl ${c.bg} px-3 py-2`}>
                      <Icon size={13} className={c.text} />
                      <div>
                        <p className={`text-sm font-bold ${c.text}`}>{value}</p>
                        <p className="text-xs text-slate-500">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedDept(dept)}
                  className={`w-full rounded-xl border ${c.border} ${c.bg} py-2 text-xs font-semibold ${c.text} hover:opacity-80 transition`}
                >
                  View Department Details
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department detail modal */}
      {selectedDept && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelectedDept(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <Building2 size={18} className="text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">{selectedDept.name}</h3>
              </div>
              <button
                onClick={() => setSelectedDept(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedDept.description}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Primary Challenges",   value: selectedDept.primaryChallenges,    color: "text-amber-600 bg-amber-50"   },
                  { label: "Supporting",           value: selectedDept.supportingChallenges, color: "text-blue-600 bg-blue-50"     },
                  { label: "Available Mentors",    value: selectedDept.availableMentors,     color: "text-green-600 bg-green-50"   },
                  { label: "Completed",            value: selectedDept.completedChallenges,  color: "text-indigo-600 bg-indigo-50" },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`rounded-xl p-3 text-center ${color}`}>
                    <p className="text-xl font-bold">{value}</p>
                    <p className="text-xs font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Areas of Expertise */}
              <div>
                <h4 className="mb-2 text-sm font-bold text-slate-700">Areas of Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDept.areasOfExpertise.map((area) => (
                    <span
                      key={area}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mentors */}
              <div>
                <h4 className="mb-3 text-sm font-bold text-slate-700">Mentors</h4>
                <div className="space-y-2">
                  {universityMentors
                    .filter((m) => m.departmentId === selectedDept.id)
                    .map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                          {m.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                          <p className="text-xs text-slate-500">
                            {m.designation} · {m.expertise.slice(0, 2).join(", ")}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              m.availability === "Available"
                                ? "bg-green-50 text-green-700"
                                : m.availability === "Limited Capacity"
                                ? "bg-amber-50 text-amber-700"
                                : m.availability === "Fully Assigned"
                                ? "bg-red-50 text-red-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {m.availability}
                          </span>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {m.challengesAssigned}/{m.maxCapacity} challenges
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Active Challenges */}
              <div>
                <h4 className="mb-3 text-sm font-bold text-slate-700">Active Challenges</h4>
                <div className="space-y-2">
                  {universityChallenges
                    .filter(
                      (c) =>
                        c.assignedDepartmentId === selectedDept.id &&
                        c.status !== "Completed" &&
                        c.status !== "Rejected"
                    )
                    .map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-2.5"
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-sm font-medium text-slate-800 truncate">{c.title}</p>
                          <p className="text-xs text-slate-500">
                            {c.assignedMentorName ?? "No mentor assigned"} · {c.status}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-sm font-bold text-indigo-600">{c.progress}%</p>
                        </div>
                      </div>
                    ))}
                  {universityChallenges.filter(
                    (c) =>
                      c.assignedDepartmentId === selectedDept.id &&
                      c.status !== "Completed" &&
                      c.status !== "Rejected"
                  ).length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">
                      No active challenges assigned.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
