import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { prompt, templateType } = await request.json()

    if (!prompt || !templateType) {
      return NextResponse.json(
        { error: 'Prompt and template type are required' },
        { status: 400 }
      )
    }

    // Check user's subscription and usage limits
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        subscriptionStatus: true,
        usageCountDay: true,
        usageCountMonth: true,
        lastGenerationDate: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check daily usage limit for free users
    if (user.subscriptionStatus === 'FREE') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const lastGeneration = user.lastGenerationDate
      const lastGenerationDate = lastGeneration ? new Date(lastGeneration) : null
      
      if (!lastGenerationDate || lastGenerationDate < today) {
        // Reset daily count for new day
        await prisma.user.update({
          where: { id: authUser.userId },
          data: { usageCountDay: 0 }
        })
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

    // Simulate AI generation (replace with actual AI service)
    const generatedText = await generateContent(prompt, templateType)
    
    // Save generation to database
    const generation = await prisma.generation.create({
      data: {
        userId: authUser.userId,
        prompt,
        outputText: generatedText,
        templateType,
      }
    })

    // Update user usage counts
    await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        usageCountDay: { increment: 1 },
        usageCountMonth: { increment: 1 },
        lastGenerationDate: new Date()
      }
    })

    return NextResponse.json({
      id: generation.id,
      text: generatedText,
      templateType,
      timestamp: generation.timestamp
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
  const yandexApiKey = process.env.YANDEX_GPT_API_KEY
  const yandexFolderId = process.env.YANDEX_GPT_FOLDER_ID
  const yandexApiUrl = process.env.YANDEX_GPT_API_URL || 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'

  // If Yandex GPT API is not configured, fall back to mock generation
  if (!yandexApiKey || !yandexFolderId) {
    console.warn('Yandex GPT API not configured, using mock generation')
    return generateMockContent(prompt, templateType)
  }

  try {
    // Create system prompt based on template type
    const systemPrompts = {
      'VK_POST': 'Ты эксперт по созданию постов для ВКонтакте. Создай привлекательный пост с эмодзи и хештегами.',
      'TELEGRAM_POST': 'Ты эксперт по созданию постов для Telegram. Создай информативный пост с эмодзи.',
      'EMAIL_CAMPAIGN': 'Ты эксперт по email-маркетингу. Создай профессиональное email-письмо.',
      'BLOG_ARTICLE': 'Ты эксперт по созданию статей для блога. Создай структурированную статью с заголовками.',
      'VIDEO_SCRIPT': 'Ты эксперт по созданию сценариев для видео. Создай увлекательный сценарий с описанием сцен.',
      'IMAGE_GENERATION': 'Ты эксперт по описанию изображений для AI-генерации. Создай детальное описание для генерации изображения.'
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

    const response = await fetch(yandexApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Api-Key ${yandexApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Yandex GPT API error:', response.status, errorText)
      throw new Error(`Yandex GPT API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.result && data.result.alternatives && data.result.alternatives[0]) {
      return data.result.alternatives[0].message.text
    } else {
      throw new Error('Invalid response from Yandex GPT API')
    }

  } catch (error) {
    console.error('Yandex GPT API error:', error)
    // Fall back to mock generation if API fails
    return generateMockContent(prompt, templateType)
  }
}

function generateMockContent(prompt: string, templateType: string): string {
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