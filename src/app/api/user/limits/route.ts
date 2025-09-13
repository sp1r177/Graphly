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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Define limits for each subscription
    const limits = {
      'FREE': { daily: 1, monthly: 1, name: 'Бесплатно' },
      'PRO': { daily: 100, monthly: 100, name: 'Старт (1000 ₽/мес)' },
      'ULTRA': { daily: 500, monthly: 500, name: 'Бизнес (3000 ₽/мес)' }
    }

    const userLimits = limits[user.subscriptionStatus as keyof typeof limits] || limits.FREE

    // Calculate remaining generations
    const remainingDaily = Math.max(0, userLimits.daily - user.usageCountDay)
    const remainingMonthly = Math.max(0, userLimits.monthly - user.usageCountMonth)

    return NextResponse.json({
      subscription: {
        status: user.subscriptionStatus,
        name: userLimits.name
      },
      limits: {
        daily: userLimits.daily,
        monthly: userLimits.monthly
      },
      usage: {
        daily: user.usageCountDay,
        monthly: user.usageCountMonth
      },
      remaining: {
        daily: remainingDaily,
        monthly: remainingMonthly
      },
      lastGeneration: user.lastGenerationDate
    })

  } catch (error) {
    console.error('❌ Error getting user limits:', error)
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
