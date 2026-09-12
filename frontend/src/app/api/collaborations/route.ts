import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const problemId = searchParams.get('problemId')
    const universityId = searchParams.get('universityId')
    const industryId = searchParams.get('industryId')
    const governmentId = searchParams.get('governmentId')
    const status = searchParams.get('status')

    const where: any = {}
    if (problemId) where.problemId = problemId
    if (universityId) where.universityId = universityId
    if (industryId) where.industryId = industryId
    if (governmentId) where.governmentId = governmentId
    if (status) where.status = status

    const collaborations = await prisma.collaboration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        problem: { select: { id: true, title: true } },
        university: { select: { id: true, name: true } },
        industry: { select: { id: true, companyName: true } },
        government: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(collaborations)
  } catch (error) {
    console.error('Error fetching collaborations:', error)
    return NextResponse.json({ error: 'Failed to fetch collaborations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { problemId, universityId, industryId, governmentId, status, proposedBy, description } = body

    if (!problemId || !proposedBy) {
      return NextResponse.json({ error: 'problemId and proposedBy are required' }, { status: 400 })
    }

    const collaboration = await prisma.collaboration.create({
      data: { problemId, universityId, industryId, governmentId, status: status || 'PROPOSED', proposedBy, description },
      include: { problem: true, university: true, industry: true, government: true },
    })

    return NextResponse.json(collaboration, { status: 201 })
  } catch (error) {
    console.error('Error creating collaboration:', error)
    return NextResponse.json({ error: 'Failed to create collaboration' }, { status: 500 })
  }
}