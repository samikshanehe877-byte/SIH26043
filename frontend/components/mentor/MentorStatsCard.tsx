import { LucideIcon } from "lucide-react";

interface MentorStatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: "emerald" | "blue" | "indigo" | "amber" | "rose" | "purple" | "teal";
  sublabel?: string;
  trend?: string;
}

const colorMap = {
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    value: "text-emerald-700",
    border: "border-emerald-100",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    value: "text-blue-700",
    border: "border-blue-100",
  },
  indigo: {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    value: "text-indigo-700",
    border: "border-indigo-100",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    value: "text-amber-700",
    border: "border-amber-100",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "text-rose-600",
    value: "text-rose-700",
    border: "border-rose-100",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    value: "text-purple-700",
    border: "border-purple-100",
  },
  teal: {
    bg: "bg-teal-50",
    icon: "text-teal-600",
    value: "text-teal-700",
    border: "border-teal-100",
  },
};

export default function MentorStatsCard({
  label,
  value,
  icon: Icon,
  color,
  sublabel,
  trend,
}: MentorStatsCardProps) {
  const c = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={`flex items-center gap-3.5 rounded-2xl border ${c.border} bg-white p-4 shadow-sm transition hover:shadow-md hover:border-slate-300/80`}
    >
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${c.bg}`}
      >
        <Icon size={22} className={c.icon} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-2xl font-black tracking-tight ${c.value}`}>
          {value}
        </p>
        <p className="truncate text-xs font-semibold text-slate-600">{label}</p>
        {sublabel && <p className="truncate text-[11px] text-slate-400">{sublabel}</p>}
      </div>
      {trend && (
        <span className="flex-shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-100">
          {trend}
        </span>
      )}
    </div>
  );
}

