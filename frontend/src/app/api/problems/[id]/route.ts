import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        ownerUser: { select: { id: true, name: true, email: true, profilePhoto: true, phone: true } },
        region: true,
        project: {
          include: {
            members: { include: { user: { select: { id: true, name: true, email: true, profilePhoto: true } } } },
            university: true,
            industry: true,
          },
        },
        matches: {
          include: {
            user: { select: { id: true, name: true, email: true, profilePhoto: true } },
          },
          orderBy: { matchScore: 'desc' },
        },
        evidence: { include: { user: { select: { id: true, name: true } } } },
        verificationHistory: {
          include: { officer: { include: { user: { select: { id: true, name: true } } } } },
          orderBy: { createdAt: 'desc' },
        },
        skills: { include: { skill: true } },
      },
    })

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
    }

    return NextResponse.json(problem)
  } catch (error) {
    console.error('Error fetching problem:', error)
    return NextResponse.json({ error: 'Failed to fetch problem' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const problem = await prisma.problem.update({
      where: { id },
      data: body,
      include: {
        ownerUser: { select: { id: true, name: true, email: true } },
        region: true,
        project: true,
        matches: true,
        evidence: true,
        skills: { include: { skill: true } },
      },
    })

    return NextResponse.json(problem)
  } catch (error) {
    console.error('Error updating problem:', error)
    return NextResponse.json({ error: 'Failed to update problem' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.problem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting problem:', error)
    return NextResponse.json({ error: 'Failed to delete problem' }, { status: 500 })
  }
}