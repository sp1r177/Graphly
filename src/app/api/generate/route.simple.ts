import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  console.log('🔍 Простой тест API - GET запрос получен')

  return NextResponse.json({
    status: 'OK',
    message: 'Простой API работает!',
    timestamp: new Date().toISOString(),
    debug: {
      method: 'GET',
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    }
  })
}

export async function POST(request: NextRequest) {
  console.log('🚀 Простой тест API - POST запрос получен')

  try {
    const body = await request.json()
    console.log('📝 Получены данные:', body)

    // Простая генерация без зависимостей
    const generatedText = generateSimpleContent(body.prompt, body.templateType)

    console.log('✅ Генерация завершена, длина текста:', generatedText.length)

    return NextResponse.json({
      id: 'simple-test-' + Date.now(),
      text: generatedText,
      templateType: body.templateType,
      timestamp: new Date().toISOString(),
      debug: {
        receivedPrompt: body.prompt,
        receivedType: body.templateType,
        generatedLength: generatedText.length,
        method: 'POST'
      }
    })

  } catch (error) {
    console.error('❌ Ошибка в простом API:', error)

    return NextResponse.json({
      error: 'Ошибка генерации',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка',
      debug: {
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}

function generateSimpleContent(prompt: string, templateType: string): string {
  console.log('🎯 Генерация простого контента для типа:', templateType)

  const templates = {
    'VK_POST': `📱 ВКонтакте пост:

${prompt}

✨ Это сгенерированный контент для ВКонтакте!
#VK #пост #контент`,

    'TELEGRAM_POST': `📢 Telegram пост:

${prompt}

🚀 Сгенерировано автоматически!
#Telegram #пост #бот`,

    'EMAIL_CAMPAIGN': `📧 Email рассылка:

Тема: ${prompt}

Уважаемый подписчик!

${prompt}

Это тестовое сообщение, сгенерированное системой.

С уважением,
Команда Graphly`,

    'BLOG_ARTICLE': `📝 Статья для блога:

# ${prompt}

## Введение

${prompt}

## Основная часть

Это сгенерированная статья на тему "${prompt}".

## Заключение

Спасибо за внимание!
`,

    'VIDEO_SCRIPT': `🎬 Сценарий видео:

НАЗВАНИЕ: ${prompt}

СЦЕНА 1: Введение
[Показывается заголовок]
ГОЛОС ЗА КАДРОМ: ${prompt}

СЦЕНА 2: Основная часть
[Показывается контент]
ГОЛОС ЗА КАДРОМ: Давайте разберем эту тему подробнее.

СЦЕНА 3: Заключение
[Итоговый слайд]
ГОЛОС ЗА КАДРОМ: Спасибо за просмотр!
`,

    'IMAGE_GENERATION': `🖼️ Описание для генерации изображения:

Основная тема: ${prompt}

Подробное описание:
- Центральный объект: ${prompt}
- Стиль: Современный, яркий, привлекательный
- Цветовая гамма: Яркие, насыщенные цвета
- Композиция: Центрированный объект на чистом фоне
- Детали: Высокое качество, четкие линии, профессиональный вид

Ключевые слова: ${prompt}, современный дизайн, высокое качество`
  }

  const result = templates[templateType as keyof typeof templates] ||
    `🎯 Сгенерированный контент:

${prompt}

Тип контента: ${templateType}
Время генерации: ${new Date().toLocaleString()}`

  console.log('📤 Возвращаемый контент длиной:', result.length, 'символов')
  return result
}
