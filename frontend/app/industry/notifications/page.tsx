"use client";

import { useIndustry } from "@/context/IndustryContext";
import { Check, Info, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { IndustryNotification } from "@/types/industry";

export default function IndustryNotificationsPage() {
  const { notifications, markNotificationAsRead } = useIndustry();

  const getIconConfig = (type: string) => {
    switch (type) {
      case "success": return { icon: CheckCircle2, bg: "bg-green-50", iconColor: "text-green-500", border: "border-green-100" };
      case "info": return { icon: Info, bg: "bg-blue-50", iconColor: "text-blue-500", border: "border-blue-100" };
      case "warning": return { icon: AlertTriangle, bg: "bg-amber-50", iconColor: "text-amber-500", border: "border-amber-100" };
      case "update": return { icon: RefreshCw, bg: "bg-purple-50", iconColor: "text-purple-500", border: "border-purple-100" };
      default: return { icon: Info, bg: "bg-slate-50", iconColor: "text-slate-500", border: "border-slate-100" };
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-slate-500">Stay updated on collaboration requests and project milestones.</p>
        </div>
        <button 
          onClick={() => {
            notifications.forEach(n => {
              if (!n.isRead) markNotificationAsRead(n.id);
            });
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <Check size={16} /> Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(notification => {
          const { icon: Icon, bg, iconColor, border } = getIconConfig(notification.type);
          
          return (
            <div
              key={notification.id}
              onClick={() => markNotificationAsRead(notification.id)}
              className={`flex gap-4 rounded-2xl border p-4 cursor-pointer transition hover:shadow-sm ${
                notification.isRead ? "border-slate-100 bg-white" : `${border} ${bg}`
              }`}
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={18} className={iconColor} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${notification.isRead ? "text-slate-700" : "text-slate-900"}`}>
                    {notification.title}
                  </p>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <span className="text-xs text-slate-400 whitespace-nowrap">{notification.timeAgo}</span>
                    {!notification.isRead && (
                      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-500 leading-relaxed">{notification.message}</p>
              </div>
            </div>
          );
        })}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-slate-500">No notifications.</div>
        )}
      </div>
    </div>
  );
}
