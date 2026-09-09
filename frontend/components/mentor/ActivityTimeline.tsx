"use client";

import { Activity, Clock, CheckCircle, Handshake, Building2, Award } from "lucide-react";
import { MentorActivityItem } from "@/types/mentor";

interface ActivityTimelineProps {
  activities: MentorActivityItem[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "task_submission":
        return <Clock size={13} className="text-purple-600" />;
      case "task_completed":
        return <CheckCircle size={13} className="text-emerald-600" />;
      case "industry_update":
        return <Handshake size={13} className="text-indigo-600" />;
      case "university_update":
        return <Building2 size={13} className="text-blue-600" />;
      case "challenge_assigned":
        return <Award size={13} className="text-amber-600" />;
      default:
        return <Activity size={13} className="text-slate-600" />;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Activity size={16} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Recent Activity
          </h2>
        </div>
        <span className="text-[11px] font-bold text-slate-400">Live Stream</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
        {activities.slice(0, 5).map((act) => (
          <div key={act.id} className="relative">
            {/* Dot marker */}
            <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-slate-200 shadow-2xs">
              {getIcon(act.type)}
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                {act.text}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                <span>{act.timestamp}</span>
                {act.actorName && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-slate-600">{act.actorName}</span>
                  </>
                )}
                {act.teamName && (
                  <>
                    <span>•</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.2 text-slate-600">
                      {act.teamName}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

