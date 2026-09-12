import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MatchStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const problemId = searchParams.get('problemId')
    const userId = searchParams.get('userId')
    const organizationId = searchParams.get('organizationId')
    const status = searchParams.get('status') as MatchStatus | null

    const where: any = {}
    if (problemId) where.problemId = problemId
    if (userId) where.userId = userId
    if (organizationId) where.organizationId = organizationId
    if (status) where.status = status

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { matchScore: 'desc' },
        include: {
          problem: { include: { ownerUser: { select: { id: true, name: true } } } },
          user: { select: { id: true, name: true, email: true, profilePhoto: true } },
        },
      }),
      prisma.match.count({ where }),
    ])

    return NextResponse.json({
      matches,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      problemId,
      userId,
      organizationId,
      organizationType,
      matchScore,
      semanticScore,
      skillScore,
      regionalScore,
      experienceScore,
      reason,
    } = body

    if (!problemId || !userId || !organizationId || !organizationType || matchScore === undefined) {
      return NextResponse.json(
        { error: 'problemId, userId, organizationId, organizationType, and matchScore are required' },
        { status: 400 }
      )
    }

    const match = await prisma.match.create({
      data: {
        problemId,
        userId,
        organizationId,
        organizationType,
        matchScore,
        semanticScore,
        skillScore,
        regionalScore,
        experienceScore,
        reason,
      },
      include: {
        problem: true,
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(match, { status: 201 })
  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 })
  }
}