import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Database Test:')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Найден' : '❌ Не найден')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Test if tables exist
    const userCount = await prisma.user.count()
    console.log('✅ Users table exists, count:', userCount)
    
    const generationCount = await prisma.generation.count()
    console.log('✅ Generations table exists, count:', generationCount)
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      tables: {
        users: userCount,
        generations: generationCount
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
