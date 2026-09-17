"use client";

import { useState } from "react";
import { useIndustry } from "@/context/IndustryContext";
import { useProblems } from "@/context/ProblemsContext";
import { useIndustryProblems } from "@/context/IndustryProblemsContext";
import { Problem } from "@/types/problem";
import StatsCard from "@/components/StatsCard";
import { Inbox, Handshake, Award, Activity, ArrowRight, Clock, Send } from "lucide-react";
import Link from "next/link";
import ProjectCards from "@/components/workspace/ProjectCards";
import { useProjects } from "@/lib/projects";

export default function IndustryDashboardPage() {
  const { company, requests, collaborations, impact } = useIndustry();
  const { publicProblems, volunteerForProblem, withdrawVolunteerRequest } = useProblems();
  const { isLoading, refreshProblems } = useIndustryProblems();
  const { projects } = useProjects("industry");
  const [volunteeredIds, setVolunteeredIds] = useState<Set<string>>(new Set());

  const handleVolunteer = async (problemId: string, proposal: string) => {
    if (!company.name) return false;
    const success = await volunteerForProblem(problemId, "industry", company.name, proposal);
    if (success) {
      setVolunteeredIds((prev) => new Set(prev).add(problemId));
      refreshProblems();
    }
    return success;
  };

  const handleWithdraw = async (problemId: string) => {
    const success = await withdrawVolunteerRequest(problemId, "industry", company.name);
    if (success) {
      setVolunteeredIds((prev) => {
        const next = new Set(prev);
        next.delete(problemId);
        return next;
      });
      refreshProblems();
    }
    return success;
  };

  const availableProblems = publicProblems.filter(
    (p: Problem) =>
      p.status === "Verified" &&
      !p.volunteers?.some(
        (v) => v.solverName === company.name && v.solverType === "industry" && v.status === "accepted"
      )
  );

  const pendingRequestsCount = requests.filter(r => r.status === "Received" || r.status === "Under Review" || r.status === "Clarification Needed").length;
  const activeCollaborationsCount = collaborations.filter(c => c.collaborationStatus === "In Progress" || c.collaborationStatus === "Support Delivered").length;
  const completedCollaborationsCount = collaborations.filter(c => c.collaborationStatus === "Completed").length + impact.completedSolutions;

  const activeProjects = projects.filter((p) => p.status !== "completed");
  const completedProjects = projects.filter((p) => p.status === "completed");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

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
          label="Active Projects"
          value={activeProjects.length}
          icon={Handshake}
          color="blue"
        />
        <StatsCard
          label="Completed"
          value={completedProjects.length}
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

      {/* Available Problems — Volunteer Opportunities */}
      {availableProblems.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Handshake size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">
              Available Problems — Volunteer Opportunities
            </h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
              {availableProblems.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            These verified societal problems are open for industry volunteer proposals. Review and offer your company's solution.
          </p>
          <div className="space-y-4">
            {availableProblems.map((problem) => {
              const hasVolunteered = volunteeredIds.has(String(problem.id));
              const existingVolunteer = problem.volunteers?.find(
                (v) => v.solverName === company.name && v.solverType === "industry"
              );
              const showVolunteer = !hasVolunteered && !existingVolunteer;
              const showWithdraw = hasVolunteered || (existingVolunteer && existingVolunteer.status === "volunteered");
              return (
                <div key={problem.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-xs font-semibold">
                      {problem.category}
                    </span>
                    {existingVolunteer && existingVolunteer.status === "accepted" && (
                      <span className="rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-xs font-bold">
                        ✓ Selected
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{problem.title}</h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{problem.description}</p>
                  {problem.volunteers && problem.volunteers.filter((v) => v.status === "volunteered" || v.status === "accepted").length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {problem.volunteers
                        .filter((v) => v.status === "volunteered" || v.status === "accepted")
                        .map((v, i) => (
                          <span key={i} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                            {v.solverName}
                            {v.status === "accepted" && <span className="text-emerald-600">✓</span>}
                          </span>
                        ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {showVolunteer && (
                      <button
                        onClick={() => handleVolunteer(String(problem.id), problem.requiredCapabilities?.join(", ") || "")}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        <Handshake size={12} />
                        Volunteer
                      </button>
                    )}
                    {showWithdraw && (
                      <button
                        onClick={() => handleWithdraw(String(problem.id))}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        <span className="text-amber-600">↶</span>
                        {existingVolunteer?.status === "accepted" ? "Withdrawn" : "Withdraw"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              {requests.filter(r => r.status === "Received" || r.status === "Under Review" || r.status === "Clarification Needed").slice(0, 3).map(req => (
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

          {/* Project Workspaces — accepted problems this company leads or supports */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Project Workspaces</h2>
              <Link href="/industry/projects" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <ProjectCards
              projects={activeProjects.slice(0, 4)}
              basePath="/industry"
              accent="blue"
              emptyText="No active projects. Accepted volunteer proposals and university collaborations open a workspace here."
            />
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