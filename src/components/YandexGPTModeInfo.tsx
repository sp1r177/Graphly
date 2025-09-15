'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

interface ModeInfo {
  mode: 'sync' | 'async'
  costPer1kTokens: number
  responseTime: string
  description: string
}

export function YandexGPTModeInfo() {
  const [modeInfo, setModeInfo] = useState<ModeInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Получаем информацию о режиме из переменных окружения
    const isAsync = process.env.NEXT_PUBLIC_YANDEX_GPT_ASYNC_MODE === 'true'
    
    const info: ModeInfo = isAsync 
      ? {
          mode: 'async',
          costPer1kTokens: 0.20,
          responseTime: '10-60 секунд',
          description: 'Дешевле в 2 раза, идеально для массовой генерации контента'
        }
      : {
          mode: 'sync',
          costPer1kTokens: 0.40,
          responseTime: '1-3 секунды',
          description: 'Мгновенный ответ, подходит для интерактивных приложений'
        }
    
    setModeInfo(info)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Режим работы Yandex GPT</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!modeInfo) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Режим работы Yandex GPT
          <span className={`px-2 py-1 text-xs rounded-full ${
            modeInfo.mode === 'async' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {modeInfo.mode === 'async' ? 'Асинхронный' : 'Синхронный'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Стоимость за 1000 токенов</div>
              <div className="text-2xl font-bold text-green-600">
                {modeInfo.costPer1kTokens}₽
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Время отклика</div>
              <div className="text-lg font-semibold">
                {modeInfo.responseTime}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-700">
            {modeInfo.description}
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-800 mb-2">
              Примеры стоимости:
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div>• Пост ВК (100 токенов): {((modeInfo.costPer1kTokens * 100) / 1000).toFixed(3)}₽</div>
              <div>• Статья блога (1000 токенов): {modeInfo.costPer1kTokens}₽</div>
              <div>• Email-кампания (500 токенов): {((modeInfo.costPer1kTokens * 500) / 1000).toFixed(2)}₽</div>
            </div>
          </div>

          {modeInfo.mode === 'async' && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <div className="text-sm text-green-800">
                💡 <strong>Экономия:</strong> Асинхронный режим в 2 раза дешевле синхронного!
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
