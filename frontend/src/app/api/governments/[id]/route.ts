import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const government = await prisma.government.findUnique({
      where: { id },
      include: {
        region: true,
        officers: { include: { user: true } },
      },
    })

    if (!government) {
      return NextResponse.json({ error: 'Government not found' }, { status: 404 })
    }

    return NextResponse.json(government)
  } catch (error) {
    console.error('Error fetching government:', error)
    return NextResponse.json({ error: 'Failed to fetch government' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const government = await prisma.government.update({
      where: { id },
      data: body,
      include: { region: true },
    })

    return NextResponse.json(government)
  } catch (error) {
    console.error('Error updating government:', error)
    return NextResponse.json({ error: 'Failed to update government' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.government.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting government:', error)
    return NextResponse.json({ error: 'Failed to delete government' }, { status: 500 })
  }
}