import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        { success: false, message: "Account is not active. Please contact support." },
        { status: 403 }
      );
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

    const sessionData = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const cookieStore = await cookies();
    cookieStore.set("auth_session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: {
        ...userWithoutPassword,
        universityId,
        industryId,
        needsProfileCompletion,
      },
      redirectTo: getRedirectPath(user.role, needsProfileCompletion),
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}

function getRedirectPath(role: string, needsProfileCompletion?: boolean): string {
  if (needsProfileCompletion) {
    switch (role) {
      case "FACULTY":
        return "/complete-profile/university";
      case "INDUSTRY_EMPLOYEE":
      case "INDUSTRY_MENTOR":
      case "INDUSTRY_EXPERT":
        return "/complete-profile/industry";
    }
  }
  
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "GOVERNMENT_OFFICER":
      return "/government";
    case "STUDENT":
      return "/student";
    case "MENTOR":
      return "/mentor";
    case "FACULTY":
      return "/university";
    case "INDUSTRY_EMPLOYEE":
    case "INDUSTRY_MENTOR":
    case "INDUSTRY_EXPERT":
      return "/industry";
    case "CITIZEN":
    default:
      return "/";
  }
}