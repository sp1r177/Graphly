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