import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      role,
      universityData,
      industryData,
    } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let userRole = "CITIZEN";
    let accountStatus = "ACTIVE";

    if (role === "UNIVERSITY") {
      userRole = "FACULTY";
      accountStatus = "PENDING_VERIFICATION";
    } else if (role === "INDUSTRY") {
      userRole = "INDUSTRY_EMPLOYEE";
      accountStatus = "PENDING_VERIFICATION";
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone,
        role: userRole as any,
        accountStatus: accountStatus as any,
      },
    });

    if (role === "UNIVERSITY" && universityData) {
      const university = await prisma.university.create({
        data: {
          name: universityData.name,
          registrationNumber: universityData.registrationNumber,
          description: universityData.description,
          website: universityData.website,
          email,
          phone: universityData.phone,
          address: universityData.address,
          district: universityData.district,
          state: universityData.state,
          regionId: universityData.regionId,
          verificationStatus: "PENDING",
        },
      });

      await prisma.universityFaculty.create({
        data: {
          userId: user.id,
          universityId: university.id,
          department: universityData.department || "General",
          designation: "Faculty",
          experienceYears: 0,
        },
      });
    }

    if (role === "INDUSTRY" && industryData) {
      const industry = await prisma.industry.create({
        data: {
          companyName: industryData.companyName,
          registrationNumber: industryData.registrationNumber,
          industryType: industryData.industryType,
          description: industryData.description,
          website: industryData.website,
          email,
          phone: industryData.phone,
          address: industryData.address,
          district: industryData.district,
          state: industryData.state,
          regionId: industryData.regionId,
          verificationStatus: "PENDING",
        },
      });

      await prisma.industryEmployee.create({
        data: {
          userId: user.id,
          industryId: industry.id,
          employeeCode: `EMP-${Date.now()}`,
          designation: "Employee",
          department: industryData.department || "General",
          experienceYears: 0,
        },
      });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: role === "CITIZEN" 
        ? "Registration successful! You can now sign in."
        : "Registration submitted for verification. You will be notified once approved.",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}