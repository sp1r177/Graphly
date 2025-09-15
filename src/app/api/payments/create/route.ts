import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getUserFromRequest(request)
    
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

    // Mock payment creation (will be implemented later)
    const mockPaymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const mockPaymentUrl = `https://yandex.ru/checkout?payment_id=${mockPaymentId}&amount=${amount}&currency=${currency}`

    return NextResponse.json({
      paymentId: mockPaymentId,
      paymentUrl: mockPaymentUrl,
      status: 'PENDING',
      message: 'Payment system will be implemented later'
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}