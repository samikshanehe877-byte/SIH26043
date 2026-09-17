import { NextResponse } from "next/server";
import { getAuthUser, UserRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES: UserRole[] = ["FACULTY", "MENTOR", "GOVERNMENT_OFFICER", "ADMIN"];

/** Industry partners a university can send a collaboration request to. */
export async function GET() {
  const user = await getAuthUser();
  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const industries = await prisma.industry.findMany({
      where: { verificationStatus: { not: "REJECTED" } },
      select: { id: true, companyName: true, industryType: true, district: true, state: true },
      orderBy: { companyName: "asc" },
    });
    return NextResponse.json(industries);
  } catch (error) {
    console.error("Error fetching industry directory:", error);
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
  }
}
