"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Search, Users } from "lucide-react";
import PersonCard, { KIND_LABEL } from "@/components/people/PersonCard";
import type { OrganizationPeople, PersonKind } from "@/lib/people";

/**
 * The card view of an organization's people, read live from the database through
 * /api/organization/people. Adding a person or a unit to the database makes a new card appear here
 * with no frontend change. Filters are client-side: an organization has tens of people, not thousands.
 */
export default function PeopleDirectory({ orgType, orgId }: { orgType?: "university" | "industry"; orgId?: string }) {
  const [data, setData] = useState<OrganizationPeople | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [unit, setUnit] = useState("");
  const [kind, setKind] = useState<PersonKind | "">("");

  useEffect(() => {
    let cancelled = false;
    const query = orgType && orgId ? `?type=${orgType}&id=${encodeURIComponent(orgId)}` : "";
    fetch(`/api/organization/people${query}`, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error ?? `Request failed (${response.status})`);
        if (!cancelled) setData(body as OrganizationPeople);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load people");
      });
    return () => {
      cancelled = true;
    };
  }, [orgType, orgId]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.people.filter((p) => {
      if (unit && p.unitId !== unit) return false;
      if (kind && p.kind !== kind) return false;
      if (!q) return true;
      return [p.name, p.title, p.specialization ?? "", ...p.skills.map((s) => s.name), ...p.domains.flatMap((d) => [d.domain, d.subdomain ?? ""])]
        .some((text) => text.toLowerCase().includes(q));
    });
  }, [data, search, unit, kind]);

  if (error) return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  const kindsPresent = Array.from(new Set(data.people.map((p) => p.kind)));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="text-lg font-bold text-slate-900">{data.organization.name}</p>
          <p className="text-sm text-slate-500">{[data.organization.district, data.organization.state].filter(Boolean).join(", ")}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
          <Users size={15} /> {data.organization.memberCount} people
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
          <Building2 size={15} /> {data.organization.units.length} {data.organization.type === "university" ? "departments" : "business units"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, skill or problem area"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400"
        >
          <option value="">All {data.organization.type === "university" ? "departments" : "units"}</option>
          {data.organization.units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.memberCount})
            </option>
          ))}
        </select>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as PersonKind | "")}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400"
        >
          <option value="">All roles</option>
          {kindsPresent.map((k) => (
            <option key={k} value={k}>
              {KIND_LABEL[k]}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-14 text-center text-sm text-slate-500">
          No one matches these filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((person) => (
            <PersonCard key={`${person.kind}-${person.id}`} person={person} />
          ))}
        </div>
      )}
    </div>
  );
}
