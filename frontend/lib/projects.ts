"use client";

import { useCallback, useEffect, useState } from "react";
import { getOrganizationName, useAuth } from "@/context/AuthContext";

/** Shared client for project workspaces (accepted problems) in the university and industry portals. */

export type PartyType = "university" | "industry";
/** Who is looking at a workspace: a solving organisation, or the citizen who reported the problem. */
export type ViewerType = PartyType | "citizen";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface ProjectParty {
  type: PartyType;
  name: string;
  role: "lead" | "collaborator";
}

export interface Attachment {
  name: string;
  content_type: string;
  size: number;
  /** Relative path (e.g. "/uploads/xyz.pdf"); resolve against API_URL to fetch/open it. */
  url: string;
}

export interface ProjectUpdateRecord {
  id: string;
  problem_id: string;
  author_type: PartyType;
  author_org: string;
  author_name: string;
  title: string;
  body: string;
  progress: number | null;
  attachments: Attachment[];
  created_at: string;
}

/** Mirrors the API's MAX_UPDATE_ATTACHMENTS / MAX_EVIDENCE_SIZE so the form can validate before uploading. */
export const MAX_UPDATE_ATTACHMENTS = 10;
export const MAX_ATTACHMENT_SIZE_MB = 10;
/** Passed to <input accept>; the server is the source of truth on exact MIME types allowed. */
export const UPDATE_ATTACHMENT_ACCEPT =
  "image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx";

export interface ProjectMessageRecord {
  id: string;
  problem_id: string;
  author_type: ViewerType;
  author_org: string;
  author_name: string;
  text: string;
  created_at: string;
}

export interface ProjectSummary {
  id: string;
  title: string;
  description: string;
  category: string | null;
  location: string | null;
  citizen_name: string;
  status: "assigned" | "in_progress" | "completed";
  progress: number;
  required_capabilities: string[];
  parties: ProjectParty[];
  /** "owner" is the citizen who reported the problem; "invitee" only appears in request previews. */
  my_role: "lead" | "collaborator" | "owner" | "invitee";
  latest_update: ProjectUpdateRecord | null;
  updated_at: string;
}

export interface CollaborationRequestRecord {
  id: string;
  requested_by: PartyType;
  university_name: string;
  industry_name: string;
  requester_contact: string | null;
  problem_id: string | null;
  challenge_title: string;
  problem_description: string | null;
  category: string | null;
  support_types: string[];
  description: string | null;
  progress_summary: string | null;
  status: "pending" | "clarification_needed" | "accepted" | "rejected" | "withdrawn";
  history: { actor_type: PartyType; actor_name: string; action: string; note: string; timestamp: string }[];
  created_at: string;
}

/** What the invited organisation reviews before accepting a collaboration request. */
export interface CollaborationPreview {
  request: CollaborationRequestRecord;
  project: ProjectSummary | null;
  recent_updates: ProjectUpdateRecord[];
}

export const PROJECT_STATUS_LABELS: Record<ProjectSummary["status"], string> = {
  assigned: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

/** The signed-in viewer: an organisation acts under its organisation name, a citizen under their own name. */
export function useParty(partyType: ViewerType) {
  const { user } = useAuth();
  const partyName = partyType === "citizen" ? user?.name ?? "" : getOrganizationName(user);
  return { partyType, partyName, userName: user?.name ?? "" };
}

export function partyQuery(partyType: ViewerType, partyName: string) {
  return `party_type=${partyType}&party_name=${encodeURIComponent(partyName)}`;
}

/** Throws the API's error detail so forms can show it. */
export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: init?.body ? { "Content-Type": "application/json", ...init.headers } : init?.headers,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(String(body.detail ?? `Request failed (${response.status})`));
  return body as T;
}

/** Like apiJson, but posts a FormData body (multipart) -- used for endpoints that accept file
 * uploads. No Content-Type header is set so the browser fills in the multipart boundary itself. */
export async function apiForm<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { method: "POST", body: formData, cache: "no-store" });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(String(body.detail ?? `Request failed (${response.status})`));
  return body as T;
}

