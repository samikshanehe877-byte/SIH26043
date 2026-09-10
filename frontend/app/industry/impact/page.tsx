"use client";

import { useIndustry } from "@/context/IndustryContext";
import { PieChart as PieChartIcon, Activity, Users, Award, TrendingUp, Building2, Package } from "lucide-react";
import StatsCard from "@/components/StatsCard";

export default function IndustryImpactPage() {
  const { impact, supportedChallenges } = useIndustry();

  // Simple pure CSS horizontal bar chart for distribution
  const maxSupportValue = Math.max(...impact.supportDistribution.map(d => d.value));

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Impact & Reports</h1>
        <p className="mt-1 text-slate-500">Measure the positive difference your company is making through collaboration.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard label="Projects Supported" value={impact.projectsSupported} icon={Activity} color="blue" />
        <StatsCard label="Students Reached" value={impact.studentsReached} icon={Users} color="green" />
        <StatsCard label="Universities" value={impact.universitiesCollaborated} icon={Building2} color="amber" />
        <StatsCard label="Resources Provided" value={impact.resourcesProvided} icon={Package} color="purple" />
        <StatsCard label="Experts Involved" value={impact.technicalExpertsInvolved} icon={Award} color="blue" />
        <StatsCard label="Solutions Deployed" value={impact.completedSolutions} icon={TrendingUp} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Distribution Chart (CSS) */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieChartIcon size={18} className="text-blue-600" /> Support Distribution
          </h2>
          
          <div className="space-y-4">
            {impact.supportDistribution.map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="text-slate-500">{item.value}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
                    style={{ width: `${(item.value / maxSupportValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Completed */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Award size={18} className="text-emerald-600" /> Recent Success Stories
          </h2>
          
          <div className="space-y-4">
            {supportedChallenges.slice(0, 3).map(ch => (
              <div key={ch.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900">{ch.challengeTitle}</h3>
                  <span className="text-xs font-semibold text-emerald-700">{ch.completionDate}</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{ch.universityName}</p>
                
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Real-World Impact</p>
                  <p className="text-sm font-medium text-slate-800">{ch.impactResult}</p>
                </div>
              </div>
            ))}
            
            {supportedChallenges.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No completed projects yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
