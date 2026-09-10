"use client";

import { useState } from "react";
import { useIndustry } from "@/context/IndustryContext";
import { Search, Building2, Calendar, Award } from "lucide-react";

export default function IndustrySupportedChallengesPage() {
  const { supportedChallenges } = useIndustry();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = supportedChallenges.filter(ch => 
    ch.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ch.universityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Supported Challenges History</h1>
        <p className="mt-1 text-slate-500">Historical record of completed projects supported by your company.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
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
      </div>

      <div className="space-y-4">
        {filtered.map(ch => (
          <div key={ch.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                    <Calendar size={12} className="mr-1" /> {ch.year}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
                    {ch.finalStatus}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{ch.challengeTitle}</h2>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Completed</p>
                <p className="font-semibold text-slate-800">{ch.completionDate}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 border-t border-slate-100 pt-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Building2 size={16} className="text-slate-400" />
                  <span className="font-medium">{ch.universityName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Award size={16} className="text-slate-400" />
                  <span>Mentor: {ch.mentorName}</span>
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Support Provided</p>
                <div className="flex flex-wrap gap-1.5">
                  {ch.supportProvided.map(sup => (
                    <span key={sup} className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {sup}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1 rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Impact Result</p>
                <p className="text-sm font-medium text-slate-800">{ch.impactResult}</p>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No supported challenges found.</div>
        )}
      </div>
    </div>
  );
}