/** FastAPI's `detail` is a string for our own errors, or a list of validation problems. */
function detailText(detail: unknown): string | null {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const parts = detail.map((d) => (d && typeof d === "object" && "msg" in d ? String(d.msg) : String(d)));
    return parts.join("; ") || null;
  }
  return null;
}

/** A failed file upload, with a message meant to be shown to the person as-is. */
export class UploadError extends Error {
  status: number;
  /** The file the server named as the problem, if any. */
  fileName: string | null;

  constructor(status: number, message: string, fileName: string | null = null) {
    super(message);
    this.status = status;
    this.fileName = fileName;
  }
}

function uploadErrorFor(status: number, detail: unknown): UploadError {
  const text = detailText(detail);
  const fileName = text?.match(/^'([^']+)'/)?.[1] ?? null;
  if (status === 400 || status === 413 || status === 415) return new UploadError(status, text ?? "One of the files was rejected.", fileName);
  if (status === 403) return new UploadError(status, `Not allowed: ${text ?? "you don't have permission to do this."}`);
  if (status === 404) return new UploadError(status, `${text ?? "Not found"}. Refresh the page; it may have been removed.`);
  if (status === 422) return new UploadError(status, "The upload was incomplete (a required field or file was missing). Try again.");
  if (status >= 500) return new UploadError(status, `The server couldn't save the files${text ? `: ${text}` : ""}. Try again in a moment.`, fileName);
  return new UploadError(status, text ?? `Upload failed (error ${status}).`, fileName);
}

/**
 * POST a multipart form with upload progress (fetch can't report upload progress).
 * Rejects with an UploadError whose message says in plain words what went wrong.
 */
export function uploadForm<T>(path: string, formData: FormData, onProgress?: (fraction: number) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", `${API_URL}${path}`);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) onProgress(event.loaded / event.total);
    };
    request.onload = () => {
      let body: { detail?: unknown } = {};
      try {
        body = JSON.parse(request.responseText);
      } catch {
        // non-JSON error page; handled by status below
      }
      if (request.status >= 200 && request.status < 300) resolve(body as T);
      else reject(uploadErrorFor(request.status, body.detail));
    };
    request.onerror = () =>
      reject(new UploadError(0, "Couldn't reach the server. Check your internet connection (and that the API is running), then try again."));
    request.ontimeout = () => reject(new UploadError(0, "The upload timed out. Try again, or upload fewer or smaller files at once."));
    request.onabort = () => reject(new UploadError(0, "The upload was cancelled."));
    request.send(formData);
  });
}

/**
 * Download a file from the API and save it under `fileName`. The API is on another origin, where
 * browsers ignore <a download> and just open the file, so fetch it and save a local copy instead.
 */
export async function downloadFile(path: string, fileName: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  } catch {
    throw new Error("Download failed: couldn't reach the server. Check your connection and try again.");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(`Download failed: ${detailText(body.detail) ?? `the server returned error ${response.status}`}.`);
  }
  const href = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 60_000);
}

/** Download URLs for workspace files; every party who can open the workspace may use them. */
export const workspaceDownloadPaths = {
  file: (problemId: string, updateId: string, index: number, viewer: ViewerType, name: string) =>
    `/projects/${problemId}/updates/${updateId}/attachments/${index}/download?${partyQuery(viewer, name)}`,
  update: (problemId: string, updateId: string, viewer: ViewerType, name: string) =>
    `/projects/${problemId}/updates/${updateId}/attachments.zip?${partyQuery(viewer, name)}`,
  workspace: (problemId: string, viewer: ViewerType, name: string) =>
    `/projects/${problemId}/attachments.zip?${partyQuery(viewer, name)}`,
};

const ATTACHABLE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "mp4", "webm", "mov", "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx"];

