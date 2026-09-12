import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProblemStatus, ProblemType, ProblemGiverType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') as ProblemStatus | null
    const problemType = searchParams.get('problemType') as ProblemType | null
    const domain = searchParams.get('domain')
    const regionId = searchParams.get('regionId')
    const search = searchParams.get('search') || ''
    const ownerUserId = searchParams.get('ownerUserId')

    const where: any = {}
    if (status) where.status = status
    if (problemType) where.problemType = problemType
    if (domain) where.domain = { contains: domain, mode: 'insensitive' }
    if (regionId) where.regionId = regionId
    if (ownerUserId) where.ownerUserId = ownerUserId
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          ownerUser: { select: { id: true, name: true, email: true, profilePhoto: true } },
          region: true,
          project: true,
          matches: { include: { user: { select: { id: true, name: true } } } },
          evidence: true,
          skills: { include: { skill: true } },
        },
      }),
      prisma.problem.count({ where }),
    ])

    return NextResponse.json({
      problems,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Error fetching problems:', error)
    return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      problemType,
      domain,
      subdomain,
      ownerUserId,
      ownerOrganizationId,
      ownerOrganizationType,
      regionId,
      district,
      state,
      latitude,
      longitude,
      impactLevel,
      urgency,
      rawInput,
      problemNature,
      affectedArea,
      affectedPopulation,
      frequency,
      requiredCapabilities,
      suggestedIntervention,
      problemGiverType,
      communityGroupName,
    } = body

    if (!title || !description || !domain || !ownerUserId || !regionId || !state) {
      return NextResponse.json(
        { error: 'title, description, domain, ownerUserId, regionId, and state are required' },
        { status: 400 }
      )
    }

    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        problemType: problemType || 'HYBRID',
        domain,
        subdomain,
        ownerUserId,
        ownerOrganizationId,
        ownerOrganizationType,
        regionId,
        district,
        state,
        latitude,
        longitude,
        impactLevel: impactLevel || 1,
        urgency: urgency || 1,
        rawInput,
        problemNature,
        affectedArea,
        affectedPopulation,
        frequency,
        requiredCapabilities: requiredCapabilities || [],
        suggestedIntervention,
        problemGiverType,
        communityGroupName,
      },
      include: {
        ownerUser: { select: { id: true, name: true, email: true } },
        region: true,
      },
    })

    return NextResponse.json(problem, { status: 201 })
  } catch (error) {
    console.error('Error creating problem:', error)
    return NextResponse.json({ error: 'Failed to create problem' }, { status: 500 })
  }
}