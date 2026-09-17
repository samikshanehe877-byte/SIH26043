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
import { universityCoordinator } from "@/data/universityAppData";
import { getOrganizationName, useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Dashboard",            href: "/university",                     icon: LayoutDashboard },
  { name: "Assigned Challenges",  href: "/university/assigned-challenges", icon: ClipboardList   },
  { name: "Departments",          href: "/university/departments",         icon: Building2       },
  { name: "Mentors",              href: "/university/mentors",             icon: Users           },
  { name: "Notifications",        href: "/university/notifications",       icon: Bell            },
  { name: "University Profile",   href: "/university/profile",            icon: UserCircle      },
  { name: "Settings",             href: "/university/settings",           icon: Settings        },
  { name: "Dashboard",           href: "/university",                     icon: LayoutDashboard },
  { name: "Assigned Challenges", href: "/university/assigned-challenges", icon: ClipboardList   },
  { name: "Departments",         href: "/university/departments",         icon: Building2       },
  { name: "Mentors",             href: "/university/mentors",             icon: Users           },
  { name: "Notifications",       href: "/university/notifications",       icon: Bell            },
  { name: "University Profile",  href: "/university/profile",            icon: UserCircle      },
  { name: "Settings",            href: "/university/settings",           icon: Settings        },
];

export default function UniversitySidebar() {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [unread, setUnread] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    if (!user) return;
    fetch(`${apiUrl}/notifications?citizen_name=${encodeURIComponent(getOrganizationName(user))}&audience=university`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then((records) => setUnread(Array.isArray(records) ? records.filter((record: any) => !record.is_read).length : 0))
      .catch(() => undefined);
  }, [apiUrl, pathname, user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  // Skeleton while auth loads
  if (isLoading) {
    return (
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-slate-100 bg-white shadow-sm z-40">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
            <span className="text-xs font-black text-white">U</span>
          </div>
          <div>
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-1 h-3 w-20 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
          {navItems.map((item) => (
            <div key={item.name} className="mx-1 my-0.5 h-10 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </aside>
    );
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-slate-100 bg-white shadow-sm z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
          <span className="text-xs font-black text-white">{initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-bold text-slate-900 leading-tight">{user.name}</h1>
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
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              {universityCoordinator.name}
            </p>
            <p className="text-xs text-indigo-500 font-medium">{universityCoordinator.role}</p>
            <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-indigo-500 font-medium">University Coordinator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}
