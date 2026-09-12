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
        { companyName: { contains: search, mode: 'insensitive' } },
        { registrationNumber: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [industries, total] = await Promise.all([
      prisma.industry.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          region: true,
          _count: {
            select: { employees: true, mentors: true, experts: true, teams: true },
          },
        },
      }),
      prisma.industry.count({ where }),
    ])

    return NextResponse.json({
      industries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching industries:', error)
    return NextResponse.json({ error: 'Failed to fetch industries' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      companyName,
      registrationNumber,
      industryType,
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

    if (!companyName || !registrationNumber || !industryType || !email || !state || !regionId) {
      return NextResponse.json(
        { error: 'companyName, registrationNumber, industryType, email, state, and regionId are required' },
        { status: 400 }
      )
    }

    const existing = await prisma.industry.findUnique({
      where: { registrationNumber },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Registration number already exists' },
        { status: 409 }
      )
    }

    const industry = await prisma.industry.create({
      data: {
        companyName,
        registrationNumber,
        industryType,
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

    return NextResponse.json(industry, { status: 201 })
  } catch (error) {
    console.error('Error creating industry:', error)
    return NextResponse.json({ error: 'Failed to create industry' }, { status: 500 })
  }
}