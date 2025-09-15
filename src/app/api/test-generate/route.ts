import { NextRequest, NextResponse } from 'next/server'
import { yandexGPT } from '@/lib/yandex-gpt'

export async function POST(request: NextRequest) {
  try {
    const { prompt, templateType } = await request.json()

    console.log('Test generation request:', { prompt, templateType })

    // Test Yandex GPT configuration
    const config = {
      apiKey: process.env.YANDEX_API_KEY || process.env.YANDEX_GPT_API_KEY,
      folderId: process.env.YANDEX_FOLDER_ID || process.env.YANDEX_GPT_FOLDER_ID,
      asyncMode: process.env.YANDEX_GPT_ASYNC_MODE === 'true' || false
    }

    console.log('Yandex GPT config:', {
      apiKey: config.apiKey ? 'SET' : 'NOT_SET',
      folderId: config.folderId ? 'SET' : 'NOT_SET',
      asyncMode: config.asyncMode
    })

    if (!config.apiKey || !config.folderId) {
      return NextResponse.json({
        success: false,
        error: 'Yandex GPT not configured',
        config
      })
    }

    // Try to generate content
    try {
      const result = await yandexGPT.generateContent(
        prompt || 'Тестовый запрос',
        templateType || 'VK_POST'
      )

      return NextResponse.json({
        success: true,
        result,
        config
      })
    } catch (gptError) {
      console.error('Yandex GPT error:', gptError)
      return NextResponse.json({
        success: false,
        error: 'Yandex GPT generation failed',
        gptError: gptError instanceof Error ? gptError.message : 'Unknown error',
        config
      })
    }

  } catch (error) {
    console.error('Test generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
