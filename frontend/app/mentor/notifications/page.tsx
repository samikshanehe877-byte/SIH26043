"use client";

import { useState, useMemo } from "react";
import { Bell, CheckCheck, Filter } from "lucide-react";
import MentorHeader from "@/components/mentor/MentorHeader";
import NotificationItem from "@/components/mentor/NotificationItem";
import { useMentor } from "@/context/MentorContext";

export default function MentorNotificationsPage() {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useMentor();

  const [activeTab, setActiveTab] = useState<"all" | "unread" | "tasks" | "industry" | "university">("all");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === "unread") return !n.isRead;
      if (activeTab === "tasks")
        return (
          n.type === "submission" ||
          n.type === "feedback_request" ||
          n.type === "completed" ||
          n.type === "deadline"
        );
      if (activeTab === "industry")
        return (
          n.type === "industry_accepted" ||
          n.type === "industry_rejected" ||
          n.type === "message"
        );
      if (activeTab === "university")
        return n.type === "assignment" || n.type === "university_update";
      return true;
    });
  }, [notifications, activeTab]);

  return (
    <div className="space-y-6">
      <MentorHeader
        title="Mentor Notifications"
        subtitle="Stay updated on challenge assignments, student deliverable submissions, and industry responses"
      >
        {unreadNotificationsCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <CheckCheck size={15} className="text-emerald-600" />
            Mark All as Read
          </button>
        )}
      </MentorHeader>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xs">
        {[
          { label: `All (${notifications.length})`, value: "all" },
          { label: `Unread (${unreadNotificationsCount})`, value: "unread" },
          { label: "Student Tasks", value: "tasks" },
          { label: "University Updates", value: "university" },
          { label: "Industry Collaboration", value: "industry" },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value as any)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === tab.value
                ? "bg-emerald-600 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Bell size={36} className="mx-auto mb-3 text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">No notifications found</h3>
          <p className="mt-1 text-xs text-slate-400">
            You are completely caught up with all updates and submissions.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkRead={(id) => markNotificationRead(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

