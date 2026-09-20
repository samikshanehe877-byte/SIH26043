"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AttachmentGallery from "./AttachmentGallery";
import { formatOwners } from "@/lib/owners";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Factory,
  Inbox,
  MapPin,
  User,
} from "lucide-react";
import {
  apiJson,
  CollaborationPreview,
  CollaborationRequestRecord,
  formatRelativeTime,
  notifyCollaborationRequestsChanged,
  PartyType,
  partyQuery,
  PROJECT_STATUS_LABELS,
} from "@/lib/projects";
import { useLanguage } from "@/context/LanguageContext";

const STATUS_STYLES: Record<
  CollaborationRequestRecord["status"],
  { label: string; hindiLabel: string; className: string }
> = {
  pending: {
    label: "Awaiting response",
    hindiLabel: "उत्तर की प्रतीक्षा",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  clarification_needed: {
    label: "Clarification needed",
    hindiLabel: "स्पष्टीकरण आवश्यक",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  accepted: {
    label: "Accepted",
    hindiLabel: "स्वीकृत",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Declined",
    hindiLabel: "अस्वीकृत",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
  withdrawn: {
    label: "Withdrawn",
    hindiLabel: "वापस लिया गया",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

const HISTORY_LABELS: Record<string, string> = {
  requested: "requested support",
  clarify: "asked for clarification",
  reply: "replied",
  accept: "accepted",
  reject: "declined",
  withdraw: "withdrew the request",
};

const HISTORY_LABELS_HINDI: Record<string, string> = {
  requested: "सहायता का अनुरोध किया",
  clarify: "स्पष्टीकरण माँगा",
  reply: "उत्तर दिया",
  accept: "स्वीकार किया",
  reject: "अस्वीकार किया",
  withdraw: "अनुरोध वापस लिया",
};

type Action = "accept" | "reject" | "clarify" | "reply" | "withdraw";

/**
 * University <-> industry collaboration requests, with the actions the viewer may take:
 * the receiving side accepts / declines / asks for clarification, the requesting side
 * replies to a clarification or withdraws. Every action alerts the other side.
 */
export default function CollaborationRequestList({
  requests,
  viewerType,
  viewerName,
  onChanged,
  workspaceBasePath,
  emptyText = "No collaboration requests yet.",
}: {
  requests: CollaborationRequestRecord[];
  viewerType: PartyType;
  viewerName: string;
  onChanged: () => void;
  /** Portal prefix (e.g. "/industry") used to link accepted requests to their project workspace. */
  workspaceBasePath?: string;
  emptyText?: string;
}) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
        <Inbox size={32} className="mb-2 text-slate-300" />
        <p className="text-sm text-slate-500">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          viewerType={viewerType}
          viewerName={viewerName}
          onChanged={onChanged}
          workspaceBasePath={workspaceBasePath}
        />
      ))}
    </div>
  );
}

