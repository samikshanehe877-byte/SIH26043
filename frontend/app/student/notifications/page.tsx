"use client";

import { useStudent } from "@/context/StudentContext";
import NotificationItem from "@/components/NotificationItem";
import { Check } from "lucide-react";

export default function StudentNotificationsPage() {
  const { notifications, markNotificationAsRead } = useStudent();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-slate-500">Stay updated with your team's activities and mentor feedback.</p>
        </div>
        <button 
          onClick={() => {
            notifications.forEach(n => {
              if (!n.isRead) markNotificationAsRead(n.id);
            });
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <Check size={16} /> Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(notification => (
          <div key={notification.id} onClick={() => markNotificationAsRead(notification.id)} className="cursor-pointer">
            <NotificationItem notification={notification} />
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-slate-500">No notifications.</div>
        )}
      </div>
    </div>
  );
}
