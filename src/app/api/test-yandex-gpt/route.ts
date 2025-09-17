import { NextResponse } from 'next/server'
import { yandexGPT } from '@/lib/yandex-gpt'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Проверяем конфигурацию режима
    const asyncMode = process.env.YANDEX_GPT_ASYNC_MODE === 'true'
    const model = process.env.YANDEX_GPT_MODEL || 'yandexgpt/latest'
    
    console.log('=== YANDEX GPT MODE TEST ===')
    console.log('Configuration:', {
      asyncMode,
      model,
      envAsyncMode: process.env.YANDEX_GPT_ASYNC_MODE,
      envModel: process.env.YANDEX_GPT_MODEL
    })
    
    // Простой тест генерации
    const startTime = Date.now()
    const result = await yandexGPT.generateContent(
      'Создай короткий пост о новом продукте',
      'VK_POST'
    )
    const endTime = Date.now()
    const duration = endTime - startTime

    return NextResponse.json({
      status: 'success',
      message: 'Yandex GPT работает!',
      configuration: {
        asyncMode,
        model,
        duration: `${duration}ms`,
        expectedMode: asyncMode ? 'ASYNC' : 'SYNC'
      },
      result: {
        text: result.text,
        tokensUsed: result.tokensUsed
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Yandex GPT test error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Yandex GPT не работает',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
