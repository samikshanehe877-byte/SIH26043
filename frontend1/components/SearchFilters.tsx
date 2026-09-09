"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProblemCategory, ProblemStatus } from "@/types/problem";

const CATEGORIES: ProblemCategory[] = [
  "Infrastructure", "Environment", "Education", "Healthcare",
  "Transportation", "Public Safety", "Technology", "Water and Sanitation", "Other",
];

const STATUSES: ProblemStatus[] = [
  "Submitted", "Under Review", "Assigned to University",
  "In Progress", "Collaboration with Industry", "Solution Implemented", "Completed",
];

export interface Filters {
  search: string;
  category: string;
  status: string;
  location: string;
  sortBy: "recent" | "supported";
}

interface SearchFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  const set = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  const hasActiveFilters =
    filters.category || filters.status || filters.location || filters.search;

  const clearAll = () =>
    onChange({ search: "", category: "", status: "", location: "", sortBy: "recent" });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search problems by title, description, or location..."
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
        {filters.search && (
          <button
            onClick={() => set("search", "")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <SlidersHorizontal size={13} />
          Filters:
        </div>

        <select
          value={filters.category}
          onChange={(e) => set("category", e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={filters.status}
          onChange={(e) => set("status", e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <input
          type="text"
          placeholder="Filter by location..."
          value={filters.location}
          onChange={(e) => set("location", e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />

        <select
          value={filters.sortBy}
          onChange={(e) => set("sortBy", e.target.value as "recent" | "supported")}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="recent">Most Recent</option>
          <option value="supported">Most Supported</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100"
          >
            <X size={12} /> Clear All
          </button>
        )}
      </div>
    </div>
  );
}
