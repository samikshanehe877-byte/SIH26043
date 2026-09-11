import { Bell, Lock, Settings, ShieldCheck } from "lucide-react";
import { currentOfficial } from "@/data/governmentData";

const settings = [
  { label: "Verification alerts", description: "New verification requests", icon: ShieldCheck },
  { label: "System updates", description: "Platform maintenance notices", icon: Settings },
  { label: "Account security", description: "Protect your official account", icon: Lock },
  { label: "Notification preferences", description: "Choose how alerts reach you", icon: Bell },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header><p className="text-sm font-medium text-emerald-600">Government Portal</p><h1 className="text-3xl font-bold text-slate-900">Government Settings</h1><p className="mt-1 text-sm text-slate-500">Configure preferences for {currentOfficial.name}.</p></header>
      <section className="rounded-2xl border border-slate-100 bg-white p-6"><h2 className="text-xl font-semibold text-slate-900">Preferences</h2><div className="mt-4 divide-y divide-slate-100">{settings.map(({ label, description, icon: Icon }) => <div key={label} className="flex items-center gap-3 py-4"><Icon className="text-emerald-600" size={19} /><div className="flex-1"><p className="font-medium text-slate-900">{label}</p><p className="text-sm text-slate-500">{description}</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Enabled</span></div>)}</div></section>
    </div>
  );
}
