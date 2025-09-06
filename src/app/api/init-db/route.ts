import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Initializing database...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Try to create a test user to check if tables exist
    try {
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'test-password',
          name: 'Test User',
          subscriptionStatus: 'FREE',
          usageCountDay: 0,
          usageCountMonth: 0,
        }
      })
      console.log('✅ Test user created:', testUser.id)
      
      // Delete test user
      await prisma.user.delete({
        where: { id: testUser.id }
      })
      console.log('✅ Test user deleted')
      
    } catch (error) {
      console.error('❌ Database schema error:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Database schema not applied',
        error: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Run: npx prisma db push'
      }, { status: 500 })
    }
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database initialized successfully',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Database initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
