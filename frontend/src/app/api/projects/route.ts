import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProjectStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') as ProjectStatus | null
    const universityId = searchParams.get('universityId')
    const industryId = searchParams.get('industryId')
    const search = searchParams.get('search') || ''

    const where: any = {}
    if (status) where.status = status
    if (universityId) where.universityId = universityId
    if (industryId) where.industryId = industryId
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          problem: { include: { ownerUser: { select: { id: true, name: true } } } },
          university: true,
          industry: true,
          members: { include: { user: { select: { id: true, name: true, email: true, profilePhoto: true } } } },
        },
      }),
      prisma.project.count({ where }),
    ])

    return NextResponse.json({
      projects,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { problemId, title, description, status, startDate, targetDate, createdBy, universityId, industryId } = body

    if (!problemId || !title || !createdBy) {
      return NextResponse.json(
        { error: 'problemId, title, and createdBy are required' },
        { status: 400 }
      )
    }

    const existingProject = await prisma.project.findUnique({ where: { problemId } })
    if (existingProject) {
      return NextResponse.json({ error: 'Project already exists for this problem' }, { status: 409 })
    }

    const project = await prisma.project.create({
      data: {
        problemId,
        title,
        description,
        status: status || 'PLANNING',
        startDate: startDate ? new Date(startDate) : null,
        targetDate: targetDate ? new Date(targetDate) : null,
        createdBy,
        universityId,
        industryId,
      },
      include: {
        problem: true,
        university: true,
        industry: true,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}