import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth_session");

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    let sessionData;
    try {
      sessionData = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid session" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionData.userId },
    });

    if (!user || !["INDUSTRY_EMPLOYEE", "INDUSTRY_MENTOR", "INDUSTRY_EXPERT"].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      companyName,
      registrationNumber,
      industryType,
      description,
      website,
      address,
      district,
      state,
      regionId,
      department,
      phone,
    } = body;

    if (!companyName || !registrationNumber || !industryType || !state || !regionId || !department) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const existingIndustry = await prisma.industry.findUnique({
      where: { registrationNumber },
    });

    if (existingIndustry) {
      return NextResponse.json(
        { success: false, message: "Company with this registration number already exists" },
        { status: 409 }
      );
    }

    const industry = await prisma.industry.create({
      data: {
        companyName,
        registrationNumber,
        industryType,
        description,
        website,
        address,
        district,
        state,
        regionId,
        email: user.email,
        phone,
        verificationStatus: "PENDING",
      },
    });

    await prisma.industryEmployee.create({
      data: {
        userId: user.id,
        industryId: industry.id,
        employeeCode: `EMP-${Date.now()}`,
        designation: "Employee",
        department,
        experienceYears: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Company profile created successfully",
      industry: {
        id: industry.id,
        companyName: industry.companyName,
      },
    });
  } catch (error) {
    console.error("Complete industry profile error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create company profile" },
      { status: 500 }
    );
  }
}