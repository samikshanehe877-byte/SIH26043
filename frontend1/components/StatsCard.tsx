import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: "blue" | "amber" | "green" | "purple";
  sublabel?: string;
}

const colorMap = {
  blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   value: "text-blue-700"  },
  amber:  { bg: "bg-amber-50",  icon: "text-amber-600",  value: "text-amber-700" },
  green:  { bg: "bg-green-50",  icon: "text-green-600",  value: "text-green-700" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", value: "text-purple-700"},
};

export default function StatsCard({ label, value, icon: Icon, color, sublabel }: StatsCardProps) {
  const c = colorMap[color];
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${c.bg}`}>
        <Icon size={22} className={c.icon} />
      </div>
      <div>
        <p className={`text-2xl font-bold ${c.value}`}>{value}</p>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        {sublabel && <p className="text-xs text-slate-400">{sublabel}</p>}
      </div>
    </div>
  );
}
