"use client";

import { Building2, Calendar, MessageSquare, ArrowRight } from "lucide-react";
import { IndustryCollaborationRequest } from "@/types/mentor";
import { CollaborationStatusBadge, HelpTypeBadge } from "./CollaborationStatusBadge";

interface CollaborationCardProps {
  request: IndustryCollaborationRequest;
  onViewDetails: (request: IndustryCollaborationRequest) => void;
}

export default function CollaborationCard({
  request,
  onViewDetails,
}: CollaborationCardProps) {
  const messageCount = request.messages ? request.messages.length : 0;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-sm">
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <HelpTypeBadge type={request.helpType} />
          <CollaborationStatusBadge status={request.status} />
        </div>

        {/* Organization & Title */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
          <Building2 size={14} className="text-slate-400 flex-shrink-0" />
          <span className="truncate">{request.organization}</span>
        </div>

        <h4 className="text-sm font-bold text-slate-800 line-clamp-2">
          {request.requestTitle}
        </h4>

        <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {request.requirement}
        </p>

        {/* Challenge & Team tags */}
        <div className="mt-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100 space-y-1 text-[11px]">
          <div className="truncate">
            <span className="text-slate-400">Challenge: </span>
            <span className="font-semibold text-slate-700">{request.challengeTitle}</span>
          </div>
          <div className="truncate">
            <span className="text-slate-400">Team: </span>
            <span className="font-semibold text-slate-700">{request.teamName}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>Submitted: {request.dateSubmitted}</span>
          </div>
          {messageCount > 0 && (
            <div className="flex items-center gap-1 text-indigo-600 font-semibold">
              <MessageSquare size={12} />
              <span>{messageCount} msgs</span>
            </div>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-[10px] text-slate-400">{request.lastUpdate}</span>
        <button
          type="button"
          onClick={() => onViewDetails(request)}
          className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
        >
          <span>View Details</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

