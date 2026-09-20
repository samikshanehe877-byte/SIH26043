import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * The open problems the signed-in user's own university or company is best placed to take on, with
 * the mixed-role team it would field. The organization is resolved from the session, never from the
 * request, so a client can't ask for another organization's people.
 */
export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgType = user.universityId ? "university" : user.industryId ? "industry" : null;
  const orgId = user.universityId ?? user.industryId;
  if (!orgType || !orgId) {
    return NextResponse.json({ error: "Complete your organization profile first" }, { status: 403 });
  }

  const requested = Number(new URL(request.url).searchParams.get("top_k"));
  const topK = Number.isInteger(requested) && requested >= 1 && requested <= 10 ? requested : 3;

  try {
    const response = await fetch(`${API_URL}/organizations/${orgType}/${encodeURIComponent(orgId)}/problem-matches?top_k=${topK}`, {
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Failed to reach the matching service:", error);
    return NextResponse.json({ error: "Matching service unavailable" }, { status: 502 });
  }
}
