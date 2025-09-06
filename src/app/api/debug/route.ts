import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Получаем все переменные окружения
    const allEnvVars = Object.keys(process.env)
      .filter(key => key.includes('YANDEX') || key.includes('SUPABASE') || key.includes('DATABASE') || key.includes('JWT') || key.includes('NEXTAUTH') || key.includes('NODE'))
      .reduce((obj, key) => {
        obj[key] = process.env[key] ? '✅ Найден' : '❌ Не найден'
        return obj
      }, {} as Record<string, string>)

    return NextResponse.json({
      message: 'Debug Environment Variables',
      environment: process.env.NODE_ENV,
      allEnvVars,
      timestamp: new Date().toISOString(),
      // Показываем первые 10 символов каждого значения для отладки
      values: Object.keys(process.env)
        .filter(key => key.includes('YANDEX') || key.includes('SUPABASE') || key.includes('DATABASE') || key.includes('JWT') || key.includes('NEXTAUTH') || key.includes('NODE'))
        .reduce((obj, key) => {
          const value = process.env[key]
          obj[key] = value ? value.substring(0, 10) + '...' : 'undefined'
          return obj
        }, {} as Record<string, string>)
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
