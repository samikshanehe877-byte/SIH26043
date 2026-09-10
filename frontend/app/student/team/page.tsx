"use client";

import { useStudent } from "@/context/StudentContext";
import { Mail, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function StudentTeamPage() {
  const { team } = useStudent();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Team: {team.name}</h1>
          <p className="mt-1 text-slate-500">
            Collaborate with your team members and lead mentor.
          </p>
        </div>
        <Link 
          href="/student/chat"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <MessageSquare size={16} />
          Team Chat
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Lead Mentor</h2>
        <div className="flex items-center gap-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/30">
          <div className="h-12 w-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
            {team.leadMentor.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{team.leadMentor}</p>
            <p className="text-sm text-slate-600">Lead Mentor</p>
          </div>
          <button className="ml-auto rounded-full p-2 text-indigo-600 hover:bg-indigo-100 transition">
            <Mail size={18} />
          </button>
        </div>
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-4">Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.members.map(member => (
          <div key={member.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <img src={member.avatar} alt={member.name} className="h-14 w-14 rounded-full bg-slate-100" />
                <span className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                  member.status === "Working" ? "bg-green-500" : 
                  member.status === "Offline" ? "bg-slate-300" : "bg-amber-500"
                }`} title={member.status} />
              </div>
            </div>
            
            <h3 className="font-bold text-slate-900 text-lg">{member.name}</h3>
            <p className="text-sm font-medium text-indigo-600 mb-3">{member.role}</p>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
              <p className="text-xs text-slate-500 flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-slate-700">{member.status}</span>
              </p>
              <p className="text-xs text-slate-500 flex justify-between">
                <span>Current Task:</span>
                <span className="font-medium text-slate-700 truncate max-w-[120px]" title={member.currentTask}>{member.currentTask || "None"}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

