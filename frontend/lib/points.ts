"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Achievement, Certificate } from "@/types/student";
import {
  apiJson, MAX_UPDATE_ATTACHMENTS, partyQuery, uploadForm, useParty,
  type Attachment, type PartyType, type ViewerType,
} from "./projects";

/** Milestone-verified points ledger, badges, certificates and leaderboards -- the client for the
 * points_storage.py-backed endpoints in ai/api.py. Reads (summary, certificates, leaderboard,
 * team roster, milestone history) go straight to the FastAPI service like every other project
 * read in this app. The three actions that write permanent ledger credit -- joining a project
 * team, submitting a milestone, and an officer's verification decision -- instead call this
 * Next.js app's own /api routes, which resolve the caller's real identity from their session
 * before forwarding to FastAPI (see frontend/app/api/projects/**\/route.ts and
 * frontend/app/api/government/milestones/**\/verify/route.ts). FastAPI has no auth of its own, so
 * that's the only place a spoofed identity is actually prevented. */

export type ActorType = "user" | PartyType;

export const MILESTONE_TYPES = [
  "project_accepted",
  "initial_planning",
  "development_started",
  "progress_50",
  "prototype_completed",
  "testing_completed",
  "government_validation",
  "implementation",
  "impact_demonstrated",
] as const;
export type MilestoneType = (typeof MILESTONE_TYPES)[number];

export const MILESTONE_LABELS: Record<MilestoneType, string> = {
  project_accepted: "Project Accepted",
  initial_planning: "Initial Planning",
  development_started: "Development Started",
  progress_50: "50% Progress",
  prototype_completed: "Prototype Completed",
  testing_completed: "Testing Completed",
  government_validation: "Government Validation",
  implementation: "Implementation",
  impact_demonstrated: "Impact Demonstrated",
};

export type MilestoneStatus = "submitted" | "verified" | "rejected";

export interface MilestoneRecord {
  id: string;
  problem_id: string;
  milestone_type: MilestoneType;
  status: MilestoneStatus;
  submitted_by_user_id: string;
  submitted_by_name: string;
  submitted_by_org_type: PartyType;
  submitted_by_org_name: string;
  submitted_note: string | null;
  submitted_at: string;
  decided_by_officer_id: string | null;
  decided_by_officer_name: string | null;
  decision_note: string | null;
  decided_at: string | null;
  /** Evidence the team attached: uploaded files (same shape as project update attachments) and web links. */
  submitted_attachments: Attachment[];
  submitted_links: string[];
}

/** Mirror ai/api.py's MAX_MILESTONE_ATTACHMENTS and ai/points_storage.py's MAX_MILESTONE_LINKS so the form can
 * say so before uploading; the server is the source of truth. */
export const MAX_MILESTONE_ATTACHMENTS = MAX_UPDATE_ATTACHMENTS;
export const MAX_MILESTONE_LINKS = 10;

