import { NextResponse } from "next/server";
import { getAuthUser, UserRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES: UserRole[] = ["INDUSTRY_EMPLOYEE", "INDUSTRY_MENTOR", "INDUSTRY_EXPERT", "GOVERNMENT_OFFICER", "ADMIN"];

/** Universities an industry project lead can invite to collaborate. */
export async function GET() {
  const user = await getAuthUser();
  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const universities = await prisma.university.findMany({
      where: { verificationStatus: { not: "REJECTED" } },
      select: { id: true, name: true, district: true, state: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(universities);
  } catch (error) {
    console.error("Error fetching university directory:", error);
    return NextResponse.json({ error: "Failed to fetch universities" }, { status: 500 });
  }
}
