import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const config = {
      // Проверяем все возможные названия переменных
      apiKey: {
        YANDEX_GPT_API_KEY: !!process.env.YANDEX_GPT_API_KEY,
        YANDEX_API_KEY: !!process.env.YANDEX_API_KEY,
        value: process.env.YANDEX_GPT_API_KEY || process.env.YANDEX_API_KEY || 'NOT_FOUND'
      },
      folderId: {
        YANDEX_GPT_FOLDER_ID: !!process.env.YANDEX_GPT_FOLDER_ID,
        YANDEX_FOLDER_ID: !!process.env.YANDEX_FOLDER_ID,
        value: process.env.YANDEX_GPT_FOLDER_ID || process.env.YANDEX_FOLDER_ID || 'NOT_FOUND'
      },
      cloudId: {
        YANDEX_CLOUD_ID: !!process.env.YANDEX_CLOUD_ID,
        value: process.env.YANDEX_CLOUD_ID || 'NOT_FOUND'
      },
      model: {
        YANDEX_GPT_MODEL: !!process.env.YANDEX_GPT_MODEL,
        value: process.env.YANDEX_GPT_MODEL || 'NOT_FOUND'
      },
      asyncMode: {
        YANDEX_GPT_ASYNC_MODE: process.env.YANDEX_GPT_ASYNC_MODE,
        value: process.env.YANDEX_GPT_ASYNC_MODE === 'true' || true
      },
      // Показываем все переменные, начинающиеся с YANDEX
      allYandexVars: Object.keys(process.env)
        .filter(key => key.startsWith('YANDEX'))
        .reduce((acc, key) => {
          acc[key] = process.env[key] ? 'SET' : 'NOT_SET'
          return acc
        }, {} as Record<string, string>)
    }

    return NextResponse.json({
      status: 'success',
      config,
      recommendations: getRecommendations(config)
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

function getRecommendations(config: any): string[] {
  const recommendations: string[] = []

  if (!config.apiKey.value || config.apiKey.value === 'NOT_FOUND') {
    recommendations.push('❌ API ключ не найден. Добавьте YANDEX_API_KEY в переменные окружения Vercel')
  } else {
    recommendations.push('✅ API ключ найден')
  }

  if (!config.folderId.value || config.folderId.value === 'NOT_FOUND') {
    recommendations.push('❌ Folder ID не найден. Добавьте YANDEX_FOLDER_ID в переменные окружения Vercel')
  } else {
    recommendations.push('✅ Folder ID найден')
  }

  if (config.cloudId.value && config.cloudId.value !== 'NOT_FOUND') {
    recommendations.push('ℹ️ YANDEX_CLOUD_ID найден, но не используется в коде')
  }

  if (config.model.value && config.model.value !== 'NOT_FOUND') {
    recommendations.push('ℹ️ YANDEX_GPT_MODEL найден, но не используется в коде')
  }

  if (config.asyncMode.value) {
    recommendations.push('✅ Асинхронный режим включен (0.20₽ за 1000 токенов)')
  } else {
    recommendations.push('ℹ️ Синхронный режим (0.40₽ за 1000 токенов)')
  }

  return recommendations
}
