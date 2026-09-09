"use client";

import { useState, useMemo } from "react";
import {
  Handshake,
  Plus,
  Filter,
  Search,
  Building2,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
} from "lucide-react";
import MentorHeader from "@/components/mentor/MentorHeader";
import MentorStatsCard from "@/components/mentor/MentorStatsCard";
import CollaborationCard from "@/components/mentor/CollaborationCard";
import IndustryRequestModal from "@/components/mentor/IndustryRequestModal";
import CollaborationDetailModal from "@/components/mentor/CollaborationDetailModal";
import { useMentor } from "@/context/MentorContext";
import { IndustryCollaborationRequest, CollaborationStatus } from "@/types/mentor";

export default function IndustryCollaborationPage() {
  const { industryRequests } = useMentor();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRequestForDetail, setSelectedRequestForDetail] = useState<IndustryCollaborationRequest | null>(null);

  // Stats
  const activeRequestsCount = industryRequests.filter(
    (r) => r.status === "In Progress" || r.status === "Accepted"
  ).length;
  const pendingRequestsCount = industryRequests.filter(
    (r) => r.status === "Sent" || r.status === "Under Review"
  ).length;
  const approvedRequestsCount = industryRequests.filter(
    (r) => r.status === "Accepted"
  ).length;
  const completedCount = industryRequests.filter(
    (r) => r.status === "Completed"
  ).length;

  const filteredRequests = useMemo(() => {
    return industryRequests.filter((r) => {
      const matchesSearch =
        r.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.requestTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.challengeTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || r.status === selectedStatus;

      const matchesType =
        selectedType === "all" || r.helpType === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [industryRequests, searchQuery, selectedStatus, selectedType]);

  return (
    <div className="space-y-6">
      <MentorHeader
        title="Industry Collaboration Portal"
        subtitle="Bridge academia and industry by procuring funding, compute, sensors, APIs, and expert mentorship"
      >
        <button
          type="button"
          onClick={() => setIsRequestModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition"
        >
          <Plus size={15} />
          Request Industry Help
        </button>
      </MentorHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <MentorStatsCard
          label="Active Collaborations"
          value={activeRequestsCount}
          icon={Handshake}
          color="indigo"
          sublabel="Currently in delivery"
        />
        <MentorStatsCard
          label="Pending Responses"
          value={pendingRequestsCount}
          icon={Clock}
          color="amber"
          sublabel="Under partner evaluation"
        />
        <MentorStatsCard
          label="Approved Grants/APIs"
          value={approvedRequestsCount}
          icon={CheckCircle2}
          color="emerald"
          sublabel="Signed & provisioned"
        />
        <MentorStatsCard
          label="Completed Support"
          value={completedCount}
          icon={Building2}
          color="teal"
          sublabel="Milestones achieved"
        />
      </div>

      {/* Search & Filter Tabs */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, title, or challenge..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Support Types</option>
              <option value="Funding">Funding</option>
              <option value="Technical Expertise">Technical Expertise</option>
              <option value="API">API</option>
              <option value="Software Tool">Software Tool</option>
              <option value="Cloud Resources">Cloud Resources</option>
              <option value="Hardware">Hardware</option>
              <option value="Dataset">Dataset</option>
              <option value="Domain Expert">Domain Expert</option>
              <option value="Mentorship">Mentorship</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          {[
            { label: "All Requests", value: "all" },
            { label: "Sent / In Review", value: "Under Review" },
            { label: "Accepted", value: "Accepted" },
            { label: "In Progress", value: "In Progress" },
            { label: "Completed", value: "Completed" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedStatus(tab.value)}
              className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${
                selectedStatus === tab.value
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}

          {(selectedStatus !== "all" || selectedType !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedStatus("all");
                setSelectedType("all");
                setSearchQuery("");
              }}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Collaboration Cards */}
      {filteredRequests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Handshake size={36} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">No collaboration requests found</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            Click &quot;Request Industry Help&quot; to initiate a partnership request for funding, compute, or hardware.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map((req) => (
            <CollaborationCard
              key={req.id}
              request={req}
              onViewDetails={(r) => setSelectedRequestForDetail(r)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {isRequestModalOpen && (
        <IndustryRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
        />
      )}

      {selectedRequestForDetail && (
        <CollaborationDetailModal
          isOpen={!!selectedRequestForDetail}
          onClose={() => setSelectedRequestForDetail(null)}
          request={selectedRequestForDetail}
        />
      )}
    </div>
  );
}

