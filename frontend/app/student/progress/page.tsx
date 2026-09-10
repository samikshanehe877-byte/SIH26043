"use client";

import { useStudent } from "@/context/StudentContext";
import StudentProjectTimeline from "@/components/student/StudentProjectTimeline";
import { Users, Target } from "lucide-react";

export default function StudentProgressPage() {
  const { activeChallenge, team } = useStudent();

  // Calculate current step based on progress roughly
  const getStep = (progress: number) => {
    if (progress < 10) return 1;
    if (progress < 25) return 2;
    if (progress < 40) return 3;
    if (progress < 70) return 4;
    if (progress < 90) return 5;
    if (progress < 100) return 6;
    return 7;
  };

  const currentStep = getStep(activeChallenge.progress);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Project Progress</h1>
        <p className="mt-1 text-slate-500">Track your team's overall progress on the challenge.</p>
      </div>

      <StudentProjectTimeline currentStep={currentStep} progress={activeChallenge.progress} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-4">
            <Users className="text-indigo-600" size={18} /> Team Contribution
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Estimated contribution based on completed tasks. For visibility only.
          </p>
          <div className="space-y-4">
            {team.members.map(member => (
              <div key={member.id}>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-slate-700">{member.name}</span>
                  <span className="text-slate-500">{member.contributionPercent || 0}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className="h-full rounded-full bg-indigo-400"
                    style={{ width: `${member.contributionPercent || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-4">
            <Target className="text-emerald-600" size={18} /> Next Milestone
          </h3>
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-900">
            <p className="font-bold mb-1">Complete Solution Development</p>
            <p className="text-sm opacity-80 mb-3">All core features must be implemented and integrated before testing can begin.</p>
            <p className="text-xs font-semibold uppercase tracking-wider">Due in {activeChallenge.deadlineDays} days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

