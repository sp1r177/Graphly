import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Проверяем все переменные окружения
    const envCheck = {
      DATABASE_URL: process.env.DATABASE_URL ? 'FOUND' : 'MISSING',
      JWT_SECRET: process.env.JWT_SECRET ? 'FOUND' : 'MISSING',
      YANDEX_API_KEY: process.env.YANDEX_API_KEY ? 'FOUND' : 'MISSING',
      YANDEX_FOLDER_ID: process.env.YANDEX_FOLDER_ID ? 'FOUND' : 'MISSING',
      SUPABASE_URL: process.env.SUPABASE_URL ? 'FOUND' : 'MISSING',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'FOUND' : 'MISSING',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'FOUND' : 'MISSING',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'FOUND' : 'MISSING',
      NODE_ENV: process.env.NODE_ENV || 'NOT_SET'
    }

    // Показываем первые 20 символов каждого значения
    const envValues = {
      DATABASE_URL: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'undefined',
      JWT_SECRET: process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 20) + '...' : 'undefined',
      YANDEX_API_KEY: process.env.YANDEX_API_KEY ? process.env.YANDEX_API_KEY.substring(0, 20) + '...' : 'undefined',
      YANDEX_FOLDER_ID: process.env.YANDEX_FOLDER_ID ? process.env.YANDEX_FOLDER_ID.substring(0, 20) + '...' : 'undefined',
      SUPABASE_URL: process.env.SUPABASE_URL || 'undefined',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'undefined',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'undefined',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.substring(0, 20) + '...' : 'undefined',
      NODE_ENV: process.env.NODE_ENV || 'undefined'
    }

    return NextResponse.json({
      message: 'REAL TEST - Environment Variables',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      status: 'OK',
      envCheck,
      envValues,
      // Показываем все переменные, которые начинаются с нужных префиксов
      allEnvVars: Object.keys(process.env)
        .filter(key => 
          key.includes('YANDEX') || 
          key.includes('SUPABASE') || 
          key.includes('DATABASE') || 
          key.includes('JWT') || 
          key.includes('NEXTAUTH') || 
          key.includes('NODE')
        )
        .sort()
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
