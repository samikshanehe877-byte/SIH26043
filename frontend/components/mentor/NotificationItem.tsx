"use client";

import Link from "next/link";
import {
  Bell,
  Award,
  FileCheck,
  CheckCircle2,
  Handshake,
  Building2,
  Clock,
  MessageSquare,
  Check,
} from "lucide-react";
import { MentorNotification, MentorNotificationType } from "@/types/mentor";

interface NotificationItemProps {
  notification: MentorNotification;
  onMarkRead: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onMarkRead,
}: NotificationItemProps) {
  const getIcon = (type: MentorNotificationType) => {
    switch (type) {
      case "assignment":
        return <Award size={18} className="text-emerald-600" />;
      case "submission":
      case "feedback_request":
        return <FileCheck size={18} className="text-purple-600" />;
      case "completed":
        return <CheckCircle2 size={18} className="text-green-600" />;
      case "industry_accepted":
      case "industry_rejected":
        return <Handshake size={18} className="text-indigo-600" />;
      case "university_update":
        return <Building2 size={18} className="text-blue-600" />;
      case "deadline":
        return <Clock size={18} className="text-amber-600" />;
      case "message":
        return <MessageSquare size={18} className="text-teal-600" />;
      default:
        return <Bell size={18} className="text-slate-600" />;
    }
  };

  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-2xl border p-4 transition ${
        !notification.isRead
          ? "border-emerald-200 bg-emerald-50/30 shadow-xs"
          : "border-slate-100 bg-white hover:bg-slate-50/50"
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-slate-100 shadow-2xs">
          {getIcon(notification.type)}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4
              className={`text-xs font-bold ${
                !notification.isRead ? "text-slate-900" : "text-slate-700"
              }`}
            >
              {notification.title}
            </h4>
            {!notification.isRead && (
              <span className="h-2 w-2 rounded-full bg-emerald-600 flex-shrink-0" />
            )}
          </div>

          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            {notification.message}
          </p>

          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
            <span>{notification.timeAgo}</span>
            {notification.relatedChallengeTitle && (
              <>
                <span>•</span>
                <span className="truncate max-w-[200px] text-slate-500 font-medium">
                  {notification.relatedChallengeTitle}
                </span>
              </>
            )}
            {notification.link && (
              <>
                <span>•</span>
                <Link
                  href={notification.link}
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  View details
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {!notification.isRead && (
        <button
          type="button"
          onClick={() => onMarkRead(notification.id)}
          title="Mark as read"
          className="flex-shrink-0 rounded-xl p-1.5 text-slate-400 hover:bg-white hover:text-emerald-600 border border-transparent hover:border-slate-200 transition"
        >
          <Check size={16} />
        </button>
      )}
    </div>
  );
}

