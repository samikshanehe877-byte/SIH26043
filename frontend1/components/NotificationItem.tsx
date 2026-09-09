import { CheckCircle2, Info, AlertTriangle, RefreshCw } from "lucide-react";
import { Notification } from "@/types/problem";

const config = {
  success: { icon: CheckCircle2, bg: "bg-green-50",  iconColor: "text-green-500",  border: "border-green-100" },
  info:    { icon: Info,         bg: "bg-blue-50",   iconColor: "text-blue-500",   border: "border-blue-100"  },
  warning: { icon: AlertTriangle,bg: "bg-amber-50",  iconColor: "text-amber-500",  border: "border-amber-100" },
  update:  { icon: RefreshCw,    bg: "bg-purple-50", iconColor: "text-purple-500", border: "border-purple-100"},
};

export default function NotificationItem({ notification }: { notification: Notification }) {
  const { icon: Icon, bg, iconColor, border } = config[notification.type];

  return (
    <div
      className={`flex gap-4 rounded-2xl border p-4 transition hover:shadow-sm ${
        notification.isRead
          ? "border-slate-100 bg-white"
          : `${border} ${bg}`
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
        {notification.problemTitle && (
          <p className="mt-1.5 text-xs font-medium text-blue-600">
            Re: {notification.problemTitle}
          </p>
        )}
      </div>
    </div>
  );
}
