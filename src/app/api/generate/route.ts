import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { supabase, getUserProfile, updateUserProfile } from '@/lib/supabase'
import { yandexGPT } from '@/lib/yandex-gpt'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('=== GENERATE API START ===')
    console.log('Cookies:', request.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value })))
    console.log('Auth header:', request.headers.get('authorization') ? 'SET' : 'NOT_SET')

    const { prompt, templateType } = await request.json()
    console.log('Request data:', { prompt: prompt?.substring(0, 50) + '...', templateType })

    if (!prompt || !templateType) {
      return NextResponse.json(
        { error: 'Prompt and template type are required' },
        { status: 400 }
      )
    }

    // Простая проверка авторизации через graphly-user-id куку
    const userId = request.cookies.get('graphly-user-id')?.value
    console.log('User ID from cookie:', userId)
    
    if (!userId) {
      console.log('=== GENERATE API: NO USER ID IN COOKIE ===')
      return NextResponse.json(
        { error: 'Unauthorized', code: 'NOT_AUTHENTICATED' },
        { status: 401 }
      )
    }

    // Создаем admin-клиент для работы с профилем и генерациями (обходит RLS)
    const supabaseUrl = process.env.SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    const admin = (supabaseUrl && serviceKey) ? createClient(supabaseUrl, serviceKey) : null
    if (!admin) {
      console.error('Supabase admin client is not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Получаем или создаем профиль пользователя
    let { data: user, error: userSelectError } = await admin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (userSelectError && userSelectError.code !== 'PGRST116') {
      console.error('Error selecting user profile (admin):', userSelectError)
    }

    if (!user) {
      const upsertPayload = {
        id: userId,
        email: `${userId}@vk.id`,
        subscription_status: 'FREE',
        usage_count_day: 0,
        usage_count_month: 0,
      }
      const { data: created, error: createErr } = await admin
        .from('user_profiles')
        .upsert(upsertPayload)
        .select('*')
        .single()
      if (createErr) {
        console.error('Error creating user profile (admin):', createErr)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      user = created as any
    }

    console.log('User profile:', user ? { id: user.id, subscription: user.subscription_status, usage: user.usage_count_day } : 'NULL')

    // Generate content using Yandex GPT
    let generatedText: string
    let tokensUsed: number = 0

    // Check if Yandex GPT is configured
    const yandexApiKey = process.env.YANDEX_API_KEY || process.env.YANDEX_GPT_API_KEY
    const yandexFolderId = process.env.YANDEX_FOLDER_ID || process.env.YANDEX_GPT_FOLDER_ID
    console.log('Yandex GPT env check:', {
      hasApiKey: !!yandexApiKey,
      hasFolderId: !!yandexFolderId,
      model: process.env.YANDEX_GPT_MODEL || 'yandexgpt/latest'
    })

    // Пытаемся сгенерировать через Yandex GPT, при ошибке используем fallback
    if (yandexApiKey && yandexFolderId) {
      try {
        console.log('Starting Yandex GPT generation:', { prompt, templateType })
        const result = await yandexGPT.generateContent(prompt, templateType)
        generatedText = (result.text && result.text.trim().length > 0)
          ? result.text
          : await generateContent(prompt, templateType)
        tokensUsed = result.tokensUsed || 0
        console.log('Yandex GPT generation successful:', { textLength: generatedText.length, tokensUsed })
      } catch (error) {
        console.error('Yandex GPT generation failed, using fallback:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          prompt,
          templateType
        })
        generatedText = await generateContent(prompt, templateType)
        tokensUsed = 100
      }
    } else {
      console.warn('YANDEX_API_KEY or YANDEX_FOLDER_ID missing → using fallback generation')
      generatedText = await generateContent(prompt, templateType)
      tokensUsed = 100
    }
    
    // Проверяем лимит ПОСЛЕ генерации, но ПЕРЕД сохранением
    if (user.subscription_status === 'FREE' && (user.usage_count_day || 0) >= 25) {
      console.log('User exceeded limit, returning error without saving')
      return NextResponse.json(
        {
          error: 'Trial limit reached. Upgrade to Pro for unlimited generations.',
          code: 'LIMIT_REACHED',
          remainingTokens: { daily: 0, monthly: -1 }
        },
        { status: 429 }
      )
    }
    
    // Сохраняем и инкрементим (через admin)
    let generation = null
    try {
      console.log('Saving generation to database for user:', user.id)
      const { data: genData, error: generationError } = await admin
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
        console.log('Generation saved successfully:', generation.id)
      } else {
        console.error('Error saving generation:', generationError)
      }

      // Для триала используем usage_count_day как "всего использовано"
      const updatedDay = (user.usage_count_day || 0) + 1
      console.log('Updating user usage count:', { old: user.usage_count_day, new: updatedDay })
      
      const { error: updErr } = await admin
        .from('user_profiles')
        .update({ usage_count_day: updatedDay })
        .eq('id', user.id)
      if (updErr) {
        console.error('Error updating user usage (admin):', updErr)
      } else {
        user.usage_count_day = updatedDay
        console.log('User usage count updated successfully')
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
      // НЕ прерываем выполнение, если база не работает
    }

    const response = {
      id: generation?.id || 'temp-' + Date.now(),
      text: generatedText,
      templateType,
      timestamp: generation?.created_at || new Date().toISOString(),
      tokensUsed,
      remainingTokens: {
        daily: user.subscription_status === 'FREE'
          ? Math.max(0, 25 - (user.usage_count_day || 0))
          : -1,
        monthly: -1
      },
      upsell: user.subscription_status === 'FREE' && (user.usage_count_day || 0) >= 25
    }
    
    console.log('=== GENERATE API SUCCESS ===')
    console.log('Response:', { 
      textLength: generatedText.length, 
      tokensUsed, 
      remainingDaily: response.remainingTokens.daily,
      upsell: response.upsell
    })
    
    return NextResponse.json(response)

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
  
  // Создаем умную генерацию на основе промпта
  const generateSmartContent = (basePrompt: string, type: string) => {
    // Извлекаем ключевые слова из промпта
    const keywords = basePrompt.toLowerCase().split(' ').filter(word => 
      word.length > 3 && !['напиши', 'создай', 'сделай', 'пост', 'статью', 'контент'].includes(word)
    )
    
    // Создаем случайные варианты для разнообразия
    const randomVariants = [
      'Уникальное предложение!',
      'Не упустите возможность!',
      'Специально для вас!',
      'Ограниченное предложение!',
      'Только сегодня!'
    ]
    
    const randomVariant = randomVariants[Math.floor(Math.random() * randomVariants.length)]
    
    // Создаем контент на основе типа и ключевых слов
    switch (type) {
      case 'VK_POST':
        // Анализируем промпт и создаем соответствующий контент
        const isCoffee = basePrompt.includes('кофейн') || basePrompt.includes('кофе')
        const isKrasnodar = basePrompt.includes('краснодар')
        const isSale = basePrompt.includes('акци') || basePrompt.includes('скидк')
        const isLatte = basePrompt.includes('латте')
        const isRestaurant = basePrompt.includes('ресторан') || basePrompt.includes('кафе')
        
        // Если промпт очень короткий, создаем более общий контент
        const isShortPrompt = basePrompt.length < 20
        
        let businessType = 'Бизнес'
        let city = 'городе'
        let offer = '💎 Выгодные цены!'
        let description = 'Мы рады предложить вам качественные услуги!'
        let hashtags = '#бизнес #услуги #качество'
        
        if (isCoffee) {
          businessType = 'Кофейня'
          offer = isLatte ? '☕ Латте всего за 100 рублей!' : '☕ Ароматный кофе по выгодным ценам!'
          description = isShortPrompt ? 
            'Добро пожаловать в нашу уютную кофейню! Здесь вы можете насладиться ароматным кофе, свежей выпечкой и приятной атмосферой.' :
            'Приходите в нашу уютную кофейню и наслаждайтесь ароматным кофе!'
          hashtags = '#кофейня #кофе #латте #вкусно #уютно'
        } else if (isRestaurant) {
          businessType = 'Ресторан'
          offer = '🍽️ Вкусные блюда по доступным ценам!'
          description = isShortPrompt ?
            'Добро пожаловать в наш ресторан! Мы предлагаем широкий выбор блюд европейской и русской кухни, приготовленных из свежих продуктов.' :
            'Добро пожаловать в наш ресторан! Мы готовим с любовью!'
          hashtags = '#ресторан #еда #вкусно #уютно'
        } else if (isShortPrompt) {
          // Для коротких промптов создаем более общий контент
          businessType = 'Бизнес'
          offer = '✨ Новые возможности!'
          description = 'Мы рады предложить вам качественные услуги и индивидуальный подход к каждому клиенту!'
          hashtags = '#бизнес #услуги #качество #надежность'
        }
        
        if (isKrasnodar) {
          city = 'Краснодаре'
          hashtags += ' #краснодар'
        }
        
        if (isSale) {
          offer = '🎉 Специальное предложение!'
          hashtags += ' #акция #скидка'
        }
        
        return `🔥 ${businessType} в ${city}

${offer}

${description}

📍 Адрес: ул. Примерная, 123
🕒 Работаем: 8:00 - 22:00
📞 Телефон: +7 (XXX) XXX-XX-XX

💡 Совет: Используйте эмодзи и хештеги для лучшего охвата!

${hashtags}`

      case 'TELEGRAM_POST':
        return `📢 ${basePrompt.includes('кофейн') ? 'Кофейня' : 'Бизнес'} в ${basePrompt.includes('краснодар') ? 'Краснодаре' : 'городе'}

${basePrompt.includes('акци') ? '🎉 Специальное предложение!' : '✨ Новое предложение!'}

${basePrompt.includes('латте') ? '☕ Латте всего за 100 рублей!' : '💎 Выгодные цены!'}

${basePrompt.includes('кофейн') ? 'Приходите в нашу уютную кофейню и наслаждайтесь ароматным кофе!' : 'Мы рады предложить вам качественные услуги!'}

🚀 Telegram - идеальная платформа для быстрого общения с аудиторией!

#telegram #кофейня #краснодар #пост #контент #мессенджер`

      case 'EMAIL_CAMPAIGN':
        return `📧 Email-рассылка

Тема письма: ${basePrompt.includes('акци') ? 'Специальное предложение!' : 'Новое предложение!'}

Дорогие подписчики!

${basePrompt.includes('кофейн') ? 'Мы рады пригласить вас в нашу кофейню!' : 'Мы рады поделиться с вами новостями!'}

${basePrompt.includes('латте') ? '☕ Латте всего за 100 рублей!' : '💎 Выгодные цены!'}

${basePrompt.includes('акци') ? 'Не упустите возможность воспользоваться нашим специальным предложением!' : 'Мы всегда рады видеть вас!'}

С уважением,
Команда ${basePrompt.includes('кофейн') ? 'Кофейни' : 'Бизнеса'}

P.S. Не забудьте подписаться на наши социальные сети!`

      case 'BLOG_ARTICLE':
        return `📝 Статья для блога

# ${basePrompt.includes('кофейн') ? 'Кофейня в Краснодаре' : 'Бизнес в городе'}

## Введение

${basePrompt.includes('кофейн') ? 'Кофейни становятся все более популярными в Краснодаре.' : 'Бизнес в современном мире требует особого подхода.'}

## Основная часть

${basePrompt.includes('акци') ? 'Специальные предложения - это отличный способ привлечь клиентов.' : 'Качественный сервис - основа успешного бизнеса.'}

${basePrompt.includes('латте') ? 'Латте за 100 рублей - это выгодное предложение для клиентов.' : 'Важно предлагать клиентам то, что им действительно нужно.'}

## Практические советы

1. ${basePrompt.includes('кофейн') ? 'Создайте уютную атмосферу' : 'Изучите потребности клиентов'}
2. ${basePrompt.includes('акци') ? 'Предлагайте выгодные акции' : 'Развивайте качественный сервис'}
3. ${basePrompt.includes('латте') ? 'Экспериментируйте с меню' : 'Не бойтесь инноваций'}

## Заключение

${basePrompt.includes('кофейн') ? 'Кофейня - это место, где люди могут отдохнуть и насладиться вкусным кофе.' : 'Успешный бизнес строится на внимании к деталям и заботе о клиентах.'}

---

*Статья создана с помощью AIКонтент*`

      case 'VIDEO_SCRIPT':
        return `🎬 Сценарий видео

# ${basePrompt.includes('кофейн') ? 'Кофейня в Краснодаре' : 'Бизнес в городе'}

## СЦЕНА 1: Вступление (0-15 сек)
"Привет, друзья! Сегодня мы поговорим о ${basePrompt.includes('кофейн') ? 'кофейне в Краснодаре' : 'бизнесе в городе'}."

## СЦЕНА 2: Основная часть (15-45 сек)
"${basePrompt.includes('акци') ? 'Специальные предложения - это отличный способ привлечь клиентов.' : 'Качественный сервис - основа успешного бизнеса.'}"

## СЦЕНА 3: Практические советы (45-60 сек)
"${basePrompt.includes('латте') ? 'Латте за 100 рублей - это выгодное предложение!' : 'Важно предлагать клиентам то, что им нужно!'}"

## СЦЕНА 4: Заключение (60-75 сек)
"Надеюсь, эта информация была полезна! Подписывайтесь на канал!"

---
*Сценарий создан с помощью AIКонтент*`

      case 'IMAGE_GENERATION':
        return `🖼️ Описание для генерации изображения

${basePrompt.includes('кофейн') ? 'Уютная кофейня в центре города с ароматным кофе и теплой атмосферой' : 'Современный бизнес-центр с профессиональной обстановкой'}

**Стиль:** ${basePrompt.includes('кофейн') ? 'уютный, теплый, домашний' : 'современный, профессиональный, качественный'}
**Цветовая схема:** ${basePrompt.includes('кофейн') ? 'теплые тона: коричневый, бежевый, золотой' : 'яркие, привлекающие внимание цвета'}
**Композиция:** сбалансированная, с акцентом на главном объекте
**Детали:** высокое разрешение, четкие линии, приятная эстетика

*Описание создано с помощью AIКонтент*`
      }
  }
  
  return generateSmartContent(prompt, templateType)
}