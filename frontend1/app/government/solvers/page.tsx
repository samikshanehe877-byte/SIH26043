import { CheckCircle2, Users, TrendingUp } from "lucide-react";
import { officials, regionalStats } from "@/data/governmentData";

export default function SolversPage() {
  return (
    <div className="space-y-6">
      <header><p className="text-sm font-medium text-emerald-600">Government Portal</p><h1 className="text-3xl font-bold text-slate-900">Solver Network</h1><p className="mt-1 text-sm text-slate-500">Monitor officials, coordinators, and active contributors.</p></header>
      <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-100 bg-white p-5"><Users className="text-blue-600" size={20} /><p className="mt-3 text-2xl font-bold text-slate-900">{regionalStats.totalSolvers}</p><p className="text-sm text-slate-500">Active solvers</p></div><div className="rounded-2xl border border-slate-100 bg-white p-5"><CheckCircle2 className="text-emerald-600" size={20} /><p className="mt-3 text-2xl font-bold text-slate-900">{regionalStats.verified}</p><p className="text-sm text-slate-500">Verified outcomes</p></div><div className="rounded-2xl border border-slate-100 bg-white p-5"><TrendingUp className="text-amber-600" size={20} /><p className="mt-3 text-2xl font-bold text-slate-900">42%</p><p className="text-sm text-slate-500">Quarterly growth</p></div></div>
      <section className="rounded-2xl border border-slate-100 bg-white p-6"><h2 className="text-xl font-semibold text-slate-900">Officials and Coordinators</h2><div className="mt-4 space-y-3">{officials.map((official) => <div key={official.name} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{official.avatar}</div><div className="min-w-0 flex-1"><p className="font-medium text-slate-900">{official.name}</p><p className="text-sm text-slate-500">{official.designation}</p></div><span className="text-xs text-slate-500">{official.activeAssignments} active</span></div>)}</div></section>
    </div>
  );
}
