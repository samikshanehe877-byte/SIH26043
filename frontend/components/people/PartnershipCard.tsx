"use client";

import { ArrowRight, Building2, CircleAlert, GraduationCap, Handshake, TrendingUp } from "lucide-react";
import type { Partnership } from "@/lib/teamMatches";

function OrgIcon({ type }: { type: "university" | "industry" }) {
  return type === "university" ? <GraduationCap size={14} /> : <Building2 size={14} />;
}

/**
 * Two organizations proposed together, because neither covers the problem on its own.
 *
 * The card leads with the gain over the stronger side alone: that number is the whole reason to
 * involve a second organization, and without it a partnership just looks like a longer list of
 * names. Each side shows only what it uniquely brings to *this* pairing, which is why the same
 * organization can read differently next to a different partner.
 */
export default function PartnershipCard({ pair, rank }: { pair: Partnership; rank: number }) {
  const [first, second] = pair.organizations;
  const percent = Math.round(pair.coverage * 100);
  const uplift = Math.round(pair.uplift * 100);

  return (
    <article className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">#{rank}</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-900">
            <Handshake size={15} /> Better together
          </span>
          {pair.cross_type && (
            <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              University + Industry
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold leading-none text-emerald-900">{percent}%</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <TrendingUp size={11} /> +{uplift} pts vs {Math.round(pair.best_alone * 100)}% alone
          </p>
        </div>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        {[first, second].map((org, index) => (
          <div key={org.org_id} className={index === 1 ? "sm:col-start-3" : undefined}>
            <p className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-800">
              <OrgIcon type={org.org_type} /> {org.name}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">{Math.round(org.coverage_alone * 100)}% on its own</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {org.brings.map((label) => (
                <span key={label} className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                  {label}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div className="hidden text-emerald-400 sm:col-start-2 sm:block">
          <ArrowRight size={16} />
        </div>
      </div>

      {pair.missing.length > 0 && (
        <p className="mb-3 flex items-center gap-1.5 text-xs text-slate-600">
          <CircleAlert size={13} className="text-amber-500" /> Even together, nobody covers {pair.missing.join(", ")}.
        </p>
      )}

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Joint team</p>
      <ul className="space-y-1.5">
        {pair.team.map((member) => (
          <li key={member.id} className="flex flex-wrap items-baseline gap-x-2 text-sm">
            <span className="font-semibold text-slate-800">{member.name}</span>
            <span className="text-xs capitalize text-slate-500">{member.kind}</span>
            <span className="text-xs text-slate-400">· {member.org_name}</span>
            <span className="text-xs text-emerald-700">
              {member.brings && member.brings.length > 0 ? member.brings.join(", ") : "supporting"}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
