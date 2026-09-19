import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

// Joins the signed-in user onto their organization's team for a project, so future
// government-verified milestones credit them individually as well as their organization as a
// whole. The FastAPI service (ai/api.py) that actually stores this has no auth of its own -- it
// trusts whatever identity it's given -- so this route is the only place that identity may come
// from: resolved here from the real session, never accepted from the request body.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const ROLE_LABELS: Partial<Record<string, string>> = {
  STUDENT: "student",
  FACULTY: "faculty",
  MENTOR: "mentor",
  INDUSTRY_EMPLOYEE: "employee",
  INDUSTRY_MENTOR: "mentor",
  INDUSTRY_EXPERT: "expert",
};

export async function POST(_request: Request, { params }: { params: Promise<{ problemId: string }> }) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partyType = user.universityId ? "university" : user.industryId ? "industry" : null;
  if (!partyType || !user.organizationName) {
    return NextResponse.json(
      { error: "Complete your organization profile before joining a project team" },
      { status: 403 }
    );
  }

  const { problemId } = await params;

  let response: Response;
  try {
    response = await fetch(`${API_URL}/projects/${problemId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        party_type: partyType,
        party_name: user.organizationName,
        user_id: user.id,
        user_name: user.name,
        role: ROLE_LABELS[user.role] ?? null,
      }),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to reach the project API while joining a project:", error);
    return NextResponse.json({ error: "Project service unavailable" }, { status: 502 });
  }

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
