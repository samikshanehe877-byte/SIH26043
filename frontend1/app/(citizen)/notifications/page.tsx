"use client";

import { useEffect, useState } from "react";
import { CheckCheck, Bell } from "lucide-react";
import NotificationItem from "@/components/NotificationItem";
import { currentUser } from "@/data/problems";
import { Notification } from "@/types/problem";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    fetch(`${apiUrl}/notifications?citizen_name=${encodeURIComponent(currentUser.name)}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then((records) => {
        if (!Array.isArray(records)) return;
        setNotifications(records.map((record) => ({
          id: record.id,
          type: record.type,
          title: record.title,
          message: record.message,
          timeAgo: formatNotificationTime(record.created_at),
          isRead: Boolean(record.is_read),
          problemTitle: record.problem_title,
          problemId: record.problem_id,
        })));
      })
      .catch(() => undefined);
  }, [apiUrl]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    await fetch(`${apiUrl}/notifications/read-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ citizen_name: currentUser.name }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markOneRead = async (id: number | string) => {
    await fetch(`${apiUrl}/notifications/${id}/read`, { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

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

      {unreadCount > 0 && (
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

      {notifications.some((n) => n.isRead) && (
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

      {notifications.length === 0 && (
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

  function openNotification(notification: Notification) {
    void markOneRead(notification.id);
    window.location.href = notification.problemId
      ? `/my-problems?problemId=${encodeURIComponent(notification.problemId)}`
      : "/my-problems";
  }
}

function formatNotificationTime(createdAt?: string) {
  if (!createdAt) return "Recently";
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
  if (elapsedMinutes < 1) return "Just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} hr ago`;
  return `${Math.floor(elapsedHours / 24)} day ago`;
}
