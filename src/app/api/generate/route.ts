import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { supabase, getUserProfile, updateUserProfile } from '@/lib/supabase'
import { yandexGPT } from '@/lib/yandex-gpt'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { prompt, templateType } = await request.json()

    if (!prompt || !templateType) {
      return NextResponse.json(
        { error: 'Prompt and template type are required' },
        { status: 400 }
      )
    }

    // Убираем проверку аутентификации для тестирования
    const user = {
      id: 'anonymous',
      subscription_status: 'FREE',
      usage_count_day: 0,
      usage_count_month: 0
    }

    // Убираем проверку лимитов для тестирования

    // Generate content using Yandex GPT
    let generatedText: string
    let tokensUsed: number = 0

    // Check if Yandex GPT is configured
    const yandexApiKey = process.env.YANDEX_API_KEY || process.env.YANDEX_GPT_API_KEY
    const yandexFolderId = process.env.YANDEX_FOLDER_ID || process.env.YANDEX_GPT_FOLDER_ID

    // Всегда используем fallback генерацию для начала
    console.log('Using fallback generation for now')
    generatedText = await generateContent(prompt, templateType)
    tokensUsed = 100
    
    // TODO: Включить Yandex GPT когда будет настроен
    /*
    if (yandexApiKey && yandexFolderId) {
      try {
        console.log('Starting Yandex GPT generation:', { prompt, templateType })
        const result = await yandexGPT.generateContent(prompt, templateType)
        generatedText = result.text
        tokensUsed = result.tokensUsed
        console.log('Yandex GPT generation successful:', { textLength: generatedText.length, tokensUsed })
      } catch (error) {
        console.error('Yandex GPT generation failed:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          prompt,
          templateType
        })
        // Fallback to mock generation if Yandex GPT fails
        generatedText = await generateContent(prompt, templateType)
        tokensUsed = 100
        console.log('Using fallback generation')
      }
    } else {
      console.log('Yandex GPT not configured, using fallback generation')
      generatedText = await generateContent(prompt, templateType)
      tokensUsed = 100
    }
    */
    
    // Save generation to database (optional)
    let generation = null
    if (supabase) {
      try {
        const { data: genData, error: generationError } = await supabase
          .from('generations')
          .insert({
            user_id: user.id,
            prompt,
            output_text: generatedText,
            template_type: templateType,
            tokens_used: tokensUsed,
          })
          .select()
          .single()

        if (!generationError) {
          generation = genData
        } else {
          console.error('Error saving generation:', generationError)
        }

        // Update user usage counts
        await updateUserProfile(authUser.id, {
          usage_count_day: user.usage_count_day + 1,
          usage_count_month: user.usage_count_month + 1,
        })
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Продолжаем работу даже если база данных не работает
      }
    }

    return NextResponse.json({
      id: generation?.id || 'temp-' + Date.now(),
      text: generatedText,
      templateType,
      timestamp: generation?.created_at || new Date().toISOString(),
      tokensUsed,
      remainingTokens: {
        daily: user.subscription_status === 'FREE' ? Math.max(0, 10 - (user.usage_count_day + 1)) : -1,
        monthly: user.subscription_status === 'PRO' ? Math.max(0, 100 - (user.usage_count_month + 1)) : -1
      }
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateContent(prompt: string, templateType: string): Promise<string> {
  // Simulate AI generation delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Улучшенная генерация контента
  const templates = {
    'VK_POST': `🔥 Пост для ВКонтакте

${prompt}

💡 Совет: Используйте эмодзи и хештеги для лучшего охвата!

#контент #вконтакте #пост #маркетинг`,

    'TELEGRAM_POST': `📢 Пост для Telegram

${prompt}

🚀 Telegram - идеальная платформа для быстрого общения с аудиторией!

#telegram #пост #контент #мессенджер`,

    'EMAIL_CAMPAIGN': `📧 Email-рассылка

Тема письма: ${prompt}

Дорогие подписчики!

${prompt}

Мы рады поделиться с вами этой информацией и надеемся, что она будет полезна.

С уважением,
Команда AIКонтент

P.S. Не забудьте подписаться на наши социальные сети!`,

    'BLOG_ARTICLE': `📝 Статья для блога

# ${prompt}

## Введение

${prompt} - это важная тема, которая заслуживает внимательного рассмотрения.

## Основная часть

В современном мире ${prompt} играет ключевую роль. Давайте разберем основные аспекты:

- Первый важный момент
- Второй ключевой фактор  
- Третий аспект для рассмотрения

## Практические советы

1. Начните с малого
2. Постепенно развивайте навыки
3. Не бойтесь экспериментировать

## Заключение

${prompt} - это не просто тренд, а необходимость для современного бизнеса.

---

*Статья создана с помощью AIКонтент*`,

    'VIDEO_SCRIPT': `🎬 Сценарий видео

# ${prompt}

## СЦЕНА 1: Вступление (0-15 сек)
"Привет, друзья! Сегодня мы поговорим о ${prompt}."

## СЦЕНА 2: Основная часть (15-45 сек)
"${prompt} - это очень важная тема. Давайте разберем по пунктам..."

## СЦЕНА 3: Практические советы (45-60 сек)
"Вот что я рекомендую делать с ${prompt}:"

## СЦЕНА 4: Заключение (60-75 сек)
"Надеюсь, эта информация была полезна! Подписывайтесь на канал!"

---
*Сценарий создан с помощью AIКонтент*`,

    'IMAGE_GENERATION': `🖼️ Описание для генерации изображения

${prompt}

**Стиль:** современный, профессиональный, качественный
**Цветовая схема:** яркие, привлекающие внимание цвета
**Композиция:** сбалансированная, с акцентом на главном объекте
**Детали:** высокое разрешение, четкие линии, приятная эстетика

*Описание создано с помощью AIКонтент*`
  }
  
  return templates[templateType as keyof typeof templates] || `✨ Сгенерированный контент

${prompt}

---
*Создано с помощью AIКонтент*`
}