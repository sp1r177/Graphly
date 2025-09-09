import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Простой тест для проверки переменных
  return NextResponse.json({
    status: 'OK',
    message: 'Generate API работает',
    environment: {
      DATABASE_URL: process.env.DATABASE_URL ? '✅ Найден' : '❌ Не найден',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Найден' : '❌ Не найден',
      YANDEX_API_KEY: process.env.YANDEX_API_KEY ? '✅ Найден' : '❌ Не найден',
      YANDEX_FOLDER_ID: process.env.YANDEX_FOLDER_ID ? '✅ Найден' : '❌ Не найден',
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Найден' : '❌ Не найден',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Найден' : '❌ Не найден',
      NODE_ENV: process.env.NODE_ENV || 'не установлен'
    },
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV !== 'production'
    // Добавляем диагностику
    console.log('🔍 Generate API Debug:')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Найден' : '❌ Не найден')
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Найден' : '❌ Не найден')
    console.log('YANDEX_API_KEY:', process.env.YANDEX_API_KEY ? '✅ Найден' : '❌ Не найден')
    console.log('YANDEX_FOLDER_ID:', process.env.YANDEX_FOLDER_ID ? '✅ Найден' : '❌ Не найден')
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Найден' : '❌ Не найден')
    console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Найден' : '❌ Не найден')
    
    let authUser = getUserFromRequest(request)
    
    if (!authUser) {
      if (isDev) {
        console.warn('Auth missing in dev, using mock user')
        authUser = { userId: 'dev-user-id', email: 'dev@example.com' }
      } else {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    const { prompt, templateType } = await request.json()

    if (!prompt || !templateType) {
      return NextResponse.json(
        { error: 'Prompt and template type are required' },
        { status: 400 }
      )
    }

    // ВРЕМЕННО: Отключаем модификации базы данных
    console.log('Generation attempt (DB writes disabled):', authUser.userId)
    
    // Создаем мок-пользователя
    const user = {
      subscriptionStatus: 'FREE' as const,
      usageCountDay: 0,
      usageCountMonth: 0,
      lastGenerationDate: null
    }

    // Check daily usage limit for free users
    if (user.subscriptionStatus === 'FREE') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const lastGeneration = user.lastGenerationDate
      const lastGenerationDate = lastGeneration ? new Date(lastGeneration) : null
      
      if (!lastGenerationDate || lastGenerationDate < today) {
        // Reset daily count for new day (local only, DB writes disabled)
        user.usageCountDay = 0
      }
      
      if (user.usageCountDay >= 10) {
        return NextResponse.json(
          { error: 'Daily generation limit reached. Upgrade to Pro for unlimited generations.' },
          { status: 429 }
        )
      }
    }

    // Check monthly usage limit for Pro users
    if (user.subscriptionStatus === 'PRO') {
      if (user.usageCountMonth >= 100) {
        return NextResponse.json(
          { error: 'Monthly generation limit reached. Upgrade to Ultra for unlimited generations.' },
          { status: 429 }
        )
      }
    }

    // Generate content using Yandex GPT API
    const generatedText = await generateContent(prompt, templateType)
    
    // ВРЕМЕННО: Отключаем сохранение в базу данных
    console.log('Generation completed (DB disabled):', generatedText.substring(0, 100) + '...')
    
    // Создаем мок-генерацию
    const generation = {
      id: 'mock-generation-id',
      timestamp: new Date()
    }

    return NextResponse.json({
      id: generation.id,
      text: generatedText,
      templateType,
      timestamp: generation.timestamp
    })

  } catch (error) {
    console.error('Generation error:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      } else if (error.message.includes('лимит') || error.message.includes('limit')) {
        return NextResponse.json(
          { error: error.message },
          { status: 429 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateContent(prompt: string, templateType: string): Promise<string> {
  const yandexApiKey = process.env.YANDEX_API_KEY
  const yandexFolderId = process.env.YANDEX_FOLDER_ID
  const yandexApiUrl = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'

  console.log('🔍 Yandex GPT API Debug:')
  console.log('API Key:', yandexApiKey ? '✅ Найден' : '❌ Не найден')
  console.log('Folder ID:', yandexFolderId ? '✅ Найден' : '❌ Не найден')
  console.log('API URL:', yandexApiUrl)

  // Check if API credentials are available
  if (!yandexApiKey || !yandexFolderId) {
    console.warn('⚠️ Yandex API credentials not found, using mock generation')
    return generateMockContent(prompt, templateType)
  }

  try {
    // Create system prompt based on template type
    const systemPrompts = {
      'VK_POST': 'Ты эксперт по созданию постов для ВКонтакте. Создай привлекательный пост с эмодзи и хештегами. Пост должен быть живым, интересным и вовлекающим.',
      'TELEGRAM_POST': 'Ты эксперт по созданию постов для Telegram. Создай информативный пост с эмодзи. Пост должен быть структурированным и легко читаемым.',
      'EMAIL_CAMPAIGN': 'Ты эксперт по email-маркетингу. Создай профессиональное email-письмо с привлекательной темой и структурированным содержанием.',
      'BLOG_ARTICLE': 'Ты эксперт по созданию статей для блога. Создай структурированную статью с заголовками, подзаголовками и заключением.',
      'VIDEO_SCRIPT': 'Ты эксперт по созданию сценариев для видео. Создай увлекательный сценарий с описанием сцен, диалогов и визуальных элементов.',
      'IMAGE_GENERATION': 'Ты эксперт по описанию изображений для AI-генерации. Создай детальное описание для генерации изображения с указанием стиля, композиции и настроения.'
    }

    const systemPrompt = systemPrompts[templateType as keyof typeof systemPrompts] || 'Создай качественный контент на основе запроса.'

    const requestBody = {
      modelUri: `gpt://${yandexFolderId}/yandexgpt`,
      completionOptions: {
        stream: false,
        temperature: 0.7,
        maxTokens: 2000
      },
      messages: [
        {
          role: "system",
          text: systemPrompt
        },
        {
          role: "user", 
          text: prompt
        }
      ]
    }

    console.log('🚀 Sending request to Yandex GPT API...')
    console.log('Request body:', JSON.stringify(requestBody, null, 2))

    const response = await fetch(yandexApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Api-Key ${yandexApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    console.log('📡 Yandex GPT API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Yandex GPT API error:', response.status, errorText)
      
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error('Неверный API ключ Yandex. Проверьте YANDEX_API_KEY в настройках.')
      } else if (response.status === 403) {
        throw new Error('Доступ запрещен. Проверьте права доступа к Yandex Cloud.')
      } else if (response.status === 429) {
        throw new Error('Превышен лимит запросов. Попробуйте позже.')
      } else if (response.status === 500) {
        throw new Error('Внутренняя ошибка сервера Yandex. Попробуйте позже.')
      } else {
        throw new Error(`Ошибка Yandex GPT API: ${response.status} - ${errorText}`)
      }
    }

    const data = await response.json()
    console.log('✅ Yandex GPT API response received:', JSON.stringify(data, null, 2))
    
    if (data.result && data.result.alternatives && data.result.alternatives[0]) {
      const generatedText = data.result.alternatives[0].message.text
      console.log('🎉 Generated text length:', generatedText.length)
      return generatedText
    } else {
      console.error('❌ Invalid response structure from Yandex GPT API:', data)
      throw new Error('Неверная структура ответа от Yandex GPT API')
    }

  } catch (error) {
    console.error('❌ Yandex GPT API error:', error)
    
    // If it's a known error, don't fall back to mock
    if (error instanceof Error && error.message.includes('API')) {
      throw error
    }
    
    // For network errors or unknown issues, fall back to mock
    console.warn('⚠️ Falling back to mock generation due to error')
    return generateMockContent(prompt, templateType)
  }
}

async function generateMockContent(prompt: string, templateType: string): Promise<string> {
  // Simulate AI generation delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock content generation based on template type
  const templates = {
    'VK_POST': `📱 Пост для ВКонтакте:\n\n${prompt}\n\n#контент #вконтакте #пост`,
    'TELEGRAM_POST': `📢 Пост для Telegram:\n\n${prompt}\n\n#telegram #пост #контент`,
    'EMAIL_CAMPAIGN': `📧 Email-кампания:\n\nТема: ${prompt}\n\nСодержание:\n${prompt}\n\nС уважением,\nКоманда AIКонтент`,
    'BLOG_ARTICLE': `📝 Статья для блога:\n\n# ${prompt}\n\n${prompt}\n\n## Заключение\n\n${prompt}`,
    'VIDEO_SCRIPT': `🎬 Сценарий видео:\n\nСЦЕНА 1:\n${prompt}\n\nСЦЕНА 2:\n${prompt}\n\nСЦЕНА 3:\n${prompt}`,
    'IMAGE_GENERATION': `🖼️ Описание для генерации изображения:\n\n${prompt}\n\nСтиль: современный, качественный, детализированный`
  }
  
  return templates[templateType as keyof typeof templates] || `Сгенерированный контент:\n\n${prompt}`
}