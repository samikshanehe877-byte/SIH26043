"use client";

import { Award, Briefcase } from "lucide-react";
import type { Availability, PersonCard as Person, PersonKind } from "@/lib/people";

export const KIND_LABEL: Record<PersonKind, string> = {
  student: "Student",
  faculty: "Faculty",
  mentor: "Mentor",
  employee: "Employee",
  expert: "Expert",
};

const KIND_STYLE: Record<PersonKind, string> = {
  student: "bg-sky-50 text-sky-700",
  faculty: "bg-violet-50 text-violet-700",
  mentor: "bg-emerald-50 text-emerald-700",
  employee: "bg-slate-100 text-slate-700",
  expert: "bg-amber-50 text-amber-700",
};

const AVAILABILITY: Record<Availability, { label: string; style: string }> = {
  light: { label: "Available", style: "bg-green-50 text-green-700 border-green-200" },
  moderate: { label: "Limited capacity", style: "bg-amber-50 text-amber-700 border-amber-200" },
  full: { label: "Fully assigned", style: "bg-red-50 text-red-700 border-red-200" },
};

function initials(name: string) {
  return name
    .replace(/^(Dr|Prof)\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** One person under an organization: who they are, where they sit, and what they can help solve. */
export default function PersonCard({
  person,
  highlight,
  footer,
}: {
  person: Person;
  /** Skill and problem-area names to emphasise, e.g. the ones a problem needs. */
  highlight?: ReadonlySet<string>;
  footer?: React.ReactNode;
}) {
  const skills = person.skills.slice(0, 5);
  const domains = person.domains.slice(0, 3);
  const availability = person.availability ? AVAILABILITY[person.availability] : null;
  const isHit = (name: string) => highlight?.has(name.toLowerCase()) ?? false;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
          {initials(person.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-slate-900">{person.name}</p>
          <p className="truncate text-sm text-slate-500">{person.title}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${KIND_STYLE[person.kind]}`}>
          {KIND_LABEL[person.kind]}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
        {person.unitName && (
          <span className="inline-flex items-center gap-1">
            <Briefcase size={12} /> {person.unitName}
          </span>
        )}
        {person.yearsExperience != null && (
          <span className="inline-flex items-center gap-1">
            <Award size={12} /> {person.yearsExperience} yrs experience
          </span>
        )}
        {availability && (
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${availability.style}`}>
            {availability.label}
            {person.currentLoad != null && person.maxCapacity != null && ` (${person.currentLoad}/${person.maxCapacity})`}
          </span>
        )}
      </div>

      {(person.specialization || person.bio) && (
        <p className="mt-3 line-clamp-2 text-sm text-slate-600">{person.specialization ?? person.bio}</p>
      )}

      {domains.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Problem areas</p>
          <div className="flex flex-wrap gap-1.5">
            {domains.map((d) => {
              const label = d.subdomain ?? d.domain;
              return (
                <span
                  key={`${d.domain}/${d.subdomain}`}
                  title={`${d.domain}${d.subdomain ? ` / ${d.subdomain}` : ""} (${d.proficiency}/5)`}
                  className={`rounded-lg px-2 py-1 text-xs font-medium ${
                    isHit(label) || isHit(d.domain) ? "bg-emerald-100 text-emerald-800" : "bg-indigo-50 text-indigo-700"
                  }`}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s.name}
                title={`Proficiency ${s.proficiency}/5`}
                className={`rounded-lg px-2 py-1 text-xs font-medium ${
                  isHit(s.name) ? "bg-emerald-100 text-emerald-800" : "bg-slate-50 text-slate-600"
                }`}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {footer && <div className="mt-auto pt-4">{footer}</div>}
    </div>
  );
}
