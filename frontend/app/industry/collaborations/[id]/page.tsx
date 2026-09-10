"use client";

import { useIndustry } from "@/context/IndustryContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Users, MessageSquare, Check, Loader2, Edit2, Box } from "lucide-react";
import { useState } from "react";
import { SupportStatus, IndustrySupport } from "@/types/industry";

export default function IndustryCollaborationDetailsPage() {
  const { id } = useParams();
  const { collaborations, updateSupportStatus } = useIndustry();
  const collab = collaborations.find(c => c.id === id);

  const [selectedSupport, setSelectedSupport] = useState<IndustrySupport | null>(null);
  const [newStatus, setNewStatus] = useState<SupportStatus>("In Progress");

  if (!collab) return <div className="p-8 text-center text-slate-500">Collaboration not found.</div>;

  const handleUpdateSupport = () => {
    if (selectedSupport) {
      updateSupportStatus(collab.id, selectedSupport.id, newStatus);
      setSelectedSupport(null);
    }
  };

  const getStatusBadge = (status: SupportStatus) => {
    switch (status) {
      case "Planned": return "bg-slate-100 text-slate-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Delivered": return "bg-emerald-100 text-emerald-700";
      case "Completed": return "bg-emerald-100 text-emerald-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <Link href="/industry/collaborations" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
        <ArrowLeft size={16} /> Back to Collaborations
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{collab.challengeTitle}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-600">
            <span className="flex items-center gap-1"><Building2 size={16} className="text-slate-400"/> {collab.university.name}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1"><Users size={16} className="text-slate-400"/> {collab.studentTeam.name}</span>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
          <MessageSquare size={16} /> Message Mentor
        </button>
      </div>

      {/* Project Progress */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Project Progress</h3>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">
            {collab.projectProgress}%
          </span>
        </div>
        <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700"
            style={{ width: `${collab.projectProgress}%` }}
          />
        </div>

        <div className="space-y-0">
          {collab.milestones.map((step, index) => {
            const stepNumber = index + 1;
            const isDone    = stepNumber < collab.currentMilestoneIndex;
            const isActive  = stepNumber === collab.currentMilestoneIndex;

            return (
              <div key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isDone ? "bg-green-500 text-white" : isActive ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-slate-100 text-slate-400"
                    }`}>
                    {isDone ? <Check size={14} strokeWidth={3} /> : isActive ? <Loader2 size={14} className="animate-spin" /> : stepNumber}
                  </div>
                  {index < collab.milestones.length - 1 && (
                    <div className={`mt-1 w-0.5 flex-1 min-h-[20px] rounded-full transition-colors ${isDone ? "bg-green-300" : "bg-slate-100"}`} />
                  )}
                </div>
                <div className={`pb-5 ${index === collab.milestones.length - 1 ? "pb-0" : ""}`}>
                  <p className={`text-sm font-semibold leading-tight ${isDone ? "text-green-600" : isActive ? "text-blue-600" : "text-slate-400"}`}>
                    {step.label}
                  </p>
                  <p className={`mt-0.5 text-xs ${isActive ? "text-slate-500" : "text-slate-400"}`}>{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Your Industry Support */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/20 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
          <Box size={24} className="text-indigo-600" /> Your Industry Support
        </h2>

        <div className="space-y-4">
          {collab.industrySupport.map(support => (
            <div key={support.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-indigo-100 bg-white p-5 shadow-sm">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-slate-900">{support.type}</h3>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(support.status)}`}>
                    {support.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{support.description}</p>
                <p className="text-xs font-medium text-slate-500">Expected Delivery: {support.expectedDeliveryDate}</p>
              </div>
              
              <button 
                onClick={() => {
                  setSelectedSupport(support);
                  setNewStatus(support.status);
                }}
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition"
              >
                <Edit2 size={16} /> Update Status
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Update Support Modal */}
      {selectedSupport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Update Support Status</h2>
            <p className="text-sm text-slate-600 mb-6">Update the delivery status of {selectedSupport.type}.</p>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select 
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as SupportStatus)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Delivered">Delivered</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setSelectedSupport(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleUpdateSupport} className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Save Update</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
