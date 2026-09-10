"use client";

import { useStudent } from "@/context/StudentContext";
import StatsCard from "@/components/StatsCard";
import { Target, CheckSquare, Users, TrendingUp, Clock, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import ProgressTracker from "@/components/ProgressTracker";

export default function StudentDashboard() {
  const { profile, activeChallenge, team, tasks } = useStudent();

  const pendingTasksCount = tasks.filter(t => t.status !== "Completed" && t.status !== "Approved").length;
  const pendingReviewsCount = tasks.filter(t => t.status === "Under Review").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {profile.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-slate-500">
          Continue working with your team to solve a real-world challenge.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Active Challenge"
          value="1"
          icon={Target}
          color="blue"
          sublabel={activeChallenge.title.slice(0, 20) + "..."}
        />
        <StatsCard
          label="Pending Tasks"
          value={pendingTasksCount}
          icon={CheckSquare}
          color="amber"
        />
        <StatsCard
          label="Team Progress"
          value={`${activeChallenge.progress}%`}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          label="Days Remaining"
          value={activeChallenge.deadlineDays}
          icon={Clock}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Challenge Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Current Challenge</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                {activeChallenge.status}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{activeChallenge.title}</h3>
            <p className="text-sm text-slate-600 mb-6">{activeChallenge.problemStatement}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-slate-400 font-medium">Category</p>
                <p className="text-sm font-medium text-slate-700">{activeChallenge.category}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Lead Mentor</p>
                <p className="text-sm font-medium text-slate-700">{activeChallenge.leadMentor}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Team</p>
                <p className="text-sm font-medium text-slate-700">{team.name} ({team.members.length} members)</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-700">Project Progress</span>
                <span className="text-indigo-600">{activeChallenge.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div 
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${activeChallenge.progress}%` }}
                />
              </div>
            </div>

            <Link href="/student/challenge" className="inline-flex items-center justify-center w-full gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
              View Challenge Details
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Pending Tasks */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">My Priority Tasks</h2>
              <Link href="/student/tasks" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status !== "Completed" && t.status !== "Approved").slice(0, 3).map(task => (
                <div key={task.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition cursor-pointer">
                  <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 ${
                    task.status === "In Progress" ? "border-indigo-500 bg-indigo-100" :
                    task.status === "Under Review" ? "border-amber-500 bg-amber-100" :
                    "border-slate-300"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-1">Due {task.dueDate}</p>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status !== "Completed" && t.status !== "Approved").length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No pending tasks.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar content */}
        <div className="space-y-6">
          {/* Team Snapshot */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">Team {team.name}</h2>
              <Link href="/student/team" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                View
              </Link>
            </div>
            <div className="space-y-4">
              {team.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={member.avatar} alt={member.name} className="h-8 w-8 rounded-full bg-slate-100" />
                    <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                      member.status === "Working" ? "bg-green-500" : "bg-slate-300"
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{member.name}</p>
                    <p className="text-xs text-slate-500 truncate">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pending Reviews Box */}
          {pendingReviewsCount > 0 && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="text-amber-600" size={20} />
                <h3 className="font-bold text-amber-900">Pending Reviews</h3>
              </div>
              <p className="text-sm text-amber-800 mb-4">
                You have {pendingReviewsCount} task(s) currently under review by your mentor.
              </p>
              <Link href="/student/tasks" className="text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                Check status <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

