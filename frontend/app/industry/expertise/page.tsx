"use client";

import { useIndustry } from "@/context/IndustryContext";
import { Code, Globe, Database, Sparkles, Check, Edit2 } from "lucide-react";

export default function IndustryExpertisePage() {
  const { company } = useIndustry();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expertise & Resources</h1>
          <p className="mt-1 text-slate-500">Manage your company's capabilities for AI matching.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
          <Edit2 size={16} /> Edit Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technology Expertise */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-2">
            <Code size={18} className="text-blue-600" />
            <h2 className="font-bold text-slate-900">Technology Expertise</h2>
          </div>
          <div className="p-6 flex-1">
            <p className="text-sm text-slate-500 mb-4">
              Core technical skills your company can provide support for. Used by our AI engine to route relevant challenges to you.
            </p>
            <div className="flex flex-wrap gap-2">
              {company.expertise.technologies.map(tech => (
                <span key={tech} className="inline-flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                  <Check size={14} className="text-blue-500" /> {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Domains */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-2">
            <Globe size={18} className="text-emerald-600" />
            <h2 className="font-bold text-slate-900">Industry Domains</h2>
          </div>
          <div className="p-6 flex-1">
            <p className="text-sm text-slate-500 mb-4">
              Business sectors and domains where you have significant experience and can guide students.
            </p>
            <div className="flex flex-wrap gap-2">
              {company.expertise.domains.map(domain => (
                <span key={domain} className="inline-flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                  <Check size={14} className="text-emerald-500" /> {domain}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Available Resources */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-2">
          <Database size={18} className="text-purple-600" />
          <h2 className="font-bold text-slate-900">Available Resources</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-6">
            Tangible resources, tools, and assets you are willing to provide to collaborating university teams.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {company.resources.map(res => (
              <div key={res.type} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full ${res.available ? 'bg-purple-500' : 'bg-slate-300'}`} />
                <div className="pl-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900">{res.type}</h3>
                    {res.available && <Sparkles size={14} className="text-amber-500" />}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{res.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
