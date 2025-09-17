import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const apiKey = process.env.YANDEX_GPT_API_KEY || process.env.YANDEX_API_KEY
    const folderId = process.env.YANDEX_GPT_FOLDER_ID || process.env.YANDEX_FOLDER_ID
    
    if (!apiKey || !folderId) {
      return NextResponse.json({ error: 'Yandex credentials not configured' }, { status: 500 })
    }

    // Тестируем разные модели
    const modelsToTest = [
      'yandexgpt/latest',
      'gpt-oss-20b/latest', 
      'gpt-oss-120b/latest',
      'yandexgpt',
      'gpt-oss-20b',
      'gpt-oss-120b'
    ]

    const results = []

    for (const modelName of modelsToTest) {
      try {
        const modelUri = `gpt://${folderId}/${modelName}`
        
        const requestData = {
          modelUri,
          completionOptions: {
            stream: false,
            temperature: 0.7,
            maxTokens: 10
          },
          messages: [
            { role: 'user', text: 'Привет' }
          ]
        }

        console.log(`Testing model: ${modelName} (${modelUri})`)
        
        const response = await axios.post(
          'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
          requestData,
          {
            headers: {
              'Authorization': `Api-Key ${apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        )

        results.push({
          model: modelName,
          status: 'success',
          response: {
            status: response.status,
            hasResult: !!response.data.result,
            alternativesCount: response.data.result?.alternatives?.length || 0
          }
        })

      } catch (error: any) {
        results.push({
          model: modelName,
          status: 'error',
          error: {
            message: error.message,
            status: error.response?.status || null,
            data: error.response?.data || null
          }
        })
      }
    }

    return NextResponse.json({
      folderId,
      results
    })

  } catch (error) {
    console.error('Model test error:', error)
    return NextResponse.json({ error: 'Test failed' }, { status: 500 })
  }
}
