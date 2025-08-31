import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook signature (implement in production)
    // const signature = request.headers.get('x-webhook-signature')
    // if (!verifyYandexKassaSignature(body, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    // }

    const { type, object: paymentData } = body

    if (type !== 'payment.succeeded' && type !== 'payment.canceled') {
      return NextResponse.json({ status: 'ok' })
    }

    const yandexPaymentId = paymentData.id
    const status = paymentData.status // 'succeeded', 'canceled', etc.

    // Find payment in database
    const payment = await prisma.payment.findFirst({
      where: { yandexPaymentId },
      include: { user: true }
    })

    if (!payment) {
      console.error('Payment not found:', yandexPaymentId)
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Update payment status
    let newPaymentStatus: 'COMPLETED' | 'FAILED' | 'CANCELLED'
    
    switch (status) {
      case 'succeeded':
        newPaymentStatus = 'COMPLETED'
        break
      case 'canceled':
        newPaymentStatus = 'CANCELLED'
        break
      default:
        newPaymentStatus = 'FAILED'
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: newPaymentStatus }
    })

    // If payment succeeded, upgrade user subscription
    if (status === 'succeeded') {
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          subscriptionStatus: payment.subscriptionType,
          usageCountMonth: 0, // Reset monthly usage on upgrade
        }
      })

      console.log(`User ${payment.user.email} upgraded to ${payment.subscriptionType}`)
      
      // Here you could also:
      // - Send confirmation email
      // - Trigger onboarding flow
      // - Update analytics
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Function to verify Yandex.Kassa webhook signature (implement in production)
// function verifyYandexKassaSignature(body: any, signature: string | null): boolean {
//   if (!signature) return false
//   
//   const crypto = require('crypto')
//   const secret = process.env.YANDEX_KASSA_SECRET_KEY
//   const expectedSignature = crypto
//     .createHmac('sha256', secret)
//     .update(JSON.stringify(body))
//     .digest('hex')
//   
//   return signature === expectedSignature
// }