import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const problemId = searchParams.get('problemId')
    const userId = searchParams.get('userId')

    const where: any = {}
    if (problemId) where.problemId = problemId
    if (userId) where.userId = userId

    const evidence = await prisma.evidence.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        problem: { select: { id: true, title: true } },
        user: { select: { id: true, name: true, profilePhoto: true } },
      },
    })

    return NextResponse.json(evidence)
  } catch (error) {
    console.error('Error fetching evidence:', error)
    return NextResponse.json({ error: 'Failed to fetch evidence' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { problemId, userId, type, name, contentType, size, url, description } = body

    if (!problemId || !userId || !type || !name || !contentType || size === undefined || !url) {
      return NextResponse.json(
        { error: 'problemId, userId, type, name, contentType, size, and url are required' },
        { status: 400 }
      )
    }

    const evidence = await prisma.evidence.create({
      data: { problemId, userId, type, name, contentType, size, url, description },
      include: { problem: true, user: { select: { id: true, name: true } } },
    })

    return NextResponse.json(evidence, { status: 201 })
  } catch (error) {
    console.error('Error creating evidence:', error)
    return NextResponse.json({ error: 'Failed to create evidence' }, { status: 500 })
  }
}