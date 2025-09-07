import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Generation Test Starting...')
    
    // Проверяем переменные Yandex GPT
    const yandexApiKey = process.env.YANDEX_API_KEY
    const yandexFolderId = process.env.YANDEX_FOLDER_ID
    
    console.log('YANDEX_API_KEY:', yandexApiKey ? 'FOUND' : 'MISSING')
    console.log('YANDEX_FOLDER_ID:', yandexFolderId ? 'FOUND' : 'MISSING')
    
    if (!yandexApiKey || !yandexFolderId) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Yandex GPT API not configured',
        missing: {
          apiKey: !yandexApiKey,
          folderId: !yandexFolderId
        },
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Пытаемся сделать запрос к Yandex GPT
    try {
      const requestBody = {
        modelUri: `gpt://${yandexFolderId}/yandexgpt`,
        completionOptions: {
          stream: false,
          temperature: 0.7,
          maxTokens: 100
        },
        messages: [
          {
            role: "user",
            text: "Привет, это тест"
          }
        ]
      }

      const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
        method: 'POST',
        headers: {
          'Authorization': `Api-Key ${yandexApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Yandex GPT API error:', response.status, errorText)
        
        return NextResponse.json({
          status: 'ERROR',
          message: 'Yandex GPT API request failed',
          statusCode: response.status,
          error: errorText,
          timestamp: new Date().toISOString()
        }, { status: 500 })
      }

      const data = await response.json()
      console.log('✅ Yandex GPT API response:', data)
      
      return NextResponse.json({
        status: 'SUCCESS',
        message: 'Yandex GPT API working',
        response: data,
        timestamp: new Date().toISOString()
      })
      
    } catch (apiError) {
      console.error('❌ API request error:', apiError)
      
      return NextResponse.json({
        status: 'ERROR',
        message: 'API request failed',
        error: apiError instanceof Error ? apiError.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    
    return NextResponse.json({
      status: 'ERROR',
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
