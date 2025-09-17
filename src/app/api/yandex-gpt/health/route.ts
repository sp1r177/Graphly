import { NextResponse } from 'next/server'
import { yandexGPT } from '@/lib/yandex-gpt'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const isHealthy = await yandexGPT.checkHealth()
    
    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      service: 'Yandex GPT 5.1 Pro',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        status: 'error',
        service: 'Yandex GPT 5.1 Pro',
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
