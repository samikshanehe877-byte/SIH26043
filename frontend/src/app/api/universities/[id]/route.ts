import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        region: true,
        students: { include: { user: true } },
        faculty: { include: { user: true } },
        mentors: { include: { user: true } },
        teams: { include: { members: { include: { student: { include: { user: true } } } } } },
        projects: { include: { problem: true } },
      },
    })

    if (!university) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 })
    }

    return NextResponse.json(university)
  } catch (error) {
    console.error('Error fetching university:', error)
    return NextResponse.json({ error: 'Failed to fetch university' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const university = await prisma.university.update({
      where: { id },
      data: body,
      include: { region: true },
    })

    return NextResponse.json(university)
  } catch (error) {
    console.error('Error updating university:', error)
    return NextResponse.json({ error: 'Failed to update university' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.university.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting university:', error)
    return NextResponse.json({ error: 'Failed to delete university' }, { status: 500 })
  }
}