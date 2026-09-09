"use client";

import { useState, useMemo } from "react";
import { Search, Filter, SlidersHorizontal, Plus, Award } from "lucide-react";
import MentorHeader from "@/components/mentor/MentorHeader";
import ChallengeCard from "@/components/mentor/ChallengeCard";
import CreateTeamModal from "@/components/mentor/CreateTeamModal";
import { useMentor } from "@/context/MentorContext";
import { MentorChallenge } from "@/types/mentor";

export default function MyChallengesPage() {
  const { challenges } = useMentor();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recently_assigned");

  const [selectedChallengeForTeam, setSelectedChallengeForTeam] = useState<MentorChallenge | null>(null);

  // Categories list
  const categories = useMemo(() => {
    return Array.from(new Set(challenges.map((c) => c.category)));
  }, [challenges]);

  // Filter & Sort
  const filteredChallenges = useMemo(() => {
    return challenges
      .filter((c) => {
        const matchesSearch =
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || c.status === statusFilter;

        const matchesCategory =
          categoryFilter === "all" || c.category === categoryFilter;

        const matchesPriority =
          priorityFilter === "all" || c.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === "highest_priority") {
          const priorityWeight: Record<string, number> = {
            Critical: 4,
            High: 3,
            Medium: 2,
            Low: 1,
          };
          return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        }
        if (sortBy === "progress") {
          return b.progress - a.progress;
        }
        // default recently assigned
        return 0;
      });
  }, [challenges, searchQuery, statusFilter, categoryFilter, priorityFilter, sortBy]);

  return (
    <div className="space-y-6">
      <MentorHeader
        title="My Assigned Challenges"
        subtitle="Manage societal problem statements allocated to you by Bharati Vidyapeeth University"
      />

      {/* Search & Filter Bar */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges by title, keyword, ID..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-slate-400 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="recently_assigned">Recently Assigned</option>
              <option value="highest_priority">Highest Priority</option>
              <option value="progress">Highest Progress</option>
            </select>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter size={12} />
            Filters:
          </span>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Team Creation Pending">Team Creation Pending</option>
            <option value="Team Active">Team Active</option>
            <option value="Industry Collaboration Active">Industry Collaboration Active</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {(statusFilter !== "all" ||
            categoryFilter !== "all" ||
            priorityFilter !== "all" ||
            searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter("all");
                setCategoryFilter("all");
                setPriorityFilter("all");
                setSearchQuery("");
              }}
              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Challenges Grid */}
      {filteredChallenges.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Award className="mx-auto mb-3 text-slate-300" size={36} />
          <h3 className="text-sm font-bold text-slate-700">No challenges matched your filters</h3>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search criteria or resetting filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onCreateTeam={(c) => setSelectedChallengeForTeam(c)}
            />
          ))}
        </div>
      )}

      {/* Team Creation Modal */}
      {selectedChallengeForTeam && (
        <CreateTeamModal
          isOpen={!!selectedChallengeForTeam}
          onClose={() => setSelectedChallengeForTeam(null)}
          challenge={selectedChallengeForTeam}
        />
      )}
    </div>
  );
}

