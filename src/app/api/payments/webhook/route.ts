import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resetUserUsage } from '@/lib/user'

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
        
        // Update user subscription and reset usage
        const payment = await prisma.payment.findUnique({
          where: { yandexPaymentId: body.object.id },
          select: { userId: true, subscriptionType: true }
        })
        
        if (payment && payment.subscriptionType) {
          // Находим план по названию
          const plan = await prisma.plan.findFirst({
            where: { name: payment.subscriptionType }
          })
          
          if (plan) {
            await prisma.user.update({
              where: { id: payment.userId },
              data: { planId: plan.id }
            })
            
            // Сбрасываем счетчик использований
            await resetUserUsage(payment.userId)
          }
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