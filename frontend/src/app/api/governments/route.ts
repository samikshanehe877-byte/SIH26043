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
        { department: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [governments, total] = await Promise.all([
      prisma.government.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          region: true,
          _count: { select: { officers: true } },
        },
      }),
      prisma.government.count({ where }),
    ])

    return NextResponse.json({
      governments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Error fetching governments:', error)
    return NextResponse.json({ error: 'Failed to fetch governments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, department, level, email, phone, address, district, state, country, regionId } = body

    if (!name || !department || !level || !email || !state || !regionId) {
      return NextResponse.json(
        { error: 'name, department, level, email, state, and regionId are required' },
        { status: 400 }
      )
    }

    const government = await prisma.government.create({
      data: { name, department, level, email, phone, address, district, state, country: country || 'India', regionId },
      include: { region: true },
    })

    return NextResponse.json(government, { status: 201 })
  } catch (error) {
    console.error('Error creating government:', error)
    return NextResponse.json({ error: 'Failed to create government' }, { status: 500 })
  }
}