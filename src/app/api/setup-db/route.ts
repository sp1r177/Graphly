import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Настройка базы данных для продакшена...')
    
    // Проверяем переменные окружения
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      return NextResponse.json({
        error: 'DATABASE_URL not found',
        message: 'Add DATABASE_URL to Vercel environment variables'
      }, { status: 400 })
    }

    console.log('📡 Тестирование подключения к БД...')
    await prisma.$connect()
    console.log('✅ Подключение к БД успешно')
    
    // Проверяем, существуют ли таблицы
    try {
      const userCount = await prisma.user.count()
      console.log('✅ Таблица users существует, пользователей:', userCount)
      
      return NextResponse.json({
        status: 'success',
        message: 'Database is ready',
        userCount,
        databaseUrl: dbUrl.substring(0, 20) + '...',
        timestamp: new Date().toISOString()
      })
      
    } catch (tableError) {
      console.log('❌ Таблицы не существуют, создаем...')
      
      // Если таблиц нет, создаем их
      // Примечание: В продакшене лучше использовать миграции
      try {
        // Создаем таблицы напрямую через SQL
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "users" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "email" TEXT NOT NULL UNIQUE,
            "password" TEXT NOT NULL,
            "name" TEXT,
            "subscriptionStatus" TEXT NOT NULL DEFAULT 'FREE',
            "usageCountDay" INTEGER NOT NULL DEFAULT 0,
            "usageCountMonth" INTEGER NOT NULL DEFAULT 0,
            "lastGenerationDate" DATETIME,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `
        
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "generations" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "prompt" TEXT NOT NULL,
            "outputText" TEXT,
            "outputImageUrl" TEXT,
            "templateType" TEXT NOT NULL,
            "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
          )
        `
        
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "payments" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "userId" TEXT NOT NULL,
            "amount" REAL NOT NULL,
            "currency" TEXT NOT NULL DEFAULT 'RUB',
            "status" TEXT NOT NULL DEFAULT 'PENDING',
            "yandexPaymentId" TEXT,
            "subscriptionType" TEXT NOT NULL,
            "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
          )
        `
        
        console.log('✅ Таблицы созданы через SQL')
        
        // Проверяем создание
        const userCount = await prisma.user.count()
        console.log('✅ Проверка: пользователей в БД:', userCount)
        
        return NextResponse.json({
          status: 'success',
          message: 'Database tables created successfully',
          userCount,
          databaseUrl: dbUrl.substring(0, 20) + '...',
          timestamp: new Date().toISOString()
        })
        
      } catch (sqlError) {
        console.error('❌ Ошибка создания таблиц через SQL:', (sqlError as Error).message)
        
        return NextResponse.json({
          status: 'error',
          message: 'Failed to create database tables',
          error: (sqlError as Error).message,
          suggestion: 'Run: npx prisma migrate deploy',
          timestamp: new Date().toISOString()
        }, { status: 500 })
      }
    }
    
  } catch (error) {
    console.error('❌ Критическая ошибка БД:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Check DATABASE_URL and database accessibility',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: NextRequest) {
  try {
    // Простая проверка статуса БД
    await prisma.$connect()
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      status: 'connected',
      userCount,
      message: 'Database is accessible',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Database not accessible',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
