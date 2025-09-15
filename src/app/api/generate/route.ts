import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { supabase, getUserProfile, updateUserProfile } from '@/lib/supabase'
import { yandexGPT } from '@/lib/yandex-gpt'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getUserFromRequest(request)
    
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
    const user = await getUserProfile(authUser.id)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check daily usage limit for free users (10 generations per day)
    if (user.subscription_status === 'FREE') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // For now, we'll use a simple daily limit check
      // In a real implementation, you'd want to track daily usage more precisely
      if (user.usage_count_day >= 10) {
        return NextResponse.json(
          { error: 'Daily generation limit reached. Upgrade to Pro for unlimited generations.' },
          { status: 429 }
        )
      }
    }

    // Check monthly usage limit for Pro users (100 generations per month)
    if (user.subscription_status === 'PRO') {
      if (user.usage_count_month >= 100) {
        return NextResponse.json(
          { error: 'Monthly generation limit reached. Upgrade to Ultra for unlimited generations.' },
          { status: 429 }
        )
      }
    }

    // Generate content using Yandex GPT
    let generatedText: string
    let tokensUsed: number = 0

    // Check if Yandex GPT is configured
    const yandexApiKey = process.env.YANDEX_API_KEY || process.env.YANDEX_GPT_API_KEY
    const yandexFolderId = process.env.YANDEX_FOLDER_ID || process.env.YANDEX_GPT_FOLDER_ID

    if (!yandexApiKey || !yandexFolderId) {
      console.log('Yandex GPT not configured, using fallback generation')
      generatedText = await generateContent(prompt, templateType)
      tokensUsed = 100
    } else {
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
        tokensUsed = 100 // Default token count for fallback
        console.log('Using fallback generation')
      }
    }
    
    // Save generation to database
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data: generation, error: generationError } = await supabase
      .from('generations')
      .insert({
        user_id: authUser.id,
        prompt,
        output_text: generatedText,
        template_type: templateType,
        tokens_used: tokensUsed,
      })
      .select()
      .single()

    if (generationError) {
      console.error('Error saving generation:', generationError)
      throw new Error('Failed to save generation')
    }

    // Update user usage counts
    await updateUserProfile(authUser.id, {
      usage_count_day: user.usage_count_day + 1,
      usage_count_month: user.usage_count_month + 1,
    })

    return NextResponse.json({
      id: generation.id,
      text: generatedText,
      templateType,
      timestamp: generation.created_at,
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