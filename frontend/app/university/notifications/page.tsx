"use client";

import { useState, useEffect } from "react";
import { CheckCheck, Bell } from "lucide-react";
import UniversityNotificationItem from "@/components/university/UniversityNotificationItem";
import { useAuth } from "@/context/AuthContext";
import { UniversityNotification } from "@/types/universityChallenge";

export default function UniversityNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UniversityNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/notifications?citizen_name=${encodeURIComponent(user.name)}`,
          { cache: "no-store" }
        );
        if (!response.ok) throw new Error("Failed to fetch notifications");

        const records = await response.json();
        const mapped: UniversityNotification[] = records.map((r: any) => ({
          id: r.id,
          type: r.type,
          title: r.title,
          message: r.message,
          timeAgo: getTimeAgo(new Date(r.created_at)),
          isRead: r.is_read,
          relatedChallengeTitle: r.problem_title,
        }));
        setNotifications(mapped);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [apiUrl, user]);

  const unread = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    if (!user) return;
    try {
      await fetch(`${apiUrl}/notifications/read-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ citizen_name: user.name }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const markOneRead = async (id: number | string) => {
    try {
      await fetch(`${apiUrl}/notifications/${id}/read`, {
        method: "PATCH",
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

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

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}
