"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Building2, Users, UserCircle } from "lucide-react";

const navItems = [
  { name: "Dashboard",   href: "/university",                     icon: LayoutDashboard },
  { name: "Challenges",  href: "/university/assigned-challenges", icon: ClipboardList   },
  { name: "Departments", href: "/university/departments",         icon: Building2       },
  { name: "Mentors",     href: "/university/mentors",             icon: Users           },
  { name: "Profile",     href: "/university/profile",            icon: UserCircle      },
];

export default function UniversityBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-100 bg-white px-2 py-2 shadow-lg lg:hidden">
      {navItems.map(({ name, href, icon: Icon }) => {
        const isActive =
          pathname === href ||
          (href !== "/university" && pathname.startsWith(href));
        return (
          <Link
            key={name}
            href={href}
            className={`relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />
            <span>{name}</span>
            {isActive && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-indigo-600" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
