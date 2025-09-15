import axios from 'axios'

interface YandexGPTRequest {
  modelUri: string
  completionOptions: {
    stream: boolean
    temperature: number
    maxTokens: string
  }
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    text: string
  }>
}

interface YandexGPTResponse {
  result: {
    alternatives: Array<{
      message: {
        role: string
        text: string
      }
      status: string
    }>
    usage: {
      inputTextTokens: string
      completionTokens: string
      totalTokens: string
    }
    modelVersion: string
  }
}

export class YandexGPTService {
  private apiKey: string
  private folderId: string
  private baseUrl: string
  private useAsyncMode: boolean

  constructor() {
    // Поддержка разных названий переменных окружения
    this.apiKey = process.env.YANDEX_GPT_API_KEY || process.env.YANDEX_API_KEY || ''
    this.folderId = process.env.YANDEX_GPT_FOLDER_ID || process.env.YANDEX_FOLDER_ID || ''
    this.useAsyncMode = process.env.YANDEX_GPT_ASYNC_MODE === 'true' || false // По умолчанию синхронный режим
    this.baseUrl = this.useAsyncMode 
      ? 'https://llm.api.cloud.yandex.net/foundationModels/v1/completionAsync'
      : 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'
  }

  private validateConfig(): void {
    console.log('Yandex GPT Config:', {
      apiKey: this.apiKey ? 'SET' : 'NOT_SET',
      folderId: this.folderId ? 'SET' : 'NOT_SET',
      useAsyncMode: this.useAsyncMode,
      baseUrl: this.baseUrl
    })
    
    if (!this.apiKey) {
      throw new Error('YANDEX_GPT_API_KEY is not configured')
    }
    if (!this.folderId) {
      throw new Error('YANDEX_GPT_FOLDER_ID is not configured')
    }
  }

  async generateContent(
    prompt: string, 
    templateType: string,
    systemPrompt?: string
  ): Promise<{ text: string; tokensUsed: number }> {
    this.validateConfig()

    if (this.useAsyncMode) {
      return this.generateContentAsync(prompt, templateType, systemPrompt)
    } else {
      return this.generateContentSync(prompt, templateType, systemPrompt)
    }
  }

  private async generateContentSync(
    prompt: string, 
    templateType: string,
    systemPrompt?: string
  ): Promise<{ text: string; tokensUsed: number }> {
    const modelName = process.env.YANDEX_GPT_MODEL || 'yandexgpt/latest'
    const modelUri = `gpt://${this.folderId}/${modelName}`
    
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; text: string }> = []
    
    // Добавляем системный промпт для конкретного типа контента
    if (systemPrompt) {
      messages.push({ role: 'system', text: systemPrompt })
    } else {
      messages.push({ role: 'system', text: this.getSystemPromptForTemplate(templateType) })
    }
    
    // Добавляем пользовательский промпт
    messages.push({ role: 'user', text: prompt })

    const requestData: YandexGPTRequest = {
      modelUri,
      completionOptions: {
        stream: false,
        temperature: 0.7,
        maxTokens: this.getMaxTokensForTemplate(templateType)
      },
      messages
    }

