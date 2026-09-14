"use client";

import { useState } from "react";
import { Bell, TrendingUp, FileText, Clock, CheckCircle2, Search, Plus, LayoutDashboard, MapPin, History, Settings, LogOut, User, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProblems } from "@/context/ProblemsContext";
import ProblemCard from "@/components/ProblemCard";
import ProblemDetails from "@/components/ProblemDetails";
import StatsCard from "@/components/StatsCard";
import { Problem } from "@/types/problem";

const TRENDING = [
  { name: "Infrastructure", count: 142, color: "bg-slate-100 text-slate-700" },
  { name: "Environment", count: 118, color: "bg-green-50 text-green-700" },
  { name: "Public Safety", count: 96, color: "bg-orange-50 text-orange-700" },
  { name: "Water and Sanitation", count: 87, color: "bg-blue-50 text-blue-700" },
];

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard", badge: null },
  { href: "/explore", icon: MapPin, label: "Explore", badge: null },
  { href: "/my-problems", icon: FileText, label: "My Problems", badge: 0 },
  { href: "/post-problem", icon: Plus, label: "Post Problem", badge: null },
  { href: "/notifications", icon: Bell, label: "Notifications", badge: 3 },
  { href: "/settings", icon: Settings, label: "Settings", badge: null },
];

export default function CitizenDashboard() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const { problems, myProblems, toggleSupport, toggleSave, isLoading: problemsLoading } = useProblems();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authLoading || problemsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push("/signin?callbackUrl=/");
    return null;
  }

  const dashboardProblems = Array.from(
    new Map([...myProblems, ...problems].map((problem) => [String(problem.id), problem])).values()
  );
  const filtered = dashboardProblems.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  const myProblemsCount = myProblems.length;
  const inProgressCount = myProblems.filter((p) =>
    ["Under Review", "Assigned to University", "In Progress", "Collaboration with Industry"].includes(p.status)
  ).length;
  const completedCount = myProblems.filter((p) => p.status === "Completed").length;

  const navItems = NAV_ITEMS.map(item => 
    item.label === "My Problems" ? { ...item, badge: myProblemsCount } : item
  );

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 transform bg-white border-r border-slate-200 lg:translate-x-0 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold text-lg text-slate-900">SolveTogether</span>
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  item.href === "/" 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge !== null && item.badge > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Bottom - Logout */}
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2 flex-1">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-lg text-slate-900">SolveTogether</span>
          </Link>
          <Link
            href="/notifications"
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </Link>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-8">
          {/* Welcome header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-slate-500">Welcome back,</p>
              <h1 className="text-2xl font-bold text-slate-900">
                {user.name} 👋
              </h1>
            </div>
            <Link
              href="/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-blue-50 hover:text-blue-600"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </Link>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems around you..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Section heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-slate-800">Discover Problems Around You</h2>
            <Link
              href="/explore"
              className="text-sm font-semibold text-blue-600 transition hover:underline"
            >
              View All →
            </Link>
          </div>

          {/* Feed */}
          <div className="space-y-4 mb-8">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm">
                <p className="text-slate-400">No problems found matching your search.</p>
              </div>
            ) : (
              filtered.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onViewDetails={setSelectedProblem}
                  onToggleSupport={toggleSupport}
                  onToggleSave={toggleSave}
                />
              ))
            )}
          </div>

          {/* Right sidebar content - Stats & Trending */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:col-span-3">
            {/* Stats */}
            <div className="lg:col-span-1 space-y-5">
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Your Impact</h3>
                <div className="space-y-3">
                  <StatsCard
                    label="Problems Submitted"
                    value={myProblemsCount}
                    icon={FileText}
                    color="blue"
                    sublabel="Total reported"
                  />
                  <StatsCard
                    label="In Progress"
                    value={inProgressCount}
                    icon={Clock}
                    color="amber"
                    sublabel="Being worked on"
                  />
                  <StatsCard
                    label="Problems Solved"
                    value={completedCount}
                    icon={CheckCircle2}
                    color="green"
                    sublabel="Successfully resolved"
                  />
                </div>
              </div>

              {/* Trending categories */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-800">Trending Categories</h3>
                </div>
                <div className="space-y-2.5">
                  {TRENDING.map((cat, i) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 text-xs font-bold text-slate-400">#{i + 1}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cat.color}`}>
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{cat.count} posts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation (Mobile) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white">
          <div className="grid grid-cols-3 gap-1 px-2 py-2">
            {[
              { href: "/", icon: LayoutDashboard, label: "Home" },
              { href: "/explore", icon: MapPin, label: "Explore" },
              { href: "/post-problem", icon: Plus, label: "Post" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </main>

      {/* Problem details modal */}
      {selectedProblem && (
        <ProblemDetails
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onToggleSupport={(id) => {
            toggleSupport(id);
            setSelectedProblem((prev) =>
              prev?.id === id
                ? { ...prev, isSupported: !prev.isSupported, supporters: prev.isSupported ? prev.supporters - 1 : prev.supporters + 1 }
                : prev
            );
          }}
        />
      )}
    </div>
  );
}