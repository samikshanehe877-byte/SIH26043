"use client";

import { CheckCircle2, LifeBuoy } from "lucide-react";
import { KIND_LABEL } from "@/components/people/PersonCard";
import type { MatchedPerson } from "@/lib/teamMatches";

const ROLE_STYLE: Record<NonNullable<MatchedPerson["role_group"]>, string> = {
  guide: "bg-violet-50 text-violet-700",
  contributor: "bg-sky-50 text-sky-700",
};

function initials(name: string) {
  return name
    .replace(/^(Dr|Prof)\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * The people the AI would put on a problem, each with the role they'd play and what they bring:
 * green chips are needs they newly cover, grey ones are needs they can back up.
 */
export default function SuggestedTeam({ team }: { team: MatchedPerson[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {team.map((member) => (
        <li key={member.id} className="flex gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {initials(member.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2">
              <p className="truncate text-sm font-semibold text-slate-900">{member.name}</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ROLE_STYLE[member.role_group ?? "contributor"]}`}>
                {KIND_LABEL[member.kind]}
              </span>
            </div>
            {(member.role_in_team || member.unit_name) && (
              <p className="truncate text-xs text-slate-400">
                {member.role_in_team && <span className="font-semibold text-slate-600">{member.role_in_team}</span>}
                {member.role_in_team && member.unit_name && " - "}
                {member.unit_name}
              </p>
            )}
            {member.reason && <p className="mt-1 text-xs text-slate-600">{member.reason}</p>}
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {member.brings?.map((label) => (
                <span key={label} className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                  <CheckCircle2 size={10} /> {label}
                </span>
              ))}
              {member.supports?.map((label) => (
                <span key={label} className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                  <LifeBuoy size={10} /> backs up {label}
                </span>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
