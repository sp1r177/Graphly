import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Простая проверка переменных окружения
    const apiKey = process.env.YANDEX_API_KEY || process.env.YANDEX_GPT_API_KEY
    const folderId = process.env.YANDEX_FOLDER_ID || process.env.YANDEX_GPT_FOLDER_ID
    const asyncMode = process.env.YANDEX_GPT_ASYNC_MODE

    return NextResponse.json({
      status: 'success',
      message: 'Простой тест прошел успешно',
      config: {
        apiKey: apiKey ? 'SET' : 'NOT_SET',
        folderId: folderId ? 'SET' : 'NOT_SET',
        asyncMode: asyncMode || 'NOT_SET',
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Простой тест не прошел',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
