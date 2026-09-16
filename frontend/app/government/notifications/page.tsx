"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle2, Clock, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [verifiedToday, setVerifiedToday] = useState(0);
  const [escalationCount, setEscalationCount] = useState(0);
  const [queue, setQueue] = useState<any[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    const fetchVerificationQueue = async () => {
      try {
        const response = await fetch(`${apiUrl}/problems?status=under_review&limit=500`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch problems");

        const problems = await response.json();
        setQueue(problems);
        setPendingCount(problems.length);

        // Count verified today
        const today = new Date().toDateString();
        const verifiedTodayCount = problems.filter((p: any) => {
          if (!p.verification_history) return false;
          return p.verification_history.some((h: any) => {
            const hDate = new Date(h.timestamp).toDateString();
            return hDate === today && h.decision === "approve";
          });
        }).length;
        setVerifiedToday(verifiedTodayCount);

        // Count requiring escalation (priority high/critical and under review)
        const escalation = problems.filter((p: any) => {
          const priority = p.priority?.level || p.priority;
          return priority === "high" || priority === "critical" || (p.supporters || 0) >= 100;
        }).length;
        setEscalationCount(escalation);
      } catch (error) {
        console.error("Failed to fetch verification queue:", error);
      }
    };

    fetchVerificationQueue();
  }, [apiUrl]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-emerald-600">Government Portal</p>
        <h1 className="text-3xl font-bold text-slate-900">Notification Center</h1>
        <p className="mt-1 text-sm text-slate-500">Review verification requests and important platform updates.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5"><Bell className="text-blue-600" size={20} /><p className="mt-3 text-2xl font-bold text-slate-900">{pendingCount}</p><p className="text-sm text-slate-500">Pending verifications</p></div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5"><CheckCircle2 className="text-green-600" size={20} /><p className="mt-3 text-2xl font-bold text-slate-900">{verifiedToday}</p><p className="text-sm text-slate-500">Verified today</p></div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5"><Clock className="text-amber-600" size={20} /><p className="mt-3 text-2xl font-bold text-slate-900">{escalationCount}</p><p className="text-sm text-slate-500">Requiring escalation</p></div>
      </div>
      <section className="rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Verification Queue</h2>
        <div className="mt-4 space-y-3">
          {queue.length > 0 ? (
            queue.map((request: any) => (
              <div key={request.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <Shield className="shrink-0 text-emerald-600" size={18} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{request.title || request.problem_text || "Untitled Problem"}</p>
                  <p className="text-sm text-slate-500">
                    {request.priority?.level || request.priority || "Medium"} priority
                  </p>
                </div>
                <span className="text-xs text-slate-500">
                  {request.date || request.created_at ? new Date(request.created_at || request.date).toLocaleDateString() : "Recently"}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-4">No pending verifications</p>
          )}
        </div>
      </section>
    </div>
  );
}
