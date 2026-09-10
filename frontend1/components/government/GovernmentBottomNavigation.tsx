"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShieldCheck, FolderKanban, BarChart3, Map } from "lucide-react";

const items = [
  { name: "Dashboard", href: "/government", icon: LayoutDashboard },
  { name: "Verify", href: "/government/verify", icon: ShieldCheck },
  { name: "Projects", href: "/government/projects", icon: FolderKanban },
  { name: "Analytics", href: "/government/analytics", icon: BarChart3 },
  { name: "Map", href: "/government/map", icon: Map },
];

export default function GovernmentBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={name}
              href={href}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon size={20} className={isActive ? "text-emerald-600" : "text-slate-400"} />
              <span>{name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}