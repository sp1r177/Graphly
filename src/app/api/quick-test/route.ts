import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Простой тест всех переменных
    const tests = {
      DATABASE_URL: {
        found: !!process.env.DATABASE_URL,
        value: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'MISSING',
        hasPassword: process.env.DATABASE_URL ? !process.env.DATABASE_URL.includes('[ВАШ_ПАРОЛЬ]') && !process.env.DATABASE_URL.includes('[PASSWORD]') : false
      },
      JWT_SECRET: {
        found: !!process.env.JWT_SECRET,
        value: process.env.JWT_SECRET ? 'FOUND' : 'MISSING'
      },
      YANDEX_API_KEY: {
        found: !!process.env.YANDEX_API_KEY,
        value: process.env.YANDEX_API_KEY ? 'FOUND' : 'MISSING'
      },
      YANDEX_FOLDER_ID: {
        found: !!process.env.YANDEX_FOLDER_ID,
        value: process.env.YANDEX_FOLDER_ID ? 'FOUND' : 'MISSING'
      },
      SUPABASE_URL: {
        found: !!process.env.SUPABASE_URL,
        value: process.env.SUPABASE_URL || 'MISSING'
      },
      SUPABASE_ANON_KEY: {
        found: !!process.env.SUPABASE_ANON_KEY,
        value: process.env.SUPABASE_ANON_KEY ? 'FOUND' : 'MISSING'
      }
    }

    // Определяем основные проблемы
    const problems = []
    if (!tests.DATABASE_URL.found) problems.push('DATABASE_URL не найден')
    if (!tests.DATABASE_URL.hasPassword) problems.push('DATABASE_URL содержит заглушку пароля')
    if (!tests.JWT_SECRET.found) problems.push('JWT_SECRET не найден')
    if (!tests.YANDEX_API_KEY.found) problems.push('YANDEX_API_KEY не найден')
    if (!tests.YANDEX_FOLDER_ID.found) problems.push('YANDEX_FOLDER_ID не найден')

    return NextResponse.json({
      status: problems.length === 0 ? 'OK' : 'PROBLEMS',
      message: problems.length === 0 ? 'Все переменные найдены' : 'Найдены проблемы',
      problems,
      tests,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
