import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test Prisma connection
    const userCount = await prisma.user.count()

    return NextResponse.json({
      status: 'success',
      message: 'Prisma connection working',
      data: { userCount }
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Prisma test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
