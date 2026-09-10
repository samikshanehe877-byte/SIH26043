"use client";

import { useIndustry } from "@/context/IndustryContext";
import StatsCard from "@/components/StatsCard";
import { Inbox, Handshake, Award, Activity, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export default function IndustryDashboardPage() {
  const { company, requests, collaborations, impact } = useIndustry();

  const pendingRequestsCount = requests.filter(r => r.status === "Received" || r.status === "Under Review" || r.status === "Clarification Needed").length;
  const activeCollaborationsCount = collaborations.filter(c => c.collaborationStatus === "In Progress" || c.collaborationStatus === "Support Delivered").length;
  const completedCollaborationsCount = collaborations.filter(c => c.collaborationStatus === "Completed").length + impact.completedSolutions;
  
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Good Morning, {company.name}
        </h1>
        <p className="mt-1 text-slate-500">
          Collaborate with universities and help transform real-world challenges into practical solutions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Pending Requests"
          value={pendingRequestsCount}
          icon={Inbox}
          color="amber"
        />
        <StatsCard
          label="Active Collaborations"
          value={activeCollaborationsCount}
          icon={Handshake}
          color="blue"
        />
        <StatsCard
          label="Completed"
          value={completedCollaborationsCount}
          icon={Award}
          color="green"
        />
        <StatsCard
          label="Support Provided"
          value={impact.resourcesProvided}
          icon={Activity}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pending Collaboration Requests */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Pending Collaboration Requests</h2>
              <Link href="/industry/requests" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {requests.filter(r => r.status !== "Approved" && r.status !== "Rejected").slice(0, 3).map(req => (
                <div key={req.id} className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900">{req.challengeTitle}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      req.status === "Clarification Needed" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {req.problemDescription}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
                    <span>{req.university.name}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>Mentor: {req.mentor.name}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>Team: {req.studentTeam.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {req.requestedSupportTypes.slice(0, 2).map(type => (
                        <span key={type} className="inline-flex rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700 border border-blue-100">
                          {type}
                        </span>
                      ))}
                      {req.requestedSupportTypes.length > 2 && (
                        <span className="inline-flex rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-600 border border-slate-100">
                          +{req.requestedSupportTypes.length - 2} more
                        </span>
                      )}
                    </div>
                    <Link href={`/industry/requests/${req.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                      Review Request
                    </Link>
                  </div>
                </div>
              ))}
              {pendingRequestsCount === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No pending requests at the moment.</p>
              )}
            </div>
          </div>

          {/* Active Collaborations */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Active Collaborations</h2>
              <Link href="/industry/collaborations" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {collaborations.slice(0, 2).map(collab => (
                <div key={collab.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900">{collab.challengeTitle}</h3>
                    <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
                      {collab.collaborationStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <span>{collab.university.name}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>Progress: {collab.projectProgress}%</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div 
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${collab.projectProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                    <p className="text-xs text-slate-500">
                      Support: <span className="font-semibold text-slate-700">{collab.industrySupport.length} items</span>
                    </p>
                    <Link href={`/industry/collaborations/${collab.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                      Manage Support
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-6">Recent Activity</h2>
            <div className="space-y-6">
              <div className="flex gap-4 relative">
                <div className="absolute left-4 top-8 bottom-[-24px] w-0.5 bg-slate-100"></div>
                <div className="h-8 w-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center flex-shrink-0 z-10">
                  <Inbox size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">New collaboration request</p>
                  <p className="text-xs text-slate-500">from Bharati Vidyapeeth</p>
                  <p className="text-[10px] text-slate-400 mt-1">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex gap-4 relative">
                <div className="absolute left-4 top-8 bottom-[-24px] w-0.5 bg-slate-100"></div>
                <div className="h-8 w-8 rounded-full bg-amber-50 border-2 border-white flex items-center justify-center flex-shrink-0 z-10">
                  <Clock size={14} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Mentor responded to clarification</p>
                  <p className="text-xs text-slate-500">Dr. Sneha Patel replied</p>
                  <p className="text-[10px] text-slate-400 mt-1">5 hours ago</p>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className="h-8 w-8 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center flex-shrink-0 z-10">
                  <Activity size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Project milestone reached</p>
                  <p className="text-xs text-slate-500">AquaTech reached 75% progress</p>
                  <p className="text-[10px] text-slate-400 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
