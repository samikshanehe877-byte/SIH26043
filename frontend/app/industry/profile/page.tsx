"use client";

import { useIndustry } from "@/context/IndustryContext";
import { Building2, Globe, MapPin, Mail, Phone, Edit2 } from "lucide-react";

export default function IndustryProfilePage() {
  const { company } = useIndustry();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
          <p className="mt-1 text-slate-500">Manage your company details and public profile.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
          <Edit2 size={16} /> Edit Profile
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-800"></div>
        
        <div className="px-6 pb-8 relative">
          <div className="absolute -top-16 flex h-32 w-32 items-center justify-center rounded-2xl bg-white p-2 shadow-md">
            <img src={company.logo} alt={company.name} className="h-full w-full rounded-xl bg-slate-100" />
          </div>
          
          <div className="pt-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{company.name}</h2>
            <p className="text-blue-600 font-semibold mb-6 flex items-center gap-2">
              <Building2 size={18} /> {company.industryDomain}
            </p>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">About Company</h3>
              <p className="text-slate-700 leading-relaxed">{company.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Email Address</p>
                      <p className="font-medium text-slate-800">{company.contactEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Phone Number</p>
                      <p className="font-medium text-slate-800">{company.contactPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Location & Web</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Headquarters</p>
                      <p className="font-medium text-slate-800">{company.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Globe size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Website</p>
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                        {company.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
