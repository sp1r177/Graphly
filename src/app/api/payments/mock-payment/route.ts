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

    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('planId')
    const amount = searchParams.get('amount')

    if (!planId || !amount) {
      return NextResponse.json(
        { error: 'Plan ID and amount are required' },
        { status: 400 }
      )
    }

    // Validate plan
    const validPlans = ['start', 'business']
    if (!validPlans.includes(planId)) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: authUser.userId,
        amount: parseFloat(amount),
        currency: 'RUB',
        status: 'PENDING',
        subscriptionType: planId === 'start' ? 'PRO' : 'ULTRA',
      }
    })

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update payment status to completed
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'COMPLETED' }
    })

    // Update user subscription
    await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        subscriptionStatus: planId === 'start' ? 'PRO' : 'ULTRA',
        usageCountDay: 0,
        usageCountMonth: 0,
      }
    })

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      message: 'Payment completed successfully',
      subscriptionType: planId === 'start' ? 'PRO' : 'ULTRA'
    })

  } catch (error) {
    console.error('Mock payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
