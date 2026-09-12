import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const domain = searchParams.get('domain')
    const search = searchParams.get('search') || ''

    const where: any = {}
    if (domain) where.domain = domain
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { domain: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { userSkills: true, problemSkills: true } },
        },
      }),
      prisma.skill.count({ where }),
    ])

    return NextResponse.json({
      skills,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, domain, category } = body

    if (!name || !domain) {
      return NextResponse.json({ error: 'name and domain are required' }, { status: 400 })
    }

    const existing = await prisma.skill.findUnique({ where: { name } })
    if (existing) {
      return NextResponse.json({ error: 'Skill already exists' }, { status: 409 })
    }

    const skill = await prisma.skill.create({
      data: { name, domain, category },
    })

    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}