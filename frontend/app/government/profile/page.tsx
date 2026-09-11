import { Mail, MapPin, ShieldCheck, UserCircle } from "lucide-react";
import { currentOfficial, regionalStats } from "@/data/governmentData";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <header><p className="text-sm font-medium text-emerald-600">Government Portal</p><h1 className="text-3xl font-bold text-slate-900">My Profile</h1><p className="mt-1 text-sm text-slate-500">Your official account and regional activity.</p></header>
      <section className="rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">{currentOfficial.avatar}</div><div><h2 className="text-xl font-semibold text-slate-900">{currentOfficial.name}</h2><p className="text-sm text-emerald-600">{currentOfficial.role}</p></div></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="flex items-center gap-3 text-sm text-slate-600"><UserCircle size={17} />{currentOfficial.designation}</div><div className="flex items-center gap-3 text-sm text-slate-600"><MapPin size={17} />Maharashtra</div><div className="flex items-center gap-3 text-sm text-slate-600"><Mail size={17} />Official government account</div><div className="flex items-center gap-3 text-sm text-slate-600"><ShieldCheck size={17} />Verified official</div></div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-100 bg-white p-5"><p className="text-2xl font-bold text-slate-900">{regionalStats.totalProblems}</p><p className="text-sm text-slate-500">Problems monitored</p></div><div className="rounded-2xl border border-slate-100 bg-white p-5"><p className="text-2xl font-bold text-slate-900">{regionalStats.verified}</p><p className="text-sm text-slate-500">Verified problems</p></div><div className="rounded-2xl border border-slate-100 bg-white p-5"><p className="text-2xl font-bold text-slate-900">{regionalStats.activeProjects}</p><p className="text-sm text-slate-500">Active projects</p></div></section>
    </div>
  );
}
