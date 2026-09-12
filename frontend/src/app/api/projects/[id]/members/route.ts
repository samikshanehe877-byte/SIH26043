import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProjectMemberRole } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const members = await prisma.projectMember.findMany({
      where: { projectId: id },
      include: {
        user: { select: { id: true, name: true, email: true, profilePhoto: true, phone: true } },
      },
      orderBy: { joinedAt: 'asc' },
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching project members:', error)
    return NextResponse.json({ error: 'Failed to fetch project members' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { userId, role, organizationType, organizationId } = body

    if (!userId || !role || !organizationType || !organizationId) {
      return NextResponse.json(
        { error: 'userId, role, organizationType, and organizationId are required' },
        { status: 400 }
      )
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId,
        role,
        organizationType,
        organizationId,
      },
      include: { user: true },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error adding project member:', error)
    return NextResponse.json({ error: 'Failed to add project member' }, { status: 500 })
  }
}