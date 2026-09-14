"use client";

import { useState } from "react";
import { Bell, TrendingUp, FileText, Clock, CheckCircle2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProblems } from "@/context/ProblemsContext";
import ProblemCard from "@/components/ProblemCard";
import ProblemDetails from "@/components/ProblemDetails";
import StatsCard from "@/components/StatsCard";
import { Problem } from "@/types/problem";

const TRENDING = [
  { name: "Infrastructure", count: 142, color: "bg-slate-100 text-slate-700" },
  { name: "Environment", count: 118, color: "bg-green-50 text-green-700" },
  { name: "Public Safety", count: 96, color: "bg-orange-50 text-orange-700" },
  { name: "Water and Sanitation", count: 87, color: "bg-blue-50 text-blue-700" },
];

export default function CitizenDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { publicProblems, myProblems, toggleSupport, toggleSave, isLoading: problemsLoading } = useProblems();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [search, setSearch] = useState("");

  if (authLoading || problemsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push("/signin?callbackUrl=/");
    return null;
  }

  const filtered = publicProblems.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  const myProblemsCount = myProblems.length;
  const inProgressCount = myProblems.filter((p) =>
    ["Under Review", "Assigned to University", "In Progress", "Collaboration with Industry"].includes(p.status)
  ).length;
  const completedCount = myProblems.filter((p) => p.status === "Completed").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Welcome back,</p>
          <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
        </div>
        <Link
          href="/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-blue-50 hover:text-blue-600"
          aria-label="Open notifications"
        >
          <Bell size={18} />
        </Link>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search problems around you..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-slate-800">Discover Problems Around You</h2>
        <Link href="/explore" className="text-sm font-semibold text-blue-600 transition hover:underline">
          View All
        </Link>
      </div>

      <div className="mb-8 space-y-4">
        {filtered.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm">
                <p className="text-slate-400">No problems found matching your search.</p>
              </div>
            ) : (
              filtered.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onViewDetails={setSelectedProblem}
                  onToggleSupport={toggleSupport}
                  onToggleSave={toggleSave}
                />
              ))
            )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-1">
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Your Impact</h3>
            <div className="space-y-3">
                  <StatsCard
                    label="Problems Submitted"
                    value={myProblemsCount}
                    icon={FileText}
                    color="blue"
                    sublabel="Total reported"
                  />
                  <StatsCard
                    label="In Progress"
                    value={inProgressCount}
                    icon={Clock}
                    color="amber"
                    sublabel="Being worked on"
                  />
                  <StatsCard
                    label="Problems Solved"
                    value={completedCount}
                    icon={CheckCircle2}
                    color="green"
                    sublabel="Successfully resolved"
                  />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-800">Trending Categories</h3>
                </div>
                <div className="space-y-2.5">
                  {TRENDING.map((cat, i) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 text-xs font-bold text-slate-400">#{i + 1}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cat.color}`}>
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{cat.count} posts</span>
                    </div>
                  ))}
                </div>
          </div>
        </div>
      </div>

      {selectedProblem && (
        <ProblemDetails
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onToggleSupport={(id) => {
            toggleSupport(id);
            setSelectedProblem((prev) =>
              prev?.id === id
                ? { ...prev, isSupported: !prev.isSupported, supporters: prev.isSupported ? prev.supporters - 1 : prev.supporters + 1 }
                : prev
            );
          }}
        />
      )}
    </div>
  );
}