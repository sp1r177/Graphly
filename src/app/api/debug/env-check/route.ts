import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envVars = {
      // Yandex GPT переменные
      YANDEX_API_KEY: process.env.YANDEX_API_KEY ? 'SET' : 'NOT_SET',
      YANDEX_GPT_API_KEY: process.env.YANDEX_GPT_API_KEY ? 'SET' : 'NOT_SET',
      YANDEX_FOLDER_ID: process.env.YANDEX_FOLDER_ID ? 'SET' : 'NOT_SET',
      YANDEX_GPT_FOLDER_ID: process.env.YANDEX_GPT_FOLDER_ID ? 'SET' : 'NOT_SET',
      YANDEX_GPT_ASYNC_MODE: process.env.YANDEX_GPT_ASYNC_MODE || 'NOT_SET',
      
      // Другие переменные
      YANDEX_CLOUD_ID: process.env.YANDEX_CLOUD_ID ? 'SET' : 'NOT_SET',
      YANDEX_GPT_MODEL: process.env.YANDEX_GPT_MODEL ? 'SET' : 'NOT_SET',
      
      // Системные переменные
      NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
      VERCEL: process.env.VERCEL || 'NOT_SET',
      VERCEL_ENV: process.env.VERCEL_ENV || 'NOT_SET'
    }

    // Проверяем, какие переменные доступны
    const availableVars = Object.entries(envVars)
      .filter(([key, value]) => value === 'SET')
      .map(([key]) => key)

    const missingVars = Object.entries(envVars)
      .filter(([key, value]) => value === 'NOT_SET')
      .map(([key]) => key)

    return NextResponse.json({
      status: 'success',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        vercelEnv: process.env.VERCEL_ENV
      },
      variables: envVars,
      summary: {
        available: availableVars,
        missing: missingVars,
        total: Object.keys(envVars).length
      },
      recommendations: getRecommendations(envVars)
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function getRecommendations(envVars: Record<string, string>): string[] {
  const recommendations: string[] = []

  if (envVars.YANDEX_API_KEY === 'NOT_SET' && envVars.YANDEX_GPT_API_KEY === 'NOT_SET') {
    recommendations.push('❌ Нужен API ключ: добавьте YANDEX_API_KEY в Vercel')
  } else {
    recommendations.push('✅ API ключ найден')
  }

  if (envVars.YANDEX_FOLDER_ID === 'NOT_SET' && envVars.YANDEX_GPT_FOLDER_ID === 'NOT_SET') {
    recommendations.push('❌ Нужен Folder ID: добавьте YANDEX_FOLDER_ID в Vercel')
  } else {
    recommendations.push('✅ Folder ID найден')
  }

  if (envVars.YANDEX_GPT_ASYNC_MODE === 'NOT_SET') {
    recommendations.push('ℹ️ YANDEX_GPT_ASYNC_MODE не установлен, будет использован синхронный режим')
  } else {
    recommendations.push(`ℹ️ YANDEX_GPT_ASYNC_MODE = ${envVars.YANDEX_GPT_ASYNC_MODE}`)
  }

  if (envVars.VERCEL === 'NOT_SET') {
    recommendations.push('⚠️ Не запущено на Vercel')
  } else {
    recommendations.push('✅ Запущено на Vercel')
  }

  return recommendations
}
