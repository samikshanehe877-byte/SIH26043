"use client";

import { useIndustry } from "@/context/IndustryContext";
import { Building2, MapPin, Users, Award } from "lucide-react";

export default function IndustryUniversitiesPage() {
  const { collaborations } = useIndustry();

  // Deduplicate universities
  const uniqueUniversities = Array.from(new Set(collaborations.map(c => c.university.id)))
    .map(id => collaborations.find(c => c.university.id === id)?.university);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Universities & Teams</h1>
        <p className="mt-1 text-slate-500">View high-level information of academic partners and student teams.</p>
      </div>

      <div className="space-y-8">
        {uniqueUniversities.map(uni => {
          if (!uni) return null;
          const uniCollabs = collaborations.filter(c => c.university.id === uni.id);
          
          return (
            <div key={uni.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{uni.name}</h2>
                    <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {uni.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">{uniCollabs.length}</span>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Collaborations</p>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Collaborating Teams</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uniCollabs.map(collab => (
                    <div key={collab.id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:border-blue-200 transition">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <Users size={16} className="text-blue-600" /> {collab.studentTeam.name}
                        </h4>
                        <span className="inline-flex rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          {collab.collaborationStatus}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 truncate" title={collab.challengeTitle}>
                        Project: {collab.challengeTitle}
                      </p>
                      
                      <div className="flex flex-col gap-2 pt-3 border-t border-slate-50">
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Award size={14} /> Mentor: {collab.mentor.name}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {collab.studentTeam.skills.slice(0, 3).map(skill => (
                            <span key={skill} className="inline-flex rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
