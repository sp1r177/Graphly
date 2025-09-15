import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.YANDEX_API_KEY || process.env.YANDEX_GPT_API_KEY
    const folderId = process.env.YANDEX_FOLDER_ID || process.env.YANDEX_GPT_FOLDER_ID

    console.log('Yandex GPT Debug Test:', {
      apiKey: apiKey ? 'SET' : 'NOT_SET',
      folderId: folderId ? 'SET' : 'NOT_SET'
    })

    if (!apiKey || !folderId) {
      return NextResponse.json({
        success: false,
        error: 'Yandex GPT not configured',
        config: {
          apiKey: apiKey ? 'SET' : 'NOT_SET',
          folderId: folderId ? 'SET' : 'NOT_SET'
        }
      })
    }

    // Простой тест API
    try {
      const response = await axios.post(
        'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
        {
          modelUri: `gpt://${folderId}/yandexgpt/latest`,
          completionOptions: {
            stream: false,
            temperature: 0.6,
            maxTokens: "100"
          },
          messages: [
            {
              role: "user",
              text: "Привет"
            }
          ]
        },
        {
          headers: {
            'Authorization': `Api-Key ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      )

      return NextResponse.json({
        success: true,
        message: 'Yandex GPT API работает!',
        response: {
          status: response.status,
          text: response.data.result?.alternatives?.[0]?.message?.text || 'No text',
          tokens: response.data.result?.usage || {}
        }
      })

    } catch (apiError: any) {
      console.error('Yandex GPT API Error:', apiError)
      
      return NextResponse.json({
        success: false,
        error: 'Yandex GPT API failed',
        details: {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          message: apiError.message
        }
      })
    }

  } catch (error) {
    console.error('Debug test error:', error)
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
