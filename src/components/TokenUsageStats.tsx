'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

interface TokenUsage {
  subscription: string
  usage: {
    daily: {
      generations: number
      tokens: number
      limit: number
      remaining: number
    }
    monthly: {
      generations: number
      tokens: number
      limit: number
      remaining: number
    }
  }
  recentGenerations: Array<{
    id: string
    templateType: string
    tokensUsed: number
    timestamp: string
  }>
  lastGeneration: string | null
}

export function TokenUsageStats() {
  const [usage, setUsage] = useState<TokenUsage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTokenUsage()
  }, [])

  const fetchTokenUsage = async () => {
    try {
      const response = await fetch('/api/user/token-usage')
      if (!response.ok) {
        throw new Error('Failed to fetch token usage')
      }
      const data = await response.json()
      setUsage(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const formatTokens = (tokens: number) => {
    return tokens.toLocaleString()
  }

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500'
    if (percentage >= 70) return 'text-yellow-500'
    return 'text-green-500'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Статистика использования</CardTitle>
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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Статистика использования</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Ошибка загрузки: {error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!usage) return null

  return (
    <div className="space-y-6">
      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle>Подписка</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">
              {usage.subscription === 'FREE' && 'Бесплатный план'}
              {usage.subscription === 'PRO' && 'Pro план'}
              {usage.subscription === 'ULTRA' && 'Ultra план'}
            </span>
            {usage.subscription === 'FREE' && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Обновить
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Дневное использование</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Генерации:</span>
              <span className="font-semibold">
                {usage.usage.daily.generations} / {usage.usage.daily.limit === -1 ? '∞' : '10'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Токены:</span>
              <span className={`font-semibold ${getUsageColor(getUsagePercentage(usage.usage.daily.tokens, usage.usage.daily.limit))}`}>
                {formatTokens(usage.usage.daily.tokens)} / {usage.usage.daily.limit === -1 ? '∞' : formatTokens(usage.usage.daily.limit)}
              </span>
            </div>
            {usage.usage.daily.limit !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    getUsagePercentage(usage.usage.daily.tokens, usage.usage.daily.limit) >= 90
                      ? 'bg-red-500'
                      : getUsagePercentage(usage.usage.daily.tokens, usage.usage.daily.limit) >= 70
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${getUsagePercentage(usage.usage.daily.tokens, usage.usage.daily.limit)}%`
                  }}
                ></div>
              </div>
            )}
            {usage.usage.daily.remaining > 0 && (
              <div className="text-sm text-gray-600">
                Осталось: {formatTokens(usage.usage.daily.remaining)} токенов
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Месячное использование</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Генерации:</span>
              <span className="font-semibold">
                {usage.usage.monthly.generations} / {usage.usage.monthly.limit === -1 ? '∞' : '100'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Токены:</span>
              <span className={`font-semibold ${getUsageColor(getUsagePercentage(usage.usage.monthly.tokens, usage.usage.monthly.limit))}`}>
                {formatTokens(usage.usage.monthly.tokens)} / {usage.usage.monthly.limit === -1 ? '∞' : formatTokens(usage.usage.monthly.limit)}
              </span>
            </div>
            {usage.usage.monthly.limit !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    getUsagePercentage(usage.usage.monthly.tokens, usage.usage.monthly.limit) >= 90
                      ? 'bg-red-500'
                      : getUsagePercentage(usage.usage.monthly.tokens, usage.usage.monthly.limit) >= 70
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${getUsagePercentage(usage.usage.monthly.tokens, usage.usage.monthly.limit)}%`
                  }}
                ></div>
              </div>
            )}
            {usage.usage.monthly.remaining > 0 && (
              <div className="text-sm text-gray-600">
                Осталось: {formatTokens(usage.usage.monthly.remaining)} токенов
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Generations */}
      <Card>
        <CardHeader>
          <CardTitle>Последние генерации</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {usage.recentGenerations.length === 0 ? (
              <div className="text-gray-500">Пока нет генераций</div>
            ) : (
              usage.recentGenerations.map((generation) => (
                <div key={generation.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <div className="font-medium">
                      {generation.templateType.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(generation.timestamp).toLocaleString('ru-RU')}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatTokens(generation.tokensUsed)} токенов
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
