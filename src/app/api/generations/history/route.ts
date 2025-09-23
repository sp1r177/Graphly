import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const generations = await prisma.generation.findMany({
      where: { userId: authUser.id },
      select: {
        id: true,
        prompt: true,
        outputText: true,
        templateType: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Transform data to match expected format
    const formattedGenerations = generations.map(gen => ({
      id: gen.id,
      prompt: gen.prompt,
      outputText: gen.outputText,
      outputImageUrl: null, // Not implemented yet
      templateType: gen.templateType,
      timestamp: gen.createdAt,
    }))

    return NextResponse.json(formattedGenerations)
  } catch (error) {
    console.error('Generation history fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}