"use client";

import { useStudent } from "@/context/StudentContext";
import { Sparkles, ArrowRight, Lightbulb, Users, Calendar, Target, Clock, Cpu } from "lucide-react";

export default function StudentChallengePage() {
  const { activeChallenge } = useStudent();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-slate-900">My Challenge</h1>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          {activeChallenge.status}
        </span>
      </div>
      
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{activeChallenge.title}</h2>
          <div className="flex flex-wrap gap-2 text-sm text-slate-600 mb-4">
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1">
              <Target size={14} /> {activeChallenge.category}
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1">
              <Users size={14} /> {activeChallenge.teamName}
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1">
              <Clock size={14} /> {activeChallenge.deadlineDays} days remaining
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Problem Statement</h3>
          <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {activeChallenge.problemStatement}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Citizen Requirement</h3>
          <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {activeChallenge.citizenRequirement}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-indigo-900 mb-3 uppercase tracking-wider">
              <Lightbulb size={16} className="text-indigo-600" /> Lead Mentor
            </h3>
            <p className="font-semibold text-slate-800">{activeChallenge.leadMentor}</p>
            <p className="text-sm text-slate-600 mt-1">{activeChallenge.primaryDepartment}</p>
          </div>
          
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-900 mb-3 uppercase tracking-wider">
              <Users size={16} className="text-emerald-600" /> Supporting Departments
            </h3>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              {activeChallenge.supportingDepartments.map(dep => (
                <li key={dep}>{dep}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Analysis MOCK display */}
        <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-purple-50/30 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Sparkles size={16} />
            </div>
            <h3 className="text-lg font-bold text-purple-900">AI Challenge Analysis</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-xs font-bold text-purple-600 uppercase mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {activeChallenge.aiAnalysis.requiredSkills.map(skill => (
                  <span key={skill} className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm border border-purple-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs font-bold text-purple-600 uppercase mb-2">Suggested Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {activeChallenge.aiAnalysis.suggestedTechnologies.map(tech => (
                  <span key={tech} className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                    <Cpu size={12} className="text-purple-400" /> {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-xs font-bold text-purple-600 uppercase mb-2">Expected Outcome</p>
            <p className="text-sm text-slate-700 leading-relaxed bg-white/60 p-3 rounded-lg border border-purple-100/50">
              {activeChallenge.aiAnalysis.expectedOutcome}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

