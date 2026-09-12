import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const problemId = searchParams.get('problemId')
    const officerId = searchParams.get('officerId')

    const where: any = {}
    if (problemId) where.problemId = problemId
    if (officerId) where.officerId = officerId

    const history = await prisma.verificationHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        problem: { select: { id: true, title: true } },
        officer: { include: { user: { select: { id: true, name: true } } } },
      },
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error('Error fetching verification history:', error)
    return NextResponse.json({ error: 'Failed to fetch verification history' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { problemId, officerId, note, previousStatus, decision, status } = body

    if (!problemId || !officerId || !previousStatus || !decision || !status) {
      return NextResponse.json(
        { error: 'problemId, officerId, previousStatus, decision, and status are required' },
        { status: 400 }
      )
    }

    const history = await prisma.verificationHistory.create({
      data: { problemId, officerId, note, previousStatus, decision, status },
      include: { problem: true, officer: { include: { user: true } } },
    })

    return NextResponse.json(history, { status: 201 })
  } catch (error) {
    console.error('Error creating verification history:', error)
    return NextResponse.json({ error: 'Failed to create verification history' }, { status: 500 })
  }
}