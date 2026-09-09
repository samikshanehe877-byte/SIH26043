"use client";

import { useState, useMemo } from "react";
import { Search, Mail, Phone, X } from "lucide-react";
import { universityMentors, universityDepartments } from "@/data/universityAppData";
import { universityChallenges } from "@/data/universityChallenges";
import { UniversityMentor, MentorAvailability } from "@/types/universityChallenge";

const availabilityStyle: Record<MentorAvailability, string> = {
  Available:          "bg-green-50 text-green-700 border border-green-200",
  "Limited Capacity": "bg-amber-50 text-amber-700 border border-amber-200",
  "Fully Assigned":   "bg-red-50 text-red-700 border border-red-200",
  Unavailable:        "bg-slate-100 text-slate-500",
};

export default function MentorsPage() {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterAvail, setFilterAvail] = useState("");
  const [selected, setSelected] = useState<UniversityMentor | null>(null);

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
    return r;
  }, [search, filterDept, filterAvail]);

  // Availability summary
  const availSummary = {
    Available:          universityMentors.filter((m) => m.availability === "Available").length,
    "Limited Capacity": universityMentors.filter((m) => m.availability === "Limited Capacity").length,
    "Fully Assigned":   universityMentors.filter((m) => m.availability === "Fully Assigned").length,
    Unavailable:        universityMentors.filter((m) => m.availability === "Unavailable").length,
  };

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mentors</h1>
          <p className="mt-1 text-sm text-slate-500">
            Faculty mentors available for challenge assignments. Assign lead mentors to accepted challenges.
          </p>
        </div>

        {/* Availability summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(Object.entries(availSummary) as [MentorAvailability, number][]).map(([status, count]) => (
            <div
              key={status}
              className={`rounded-2xl p-4 text-center cursor-pointer transition hover:opacity-80 ${availabilityStyle[status]}`}
              onClick={() => setFilterAvail(filterAvail === status ? "" : status)}
            >
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs font-medium mt-0.5">{status}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
          <div className="relative">
            <Search
              size={15}
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
              {universityDepartments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
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
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{filtered.length}</span> mentor
          {filtered.length !== 1 ? "s" : ""} found
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((mentor) => (
            <div
              key={mentor.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-sm font-bold text-white shadow-sm">
                  {mentor.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900">{mentor.name}</h3>
                  <p className="text-xs text-slate-500">{mentor.designation}</p>
                  <p className="text-xs text-indigo-600 font-medium">{mentor.departmentName}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${availabilityStyle[mentor.availability]}`}
                >
                  {mentor.availability}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {mentor.expertise.map((e) => (
                  <span
                    key={e}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                  >
                    {e}
                  </span>
                ))}
              </div>

              {/* Capacity bar */}
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Capacity</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {mentor.challengesAssigned}/{mentor.maxCapacity} challenges
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      mentor.challengesAssigned >= mentor.maxCapacity
                        ? "bg-red-500"
                        : mentor.challengesAssigned >= mentor.maxCapacity - 1
                        ? "bg-amber-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${(mentor.challengesAssigned / mentor.maxCapacity) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                {[
                  { label: "Assigned",  value: mentor.challengesAssigned },
                  { label: "Completed", value: mentor.completedProjects  },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-slate-50 py-2">
                    <p className="text-sm font-bold text-slate-800">{value}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelected(mentor)}
                className="w-full rounded-xl border border-indigo-200 bg-indigo-50 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">Mentor Profile</h3>
              <button
                onClick={() => setSelected(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-xl font-bold text-white shadow-md">
                  {selected.avatar}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{selected.name}</h4>
                  <p className="text-sm text-slate-500">{selected.designation}</p>
                  <p className="text-sm font-medium text-indigo-600">{selected.departmentName}</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{selected.bio}</p>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  {selected.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  {selected.phone}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Expertise
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.expertise.map((e) => (
                    <span
                      key={e}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Assigned",  value: selected.challengesAssigned },
                  { label: "Capacity",  value: selected.maxCapacity        },
                  { label: "Completed", value: selected.completedProjects  },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-slate-50 py-3">
                    <p className="text-xl font-bold text-slate-800">{value}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">Availability</span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${availabilityStyle[selected.availability]}`}
                >
                  {selected.availability}
                </span>
              </div>

              {/* Assigned challenges */}
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Assigned Challenges
                </p>
                <div className="space-y-2">
                  {universityChallenges
                    .filter((c) => c.assignedMentorId === selected.id && c.status !== "Completed")
                    .map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2.5"
                      >
                        <div className="flex-1 min-w-0 mr-2">
                          <p className="text-xs font-semibold text-slate-800 truncate">{c.title}</p>
                          <p className="text-xs text-slate-500">{c.category} · {c.status}</p>
                        </div>
                        <span className="text-xs font-bold text-indigo-600 flex-shrink-0">
                          {c.progress}%
                        </span>
                      </div>
                    ))}
                  {universityChallenges.filter(
                    (c) => c.assignedMentorId === selected.id && c.status !== "Completed"
                  ).length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-2">
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
