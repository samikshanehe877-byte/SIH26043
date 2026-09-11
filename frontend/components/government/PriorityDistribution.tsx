import { regionalStats, domainClusters } from "@/data/governmentData";

export default function PriorityDistribution() {
  const total = regionalStats.critical + regionalStats.high + regionalStats.medium + regionalStats.low;
  const items = [
    { label: "Critical", value: regionalStats.critical, color: "bg-red-500", pct: Math.round((regionalStats.critical / total) * 100) },
    { label: "High", value: regionalStats.high, color: "bg-orange-500", pct: Math.round((regionalStats.high / total) * 100) },
    { label: "Medium", value: regionalStats.medium, color: "bg-amber-400", pct: Math.round((regionalStats.medium / total) * 100) },
    { label: "Low", value: regionalStats.low, color: "bg-slate-300", pct: Math.round((regionalStats.low / total) * 100) },
  ];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-slate-800">Priority Distribution</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">{item.label}</span>
              <span className="text-xs text-slate-500">
                {item.value} · {item.pct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}