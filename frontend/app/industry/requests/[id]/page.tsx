"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CollaborationRequestList from "@/components/workspace/CollaborationRequestList";
import { useIndustry } from "@/context/IndustryContext";
import { apiJson, CollaborationRequestRecord, useParty } from "@/lib/projects";

/** One collaboration request, opened from the dashboard or an alert. */
export default function IndustryRequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { partyName } = useParty("industry");
  const { refreshRequests } = useIndustry();
  const [request, setRequest] = useState<CollaborationRequestRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setRequest(await apiJson<CollaborationRequestRecord>(`/collaboration-requests/${id}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request not found");
    }
  }, [id]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const isMine = request && partyName && request.industry_name === partyName;

  return (
    <div className="max-w-3xl space-y-5 pb-12">
      <Link href="/industry/requests" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800">
        <ArrowLeft size={16} /> Back to Requests
      </Link>

      {error && <div className="p-8 text-center text-slate-500">{error}</div>}
      {!error && !request && <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />}
      {request && !isMine && partyName && (
        <div className="p-8 text-center text-slate-500">This request was not sent to your company.</div>
      )}
      {request && isMine && (
        <CollaborationRequestList
          requests={[request]}
          viewerType="industry"
          viewerName={partyName}
          workspaceBasePath="/industry"
          onChanged={() => {
            void load();
            refreshRequests();
          }}
        />
      )}
    </div>
  );
}
