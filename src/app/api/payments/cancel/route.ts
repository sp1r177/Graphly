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

    const { paymentId } = await request.json()

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    // Check if payment belongs to user
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId: authUser.userId,
        status: 'PENDING'
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found or cannot be cancelled' },
        { status: 404 }
      )
    }

    // Update payment status to cancelled
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'CANCELLED' }
    })

    return NextResponse.json({ message: 'Payment cancelled successfully' })
  } catch (error) {
    console.error('Payment cancellation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}