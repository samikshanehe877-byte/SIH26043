import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";

// A government officer's milestone decision. This is the fix for the same gap the existing
// problem-verification flow still has (frontend/app/government/verify/page.tsx sends a
// hardcoded officer name straight from the client) -- here the officer's identity is resolved
// from their real signed-in session via requireApiRole, never accepted from the request body, so
// milestone_verified permanently-scored ledger credit can't be attributed to a spoofed officer.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function PATCH(request: Request, { params }: { params: Promise<{ milestoneId: string }> }) {
  const auth = await requireApiRole(["GOVERNMENT_OFFICER", "ADMIN"]);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => null);
  if (!body || (body.decision !== "approve" && body.decision !== "reject")) {
    return NextResponse.json({ error: "decision must be 'approve' or 'reject'" }, { status: 400 });
  }

  const { milestoneId } = await params;

  let response: Response;
  try {
    response = await fetch(`${API_URL}/milestones/${milestoneId}/verification`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decision: body.decision,
        note: typeof body.note === "string" ? body.note : undefined,
        officer_id: auth.id,
        officer_name: auth.name,
      }),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to reach the project API while verifying a milestone:", error);
    return NextResponse.json({ error: "Project service unavailable" }, { status: 502 });
  }

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
