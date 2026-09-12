import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MatchStatus } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        problem: { include: { ownerUser: true, region: true } },
        user: { select: { id: true, name: true, email: true, profilePhoto: true } },
      },
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    return NextResponse.json(match)
  } catch (error) {
    console.error('Error fetching match:', error)
    return NextResponse.json({ error: 'Failed to fetch match' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const match = await prisma.match.update({
      where: { id },
      data: body,
      include: { problem: true, user: true },
    })

    return NextResponse.json(match)
  } catch (error) {
    console.error('Error updating match:', error)
    return NextResponse.json({ error: 'Failed to update match' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.match.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting match:', error)
    return NextResponse.json({ error: 'Failed to delete match' }, { status: 500 })
  }
}