"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Search, PlusCircle, FileText, Bell, User, Settings, LogOut,
} from "lucide-react";
import { currentUser } from "@/data/problems";
import { notifications } from "@/data/problems";

const navigation = [
  { name: "Home",             href: "/",             icon: Home       },
  { name: "Explore Problems", href: "/explore",       icon: Search     },
  { name: "Post a Problem",   href: "/post-problem",  icon: PlusCircle },
  { name: "My Problems",      href: "/my-problems",   icon: FileText   },
  { name: "Notifications",    href: "/notifications", icon: Bell       },
  { name: "Profile",          href: "/profile",       icon: User       },
  { name: "Settings",         href: "/settings",      icon: Settings   },
];

export default function Sidebar() {
  const pathname = usePathname();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-slate-100 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
          <span className="text-sm font-black text-white">ST</span>
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900">SolveTogether</h1>
          <p className="text-xs text-slate-400">Citizen Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"} />
              <span className="flex-1">{item.name}</span>
              {item.name === "Notifications" && unreadCount > 0 && (
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${isActive ? "bg-white text-blue-600" : "bg-red-500 text-white"}`}>
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="border-t border-slate-100 p-4">
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-sm">
            {currentUser.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">{currentUser.name}</p>
            <p className="text-xs text-blue-500 font-medium">{currentUser.role}</p>
          </div>
        </div>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-500">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
