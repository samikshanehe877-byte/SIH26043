import { LucideIcon } from "lucide-react";

interface UniversityStatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: "indigo" | "amber" | "green" | "red" | "purple" | "teal";
  sublabel?: string;
  trend?: string;
}

const colorMap = {
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", value: "text-indigo-700", border: "border-indigo-100" },
  amber:  { bg: "bg-amber-50",  icon: "text-amber-600",  value: "text-amber-700",  border: "border-amber-100"  },
  green:  { bg: "bg-green-50",  icon: "text-green-600",  value: "text-green-700",  border: "border-green-100"  },
  red:    { bg: "bg-red-50",    icon: "text-red-600",    value: "text-red-700",    border: "border-red-100"    },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", value: "text-purple-700", border: "border-purple-100" },
  teal:   { bg: "bg-teal-50",   icon: "text-teal-600",   value: "text-teal-700",   border: "border-teal-100"   },
};

export default function UniversityStatsCard({ label, value, icon: Icon, color, sublabel, trend }: UniversityStatsCardProps) {
  const c = colorMap[color];
  return (
    <div className={`flex items-center gap-4 rounded-2xl border ${c.border} bg-white p-4 shadow-sm transition hover:shadow-md`}>
      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${c.bg}`}>
        <Icon size={22} className={c.icon} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-2xl font-bold ${c.value}`}>{value}</p>
        <p className="text-sm font-medium text-slate-600 truncate">{label}</p>
        {sublabel && <p className="text-xs text-slate-400">{sublabel}</p>}
      </div>
      {trend && (
        <span className="flex-shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600">
          {trend}
        </span>
      )}
    </div>
  );
}
