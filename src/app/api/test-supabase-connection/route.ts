import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const result = {
    timestamp: new Date().toISOString(),
    supabaseProject: 'tlorolxxxyztzrjlsjbwi',
    environment: {
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Найден' : '❌ Не найден',
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Найден' : '❌ Не найден',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Найден' : '❌ Не найден',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Найден' : '❌ Не найден',
    },
    database: {
      status: 'unknown',
      connection: false,
      tables: {
        users: false,
        generations: false,
        payments: false
      },
      userCount: 0,
      error: null
    },
    recommendations: []
  }

  // Тестируем подключение к Supabase через Prisma
  try {
    console.log('🔍 Тестирование Supabase подключения...')
    
    await prisma.$connect()
    result.database.connection = true
    result.database.status = 'connected'
    
    // Проверяем таблицы
    try {
      const userCount = await prisma.user.count()
      result.database.tables.users = true
      result.database.userCount = userCount
      result.database.status = 'ready'
      
      try {
        await prisma.generation.count()
        result.database.tables.generations = true
      } catch (e) {
        // Таблица генераций опциональна
      }
      
      try {
        await prisma.payment.count()
        result.database.tables.payments = true
      } catch (e) {
        // Таблица платежей опциональна
      }
      
    } catch (tableError) {
      result.database.status = 'no_tables'
      result.database.error = (tableError as Error).message
      result.recommendations.push('Создайте таблицы в Supabase SQL Editor')
      result.recommendations.push('Или откройте: /api/setup-db POST')
    }
    
  } catch (dbError) {
    result.database.status = 'failed'
    result.database.error = (dbError as Error).message
    
    if ((dbError as Error).message.includes('password')) {
      result.recommendations.push('Проверьте пароль в DATABASE_URL')
    } else if ((dbError as Error).message.includes('host')) {
      result.recommendations.push('Проверьте хост в DATABASE_URL')
    } else {
      result.recommendations.push('Проверьте DATABASE_URL в переменных окружения')
    }
  } finally {
    await prisma.$disconnect()
  }

  // Добавляем общие рекомендации
  if (!process.env.DATABASE_URL) {
    result.recommendations.push('Добавьте DATABASE_URL в Vercel Environment Variables')
  }
  
  if (!process.env.JWT_SECRET) {
    result.recommendations.push('Добавьте JWT_SECRET в Vercel Environment Variables')
  }

  if (result.database.status === 'ready') {
    result.recommendations.push('✅ Supabase готов! Тестируйте регистрацию')
  }

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'test_user_creation') {
      // Тестируем создание пользователя в Supabase
      const testEmail = 'test-' + Date.now() + '@supabase.test'
      
      try {
        // Хэшируем тестовый пароль
        const bcrypt = require('bcryptjs')
        const hashedPassword = await bcrypt.hash('TestPassword123', 12)
        
        const testUser = await prisma.user.create({
          data: {
            email: testEmail,
            password: hashedPassword,
            name: 'Supabase Test User',
            subscriptionStatus: 'FREE',
            usageCountDay: 0,
            usageCountMonth: 0,
          }
        })
        
        console.log('✅ Тестовый пользователь создан в Supabase:', testUser.email)
        
        // Удаляем тестового пользователя
        await prisma.user.delete({
          where: { id: testUser.id }
        })
        
        console.log('✅ Тестовый пользователь удален')
        
        return NextResponse.json({
          status: 'success',
          message: 'Supabase user creation test passed',
          testEmail,
          userId: testUser.id,
          timestamp: new Date().toISOString()
        })
        
      } catch (error) {
        console.error('❌ Ошибка создания тестового пользователя:', error)
        
        return NextResponse.json({
          status: 'error',
          message: 'Supabase user creation test failed',
          error: (error as Error).message,
          testEmail,
          timestamp: new Date().toISOString()
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Unknown action',
      availableActions: ['test_user_creation']
    }, { status: 400 })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Test API error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
