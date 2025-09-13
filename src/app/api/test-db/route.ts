import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Тестируем подключение к базе данных...')
    
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
        subscriptionStatus: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({
      status: 'OK',
      message: 'База данных работает',
      environment: envCheck,
      database: {
        connected: true,
        userCount,
        sampleUser: sampleUser || 'Нет пользователей'
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Ошибка подключения к базе данных',
      error: error instanceof Error ? error.message : 'Unknown error',
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
