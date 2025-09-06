import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const envVars = {
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Найден' : '❌ Не найден',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Найден' : '❌ Не найден',
      YANDEX_API_KEY: process.env.YANDEX_API_KEY ? '✅ Найден' : '❌ Не найден',
      YANDEX_FOLDER_ID: process.env.YANDEX_FOLDER_ID ? '✅ Найден' : '❌ Не найден',
      YANDEX_GPT_MODEL: process.env.YANDEX_GPT_MODEL ? '✅ Найден' : '❌ Не найден',
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Найден' : '❌ Не найден',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Найден' : '❌ Не найден',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '✅ Найден' : '❌ Не найден',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Найден' : '❌ Не найден',
      NODE_ENV: process.env.NODE_ENV || 'не установлен'
    }

    return NextResponse.json({
      message: 'Environment Variables Test',
      environment: process.env.NODE_ENV,
      variables: envVars,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