export interface PointEventRecord {
  id: string;
  problem_id: string;
  milestone_id: string;
  milestone_type: MilestoneType;
  points: number;
  actor_type: ActorType;
  actor_id: string;
  actor_name: string;
  organization_type: PartyType | null;
  organization_name: string | null;
  officer_id: string;
  officer_name: string;
  created_at: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PointsSummary {
  actor_type: ActorType;
  actor_id: string;
  actor_name: string;
  total_points: number;
  verified_milestones: number;
  distinct_projects: number;
  badges: Badge[];
  recent_events: PointEventRecord[];
}

export interface LeaderboardEntry {
  rank: number;
  actor_type: ActorType;
  actor_id: string;
  actor_name: string;
  total_points: number;
  verified_milestones: number;
  distinct_projects: number;
}

export interface CertificateRecord {
  id: string;
  problem_id: string;
  challenge_title: string;
  actor_name: string;
  completion_date: string | null;
  status: "Verified" | "Pending";
  certificate_id: string;
  issue_authority: string;
}

export interface ProjectMemberRecord {
  id: string;
  problem_id: string;
  user_id: string;
  user_name: string;
  organization_type: PartyType;
  organization_name: string;
  role: string | null;
  joined_at: string;
}

/** Polls a FastAPI GET endpoint every 30s, the same shape every read hook in lib/projects.ts
 * uses -- kept private to this file since points.ts is the first place with enough of these
 * (five) that inlining each one separately would just be noise. */
function useApiPoll<T>(path: string | null, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!path) return;
    try {
      setData(await apiJson<T>(path));
    } catch (error) {
      console.error(`Failed to load ${path}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [path]);

  useEffect(() => {
    if (!path) {
      setIsLoading(false);
      return;
    }
    const load = () => void refresh();
    const initial = window.setTimeout(load, 0);
    const interval = window.setInterval(load, 30_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [path, refresh]);

  return { data, isLoading: isLoading && !!path, refresh };
}

/** The signed-in user's own individual points identity. Every non-citizen role can have one --
 * the ledger doesn't care what portal you're in, only whether you've been credited on a project. */
export function useOwnActor(): { actorType: "user"; actorId: string } | null {
  const { user } = useAuth();
  return user ? { actorType: "user", actorId: user.id } : null;
}

export function usePointsSummary(actorType: ActorType | null, actorId: string | null) {
  const path = actorType && actorId ? `/points/summary?actor_type=${actorType}&actor_id=${encodeURIComponent(actorId)}` : null;
  return useApiPoll<PointsSummary | null>(path, null);
}

export function useCertificates(actorType: ActorType | null, actorId: string | null) {
  const path = actorType && actorId ? `/certificates?actor_type=${actorType}&actor_id=${encodeURIComponent(actorId)}` : null;
  return useApiPoll<CertificateRecord[]>(path, []);
}

export interface LeaderboardFilters {
  region?: string;
  period?: "all" | "30d" | "90d" | "365d";
  limit?: number;
}

export function useOrganizationLeaderboard(orgType: "all" | PartyType = "all", filters: LeaderboardFilters = {}) {
  const params = new URLSearchParams({ org_type: orgType });
  if (filters.region) params.set("region", filters.region);
  if (filters.period) params.set("period", filters.period);
  if (filters.limit) params.set("limit", String(filters.limit));
  return useApiPoll<LeaderboardEntry[]>(`/leaderboard/organizations?${params.toString()}`, []);
}

export function useUserLeaderboard(filters: LeaderboardFilters = {}) {
  const params = new URLSearchParams();
  if (filters.region) params.set("region", filters.region);
  if (filters.period) params.set("period", filters.period);
  if (filters.limit) params.set("limit", String(filters.limit));
  return useApiPoll<LeaderboardEntry[]>(`/leaderboard/users?${params.toString()}`, []);
}

export function useProjectMembers(problemId: string | null, viewer: ViewerType) {
  const { partyType, partyName } = useParty(viewer);
  const path = problemId && partyName ? `/projects/${problemId}/members?${partyQuery(partyType, partyName)}` : null;
  return useApiPoll<ProjectMemberRecord[]>(path, []);
}

export interface ProjectMilestones {
  milestones: MilestoneRecord[];
  point_events: PointEventRecord[];
}

export function useMilestones(problemId: string | null, viewer: ViewerType) {
  const { partyType, partyName } = useParty(viewer);
  const path = problemId && partyName ? `/projects/${problemId}/milestones?${partyQuery(partyType, partyName)}` : null;
  return useApiPoll<ProjectMilestones>(path, { milestones: [], point_events: [] });
}

export function usePendingMilestones() {
  return useApiPoll<MilestoneRecord[]>(`/milestones?status=submitted`, []);
}

/** Throws the route's error message so forms can show it -- same contract as lib/projects.ts's apiJson. */
async function proxyJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    cache: "no-store",
    ...init,
    headers: init?.body ? { "Content-Type": "application/json", ...init.headers } : init?.headers,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(String(body.error ?? body.detail ?? `Request failed (${response.status})`));
  return body as T;
}

/** Joins the signed-in user onto their own organization's team for a project. */
export function joinProject(problemId: string): Promise<ProjectMemberRecord> {
  return proxyJson<ProjectMemberRecord>(`/api/projects/${problemId}/members`, { method: "POST" });
}

export interface MilestoneSubmission {
  note?: string;
  links?: string[];
  files?: File[];
}

/** Submits a milestone with its evidence as one multipart request to this app's own route, which
 * resolves the signed-in user's identity before forwarding to FastAPI. Rejects with an UploadError
 * whose message is meant to be shown as-is, and reports upload progress as a 0-1 fraction. */
export function submitMilestone(
  problemId: string, milestoneType: MilestoneType, submission: MilestoneSubmission = {},
  onProgress?: (fraction: number) => void,
): Promise<MilestoneRecord> {
  const form = new FormData();
  form.set("milestone_type", milestoneType);
  if (submission.note) form.set("note", submission.note);
  (submission.links ?? []).forEach((link) => form.append("links", link));
  (submission.files ?? []).forEach((file) => form.append("files", file));
  return uploadForm<MilestoneRecord>(`/api/projects/${problemId}/milestones`, form, onProgress, "");
}

export interface VerifyMilestoneResult {
  milestone: MilestoneRecord;
  new_point_events: PointEventRecord[];
}

export function verifyMilestone(milestoneId: string, decision: "approve" | "reject", note?: string): Promise<VerifyMilestoneResult> {
  return proxyJson<VerifyMilestoneResult>(`/api/government/milestones/${milestoneId}/verify`, {
    method: "PATCH",
    body: JSON.stringify({ decision, note }),
  });
}

/** Bridges this API's snake_case shape onto the pre-existing camelCase types in
 * types/student.ts, so the achievements/certificates pages never have to change. */
export function toAchievement(badge: Badge, dateEarned = ""): Achievement {
  return { id: badge.id, title: badge.title, description: badge.description, dateEarned, icon: badge.icon };
}

export function toStudentCertificate(record: CertificateRecord): Certificate {
  return {
    id: record.id,
    challengeTitle: record.challenge_title,
    studentName: record.actor_name,
    completionDate: record.completion_date ?? "",
    status: record.status,
    certificateId: record.certificate_id,
    issueAuthority: record.issue_authority,
  };
}
