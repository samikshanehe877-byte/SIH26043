import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, UserRole } from '@/lib/auth'

const ALLOWED_ROLES_GET: UserRole[] = ["FACULTY", "INDUSTRY_EMPLOYEE", "INDUSTRY_EXPERT", "GOVERNMENT_OFFICER", "ADMIN"]
const ALLOWED_ROLES_POST: UserRole[] = ["FACULTY", "INDUSTRY_EMPLOYEE", "INDUSTRY_EXPERT", "GOVERNMENT_OFFICER", "ADMIN"]

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  if (!user || !ALLOWED_ROLES_GET.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
  const user = await getAuthUser();
  if (!user || !ALLOWED_ROLES_POST.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json()
    const { problemId, universityId, industryId, governmentId, status, proposedBy, description } = body

    if (!problemId || !proposedBy) {
      return NextResponse.json({ error: 'problemId and proposedBy are required' }, { status: 400 })
    }

    // Ensure user can only propose as themselves
    if (proposedBy !== user.id) {
      return NextResponse.json({ error: 'Cannot propose collaboration for another user' }, { status: 403 });
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