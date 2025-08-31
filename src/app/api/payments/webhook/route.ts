import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // In production, verify webhook signature here
    // const signature = request.headers.get('x-webhook-signature')
    
    const body = await request.json()
    
    // Handle different webhook events
    switch (body.event) {
      case 'payment.succeeded':
        // Update payment status
        await prisma.payment.update({
          where: { yandexPaymentId: body.object.id },
          data: { status: 'COMPLETED' }
        })
        
        // Update user subscription
        const payment = await prisma.payment.findFirst({
          where: { yandexPaymentId: body.object.id },
          include: { user: true }
        })
        
        if (payment) {
          await prisma.user.update({
            where: { id: payment.userId },
            data: {
              subscriptionStatus: payment.subscriptionType,
              usageCountDay: 0,
              usageCountMonth: 0,
            }
          })
        }
        break
        
      case 'payment.cancelled':
        await prisma.payment.update({
          where: { yandexPaymentId: body.object.id },
          data: { status: 'CANCELLED' }
        })
        break
        
      case 'payment.failed':
        await prisma.payment.update({
          where: { yandexPaymentId: body.object.id },
          data: { status: 'FAILED' }
        })
        break
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}