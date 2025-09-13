import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { subscriptionType, paymentId } = await request.json()
    
    if (!subscriptionType || !paymentId) {
      return NextResponse.json(
        { error: 'Subscription type and payment ID are required' },
        { status: 400 }
      )
    }

    // Validate subscription type
    const validSubscriptions = ['FREE', 'PRO', 'ULTRA']
    if (!validSubscriptions.includes(subscriptionType)) {
      return NextResponse.json(
        { error: 'Invalid subscription type' },
        { status: 400 }
      )
    }

    // Update user subscription and reset usage counts
    const updatedUser = await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        subscriptionStatus: subscriptionType,
        usageCountDay: 0,
        usageCountMonth: 0,
        lastGenerationDate: null
      }
    })

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: authUser.userId,
        amount: subscriptionType === 'PRO' ? 1000 : 3000,
        currency: 'RUB',
        status: 'COMPLETED',
        yandexPaymentId: paymentId,
        subscriptionType: subscriptionType
      }
    })

    console.log('✅ Subscription updated:', {
      userId: authUser.userId,
      subscriptionType,
      paymentId
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        subscriptionStatus: updatedUser.subscriptionStatus,
        usageCountDay: updatedUser.usageCountDay,
        usageCountMonth: updatedUser.usageCountMonth
      },
      payment: {
        id: payment.id,
        amount: payment.amount,
        subscriptionType: payment.subscriptionType
      }
    })

  } catch (error) {
    console.error('❌ Error updating subscription:', error)
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
