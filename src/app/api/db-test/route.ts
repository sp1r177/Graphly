import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Database Test Starting...')
    
    // Проверяем DATABASE_URL
    const databaseUrl = process.env.DATABASE_URL
    console.log('DATABASE_URL:', databaseUrl ? 'FOUND' : 'MISSING')
    
    if (!databaseUrl) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'DATABASE_URL not found',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Проверяем, что это PostgreSQL URL
    if (!databaseUrl.includes('postgresql://')) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'DATABASE_URL is not a PostgreSQL URL',
        databaseUrl: databaseUrl.substring(0, 50) + '...',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Проверяем, что пароль не заглушка
    if (databaseUrl.includes('[ВАШ_ПАРОЛЬ]') || databaseUrl.includes('[PASSWORD]')) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'DATABASE_URL contains placeholder password',
        databaseUrl: databaseUrl.substring(0, 50) + '...',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Пытаемся подключиться к базе данных
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      await prisma.$connect()
      console.log('✅ Database connection successful')
      
      // Пытаемся выполнить простой запрос
      const result = await prisma.$queryRaw`SELECT 1 as test`
      console.log('✅ Database query successful:', result)
      
      await prisma.$disconnect()
      
      return NextResponse.json({
        status: 'SUCCESS',
        message: 'Database connection and query successful',
        timestamp: new Date().toISOString()
      })
      
    } catch (dbError) {
      console.error('❌ Database error:', dbError)
      
      return NextResponse.json({
        status: 'ERROR',
        message: 'Database connection failed',
        error: dbError instanceof Error ? dbError.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
