"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useMentor } from "@/context/MentorContext";

interface MentorHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function MentorHeader({
  title,
  subtitle,
  children,
}: MentorHeaderProps) {
  const { profile, unreadNotificationsCount } = useMentor();

  const defaultGreeting = `Good morning, ${profile.name}`;
  const defaultSubtitle =
    "Manage your assigned challenges, student teams and industry collaborations.";

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-5">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {title || defaultGreeting}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {subtitle || defaultSubtitle}
        </p>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
        {children}

        {/* Notification bell */}
        <Link
          href="/mentor/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700 shadow-sm"
          title="Notifications"
        >
          <Bell size={18} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
              {unreadNotificationsCount}
            </span>
          )}
        </Link>

        {/* Profile Link */}
        <Link
          href="/mentor/profile"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-[10px] font-bold text-white">
            {profile.avatar}
          </div>
          <span className="hidden md:inline">{profile.name}</span>
        </Link>
      </div>
    </header>
  );
}

