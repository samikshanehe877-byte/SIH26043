"use client";

import { useState } from "react";
import { useIndustry } from "@/context/IndustryContext";
import { Search, Filter, SlidersHorizontal, ArrowRight, Building2, Users, Inbox } from "lucide-react";
import Link from "next/link";
import { CollaborationRequestStatus } from "@/types/industry";

export default function IndustryRequestsPage() {
  const { requests } = useIndustry();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.university.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" ? true : req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: CollaborationRequestStatus) => {
    switch (status) {
      case "Received": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Under Review": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Clarification Needed": return "bg-red-50 text-red-700 border-red-200";
      case "Approved": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Collaboration Requests</h1>
          <p className="mt-1 text-slate-500">Review and manage support requests from universities.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by challenge or university..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Received", "Under Review", "Clarification Needed", "Approved"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition ${
                statusFilter === status 
                  ? "bg-slate-800 text-white" 
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Request List */}
      <div className="space-y-4">
        {filteredRequests.map(req => (
          <Link href={`/industry/requests/${req.id}`} key={req.id} className="block">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:border-blue-200 hover:shadow-md transition">
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Left Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Requested: {req.requestDate}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2 truncate">{req.challengeTitle}</h2>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{req.problemDescription}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Building2 size={16} className="text-slate-400" />
                      <span className="font-semibold text-slate-800">{req.university.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Users size={16} className="text-slate-400" />
                      <span className="font-medium">{req.studentTeam.name} ({req.studentTeam.size} members)</span>
                    </div>
                  </div>
                </div>

                {/* Right Content */}
                <div className="lg:w-72 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Requested Support</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {req.requestedSupportTypes.map(type => (
                        <span key={type} className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700 border border-blue-100">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AI Match</p>
                      <p className="text-sm font-bold text-emerald-600">{req.aiAnalysis.matchScore}% Score</p>
                    </div>
                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </Link>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
            <Inbox className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No requests found</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
