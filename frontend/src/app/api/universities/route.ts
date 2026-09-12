import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VerificationStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') as VerificationStatus | null
    const search = searchParams.get('search') || ''
    const regionId = searchParams.get('regionId')

    const where: any = {}
    if (status) where.verificationStatus = status
    if (regionId) where.regionId = regionId
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { registrationNumber: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [universities, total] = await Promise.all([
      prisma.university.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          region: true,
          _count: {
            select: { students: true, faculty: true, mentors: true, teams: true },
          },
        },
      }),
      prisma.university.count({ where }),
    ])

    return NextResponse.json({
      universities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching universities:', error)
    return NextResponse.json({ error: 'Failed to fetch universities' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      registrationNumber,
      description,
      website,
      email,
      phone,
      address,
      district,
      state,
      country,
      logo,
      regionId,
    } = body

    if (!name || !registrationNumber || !email || !state || !regionId) {
      return NextResponse.json(
        { error: 'Name, registrationNumber, email, state, and regionId are required' },
        { status: 400 }
      )
    }

    const existing = await prisma.university.findUnique({
      where: { registrationNumber },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Registration number already exists' },
        { status: 409 }
      )
    }

    const university = await prisma.university.create({
      data: {
        name,
        registrationNumber,
        description,
        website,
        email,
        phone,
        address,
        district,
        state,
        country: country || 'India',
        logo,
        regionId,
      },
      include: { region: true },
    })

    return NextResponse.json(university, { status: 201 })
  } catch (error) {
    console.error('Error creating university:', error)
    return NextResponse.json({ error: 'Failed to create university' }, { status: 500 })
  }
}