function RequestCard({
  request,
  viewerType,
  viewerName,
  onChanged,
  workspaceBasePath,
}: {
  request: CollaborationRequestRecord;
  viewerType: PartyType;
  viewerName: string;
  onChanged: () => void;
  workspaceBasePath?: string;
}) {
  const { language } = useLanguage();
  const hindi = language === "Hindi";

  const tr = (english: string, hindiText: string) =>
    hindi ? hindiText : english;

  const isRequester = request.requested_by === viewerType;
  const isOpen =
    request.status === "pending" ||
    request.status === "clarification_needed";

  const [pendingAction, setPendingAction] = useState<Action | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The invited side should review the problem before deciding, so open the preview for them.
  const [showPreview, setShowPreview] = useState(
    !isRequester && isOpen && !!request.problem_id
  );

  const otherName =
    viewerType === "university"
      ? request.industry_name
      : request.university_name;

  const OtherIcon =
    viewerType === "university" ? Factory : Building2;

  const status = STATUS_STYLES[request.status];

  const available: Action[] = !isOpen
    ? []
    : isRequester
      ? [
          ...(request.status === "clarification_needed"
            ? (["reply"] as Action[])
            : []),
          "withdraw",
        ]
      : ["accept", "clarify", "reject"];

  const needsNote =
    pendingAction === "reject" ||
    pendingAction === "clarify" ||
    pendingAction === "reply";

  const submit = async (action: Action) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await apiJson(`/collaboration-requests/${request.id}/actions`, {
        method: "POST",
        body: JSON.stringify({
          actor_type: viewerType,
          actor_name: viewerName,
          action,
          note: note.trim(),
        }),
      });

      setPendingAction(null);
      setNote("");
      onChanged();
      notifyCollaborationRequestsChanged();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : tr(
              "Could not update the request",
              "अनुरोध अपडेट नहीं किया जा सका"
            )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const choose = (action: Action) => {
    setError(null);

    if (action === "accept" || action === "withdraw") {
      void submit(action);
    } else {
      setPendingAction(action);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">
            {request.challenge_title}
          </p>

          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
            <OtherIcon size={12} />

            {isRequester
              ? tr("To", "को")
              : tr("From", "से")}

            <span className="font-semibold text-slate-700">
              {otherName}
            </span>

            <span>· {formatRelativeTime(request.created_at)}</span>
          </p>
        </div>

        <span
          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.className}`}
        >
          {hindi ? status.hindiLabel : status.label}
        </span>
      </div>

      {request.support_types.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {request.support_types.map((type) => (
            <span
              key={type}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
            >
              {type}
            </span>
          ))}
        </div>
      )}

      {request.progress_summary && (
        <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            {tr(
              "Progress so far · from",
              "अब तक की प्रगति · द्वारा"
            )}{" "}
            {request.requested_by === "university"
              ? request.university_name
              : request.industry_name}
          </p>

          <p className="mt-0.5 whitespace-pre-line text-sm text-emerald-900">
            {request.progress_summary}
          </p>
        </div>
      )}

      {request.description && (
        <p className="mt-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-700">
            {tr("Needs:", "आवश्यकता:")}{" "}
          </span>
          {request.description}
        </p>
      )}

      {request.problem_id && (
        <button
          onClick={() => setShowPreview((value) => !value)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          {showPreview ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}

          {showPreview
            ? tr("Hide problem & progress", "समस्या और प्रगति छिपाएँ")
            : tr("View problem & progress", "समस्या और प्रगति देखें")}
        </button>
      )}

      {showPreview && (
        <ProblemPreview
          requestId={request.id}
          viewerType={viewerType}
          viewerName={viewerName}
        />
      )}

      {request.status === "accepted" &&
        request.problem_id &&
        workspaceBasePath && (
          <Link
            href={`${workspaceBasePath}/projects/${request.problem_id}`}
            className="mt-3 inline-flex rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900"
          >
            {tr(
              "Open project workspace",
              "प्रोजेक्ट वर्कस्पेस खोलें"
            )}
          </Link>
        )}

      {request.history.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-l-2 border-slate-100 pl-3">
          {request.history.map((entry, index) => (
            <li key={index} className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {entry.actor_name}
              </span>{" "}
              {hindi
                ? HISTORY_LABELS_HINDI[entry.action] ??
                  entry.action
                : HISTORY_LABELS[entry.action] ?? entry.action}

              {entry.note && (
                <span className="text-slate-600">
                  : &ldquo;{entry.note}&rdquo;
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-700">
          {error}
        </p>
      )}

      {pendingAction && needsNote && (
        <div className="mt-3 space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder={
              pendingAction === "reject"
                ? tr(
                    "Reason for rejecting...",
                    "अस्वीकार करने का कारण..."
                  )
                : pendingAction === "clarify"
                  ? tr(
                      "What do you need to know?",
                      "आप क्या जानना चाहते हैं?"
                    )
                  : tr("Your reply...", "आपका उत्तर...")
            }
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setPendingAction(null)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
            >
              {tr("Cancel", "रद्द करें")}
            </button>

            <button
              onClick={() => submit(pendingAction)}
              disabled={isSubmitting || !note.trim()}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900 disabled:opacity-40"
            >
              {tr("Send", "भेजें")}
            </button>
          </div>
        </div>
      )}

      {!pendingAction && available.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          {available.includes("withdraw") && (
            <button
              onClick={() => choose("withdraw")}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              {tr("Withdraw", "वापस लें")}
            </button>
          )}

          {available.includes("reply") && (
            <button
              onClick={() => choose("reply")}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
            >
              {tr(
                "Reply to clarification",
                "स्पष्टीकरण का उत्तर दें"
              )}
            </button>
          )}

          {available.includes("reject") && (
            <button
              onClick={() => choose("reject")}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              {tr("Reject", "अस्वीकार करें")}
            </button>
          )}

          {available.includes("clarify") && (
            <button
              onClick={() => choose("clarify")}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {tr("Ask for details", "विवरण पूछें")}
            </button>
          )}

          {available.includes("accept") && (
            <button
              onClick={() => choose("accept")}
              disabled={isSubmitting}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40"
            >
              {request.problem_id
                ? tr(
                    "Accept & join project",
                    "स्वीकार करें और प्रोजेक्ट से जुड़ें"
                  )
                : tr("Accept", "स्वीकार करें")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Problem, current progress, partners and recent updates, fetched for someone on the request. */
function ProblemPreview({
  requestId,
  viewerType,
  viewerName,
}: {
  requestId: string;
  viewerType: PartyType;
  viewerName: string;
}) {
  const { language } = useLanguage();
  const hindi = language === "Hindi";

  const tr = (english: string, hindiText: string) =>
    hindi ? hindiText : english;

  const [preview, setPreview] =
    useState<CollaborationPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    apiJson<CollaborationPreview>(
      `/collaboration-requests/${requestId}/preview?${partyQuery(
        viewerType,
        viewerName
      )}`
    )
      .then((data) => {
        if (!cancelled) setPreview(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : tr(
                  "Could not load the problem",
                  "समस्या लोड नहीं की जा सकी"
                )
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestId, viewerType, viewerName, hindi]);

  if (error) {
    return (
      <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
        {error}
      </p>
    );
  }

  if (!preview) {
    return (
      <div className="mt-2 h-24 animate-pulse rounded-xl bg-slate-100" />
    );
  }

  const { project, recent_updates: updates } = preview;

  if (!project) {
    return (
      <p className="mt-2 text-xs text-slate-500">
        {tr(
          "The problem for this request is no longer available.",
          "इस अनुरोध से संबंधित समस्या अब उपलब्ध नहीं है।"
        )}
      </p>
    );
  }

  return (
    <div className="mt-2 space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-slate-900">
            {project.title}
          </p>

          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
            {PROJECT_STATUS_LABELS[project.status] ??
              project.status}
          </span>

          {project.category && (
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
              {project.category}
            </span>
          )}
        </div>

        <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
          {project.description}
        </p>

        <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <User size={12} />

            {(project.co_owners?.length ?? 0) > 0
              ? tr(
                  "Jointly reported by",
                  "संयुक्त रूप से रिपोर्ट किया गया द्वारा"
                )
              : tr("Reported by", "रिपोर्ट किया गया द्वारा")}

            {formatOwners(
              project.citizen_name,
              project.co_owners
            )}
          </span>

          {project.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {project.location}
            </span>
          )}
        </div>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-xs font-semibold">
          <span className="text-slate-500">
            {tr("Progress", "प्रगति")}
          </span>

          <span className="text-slate-700">
            {project.progress}%
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.parties.map((party) => (
          <span
            key={`${party.type}-${party.name}`}
            className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-0.5 text-[11px] text-slate-600"
          >
            {party.type === "university" ? (
              <Building2 size={11} />
            ) : (
              <Factory size={11} />
            )}

            {party.name} ·{" "}
            {party.role === "lead"
              ? tr("Lead", "मुख्य")
              : tr("Collaborator", "सहयोगी")}
          </span>
        ))}
      </div>

      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {tr("Recent updates", "हाल के अपडेट")}
        </p>

        {updates.length === 0 ? (
          <p className="text-xs text-slate-500">
            {tr(
              "No updates posted yet.",
              "अभी तक कोई अपडेट पोस्ट नहीं किया गया है।"
            )}
          </p>
        ) : (
          <ul className="space-y-1.5">
            {updates.map((update) => (
              <li
                key={update.id}
                className="rounded-lg bg-white px-2.5 py-1.5 text-xs"
              >
                <span className="font-semibold text-slate-800">
                  {update.title}
                </span>

                {update.progress !== null && (
                  <span className="text-emerald-700">
                    {" "}
                    · {update.progress}%
                  </span>
                )}

                <span className="text-slate-400">
                  {" "}
                  · {update.author_org},{" "}
                  {formatRelativeTime(update.created_at)}
                </span>

                {update.body && (
                  <p className="mt-0.5 text-slate-600">
                    {update.body}
                  </p>
                )}

                {update.attachments?.length > 0 && (
                  <div className="mt-1.5">
                    <AttachmentGallery
                      attachments={update.attachments}
                      compact
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}