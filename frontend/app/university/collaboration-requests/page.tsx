"use client";

import { useCallback, useEffect, useState } from "react";
import CollaborationRequestList from "@/components/workspace/CollaborationRequestList";
import { apiJson, CollaborationRequestRecord, useParty } from "@/lib/projects";

/** Collaboration requests between this university and industry partners, both directions. */
export default function UniversityCollaborationRequestsPage() {
  const { partyName } = useParty("university");
  const [requests, setRequests] = useState<CollaborationRequestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!partyName) return;
    try {
      setRequests(await apiJson<CollaborationRequestRecord[]>(
        `/collaboration-requests?university_name=${encodeURIComponent(partyName)}&limit=500`,
      ));
    } catch (error) {
      console.error("Failed to load collaboration requests:", error);
    } finally {
      setIsLoading(false);
    }
  }, [partyName]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const incoming = requests.filter((r) => r.requested_by === "industry");
  const outgoing = requests.filter((r) => r.requested_by === "university");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Collaboration Requests</h1>
        <p className="mt-1 text-sm text-slate-500">
          Industry partners leading a project can invite your university to join; accepting adds you to their workspace.
        </p>
      </div>

      {isLoading ? (
        <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <>
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Received from industry</h2>
            <CollaborationRequestList
              requests={incoming}
              viewerType="university"
              viewerName={partyName}
              onChanged={load}
              workspaceBasePath="/university"
              emptyText="No invitations from industry partners yet."
            />
          </section>
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sent by your university</h2>
            <CollaborationRequestList
              requests={outgoing}
              viewerType="university"
              viewerName={partyName}
              onChanged={load}
              workspaceBasePath="/university"
              emptyText="You have not invited any industry partners yet. Invite them from a project workspace."
            />
          </section>
        </>
      )}
    </div>
  );
}
