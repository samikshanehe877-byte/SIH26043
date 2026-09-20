"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home, Search, PlusCircle, FileText, Bell, User, Settings, LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProjectsNavSection from "@/components/workspace/ProjectsNavSection";
import { useLanguage } from "@/context/LanguageContext";

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
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const { language } = useLanguage();
  const hindi = language === "Hindi";

  const tr = (english: string, hindiText: string) =>
    hindi ? hindiText : english;

  const navigationHindi: Record<string, string> = {
    Home: "होम",
    "Explore Problems": "समस्याएँ देखें",
    "Post a Problem": "समस्या दर्ज करें",
    "My Problems": "मेरी समस्याएँ",
    Notifications: "सूचनाएँ",
    Profile: "प्रोफ़ाइल",
    Settings: "सेटिंग्स",
  };

  useEffect(() => {
    if (!user) return;

    fetch(
      `${apiUrl}/notifications?citizen_name=${encodeURIComponent(user.name)}&audience=citizen`,
      { cache: "no-store" }
    )
      .then((response) => (response.ok ? response.json() : []))
      .then((records) =>
        setUnreadCount(
          Array.isArray(records)
            ? records.filter((record) => !record.is_read).length
            : 0
        )
      )
      .catch(() => undefined);
  }, [apiUrl, pathname, user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  // While auth is resolving show a skeleton so the layout doesn't shift
  if (isLoading) {
    return (
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 shrink-0 flex-col border-r border-slate-100 bg-white shadow-sm lg:flex">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
            <span className="text-sm font-black text-white">ST</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">SolveTogether</h1>
            <p className="text-xs text-slate-400">
              {tr("Citizen Portal", "सिटीजन पोर्टल")}
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navigation.map((item) => (
            <div
              key={item.name}
              className="mx-1 my-0.5 h-10 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="h-14 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </aside>
    );
  }

  // Auth resolved but no user — middleware will redirect
  if (!user) return null;

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 shrink-0 flex-col border-r border-slate-100 bg-white shadow-sm lg:flex">

      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
          <span className="text-sm font-black text-white">ST</span>
        </div>

        <div>
          <h1 className="text-base font-bold text-slate-900">
            SolveTogether
          </h1>
          <p className="text-xs text-slate-400">
            {tr("Citizen Portal", "सिटीजन पोर्टल")}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

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
              <Icon
                size={18}
                className={
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-blue-500"
                }
              />

              <span className="flex-1">
                {hindi ? navigationHindi[item.name] : item.name}
              </span>

              {item.name === "Notifications" && unreadCount > 0 && (
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                    isActive
                      ? "bg-white text-blue-600"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}

        <ProjectsNavSection
          partyType="citizen"
          basePath=""
          accent="blue"
          label={tr("Workspaces", "वर्कस्पेस")}
          emptyText={tr(
            "Opens once you accept a volunteer",
            "स्वयंसेवक स्वीकार करने के बाद खुलेगा"
          )}
        />
      </nav>

      {/* User profile */}
      <div className="border-t border-slate-100 p-4">
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              {user.name}
            </p>

            <p className="text-xs font-medium text-blue-500">
              {tr("Citizen", "नागरिक")}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={16} />
          {tr("Logout", "लॉग आउट")}
        </button>
      </div>
    </aside>
  );
}