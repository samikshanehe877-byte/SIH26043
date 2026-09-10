"use client";

import { useState } from "react";
import { useIndustry } from "@/context/IndustryContext";
import { Search, Building2, Users, Handshake, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CollaborationStatus } from "@/types/industry";

export default function IndustryCollaborationsPage() {
  const { collaborations } = useIndustry();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = collaborations.filter(col => {
    const matchesSearch = col.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          col.university.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" ? true : col.collaborationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: CollaborationStatus) => {
    switch (status) {
      case "In Progress": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Support Delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Completed": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Active Collaborations</h1>
        <p className="mt-1 text-slate-500">Manage your ongoing support for student projects.</p>
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
          {["All", "In Progress", "Support Delivered", "Completed"].map(status => (
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

      {/* Collaborations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(col => (
          <div key={col.id} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border ${getStatusColor(col.collaborationStatus)}`}>
                {col.collaborationStatus}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                Updated {col.lastUpdate}
              </span>
            </div>
            
            <h2 className="text-lg font-bold text-slate-900 mb-2">{col.challengeTitle}</h2>
            <p className="text-sm text-slate-600 mb-6 line-clamp-2">{col.problemDescription}</p>
            
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Building2 size={16} className="text-slate-400" />
                <span className="font-semibold">{col.university.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users size={16} className="text-slate-400" />
                <span>{col.studentTeam.name} — Mentor: {col.mentor.name}</span>
              </div>
            </div>

            <div className="mt-auto border-t border-slate-100 pt-4">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-500 uppercase tracking-wider">Project Progress</span>
                <span className="text-emerald-600">{col.projectProgress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 mb-4">
                <div 
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${col.projectProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span className="font-bold text-slate-700">{col.industrySupport.filter(s => s.status === "Delivered" || s.status === "Completed").length}</span>
                  {" / "}
                  <span className="font-bold text-slate-700">{col.industrySupport.length}</span> support items delivered
                </div>
                <Link 
                  href={`/industry/collaborations/${col.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition"
                >
                  Manage <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
          <Handshake className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No active collaborations</h3>
          <p className="text-sm text-slate-500 mt-1">Accept requests to start collaborating.</p>
        </div>
      )}
    </div>
  );
}
