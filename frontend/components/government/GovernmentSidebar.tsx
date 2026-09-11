"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  FolderKanban,
  BarChart3,
  Map,
  Users,
  Bell,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { currentOfficial } from "@/data/governmentData";

const navItems = [
  { name: "Dashboard", href: "/government", icon: LayoutDashboard },
  { name: "Verification Queue", href: "/government/verify", icon: ShieldCheck },
  { name: "Project Monitoring", href: "/government/projects", icon: FolderKanban },
  { name: "Impact Analytics", href: "/government/analytics", icon: BarChart3 },
  { name: "Regional Map", href: "/government/map", icon: Map },
  { name: "Solver Network", href: "/government/solvers", icon: Users },
  { name: "Notifications", href: "/government/notifications", icon: Bell },
  { name: "My Profile", href: "/government/profile", icon: UserCircle },
  { name: "Settings", href: "/government/settings", icon: Settings },
];

export default function GovernmentSidebar() {
  const pathname = usePathname();
  const unread = 3;

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-slate-100 bg-white shadow-sm z-40">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 shadow-sm">
          <span className="text-xs font-black text-white">MAH</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 leading-tight">Maharashtra</h1>
          <p className="text-xs text-emerald-500 font-medium">Government Portal</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/government" && pathname.startsWith(href));
          return (
            <Link
              key={name}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
              }`}
            >
              <Icon
                size={17}
                className={isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-500"}
              />
              <span className="flex-1">{name}</span>
              {name === "Verification Queue" && unread > 0 && (
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                    isActive ? "bg-white text-emerald-600" : "bg-red-500 text-white"
                  }`}
                >
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-bold text-white shadow-sm">
            {currentOfficial.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              {currentOfficial.name}
            </p>
            <p className="text-xs text-emerald-500 font-medium">{currentOfficial.role}</p>
          </div>
        </div>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-500">
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}