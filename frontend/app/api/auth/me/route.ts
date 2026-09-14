import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth_session");

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    let sessionData;
    try {
      sessionData = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionData.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accountStatus: true,
        profilePhoto: true,
        location: true,
        regionId: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Check if university/industry profile needs completion
    let needsProfileCompletion = false;
    let universityId: string | undefined;
    let industryId: string | undefined;

    if (user.role === "FACULTY") {
      const faculty = await prisma.universityFaculty.findUnique({
        where: { userId: user.id },
      });
      if (!faculty) {
        needsProfileCompletion = true;
      } else {
        universityId = faculty.universityId;
      }
    } else if (["INDUSTRY_EMPLOYEE", "INDUSTRY_MENTOR", "INDUSTRY_EXPERT"].includes(user.role)) {
      const employee = await prisma.industryEmployee.findUnique({
        where: { userId: user.id },
      });
      if (!employee) {
        needsProfileCompletion = true;
      } else {
        industryId = employee.industryId;
      }
    }

    return NextResponse.json({ 
      user: {
        ...user,
        universityId,
        industryId,
        needsProfileCompletion,
      }
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}