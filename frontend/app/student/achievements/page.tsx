"use client";

import { useStudent } from "@/context/StudentContext";
import { Star, Users, Award, Shield, Zap, TrendingUp, Trophy } from "lucide-react";

export default function StudentAchievementsPage() {
  const { profile } = useStudent();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Star": return <Star size={24} className="text-amber-500" />;
      case "Users": return <Users size={24} className="text-blue-500" />;
      case "Award": return <Award size={24} className="text-purple-500" />;
      case "Shield": return <Shield size={24} className="text-emerald-500" />;
      case "Zap": return <Zap size={24} className="text-yellow-500" />;
      default: return <Trophy size={24} className="text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Achievements</h1>
        <p className="mt-1 text-slate-500">Badges and recognition earned during your SIH journey.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm text-center">
          <p className="text-3xl font-bold text-indigo-600 mb-1">{profile.completedChallenges}</p>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Challenges Completed</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm text-center">
          <p className="text-3xl font-bold text-emerald-600 mb-1">{profile.certificates}</p>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certificates Earned</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm text-center">
          <p className="text-3xl font-bold text-amber-600 mb-1">{profile.achievements.length}</p>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Badges Unlocked</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600 mb-1">1</p>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Streak (Months)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profile.achievements.map((achievement) => (
          <div key={achievement.id} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm group hover:shadow-md transition">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-slate-50 transition group-hover:scale-150" />
            
            <div className="relative z-10">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100">
                {getIcon(achievement.icon)}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{achievement.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{achievement.description}</p>
              <p className="text-xs font-semibold text-slate-400">Earned {achievement.dateEarned}</p>
            </div>
          </div>
        ))}

        {/* Locked Achievement Mock */}
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 opacity-70">
          <div className="relative z-10">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-400">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Master Solver</h3>
            <p className="text-sm text-slate-500 mb-4">Complete 5 challenges with high mentor ratings.</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-2/5 rounded-full bg-slate-400" />
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-400 text-right">2/5 Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

