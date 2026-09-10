"use client";

import { useIndustry } from "@/context/IndustryContext";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Building2, User, Users, Cpu, Target, FileText, CheckCircle2, MessageSquare, XCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CollaborationRequestStatus } from "@/types/industry";

export default function IndustryRequestDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { requests, updateRequestStatus } = useIndustry();
  const request = requests.find(r => r.id === id);

  const [showClarification, setShowClarification] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [clarificationMsg, setClarificationMsg] = useState("");

  if (!request) {
    return <div className="p-8 text-center text-slate-500">Request not found.</div>;
  }

  const handleStatusChange = (status: CollaborationRequestStatus) => {
    updateRequestStatus(request.id, status);
    // Hide modals
    setShowClarification(false);
    setShowAccept(false);
    setShowReject(false);
    // Optional redirect or toast
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <Link href="/industry/requests" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
        <ArrowLeft size={16} /> Back to Requests
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 border border-blue-200">
              {request.status}
            </span>
            <span className="text-sm text-slate-500 font-medium">Requested on {request.requestDate}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{request.challengeTitle}</h1>
        </div>
        
        {/* Action Buttons */}
        {request.status !== "Approved" && request.status !== "Rejected" && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowReject(true)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition">
              Reject
            </button>
            <button onClick={() => setShowClarification(true)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              Request Clarification
            </button>
            <button onClick={() => setShowAccept(true)} className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">
              Accept Request
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Target size={18} className="text-blue-600" /> Challenge Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Problem Description</p>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">{request.problemDescription}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                  <p className="font-semibold text-slate-800">{request.category}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Expected Outcome</p>
                  <p className="font-medium text-slate-700 text-sm line-clamp-2" title={request.expectedOutcome}>{request.expectedOutcome}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" /> Support Requirements
            </h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Requested Support Types</p>
                <div className="flex flex-wrap gap-2">
                  {request.requestedSupportTypes.map(type => (
                    <span key={type} className="inline-flex rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 border border-indigo-100">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Why Support Is Needed</p>
                <p className="text-slate-700 leading-relaxed text-sm">{request.whySupportIsNeeded}</p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Expected Industry Contribution</p>
                <p className="text-slate-700 leading-relaxed text-sm bg-blue-50/50 p-4 rounded-xl border border-blue-100">{request.expectedIndustryContribution}</p>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-600" /> AI Match Analysis
              </h2>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
                {request.aiAnalysis.matchScore}% Match
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Matching Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {request.aiAnalysis.matchingSkills?.map(skill => (
                    <span key={skill} className="inline-flex rounded-md bg-white px-2 py-1 text-xs font-medium text-emerald-700 shadow-sm border border-emerald-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Suggested Tech</p>
                <div className="flex flex-wrap gap-1.5">
                  {request.aiAnalysis.suggestedTechnologies.map(tech => (
                    <span key={tech} className="inline-flex rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm border border-slate-100">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Sidebar Content */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 size={16} className="text-slate-400" /> University
            </h2>
            <p className="font-bold text-slate-800">{request.university.name}</p>
            <p className="text-sm text-slate-600 mt-1">{request.university.department}</p>
            <p className="text-xs text-slate-500 mt-1">{request.university.location}</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User size={16} className="text-slate-400" /> Lead Mentor
            </h2>
            <p className="font-bold text-slate-800">{request.mentor.name}</p>
            <p className="text-sm text-slate-600 mt-1 mb-3">{request.mentor.department}</p>
            <div className="flex flex-wrap gap-1.5">
              {request.mentor.expertise.map(exp => (
                <span key={exp} className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  {exp}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users size={16} className="text-slate-400" /> Student Team
            </h2>
            <p className="font-bold text-slate-800 mb-1">{request.studentTeam.name}</p>
            <p className="text-sm text-slate-600 mb-4">{request.studentTeam.size} members</p>
            
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Team Skills</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {request.studentTeam.skills.map(skill => (
                <span key={skill} className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  {skill}
                </span>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-500">Project Progress</span>
                <span className="text-blue-600">{request.projectProgress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div 
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${request.projectProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showClarification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <MessageSquare size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Request Clarification</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Send a message to the mentor to ask for more details before making a decision.
            </p>
            <textarea 
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[100px] mb-6"
              placeholder="E.g., Could you specify the exact cloud resources you need?"
              value={clarificationMsg}
              onChange={(e) => setClarificationMsg(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowClarification(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleStatusChange("Clarification Needed")} className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">Send Request</button>
            </div>
          </div>
        </div>
      )}

      {showAccept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Accept Collaboration</h2>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl mb-6">
              <p className="text-sm text-slate-600 mb-2">You are agreeing to support:</p>
              <p className="font-bold text-slate-900">{request.challengeTitle}</p>
              <p className="text-sm text-slate-700">by {request.university.name}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAccept(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleStatusChange("Approved")} className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Confirm Collaboration</button>
            </div>
          </div>
        </div>
      )}

      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <XCircle size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Reject Request</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Please provide a reason for rejecting this collaboration request. This will be shared with the mentor.
            </p>
            <textarea 
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 min-h-[100px] mb-6"
              placeholder="Reason for rejection..."
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowReject(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleStatusChange("Rejected")} className="rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700">Reject Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
