"use client";

import { CheckCircle2 } from "lucide-react";
import { regionalStats } from "@/data/governmentData";

export default function AnalyticsPage() {
  return (
    <div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <CheckCircle2 size={16} />
          </div>
          <span className="text-sm text-slate-500">Verified Problems</span>
          <p className="text-2xl font-bold text-slate-900">{regionalStats.verified}</p>
          <p className="text-sm text-slate-500">Successfully verified & validated</p>
        </div>
      </div>
    </div>
  );
}