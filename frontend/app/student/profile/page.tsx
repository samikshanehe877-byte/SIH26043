"use client";

import { useStudent } from "@/context/StudentContext";
import { UserCircle2, Mail, Building2, Calendar, Star, Hash } from "lucide-react";

export default function StudentProfilePage() {
  const { profile } = useStudent();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-1 text-slate-500">Manage your personal information and skills.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        <div className="px-6 pb-6 relative">
          <div className="absolute -top-12 flex h-24 w-24 items-center justify-center rounded-2xl bg-white p-1 shadow-md">
            <img src={profile.avatar} alt={profile.name} className="h-full w-full rounded-xl bg-slate-100" />
          </div>
          
          <div className="flex justify-end pt-4 mb-4">
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              Edit Profile
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-1">{profile.name}</h2>
          <p className="text-indigo-600 font-medium text-sm flex items-center gap-1.5 mb-6">
            <Building2 size={16} /> {profile.department} — {profile.year}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                <p className="font-medium text-slate-800 flex items-center gap-2">
                  <Mail size={16} className="text-slate-400" /> {profile.email}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Student ID</p>
                <p className="font-medium text-slate-800 flex items-center gap-2">
                  <Hash size={16} className="text-slate-400" /> {profile.id}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technical Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(skill => (
                    <span key={skill} className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map(interest => (
                    <span key={interest} className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

