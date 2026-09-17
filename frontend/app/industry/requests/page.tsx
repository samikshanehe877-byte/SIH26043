"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import CollaborationRequestList from "@/components/workspace/CollaborationRequestList";
import { useIndustry } from "@/context/IndustryContext";
import { apiJson, CollaborationRequestRecord, useParty } from "@/lib/projects";

const STATUS_FILTERS: { label: string; value: CollaborationRequestRecord["status"] | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Awaiting response", value: "pending" },
  { label: "Clarification needed", value: "clarification_needed" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Withdrawn", value: "withdrawn" },
];

/** Collaboration invitations from universities leading a project. Accepting adds this company to that workspace. */
export default function IndustryRequestsPage() {
  const { partyName } = useParty("industry");
  const { refreshRequests } = useIndustry();
  const [requests, setRequests] = useState<CollaborationRequestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]["value"]>("all");

  const load = useCallback(async () => {
    if (!partyName) return;
    try {
      const records = await apiJson<CollaborationRequestRecord[]>(
        `/collaboration-requests?industry_name=${encodeURIComponent(partyName)}&limit=500`,
      );
      setRequests(records.filter((r) => r.requested_by === "university"));
    } catch (error) {
      console.error("Failed to load collaboration requests:", error);
    } finally {
      setIsLoading(false);
    }
  }, [partyName]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const handleChanged = () => {
    void load();
    refreshRequests();
  };

  const term = searchTerm.toLowerCase();
  const filtered = requests.filter((r) =>
    (statusFilter === "all" || r.status === statusFilter) &&
    (r.challenge_title.toLowerCase().includes(term) || r.university_name.toLowerCase().includes(term)),
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Collaboration Requests</h1>
        <p className="mt-1 text-slate-500">
          Universities leading a project invite you to join. Review the problem and their progress, then accept or reject.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by problem or university..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${
                statusFilter === value
                  ? "bg-slate-800 text-white"
                  : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <CollaborationRequestList
          requests={filtered}
          viewerType="industry"
          viewerName={partyName}
          onChanged={handleChanged}
          workspaceBasePath="/industry"
          emptyText="No collaboration requests match."
        />
      )}
    </div>
  );
}
