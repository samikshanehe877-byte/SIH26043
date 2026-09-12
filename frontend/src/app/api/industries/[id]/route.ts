import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const industry = await prisma.industry.findUnique({
      where: { id },
      include: {
        region: true,
        employees: { include: { user: true } },
        mentors: { include: { user: true } },
        experts: { include: { user: true } },
        teams: { include: { members: { include: { employee: { include: { user: true } } } } } },
        projects: { include: { problem: true } },
      },
    })

    if (!industry) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 })
    }

    return NextResponse.json(industry)
  } catch (error) {
    console.error('Error fetching industry:', error)
    return NextResponse.json({ error: 'Failed to fetch industry' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const industry = await prisma.industry.update({
      where: { id },
      data: body,
      include: { region: true },
    })

    return NextResponse.json(industry)
  } catch (error) {
    console.error('Error updating industry:', error)
    return NextResponse.json({ error: 'Failed to update industry' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.industry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting industry:', error)
    return NextResponse.json({ error: 'Failed to delete industry' }, { status: 500 })
  }
}