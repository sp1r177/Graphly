import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Диагностика регистрации...')
    
    // Проверяем переменные окружения
    const envCheck = {
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Найден' : '❌ Не найден',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Найден' : '❌ Не найден',
      NODE_ENV: process.env.NODE_ENV || 'не установлен'
    }
    
    console.log('📋 Переменные окружения:', envCheck)
    
    // Проверяем подключение к базе данных
    await prisma.$connect()
    console.log('✅ Подключение к базе данных успешно')
    
    // Проверяем, есть ли таблица users
    const userCount = await prisma.user.count()
    console.log('📊 Количество пользователей в БД:', userCount)
    
    // Проверяем структуру таблицы
    const sampleUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        subscriptionStatus: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({
      status: 'OK',
      message: 'Диагностика регистрации завершена',
      environment: envCheck,
      database: {
        connected: true,
        userCount,
        sampleUser: sampleUser || 'Нет пользователей',
        hasEmailVerification: sampleUser ? 'emailVerified' in sampleUser : 'Неизвестно'
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Ошибка диагностики:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Ошибка диагностики',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ? '✅ Найден' : '❌ Не найден',
        JWT_SECRET: process.env.JWT_SECRET ? '✅ Найден' : '❌ Не найден',
        NODE_ENV: process.env.NODE_ENV || 'не установлен'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Тестируем регистрацию...')
    
    const { email, password, name } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json({
        message: 'Пользователь уже существует',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          emailVerified: existingUser.emailVerified
        }
      })
    }
    
    // Тестируем создание пользователя
    const testUser = await prisma.user.create({
      data: {
        email: email + '_test',
        password: 'test_password',
        name: name || 'Test User',
        emailVerified: false,
        emailVerificationToken: 'test_token',
        subscriptionStatus: 'FREE',
        usageCountDay: 0,
        usageCountMonth: 0,
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        subscriptionStatus: true
      }
    })
    
    // Удаляем тестового пользователя
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    
    return NextResponse.json({
      message: 'Тест регистрации прошел успешно',
      testUser: testUser
    })
    
  } catch (error) {
    console.error('❌ Ошибка теста регистрации:', error)
    
    return NextResponse.json({
      error: 'Ошибка теста регистрации',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
