interface StatsCardProps {
  label: string;
  value: number | string;
  sublabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  trend?: number;
}

const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "text-emerald-500" },
  red: { bg: "bg-red-50", text: "text-red-600", icon: "text-red-500" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", icon: "text-amber-500" },
  blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "text-blue-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", icon: "text-purple-500" },
  slate: { bg: "bg-slate-50", text: "text-slate-600", icon: "text-slate-500" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", icon: "text-indigo-500" },
};

export default function StatsCard({ label, value, sublabel, icon: Icon, color, trend }: StatsCardProps) {
  const c = colorMap[color] || colorMap.slate;
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-0.5 text-xs text-slate-400">{sublabel}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}>
          <Icon size={20} className={c.icon} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          <span className={`text-xs font-semibold ${trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
}