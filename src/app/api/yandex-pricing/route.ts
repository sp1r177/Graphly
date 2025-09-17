import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const asyncMode = process.env.YANDEX_GPT_ASYNC_MODE === 'true'
    const model = process.env.YANDEX_GPT_MODEL || 'yandexgpt/latest'
    
    // Информация о тарифах Yandex GPT
    const pricingInfo = {
      sync: {
        url: 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
        description: 'Синхронный режим - быстрый ответ, дороже',
        pricing: 'Выше за токен, но быстрее'
      },
      async: {
        url: 'https://llm.api.cloud.yandex.net/foundationModels/v1/completionAsync',
        description: 'Асинхронный режим - медленнее, дешевле',
        pricing: 'Дешевле за токен, но дольше обработка'
      }
    }

    return NextResponse.json({
      currentConfiguration: {
        asyncMode,
        model,
        envAsyncMode: process.env.YANDEX_GPT_ASYNC_MODE,
        envModel: process.env.YANDEX_GPT_MODEL
      },
      pricingInfo,
      recommendations: [
        asyncMode 
          ? '✅ Используется ASYNC режим - должен быть дешевле'
          : '⚠️ Используется SYNC режим - дороже, но быстрее',
        'Проверьте логи генерации - должны быть сообщения "Using ASYNC/SYNC mode"',
        'Если деньги списываются как за SYNC, возможно модель не поддерживает ASYNC'
      ],
      checkSteps: [
        '1. Откройте GET /api/test-yandex-gpt - покажет режим',
        '2. Посмотрите логи при генерации',
        '3. Проверьте, что модель поддерживает async режим'
      ]
    })

  } catch (error) {
    console.error('Pricing check error:', error)
    return NextResponse.json({ error: 'Check failed' }, { status: 500 })
  }
}