    try {
      console.log('Sending request to Yandex GPT Sync API:', {
        url: this.baseUrl,
        modelUri: requestData.modelUri,
        messagesCount: requestData.messages.length
      })

      const response = await axios.post<YandexGPTResponse>(
        this.baseUrl,
        requestData,
        {
          headers: {
            'Authorization': `Api-Key ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 секунд таймаут
        }
      )

      console.log('Yandex GPT Sync API response:', {
        status: response.status,
        hasResult: !!response.data.result,
        alternativesCount: response.data.result?.alternatives?.length || 0
      })

      const result = response.data.result
      const generatedText = result.alternatives[0]?.message?.text || ''
      const tokensUsed = parseInt(result.usage.totalTokens) || 0

      console.log('Generated content:', {
        textLength: generatedText.length,
        tokensUsed
      })

      return {
        text: generatedText,
        tokensUsed
      }
    } catch (error) {
      console.error('Yandex GPT Sync API error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        response: error instanceof Error && 'response' in error ? error.response : null,
        status: error instanceof Error && 'response' in error ? (error as any).response?.status : null
      })
      throw new Error(`Failed to generate content with Yandex GPT (Sync): ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async generateContentAsync(
    prompt: string, 
    templateType: string,
    systemPrompt?: string
  ): Promise<{ text: string; tokensUsed: number }> {
    const modelName = process.env.YANDEX_GPT_MODEL || 'yandexgpt/latest'
    const modelUri = `gpt://${this.folderId}/${modelName}`
    
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; text: string }> = []
    
    // Добавляем системный промпт для конкретного типа контента
    if (systemPrompt) {
      messages.push({ role: 'system', text: systemPrompt })
    } else {
      messages.push({ role: 'system', text: this.getSystemPromptForTemplate(templateType) })
    }
    
    // Добавляем пользовательский промпт
    messages.push({ role: 'user', text: prompt })

    const requestData: YandexGPTRequest = {
      modelUri,
      completionOptions: {
        stream: false,
        temperature: 0.7,
        maxTokens: this.getMaxTokensForTemplate(templateType)
      },
      messages
    }

    try {
      // 1. Отправляем асинхронный запрос
      const response = await axios.post<{ operationId: string }>(
        this.baseUrl,
        requestData,
        {
          headers: {
            'Authorization': `Api-Key ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const operationId = response.data.operationId

      // 2. Ожидаем завершения операции
      return await this.waitForAsyncCompletion(operationId)
    } catch (error) {
      console.error('Yandex GPT Async API error:', error)
      throw new Error('Failed to generate content with Yandex GPT (Async)')
    }
  }

  private async waitForAsyncCompletion(operationId: string): Promise<{ text: string; tokensUsed: number }> {
    const maxAttempts = 30 // Максимум 30 попыток (5 минут)
    const delay = 10000 // 10 секунд между попытками

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await axios.get(
          `https://operation.api.cloud.yandex.net/operations/${operationId}`,
          {
            headers: {
              'Authorization': `Api-Key ${this.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        )

        const operation = response.data

        if (operation.done) {
          if (operation.error) {
            throw new Error(`Operation failed: ${operation.error.message}`)
          }

          const result = operation.response.result
          const generatedText = result.alternatives[0]?.message?.text || ''
          const tokensUsed = parseInt(result.usage.totalTokens) || 0

          return {
            text: generatedText,
            tokensUsed
          }
        }

        // Если операция еще не завершена, ждем
        await new Promise(resolve => setTimeout(resolve, delay))
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw error
        }
        console.warn(`Attempt ${attempt + 1} failed, retrying...`, error)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw new Error('Async operation timeout')
  }

  private getSystemPromptForTemplate(templateType: string): string {
    const systemPrompts = {
      'VK_POST': `Ты эксперт по созданию контента для ВКонтакте. Создавай интересные, вовлекающие посты с эмодзи, хештегами и призывами к действию. Посты должны быть живыми, неформальными и привлекательными для русскоязычной аудитории.`,
      'TELEGRAM_POST': `Ты эксперт по созданию контента для Telegram. Создавай информативные, структурированные посты с четкой структурой, эмодзи и хештегами. Контент должен быть полезным и легко читаемым.`,
      'EMAIL_CAMPAIGN': `Ты эксперт по email-маркетингу. Создавай профессиональные email-кампании с привлекательными темами, структурированным содержанием и четкими призывами к действию. Используй деловой тон, но не слишком формальный.`,
      'BLOG_ARTICLE': `Ты эксперт по созданию блогов. Создавай информативные, структурированные статьи с заголовками, подзаголовками и четкой логикой изложения. Контент должен быть полезным и SEO-оптимизированным.`,
      'VIDEO_SCRIPT': `Ты эксперт по созданию сценариев для видео. Создавай динамичные, увлекательные сценарии с четкой структурой, диалогами и визуальными подсказками. Контент должен быть интересным и удерживать внимание зрителя.`,
      'IMAGE_GENERATION': `Ты эксперт по созданию описаний для генерации изображений. Создавай детальные, художественные описания с указанием стиля, композиции, цветовой гаммы и настроения. Описания должны быть конкретными и вдохновляющими.`
    }

    return systemPrompts[templateType as keyof typeof systemPrompts] || 
           'Ты эксперт по созданию качественного контента. Создавай интересный, полезный и структурированный контент.'
  }

  private getMaxTokensForTemplate(templateType: string): string {
    const tokenLimits = {
      'VK_POST': '500',
      'TELEGRAM_POST': '800',
      'EMAIL_CAMPAIGN': '1500',
      'BLOG_ARTICLE': '3000',
      'VIDEO_SCRIPT': '2000',
      'IMAGE_GENERATION': '300'
    }

    return tokenLimits[templateType as keyof typeof tokenLimits] || '1000'
  }

  // Метод для проверки доступности API
  async checkHealth(): Promise<boolean> {
    try {
      this.validateConfig()
      // Простой тестовый запрос
      await this.generateContent('Тест', 'VK_POST')
      return true
    } catch (error) {
      console.error('Yandex GPT health check failed:', error)
      return false
    }
  }
}

// Экспортируем синглтон
export const yandexGPT = new YandexGPTService()
