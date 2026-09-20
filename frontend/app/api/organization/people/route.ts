import { NextResponse } from "next/server";
import { getAuthUser, UserRole } from "@/lib/auth";
import { getOrganizationPeople, OrgType } from "@/lib/people";

// Roles that may browse another organization's people, the same audience the directory routes serve.
const BROWSE_ROLES: UserRole[] = ["FACULTY", "INDUSTRY_EMPLOYEE", "INDUSTRY_MENTOR", "INDUSTRY_EXPERT", "GOVERNMENT_OFFICER", "ADMIN"];

/**
 * The people (students, faculty, mentors, employees, experts) under one organization, with their
 * units, skills and problem areas -- what the card views render. With no query it returns the
 * signed-in user's own organization, resolved from the session. ?type=university|industry&id=... lets
 * a permitted role look at another organization.
 */
export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const requestedType = url.searchParams.get("type");
  const requestedId = url.searchParams.get("id");

  let type: OrgType;
  let orgId: string;
  if (requestedType || requestedId) {
    if (requestedType !== "university" && requestedType !== "industry") {
      return NextResponse.json({ error: "type must be 'university' or 'industry'" }, { status: 400 });
    }
    if (!requestedId) return NextResponse.json({ error: "id is required" }, { status: 400 });
    if (!BROWSE_ROLES.includes(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    type = requestedType;
    orgId = requestedId;
  } else if (user.universityId) {
    type = "university";
    orgId = user.universityId;
  } else if (user.industryId) {
    type = "industry";
    orgId = user.industryId;
  } else {
    return NextResponse.json({ error: "Complete your organization profile first" }, { status: 403 });
  }

  try {
    const result = await getOrganizationPeople(type, orgId);
    if (!result) return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error loading organization people:", error);
    return NextResponse.json({ error: "Failed to load people" }, { status: 500 });
  }
}
