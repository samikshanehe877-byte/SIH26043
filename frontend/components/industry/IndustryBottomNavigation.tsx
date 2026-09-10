"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Handshake,
  PieChart,
  Bell,
} from "lucide-react";
import { useIndustry } from "@/context/IndustryContext";

const navItems = [
  { name: "Home",       href: "/industry",               icon: LayoutDashboard },
  { name: "Requests",   href: "/industry/requests",      icon: Inbox           },
  { name: "Collab",     href: "/industry/collaborations",icon: Handshake       },
  { name: "Impact",     href: "/industry/impact",        icon: PieChart        },
  { name: "Alerts",     href: "/industry/notifications", icon: Bell            },
];

export default function IndustryBottomNavigation() {
  const pathname = usePathname();
  const { unreadNotificationsCount } = useIndustry();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-1 py-1.5 shadow-lg lg:hidden">
      {navItems.map(({ name, href, icon: Icon }) => {
        const isActive =
          pathname === href ||
          (href !== "/industry" && pathname.startsWith(href));

        return (
          <Link
            key={name}
            href={href}
            className={`relative flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1 text-[11px] font-medium transition-all ${
              isActive
                ? "text-blue-700 font-semibold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className="relative">
              <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
              {name === "Alerts" && unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
            <span>{name}</span>
            {isActive && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-blue-600" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
