"use client";

import { useState, useMemo } from "react";
import SearchFilters, { Filters } from "@/components/SearchFilters";
import ProblemCard from "@/components/ProblemCard";
import ProblemDetails from "@/components/ProblemDetails";
import { useProblems } from "@/context/ProblemsContext";
import { useLanguage } from "@/context/LanguageContext";
import { Problem } from "@/types/problem";

export default function ExplorePage() {
  const { publicProblems, toggleSupport, toggleSave } = useProblems();
  const { language: uiLanguage } = useLanguage();

  const hindi = uiLanguage === "Hindi";

  const tr = (english: string, hindiText: string) =>
    hindi ? hindiText : english;

  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    status: "",
    location: "",
    sortBy: "recent",
  });

  const filtered = useMemo(() => {
    let result = [...publicProblems];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.status) {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter((p) =>
        p.location.toLowerCase().includes(loc)
      );
    }

    result.sort((a, b) =>
      filters.sortBy === "supported"
        ? b.supporters - a.supporters
        : String(b.id).localeCompare(String(a.id))
    );

    return result;
  }, [publicProblems, filters]);

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {tr("Explore Problems", "समस्याएँ देखें")}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {tr(
              "Browse, search, and support real societal problems reported by citizens across India.",
              "भारत भर के नागरिकों द्वारा रिपोर्ट की गई वास्तविक सामाजिक समस्याओं को देखें, खोजें और उनका समर्थन करें।"
            )}
          </p>
        </div>

        <SearchFilters filters={filters} onChange={setFilters} />

        <p className="text-sm text-slate-500">
          {tr("Showing", "दिखाई जा रही हैं")}{" "}
          <span className="font-semibold text-slate-700">
            {filtered.length}
          </span>{" "}
          {filtered.length !== 1
            ? tr("problems", "समस्याएँ")
            : tr("problem", "समस्या")}
          {filters.search && (
            <>
              {" "}
              {tr("matching", "जिनमें")}{" "}
              &ldquo;
              <span className="font-medium text-blue-600">
                {filters.search}
              </span>
              &rdquo;
            </>
          )}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white py-20 text-center shadow-sm">
            <p className="mb-2 text-3xl">🔍</p>

            <p className="font-semibold text-slate-600">
              {tr("No problems found", "कोई समस्या नहीं मिली")}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {tr(
                "Try adjusting your filters or search terms.",
                "अपने फ़िल्टर या खोज शब्दों को बदलकर देखें।"
              )}
            </p>
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

      {selectedProblem && (
        <ProblemDetails
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onToggleSupport={(id) => {
            toggleSupport(id);

            setSelectedProblem((prev) =>
              prev?.id === id
                ? {
                    ...prev,
                    isSupported: !prev.isSupported,
                    supporters: prev.isSupported
                      ? prev.supporters - 1
                      : prev.supporters + 1,
                  }
                : prev
            );
          }}
        />
      )}
    </>
  );
}