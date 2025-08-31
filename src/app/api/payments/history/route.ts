import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payments = await prisma.payment.findMany({
      where: { userId: authUser.userId },
      orderBy: { timestamp: 'desc' },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        subscriptionType: true,
        timestamp: true,
      }
    })

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Payment history fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}