import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
      orderBy: { proficiency: 'desc' },
    })

    return NextResponse.json(userSkills)
  } catch (error) {
    console.error('Error fetching user skills:', error)
    return NextResponse.json({ error: 'Failed to fetch user skills' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const body = await request.json()
    const { skillId, proficiency, experienceYears } = body

    if (!skillId) {
      return NextResponse.json({ error: 'skillId is required' }, { status: 400 })
    }

    const userSkill = await prisma.userSkill.upsert({
      where: { userId_skillId: { userId, skillId } },
      update: { proficiency: proficiency || 1, experienceYears },
      create: { userId, skillId, proficiency: proficiency || 1, experienceYears },
      include: { skill: true },
    })

    return NextResponse.json(userSkill)
  } catch (error) {
    console.error('Error adding user skill:', error)
    return NextResponse.json({ error: 'Failed to add user skill' }, { status: 500 })
  }
}