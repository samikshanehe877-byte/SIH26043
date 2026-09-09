"use client";

import { useState } from "react";
import { Bell, TrendingUp, FileText, Clock, CheckCircle2, Search } from "lucide-react";
import Link from "next/link";
import ProblemCard from "@/components/ProblemCard";
import ProblemDetails from "@/components/ProblemDetails";
import StatsCard from "@/components/StatsCard";
import { useProblems } from "@/context/ProblemsContext";
import { currentUser } from "@/data/problems";
import { Problem } from "@/types/problem";

const TRENDING = [
  { name: "Infrastructure",       count: 142, color: "bg-slate-100 text-slate-700"  },
  { name: "Environment",          count: 118, color: "bg-green-50 text-green-700"   },
  { name: "Public Safety",        count: 96,  color: "bg-orange-50 text-orange-700" },
  { name: "Water and Sanitation", count: 87,  color: "bg-blue-50 text-blue-700"     },
];

export default function HomePage() {
  const { problems, toggleSupport, toggleSave } = useProblems();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [search, setSearch] = useState("");

  const filtered = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ── Left / Main feed ── */}
        <div className="xl:col-span-2 space-y-5">
          {/* Welcome header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Welcome back,</p>
              <h1 className="text-2xl font-bold text-slate-900">
                {currentUser.name} 👋
              </h1>
            </div>
            <Link
              href="/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-blue-50 hover:text-blue-600"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </Link>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems around you..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Section heading */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              Discover Problems Around You
            </h2>
            <Link
              href="/explore"
              className="text-sm font-semibold text-blue-600 transition hover:underline"
            >
              View All →
            </Link>
          </div>

          {/* Feed */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm">
              <p className="text-slate-400">No problems found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onViewDetails={setSelectedProblem}
                  onToggleSupport={toggleSupport}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-5">
          {/* Stats */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Your Impact
            </h3>
            <div className="space-y-3">
              <StatsCard
                label="Problems Submitted"
                value={currentUser.totalSubmitted}
                icon={FileText}
                color="blue"
                sublabel="Total reported"
              />
              <StatsCard
                label="In Progress"
                value={currentUser.inProgress}
                icon={Clock}
                color="amber"
                sublabel="Being worked on"
              />
              <StatsCard
                label="Problems Solved"
                value={currentUser.completed}
                icon={CheckCircle2}
                color="green"
                sublabel="Successfully resolved"
              />
            </div>
          </div>

          {/* Trending categories */}
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

          {/* Recent activity */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-slate-800">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { dot: "bg-blue-500",  text: "Your problem was assigned to College of Engineering Pune",  time: "1 day ago"  },
                { dot: "bg-green-500", text: "Broken Footpath Tiles problem marked as Completed",          time: "2 days ago" },
                { dot: "bg-amber-500", text: "28 citizens supported your park dustbin problem",            time: "4 days ago" },
                { dot: "bg-purple-500",text: "Poor Lighting problem assigned to Symbiosis Institute",      time: "6 days ago" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${item.dot}`} />
                  <div>
                    <p className="text-xs text-slate-600 leading-snug">{item.text}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Post CTA */}
          <Link
            href="/post-problem"
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            + Post a New Problem
          </Link>
        </div>
      </div>

      {/* Problem details modal */}
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
    </>
  );
}
