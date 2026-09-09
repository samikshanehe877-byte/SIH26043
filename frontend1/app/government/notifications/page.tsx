import { Bell, CheckCircle2, Clock, Shield } from "lucide-react";
import { verificationQueue } from "@/data/governmentData";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-emerald-600">Government Portal</p>
        <h1 className="text-3xl font-bold text-slate-900">Notification Center</h1>
        <p className="mt-1 text-sm text-slate-500">Review verification requests and important platform updates.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5"><Bell className="text-blue-600" size={20} /><p className="mt-3 text-2xl font-bold text-slate-900">{verificationQueue.length}</p><p className="text-sm text-slate-500">Pending verifications</p></div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5"><CheckCircle2 className="text-green-600" size={20} /><p className="mt-3 text-2xl font-bold text-slate-900">12</p><p className="text-sm text-slate-500">Verified today</p></div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5"><Clock className="text-amber-600" size={20} /><p className="mt-3 text-2xl font-bold text-slate-900">3</p><p className="text-sm text-slate-500">Requiring escalation</p></div>
      </div>
      <section className="rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Verification Queue</h2>
        <div className="mt-4 space-y-3">
          {verificationQueue.map((request) => (
            <div key={request.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <Shield className="shrink-0 text-emerald-600" size={18} />
              <div className="min-w-0 flex-1"><p className="truncate font-medium text-slate-900">{request.problemTitle}</p><p className="text-sm text-slate-500">{request.priority} priority</p></div>
              <span className="text-xs text-slate-500">{request.dateSubmitted}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
