import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

// Yandex.Kassa configuration
const YANDEX_KASSA_SHOP_ID = process.env.YANDEX_KASSA_SHOP_ID || 'demo-shop-id'
const YANDEX_KASSA_SECRET_KEY = process.env.YANDEX_KASSA_SECRET_KEY || 'demo-secret-key'

interface PricingPlan {
  id: string
  name: string
  price: number
  currency: string
}

const pricingPlans: Record<string, PricingPlan> = {
  PRO: {
    id: 'PRO',
    name: 'Pro подписка',
    price: 1000,
    currency: 'RUB'
  },
  ULTRA: {
    id: 'ULTRA', 
    name: 'Ultra подписка',
    price: 2000,
    currency: 'RUB'
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { planId, returnUrl } = await request.json()

    if (!planId || !pricingPlans[planId]) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }

    const plan = pricingPlans[planId]

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        userId: authUser.userId,
        amount: plan.price,
        currency: plan.currency,
        status: 'PENDING',
        subscriptionType: planId as any,
      }
    })

    // In production, integrate with real Yandex.Kassa API
    // This is a stub implementation for development
    const yandexKassaPayment = await createYandexKassaPayment({
      amount: plan.price,
      currency: plan.currency,
      description: `Подписка ${plan.name}`,
      orderId: payment.id,
      returnUrl: returnUrl || `${process.env.NEXTAUTH_URL}/dashboard`,
      userEmail: authUser.email,
    })

    // Update payment with Yandex.Kassa payment ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        yandexPaymentId: yandexKassaPayment.id,
      }
    })

    return NextResponse.json({
      paymentId: payment.id,
      paymentUrl: yandexKassaPayment.confirmation.confirmation_url,
      amount: plan.price,
      currency: plan.currency,
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

// Stub function for Yandex.Kassa integration
async function createYandexKassaPayment(params: {
  amount: number
  currency: string
  description: string
  orderId: string
  returnUrl: string
  userEmail: string
}) {
  // In production, make actual API call to Yandex.Kassa
  // https://yookassa.ru/developers/api
  
  console.log('Creating Yandex.Kassa payment:', params)
  
  // Simulate API response structure
  const mockResponse = {
    id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    amount: {
      value: params.amount.toFixed(2),
      currency: params.currency
    },
    description: params.description,
    confirmation: {
      type: 'redirect',
      confirmation_url: `https://yoomoney.ru/checkout/payments/v2/contract?orderId=${params.orderId}`
    },
    created_at: new Date().toISOString(),
    metadata: {
      order_id: params.orderId,
      user_email: params.userEmail
    }
  }

  // In production, uncomment and implement actual API call:
  /*
  const response = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${YANDEX_KASSA_SHOP_ID}:${YANDEX_KASSA_SECRET_KEY}`).toString('base64')}`,
      'Content-Type': 'application/json',
      'Idempotence-Key': params.orderId,
    },
    body: JSON.stringify({
      amount: {
        value: params.amount.toFixed(2),
        currency: params.currency
      },
      confirmation: {
        type: 'redirect',
        return_url: params.returnUrl
      },
      description: params.description,
      metadata: {
        order_id: params.orderId,
        user_email: params.userEmail
      }
    })
  })

  if (!response.ok) {
    throw new Error('Yandex.Kassa API error')
  }

  return await response.json()
  */

  return mockResponse
}