import { NextRequest, NextResponse } from 'next/server'
import { yandexGPT } from '@/lib/yandex-gpt'

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  try {
    const hasApiKey = !!(process.env.YANDEX_API_KEY || process.env.YANDEX_GPT_API_KEY)
    const hasFolderId = !!(process.env.YANDEX_FOLDER_ID || process.env.YANDEX_GPT_FOLDER_ID)
    const model = process.env.YANDEX_GPT_MODEL || 'yandexgpt/latest'
    const asyncMode = process.env.YANDEX_GPT_ASYNC_MODE === 'true'

    let ok = false
    let error: any = null
    try {
      ok = await yandexGPT.checkHealth()
    } catch (e: any) {
      error = {
        message: e?.message || 'Unknown error',
      }
    }

    return NextResponse.json({
      ok,
      env: { hasApiKey, hasFolderId, model, asyncMode },
      error
    })
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Health check failed' }, { status: 500 })
  }
}


