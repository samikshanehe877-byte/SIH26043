import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        universityStudents: { include: { university: true } },
        universityMentors: { include: { university: true } },
        universityFaculty: { include: { university: true } },
        industryEmployees: { include: { industry: true } },
        industryMentors: { include: { industry: true } },
        industryExperts: { include: { industry: true } },
        governmentOfficers: { include: { government: true } },
        skills: { include: { skill: true } },
        ownedProblems: true,
        projectMembers: { include: { project: true } },
        matches: { include: { problem: true } },
        evidence: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, phone, role, profilePhoto, location, regionId, accountStatus } = body

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
        role,
        profilePhoto,
        location,
        regionId,
        accountStatus,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}