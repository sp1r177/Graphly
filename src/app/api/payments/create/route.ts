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

    const { planId, amount, currency = 'RUB' } = await request.json()

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
        currency,
        status: 'PENDING',
        subscriptionType: planId === 'start' ? 'PRO' : 'ULTRA',
      }
    })

    // In production, integrate with Yandex.Kassa here
    // For now, return mock payment data
    const mockPaymentUrl = `https://yandex.ru/checkout?payment_id=${payment.id}&amount=${amount}&currency=${currency}`

    return NextResponse.json({
      paymentId: payment.id,
      paymentUrl: mockPaymentUrl,
      status: 'PENDING'
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}