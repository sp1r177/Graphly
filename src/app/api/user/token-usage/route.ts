import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        subscriptionStatus: true,
        usageCountDay: true,
        usageCountMonth: true,
        tokensUsedDay: true,
        tokensUsedMonth: true,
        lastGenerationDate: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get recent generations for detailed stats
    const recentGenerations = await prisma.generation.findMany({
      where: { userId: authUser.userId },
      orderBy: { timestamp: 'desc' },
      take: 10,
      select: {
        id: true,
        templateType: true,
        tokensUsed: true,
        timestamp: true
      }
    })

    // Calculate limits based on subscription
    const limits = {
      daily: user.subscriptionStatus === 'FREE' ? 5000 : -1,
      monthly: user.subscriptionStatus === 'PRO' ? 50000 : -1
    }

    const usage = {
      daily: {
        generations: user.usageCountDay,
        tokens: user.tokensUsedDay || 0,
        limit: limits.daily,
        remaining: limits.daily > 0 ? Math.max(0, limits.daily - (user.tokensUsedDay || 0)) : -1
      },
      monthly: {
        generations: user.usageCountMonth,
        tokens: user.tokensUsedMonth || 0,
        limit: limits.monthly,
        remaining: limits.monthly > 0 ? Math.max(0, limits.monthly - (user.tokensUsedMonth || 0)) : -1
      }
    }

    return NextResponse.json({
      subscription: user.subscriptionStatus,
      usage,
      recentGenerations,
      lastGeneration: user.lastGenerationDate
    })

  } catch (error) {
    console.error('Token usage error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
