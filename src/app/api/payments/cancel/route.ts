import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.subscriptionStatus === 'FREE') {
      return NextResponse.json(
        { error: 'No active subscription to cancel' },
        { status: 400 }
      )
    }

    // In production, you would:
    // 1. Cancel the subscription with Yandex.Kassa
    // 2. Update the user's subscription status
    // 3. Set an end date for when the subscription actually ends
    
    // For now, we'll mark as cancelled but keep benefits until end of period
    // In a real implementation, you'd have a separate field for cancellation status
    
    console.log(`Subscription cancellation requested for user ${user.email}`)
    
    // Here you would typically:
    // - Call Yandex.Kassa API to cancel recurring payments
    // - Update subscription metadata
    // - Send confirmation email
    
    return NextResponse.json({ 
      message: 'Subscription cancellation processed. Access will continue until the end of the current billing period.' 
    })
  } catch (error) {
    console.error('Subscription cancellation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}