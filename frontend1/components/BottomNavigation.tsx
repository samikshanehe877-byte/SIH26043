"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Search, PlusCircle, FileText, Bell } from "lucide-react";
import { currentUser } from "@/data/problems";

const navigation = [
  { name: "Home",     href: "/",             icon: Home       },
  { name: "Explore",  href: "/explore",       icon: Search     },
  { name: "Post",     href: "/post-problem",  icon: PlusCircle },
  { name: "Mine",     href: "/my-problems",   icon: FileText   },
  { name: "Alerts",   href: "/notifications", icon: Bell       },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    fetch(`${apiUrl}/notifications?citizen_name=${encodeURIComponent(currentUser.name)}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then((records) => setUnreadCount(Array.isArray(records) ? records.filter((record) => !record.is_read).length : 0))
      .catch(() => undefined);
  }, [apiUrl, pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-100 bg-white px-2 py-2 shadow-lg lg:hidden">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className="relative">
              <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
              {item.name === "Alerts" && unreadCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white" style={{ fontSize: "9px", fontWeight: 700 }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <span>{item.name}</span>
            {isActive && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-blue-600" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
