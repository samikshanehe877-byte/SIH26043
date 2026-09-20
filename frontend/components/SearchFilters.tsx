"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProblemCategory, ProblemStatus } from "@/types/problem";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORIES: ProblemCategory[] = [
  "Infrastructure",
  "Environment",
  "Education",
  "Healthcare",
  "Transportation",
  "Public Safety",
  "Technology",
  "Water and Sanitation",
  "Other",
];

const STATUSES: ProblemStatus[] = [
  "Submitted",
  "Under Review",
  "Assigned to University",
  "In Progress",
  "Collaboration with Industry",
  "Solution Implemented",
  "Completed",
];

const CATEGORY_HINDI: Record<string, string> = {
  Infrastructure: "बुनियादी ढाँचा",
  Environment: "पर्यावरण",
  Education: "शिक्षा",
  Healthcare: "स्वास्थ्य सेवा",
  Transportation: "परिवहन",
  "Public Safety": "सार्वजनिक सुरक्षा",
  Technology: "प्रौद्योगिकी",
  "Water and Sanitation": "जल और स्वच्छता",
  Other: "अन्य",
};

const STATUS_HINDI: Record<string, string> = {
  Submitted: "प्रस्तुत",
  "Under Review": "समीक्षाधीन",
  "Assigned to University": "विश्वविद्यालय को सौंपा गया",
  "In Progress": "प्रगति पर",
  "Collaboration with Industry": "उद्योग के साथ सहयोग",
  "Solution Implemented": "समाधान लागू किया गया",
  Completed: "पूर्ण",
};

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

export default function SearchFilters({
  filters,
  onChange,
}: SearchFiltersProps) {
  const { language } = useLanguage();
  const hindi = language === "Hindi";

  const tr = (english: string, hindiText: string) =>
    hindi ? hindiText : english;

  const set = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  const hasActiveFilters =
    filters.category || filters.status || filters.location || filters.search;

  const clearAll = () =>
    onChange({
      search: "",
      category: "",
      status: "",
      location: "",
      sortBy: "recent",
    });

  return (
    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder={tr(
            "Search problems by title, description, or location...",
            "शीर्षक, विवरण या स्थान के आधार पर समस्याएँ खोजें..."
          )}
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />

        {filters.search && (
          <button
            onClick={() => set("search", "")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label={tr("Clear search", "खोज साफ़ करें")}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <SlidersHorizontal size={13} />
          {tr("Filters:", "फ़िल्टर:")}
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => set("category", e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            {tr("All Categories", "सभी श्रेणियाँ")}
          </option>

          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {hindi ? CATEGORY_HINDI[c] : c}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => set("status", e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            {tr("All Statuses", "सभी स्थितियाँ")}
          </option>

          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {hindi ? STATUS_HINDI[s] : s}
            </option>
          ))}
        </select>

        {/* Location */}
        <input
          type="text"
          placeholder={tr(
            "Filter by location...",
            "स्थान के अनुसार फ़िल्टर करें..."
          )}
          value={filters.location}
          onChange={(e) => set("location", e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />

        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) =>
            set("sortBy", e.target.value as "recent" | "supported")
          }
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="recent">
            {tr("Most Recent", "सबसे हाल की")}
          </option>

          <option value="supported">
            {tr("Most Supported", "सबसे अधिक समर्थित")}
          </option>
        </select>

        {/* Clear All */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100"
          >
            <X size={12} />
            {tr("Clear All", "सभी साफ़ करें")}
          </button>
        )}
      </div>
    </div>
  );
}