"use client";

import { useEffect, useState } from "react";
import { CheckCheck, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NotificationItem from "@/components/NotificationItem";
import { Notification } from "@/types/problem";

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      router.push("/signin?callbackUrl=/notifications");
      return;
    }

    fetch(`${apiUrl}/notifications?citizen_name=${encodeURIComponent(user.name)}&audience=citizen`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load notifications");
        return response.json();
      })
      .then((records) => {
        if (!Array.isArray(records)) return;
        setNotifications(records.map((record) => ({
          id: record.id,
          type: record.type === "success" || record.type === "warning" || record.type === "update"
            ? record.type
            : "info",
          title: record.title,
          message: record.message,
          timeAgo: formatNotificationTime(record.created_at),
          isRead: Boolean(record.is_read),
          problemTitle: record.problem_title,
          problemId: record.problem_id,
          category: record.category,
        })));
      })
      .catch(() => setLoadError(true))
      .finally(() => setIsLoading(false));
  }, [apiUrl, authLoading, isAuthenticated, user, router]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    if (!user) return;
    const response = await fetch(`${apiUrl}/notifications/read-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ citizen_name: user.name, audience: "citizen" }),
    });
    if (!response.ok) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markOneRead = async (id: number | string) => {
    const response = await fetch(`${apiUrl}/notifications/${id}/read`, { method: "PATCH" });
    if (!response.ok) return false;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    return true;
  };

  if (authLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You are all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <CheckCheck size={15} />
            Mark all read
          </button>
        )}
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading notifications...
        </div>
      )}

      {loadError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
          Notifications could not be loaded. Please refresh and try again.
        </div>
      )}

      {!isLoading && !loadError && unreadCount > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Unread</p>
          {notifications
            .filter((n) => !n.isRead)
            .map((n) => (
              <div key={n.id} onClick={() => openNotification(n)} className="cursor-pointer">
                <NotificationItem notification={n} />
              </div>
            ))}
        </div>
      )}

      {!isLoading && !loadError && notifications.some((n) => n.isRead) && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Earlier</p>
          {notifications
            .filter((n) => n.isRead)
            .map((n) => (
              <div key={n.id} onClick={() => openNotification(n)} className="cursor-pointer">
                <NotificationItem notification={n} />
              </div>
            ))}
        </div>
      )}

      {!isLoading && !loadError && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-20 text-center shadow-sm">
          <Bell size={40} className="mb-3 text-slate-200" />
          <p className="font-semibold text-slate-500">No notifications yet</p>
          <p className="mt-1 text-sm text-slate-400">
            You will be notified when your problems are updated.
          </p>
        </div>
      )}
    </div>
  );

  async function openNotification(notification: Notification) {
    await markOneRead(notification.id);
    // Progress updates and new partners belong to the project workspace.
    if (notification.category === "project" && notification.problemId) {
      router.push(`/projects/${encodeURIComponent(notification.problemId)}`);
      return;
    }
    router.push(notification.problemId
      ? `/my-problems?problemId=${encodeURIComponent(notification.problemId)}`
      : "/my-problems");
  }
}

function formatNotificationTime(createdAt?: string) {
  if (!createdAt) return "Recently";
  const timestamp = new Date(createdAt).getTime();
  if (Number.isNaN(timestamp)) return "Recently";
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (elapsedMinutes < 1) return "Just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} hr ago`;
  return `${Math.floor(elapsedHours / 24)} day ago`;
}