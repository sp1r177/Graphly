import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Найден' : '❌ Не найден',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Найден' : '❌ Не найден',
      YANDEX_API_KEY: process.env.YANDEX_API_KEY ? '✅ Найден' : '❌ Не найден',
      YANDEX_FOLDER_ID: process.env.YANDEX_FOLDER_ID ? '✅ Найден' : '❌ Не найден',
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Найден' : '❌ Не найден',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Найден' : '❌ Не найден',
    },
    database: {
      status: 'unknown',
      error: null,
      userCount: 0,
      tablesExist: false
    },
    recommendations: []
  }

  // Проверяем подключение к БД
  try {
    await prisma.$connect()
    debug.database.status = 'connected'
    
    try {
      const userCount = await prisma.user.count()
      debug.database.userCount = userCount
      debug.database.tablesExist = true
      debug.database.status = 'ready'
    } catch (tableError) {
      debug.database.status = 'no_tables'
      debug.database.error = (tableError as Error).message
      debug.recommendations.push('Run: POST /api/setup-db to create tables')
    }
    
  } catch (dbError) {
    debug.database.status = 'failed'
    debug.database.error = (dbError as Error).message
    debug.recommendations.push('Check DATABASE_URL in environment variables')
  } finally {
    await prisma.$disconnect()
  }

  // Добавляем рекомендации
  if (!process.env.DATABASE_URL) {
    debug.recommendations.push('Add DATABASE_URL to environment variables')
  }
  if (!process.env.JWT_SECRET) {
    debug.recommendations.push('Add JWT_SECRET to environment variables')
  }
  if (!process.env.YANDEX_API_KEY) {
    debug.recommendations.push('Add YANDEX_API_KEY for real content generation (optional)')
  }

  return NextResponse.json(debug)
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'test_registration') {
      // Тест регистрации
      const testEmail = 'debug-test-' + Date.now() + '@example.com'
      
      try {
        const testUser = await prisma.user.create({
          data: {
            email: testEmail,
            password: '$2a$12$test.hash.password',
            name: 'Debug Test User',
            subscriptionStatus: 'FREE',
            usageCountDay: 0,
            usageCountMonth: 0,
          }
        })
        
        // Удаляем тестового пользователя
        await prisma.user.delete({
          where: { id: testUser.id }
        })
        
        return NextResponse.json({
          status: 'success',
          message: 'Registration test passed',
          testEmail,
          timestamp: new Date().toISOString()
        })
        
      } catch (error) {
        return NextResponse.json({
          status: 'error',
          message: 'Registration test failed',
          error: (error as Error).message,
          timestamp: new Date().toISOString()
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Unknown action',
      availableActions: ['test_registration']
    }, { status: 400 })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Debug API error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}