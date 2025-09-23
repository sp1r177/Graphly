import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      tests: []
    }

    // Test 1: Environment variables
    const envTest = {
      name: 'Environment Variables',
      status: 'unknown',
      details: {
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
        VK_CLIENT_ID: process.env.VK_CLIENT_ID ? 'SET' : 'NOT_SET',
        VK_CLIENT_SECRET: process.env.VK_CLIENT_SECRET ? 'SET' : 'NOT_SET',
        YANDEX_API_KEY: process.env.YANDEX_API_KEY ? 'SET' : 'NOT_SET',
        YANDEX_FOLDER_ID: process.env.YANDEX_FOLDER_ID ? 'SET' : 'NOT_SET',
      }
    }

    if (process.env.DATABASE_URL && process.env.NEXTAUTH_SECRET) {
      envTest.status = 'pass'
    } else {
      envTest.status = 'fail'
    }

    results.tests.push(envTest)

    // Test 2: Prisma connection
    const prismaTest = {
      name: 'Prisma Connection',
      status: 'unknown',
      details: {}
    }

    try {
      const userCount = await prisma.user.count()
      prismaTest.status = 'pass'
      prismaTest.details = { message: 'Connection successful', userCount }
    } catch (err) {
      prismaTest.status = 'fail'
      prismaTest.details = { error: err instanceof Error ? err.message : 'Unknown error' }
    }

    results.tests.push(prismaTest)

    // Test 3: Database tables
    const tablesTest = {
      name: 'Database Tables',
      status: 'unknown',
      details: {}
    }

    try {
      // Test all tables
      const userCount = await prisma.user.count()
      const planCount = await prisma.plan.count()
      const usageCount = await prisma.usage.count()
      const generationCount = await prisma.generation.count()
      const paymentCount = await prisma.payment.count()

      tablesTest.status = 'pass'
      tablesTest.details = { 
        message: 'All tables accessible',
        counts: { userCount, planCount, usageCount, generationCount, paymentCount }
      }
    } catch (err) {
      tablesTest.status = 'fail'
      tablesTest.details = { error: err instanceof Error ? err.message : 'Unknown error' }
    }

    results.tests.push(tablesTest)

    // Overall status
    const allPassed = results.tests.every(test => test.status === 'pass')
    results.overall = allPassed ? 'PASS' : 'FAIL'

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        overall: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
