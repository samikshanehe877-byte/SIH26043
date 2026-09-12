import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, AccountStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const role = searchParams.get('role') as UserRole | null
    const status = searchParams.get('status') as AccountStatus | null
    const search = searchParams.get('search') || ''

    const where: any = {}
    if (role) where.role = role
    if (status) where.accountStatus = status
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          universityStudents: { include: { university: true } },
          universityMentors: { include: { university: true } },
          universityFaculty: { include: { university: true } },
          industryEmployees: { include: { industry: true } },
          industryMentors: { include: { industry: true } },
          industryExperts: { include: { industry: true } },
          governmentOfficers: { include: { government: true } },
          skills: { include: { skill: true } },
        },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, passwordHash, phone, role, profilePhoto, location, regionId } = body

    if (!name || !email || !passwordHash) {
      return NextResponse.json(
        { error: 'Name, email, and passwordHash are required' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone,
        role: role || 'CITIZEN',
        profilePhoto,
        location,
        regionId,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}