import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const ACTIONS = ["seen", "dismiss", "restore"] as const;
const MAX_IDS = 20;

/**
 * Records what the signed-in person did with their Best Match cards: saw them, marked one "not
 * interested", or took that back. Only the action and the problem ids are read from the request;
 * the person and their organization come from the session, so nobody can change another user's list.
 */
export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgType = user.universityId ? "university" : user.industryId ? "industry" : null;
  const orgId = user.universityId ?? user.industryId;
  if (!orgType || !orgId) {
    return NextResponse.json({ error: "Complete your organization profile first" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const action = body && typeof body === "object" ? body.action : undefined;
  const problemIds: unknown = body && typeof body === "object" ? body.problemIds : undefined;
  if (
    !ACTIONS.includes(action) ||
    !Array.isArray(problemIds) ||
    problemIds.length === 0 ||
    problemIds.length > MAX_IDS ||
    !problemIds.every((id) => typeof id === "string" && id.length > 0 && id.length <= 100)
  ) {
    return NextResponse.json({ error: "action and problemIds are required" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/organizations/${orgType}/${encodeURIComponent(orgId)}/problem-feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, action, problem_ids: problemIds }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to reach the matching service:", error);
    return NextResponse.json({ error: "Matching service unavailable" }, { status: 502 });
  }
}
