import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const generations = await prisma.generation.findMany({
      where: { userId: authUser.userId },
      orderBy: { timestamp: 'desc' },
      take: 50,
      select: {
        id: true,
        prompt: true,
        outputText: true,
        outputImageUrl: true,
        templateType: true,
        timestamp: true,
      }
    })

    return NextResponse.json(generations)
  } catch (error) {
    console.error('Generation history fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}