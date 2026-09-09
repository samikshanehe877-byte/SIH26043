"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, FileCheck, Handshake, Clock, Building2 } from "lucide-react";

interface AttentionItem {
  id: string;
  type: "review" | "collab" | "university" | "deadline";
  title: string;
  description: string;
  actionText: string;
  actionHref?: string;
  onAction?: () => void;
  urgency: "high" | "critical" | "medium";
}

interface AttentionCardProps {
  items: AttentionItem[];
}

export default function AttentionCard({ items }: AttentionCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "review":
        return <FileCheck size={18} className="text-purple-600" />;
      case "collab":
        return <Handshake size={18} className="text-indigo-600" />;
      case "university":
        return <Building2 size={18} className="text-emerald-600" />;
      default:
        return <Clock size={18} className="text-amber-600" />;
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-xs">
        <p className="text-xs font-semibold text-slate-500">
          No urgent blockers or reviews pending right now. Great job keeping everything on track!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <AlertCircle size={16} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Needs Your Attention ({items.length})
          </h2>
        </div>
        <span className="text-[11px] font-bold text-slate-400">Action Required</span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border p-3.5 transition hover:shadow-xs ${
              item.urgency === "critical"
                ? "border-rose-200 bg-rose-50/30"
                : item.urgency === "high"
                ? "border-amber-200 bg-amber-50/20"
                : "border-slate-200 bg-slate-50/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs border border-slate-100">
                {getIcon(item.type)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
              </div>
            </div>

            <div className="flex-shrink-0 sm:text-right">
              {item.actionHref ? (
                <Link
                  href={item.actionHref}
                  className="inline-flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight size={12} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={item.onAction}
                  className="inline-flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

