"use client";

import { useState } from "react";
import { CheckCheck, Bell } from "lucide-react";
import UniversityNotificationItem from "@/components/university/UniversityNotificationItem";
import { universityNotifications as initial } from "@/data/universityAppData";
import { UniversityNotification } from "@/types/universityChallenge";

export default function UniversityNotificationsPage() {
  const [notifications, setNotifications] = useState<UniversityNotification[]>(initial);

  const unread = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  const markOneRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">
            {unread > 0
              ? `${unread} unread notification${unread > 1 ? "s" : ""}`
              : "You are all caught up!"}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
          >
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {/* Unread */}
      {unread > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Unread</p>
          {notifications
            .filter((n) => !n.isRead)
            .map((n) => (
              <div key={n.id} onClick={() => markOneRead(n.id)} className="cursor-pointer">
                <UniversityNotificationItem notification={n} />
              </div>
            ))}
        </div>
      )}

      {/* Read */}
      {notifications.some((n) => n.isRead) && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Earlier</p>
          {notifications
            .filter((n) => n.isRead)
            .map((n) => (
              <UniversityNotificationItem key={n.id} notification={n} />
            ))}
        </div>
      )}

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-20 text-center shadow-sm">
          <Bell size={40} className="mb-3 text-slate-200" />
          <p className="font-semibold text-slate-500">No notifications yet</p>
        </div>
      )}
    </div>
  );
}
