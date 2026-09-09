"use client";

import { useState } from "react";
import {
  X,
  Handshake,
  Send,
  CheckCircle2,
  MessageSquare,
  FileText,
} from "lucide-react";
import { IndustryCollaborationRequest, CollaborationStatus } from "@/types/mentor";
import { useMentor } from "@/context/MentorContext";
import { CollaborationStatusBadge, HelpTypeBadge } from "./CollaborationStatusBadge";

interface CollaborationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: IndustryCollaborationRequest;
}

export default function CollaborationDetailModal({
  isOpen,
  onClose,
  request,
}: CollaborationDetailModalProps) {
  const { profile, updateIndustryRequestStatus, addIndustryMessage } = useMentor();
  const [messageInput, setMessageInput] = useState("");
  const [currentStatus, setCurrentStatus] = useState<CollaborationStatus>(request.status);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    addIndustryMessage(request.id, messageInput.trim());
    setMessageInput("");
  };

  const handleStatusChange = (newStatus: CollaborationStatus) => {
    setCurrentStatus(newStatus);
    updateIndustryRequestStatus(request.id, newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Handshake size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {request.organization}
                </h2>
                <CollaborationStatusBadge status={currentStatus} />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {request.requestTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Metadata Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Support Type:</span>
                <HelpTypeBadge type={request.helpType} />
              </div>
              <div className="text-xs text-slate-500">
                <span className="text-slate-400">Target Delivery: </span>
                <span className="font-semibold text-slate-800">{request.requiredBy}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Challenge: </span>
                <span className="font-semibold text-slate-800">{request.challengeTitle}</span>
              </div>
              <div>
                <span className="text-slate-400">Team: </span>
                <span className="font-semibold text-slate-800">{request.teamName}</span>
              </div>
              <div>
                <span className="text-slate-400">Mentor Lead: </span>
                <span className="font-semibold text-slate-800">{profile.name}</span>
              </div>
              <div>
                <span className="text-slate-400">Submitted: </span>
                <span className="font-semibold text-slate-800">{request.dateSubmitted}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Requirement:</span>
              <p className="text-xs text-slate-700 leading-relaxed bg-white rounded-xl p-3 border border-slate-200">
                {request.requirement}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Why Needed:</span>
              <p className="text-xs text-slate-600 bg-white rounded-xl p-3 border border-slate-200">
                {request.whyNeeded}
              </p>
            </div>

            {request.attachmentName && (
              <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 p-2.5 text-xs text-slate-700">
                <FileText size={15} className="text-indigo-600" />
                <span className="font-medium">{request.attachmentName}</span>
              </div>
            )}
          </div>

          {/* Status Controls */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Update Collaboration Status
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(["Under Review", "Accepted", "In Progress", "Completed", "Rejected"] as CollaborationStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${
                      currentStatus === st
                        ? "bg-slate-900 text-white shadow-xs"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Discussion / Messages Thread */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              <MessageSquare size={14} />
              <span>Communication History ({request.messages?.length || 0})</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 max-h-52 overflow-y-auto">
              {(!request.messages || request.messages.length === 0) ? (
                <p className="text-center text-xs text-slate-400 py-3">
                  No messages yet. Send an introductory note below.
                </p>
              ) : (
                request.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-2xl p-3 max-w-[85%] ${
                      msg.role === "mentor"
                        ? "ml-auto bg-emerald-600 text-white shadow-xs"
                        : "mr-auto bg-white border border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] mb-1 opacity-80">
                      <span className="font-bold">{msg.sender}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="mt-2.5 flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Write a message to industry partner..."
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                className="flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
              >
                <Send size={13} />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => handleStatusChange("Completed")}
              className="flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-xs font-bold text-green-700 hover:bg-green-100"
            >
              <CheckCircle2 size={14} />
              Mark Completed
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

