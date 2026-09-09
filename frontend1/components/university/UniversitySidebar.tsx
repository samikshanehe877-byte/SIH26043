"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  Users,
  Bell,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { universityCoordinator, universityNotifications } from "@/data/universityAppData";

const navItems = [
  { name: "Dashboard",            href: "/university",                     icon: LayoutDashboard },
  { name: "Assigned Challenges",  href: "/university/assigned-challenges", icon: ClipboardList   },
  { name: "Departments",          href: "/university/departments",         icon: Building2       },
  { name: "Mentors",              href: "/university/mentors",             icon: Users           },
  { name: "Notifications",        href: "/university/notifications",       icon: Bell            },
  { name: "University Profile",   href: "/university/profile",            icon: UserCircle      },
  { name: "Settings",             href: "/university/settings",           icon: Settings        },
];

export default function UniversitySidebar() {
  const pathname = usePathname();
  const unread = universityNotifications.filter((n) => !n.isRead).length;

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-slate-100 bg-white shadow-sm z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
          <span className="text-xs font-black text-white">BVU</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 leading-tight">Bharati Vidyapeeth</h1>
          <p className="text-xs text-indigo-500 font-medium">University Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/university" && pathname.startsWith(href));
          return (
            <Link
              key={name}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              <Icon
                size={17}
                className={isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500"}
              />
              <span className="flex-1">{name}</span>
              {name === "Notifications" && unread > 0 && (
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                    isActive ? "bg-white text-indigo-600" : "bg-red-500 text-white"
                  }`}
                >
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-slate-100 p-4">
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-xs font-bold text-white shadow-sm">
            {universityCoordinator.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              {universityCoordinator.name}
            </p>
            <p className="text-xs text-indigo-500 font-medium">{universityCoordinator.role}</p>
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
