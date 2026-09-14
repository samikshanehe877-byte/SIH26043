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

    if (!user || user.role !== "FACULTY") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      registrationNumber,
      description,
      website,
      address,
      district,
      state,
      regionId,
      department,
      phone,
    } = body;

    if (!name || !registrationNumber || !state || !regionId || !department) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const existingUniversity = await prisma.university.findUnique({
      where: { registrationNumber },
    });

    if (existingUniversity) {
      return NextResponse.json(
        { success: false, message: "University with this registration number already exists" },
        { status: 409 }
      );
    }

    const university = await prisma.university.create({
      data: {
        name,
        registrationNumber,
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

    await prisma.universityFaculty.create({
      data: {
        userId: user.id,
        universityId: university.id,
        department,
        designation: "Faculty",
        experienceYears: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "University profile created successfully",
      university: {
        id: university.id,
        name: university.name,
      },
    });
  } catch (error) {
    console.error("Complete university profile error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create university profile" },
      { status: 500 }
    );
  }
}