/** Why a picked file can't be attached (mirrors the API's rules), or null if it's fine. */
export function attachmentProblem(file: File): string | null {
  const extension = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";
  const typeOk = file.type.startsWith("image/") || file.type.startsWith("video/") || ATTACHABLE_EXTENSIONS.includes(extension);
  if (!typeOk) {
    return `${extension ? extension.toUpperCase() : "This kind of"} files can't be attached. Use images, videos, PDFs, or Word, PowerPoint or Excel files.`;
  }
  if (file.size === 0) return "The file is empty (0 bytes).";
  if (file.size > MAX_ATTACHMENT_SIZE_MB * 1024 * 1024) {
    return `It is ${(file.size / (1024 * 1024)).toFixed(1)} MB; the limit is ${MAX_ATTACHMENT_SIZE_MB} MB per file.`;
  }
  return null;
}

/** Projects the signed-in viewer can open (lead, collaborator, or problem owner). Refreshes every 30s. */
export function useProjects(partyType: ViewerType) {
  const { partyName } = useParty(partyType);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!partyName) return;
    try {
      setProjects(await apiJson<ProjectSummary[]>(`/projects?${partyQuery(partyType, partyName)}`));
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, [partyType, partyName]);

  useEffect(() => {
    if (!partyName) return;
    const load = () => void refresh();
    const initial = window.setTimeout(load, 0);
    const interval = window.setInterval(load, 30_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [partyName, refresh]);

  return { projects, isLoading: isLoading && !!partyName, refresh };
}

/**
 * Number of collaboration requests waiting on this organisation: new requests it has to accept or
 * reject, plus its own requests where the partner asked for clarification. Refreshes on every
 * `refreshKey` change (e.g. navigation) and every 30s, so sidebar badges stay current.
 */
export function useCollaborationRequestBadge(partyType: PartyType, refreshKey?: string) {
  const { partyName } = useParty(partyType);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!partyName) return;
    const nameField = partyType === "university" ? "university_name" : "industry_name";
    const load = () =>
      apiJson<CollaborationRequestRecord[]>(`/collaboration-requests?${nameField}=${encodeURIComponent(partyName)}&limit=500`)
        .then((records) =>
          setCount(
            records.filter((r) =>
              r.requested_by === partyType ? r.status === "clarification_needed" : r.status === "pending",
            ).length,
          ),
        )
        .catch(() => undefined);
    const initial = window.setTimeout(load, 0);
    const interval = window.setInterval(load, 30_000);
    window.addEventListener(COLLABORATION_REQUESTS_CHANGED, load);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
      window.removeEventListener(COLLABORATION_REQUESTS_CHANGED, load);
    };
  }, [partyType, partyName, refreshKey]);

  return count;
}

/** Fired after any collaboration request action so badges update without waiting for the next poll. */
export const COLLABORATION_REQUESTS_CHANGED = "collaboration-requests-changed";

export function notifyCollaborationRequestsChanged() {
  window.dispatchEvent(new Event(COLLABORATION_REQUESTS_CHANGED));
}

export function formatRelativeTime(value?: string | null) {
  if (!value) return "";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "";
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/** Tailwind class sets per portal (class names must be literal for Tailwind to pick them up). */
export const ACCENTS = {
  indigo: {
    solid: "bg-indigo-600 text-white hover:bg-indigo-700",
    soft: "bg-indigo-50 text-indigo-700",
    text: "text-indigo-600",
    bar: "bg-indigo-500",
    ring: "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
    active: "bg-indigo-600 text-white shadow-sm",
    hover: "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600",
    mine: "bg-indigo-600 text-white",
  },
  blue: {
    solid: "bg-blue-600 text-white hover:bg-blue-700",
    soft: "bg-blue-50 text-blue-700",
    text: "text-blue-600",
    bar: "bg-blue-500",
    ring: "focus:border-blue-400 focus:ring-2 focus:ring-blue-100",
    active: "bg-blue-600 text-white shadow-sm",
    hover: "text-slate-600 hover:bg-blue-50/70 hover:text-blue-700",
    mine: "bg-blue-600 text-white",
  },
} as const;

export type Accent = keyof typeof ACCENTS;
