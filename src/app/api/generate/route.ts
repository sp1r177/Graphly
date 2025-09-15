import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { yandexGPT } from '@/lib/yandex-gpt'

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
        lastGenerationDate: true,
        tokensUsedDay: true,
        tokensUsedMonth: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check daily usage limit for free users (10 generations or 5000 tokens per day)
    if (user.subscriptionStatus === 'FREE') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const lastGeneration = user.lastGenerationDate
      const lastGenerationDate = lastGeneration ? new Date(lastGeneration) : null
      
      if (!lastGenerationDate || lastGenerationDate < today) {
        // Reset daily count for new day
        await prisma.user.update({
          where: { id: authUser.userId },
          data: { 
            usageCountDay: 0,
            tokensUsedDay: 0
          }
        })
        user.usageCountDay = 0
        user.tokensUsedDay = 0
      }
      
      if (user.usageCountDay >= 10 || (user.tokensUsedDay || 0) >= 5000) {
        return NextResponse.json(
          { error: 'Daily generation limit reached. Upgrade to Pro for unlimited generations.' },
          { status: 429 }
        )
      }
    }

    // Check monthly usage limit for Pro users (100 generations or 50000 tokens per month)
    if (user.subscriptionStatus === 'PRO') {
      if (user.usageCountMonth >= 100 || (user.tokensUsedMonth || 0) >= 50000) {
        return NextResponse.json(
          { error: 'Monthly generation limit reached. Upgrade to Ultra for unlimited generations.' },
          { status: 429 }
        )
      }
    }

    // Generate content using Yandex GPT
    let generatedText: string
    let tokensUsed: number = 0

    try {
      const result = await yandexGPT.generateContent(prompt, templateType)
      generatedText = result.text
      tokensUsed = result.tokensUsed
    } catch (error) {
      console.error('Yandex GPT generation failed:', error)
      // Fallback to mock generation if Yandex GPT fails
      generatedText = await generateContent(prompt, templateType)
      tokensUsed = 100 // Default token count for fallback
    }
    
    // Save generation to database
    const generation = await prisma.generation.create({
      data: {
        userId: authUser.userId,
        prompt,
        outputText: generatedText,
        templateType,
        tokensUsed,
      }
    })

    // Update user usage counts
    await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        usageCountDay: { increment: 1 },
        usageCountMonth: { increment: 1 },
        tokensUsedDay: { increment: tokensUsed },
        tokensUsedMonth: { increment: tokensUsed },
        lastGenerationDate: new Date()
      }
    })

    return NextResponse.json({
      id: generation.id,
      text: generatedText,
      templateType,
      timestamp: generation.timestamp,
      tokensUsed,
      remainingTokens: {
        daily: user.subscriptionStatus === 'FREE' ? Math.max(0, 5000 - ((user.tokensUsedDay || 0) + tokensUsed)) : -1,
        monthly: user.subscriptionStatus === 'PRO' ? Math.max(0, 50000 - ((user.tokensUsedMonth || 0) + tokensUsed)) : -1
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