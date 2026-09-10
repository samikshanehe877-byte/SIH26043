"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Users,
  CheckSquare,
  MessageSquare,
  FolderOpen,
  TrendingUp,
  Bot,
  BookOpen,
  Award,
  FileBadge,
  Bell,
  UserCircle2,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useStudent } from "@/context/StudentContext";

const navItems = [
  { name: "Dashboard",       href: "/student",               icon: LayoutDashboard },
  { name: "My Challenge",    href: "/student/challenge",     icon: Target          },
  { name: "My Team",         href: "/student/team",          icon: Users           },
  { name: "My Tasks",        href: "/student/tasks",         icon: CheckSquare     },
  { name: "Team Chat",       href: "/student/chat",          icon: MessageSquare   },
  { name: "Shared Files",    href: "/student/files",         icon: FolderOpen      },
  { name: "Project Progress",href: "/student/progress",      icon: TrendingUp      },
  { name: "AI Assistant",    href: "/student/ai-assistant",  icon: Bot             },
  { name: "Resources",       href: "/student/resources",     icon: BookOpen        },
  { name: "Achievements",    href: "/student/achievements",  icon: Award           },
  { name: "Certificates",    href: "/student/certificates",  icon: FileBadge       },
  { name: "Notifications",   href: "/student/notifications", icon: Bell            },
  { name: "Profile",         href: "/student/profile",       icon: UserCircle2     },
  { name: "Settings",        href: "/student/settings",      icon: Settings        },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const { profile, unreadNotificationsCount } = useStudent();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-slate-100 bg-white shadow-sm z-40">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-sm text-white">
          <Sparkles size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-bold text-slate-900 leading-tight truncate">
            SolveTogether
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
            <span>Student Portal</span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="text-[11px] font-normal text-slate-400">SIH</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Main Menu
        </div>
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/student" && pathname.startsWith(href));

          return (
            <Link
              key={name}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-indigo-50/70 hover:text-indigo-700"
              }`}
            >
              <Icon
                size={18}
                className={
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-indigo-600"
                }
              />
              <span className="flex-1 truncate">{name}</span>
              {name === "Notifications" && unreadNotificationsCount > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                    isActive ? "bg-white text-indigo-700" : "bg-red-500 text-white"
                  }`}
                >
                  {unreadNotificationsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Student Profile / Footer */}
      <div className="border-t border-slate-100 p-4">
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100/80">
          <div className="relative">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-xs font-bold text-white shadow-sm" 
            />
            {/* Online Status Indicator */}
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500"
              title="Online Active"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-xs font-bold text-slate-800">
                {profile.name}
              </p>
            </div>
            <p className="truncate text-[11px] text-slate-500 font-medium">
              {profile.department}
            </p>
            <p className="truncate text-[10px] text-indigo-600 font-medium">
              {profile.year}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            alert("Logging out from Student Portal...");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={14} />
          Logout Session
        </button>
      </div>
    </aside>
  );
}

