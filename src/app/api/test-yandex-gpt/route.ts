import { NextResponse } from 'next/server'
import { yandexGPT } from '@/lib/yandex-gpt'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Простой тест генерации
    const result = await yandexGPT.generateContent(
      'Создай короткий пост о новом продукте',
      'VK_POST'
    )

    return NextResponse.json({
      status: 'success',
      message: 'Yandex GPT работает!',
      result: {
        text: result.text,
        tokensUsed: result.tokensUsed
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Yandex GPT test error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Yandex GPT не работает',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
