"use client";

import { useState, useMemo } from "react";
import SearchFilters, { Filters } from "@/components/SearchFilters";
import ProblemCard from "@/components/ProblemCard";
import ProblemDetails from "@/components/ProblemDetails";
import { useProblems } from "@/context/ProblemsContext";
import { Problem } from "@/types/problem";

export default function ExplorePage() {
  const { problems, toggleSupport, toggleSave } = useProblems();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "", category: "", status: "", location: "", sortBy: "recent",
  });

  const filtered = useMemo(() => {
    let result = [...problems];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }
    if (filters.category) result = result.filter((p) => p.category === filters.category);
    if (filters.status)   result = result.filter((p) => p.status   === filters.status);
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter((p) => p.location.toLowerCase().includes(loc));
    }
    result.sort((a, b) =>
      filters.sortBy === "supported" ? b.supporters - a.supporters : b.id - a.id
    );
    return result;
  }, [problems, filters]);

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Explore Problems</h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse, search, and support real societal problems reported by citizens across India.
          </p>
        </div>

        <SearchFilters filters={filters} onChange={setFilters} />

        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span>{" "}
          problem{filtered.length !== 1 ? "s" : ""}
          {filters.search && (
            <> matching &ldquo;<span className="font-medium text-blue-600">{filters.search}</span>&rdquo;</>
          )}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white py-20 text-center shadow-sm">
            <p className="mb-2 text-3xl">🔍</p>
            <p className="font-semibold text-slate-600">No problems found</p>
            <p className="mt-1 text-sm text-slate-400">Try adjusting your filters or search terms.</p>
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
                    supporters: prev.isSupported ? prev.supporters - 1 : prev.supporters + 1,
                  }
                : prev
            );
          }}
        />
      )}
    </>
  );
}
