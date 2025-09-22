import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getUserById, getUserLimits } from '@/lib/user'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await getUserById(authUser.id)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get recent generations for detailed stats
    const recentGenerations = await prisma.generation.findMany({
      where: { userId: authUser.id },
      select: {
        id: true,
        templateType: true,
        tokensUsed: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Get user limits
    const limits = await getUserLimits(authUser.id)

    const usage = {
      daily: {
        generations: limits.used,
        tokens: 0, // We'll implement token tracking later
        limit: limits.daily,
        remaining: limits.remaining
      },
      monthly: {
        generations: limits.used,
        tokens: 0, // We'll implement token tracking later
        limit: limits.monthly,
        remaining: limits.monthly > 0 ? Math.max(0, limits.monthly - limits.used) : -1
      }
    }

    // Format recent generations
    const formattedGenerations = recentGenerations.map(gen => ({
      id: gen.id,
      templateType: gen.templateType,
      tokensUsed: gen.tokensUsed,
      timestamp: gen.createdAt
    }))

    return NextResponse.json({
      subscription: user.plan?.name || 'FREE',
      usage,
      recentGenerations: formattedGenerations,
      lastGeneration: formattedGenerations[0] || null
    })

  } catch (error) {
    console.error('Token usage error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
