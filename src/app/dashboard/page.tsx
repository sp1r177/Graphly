'use client'

import { useLanguage, useUser } from '@/app/providers'
import { Button, Input, Textarea, Select, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Header } from '@/components/Header'
import { Sparkles, Copy, Download, Clock, BarChart3, Crown, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface Generation {
  id: string
  prompt: string
  outputText: string | null
  outputImageUrl: string | null
  templateType: string
  timestamp: string
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const { user, setUser, isLoading: isAuthLoading } = useUser()
  const [prompt, setPrompt] = useState('')
  const [templateType, setTemplateType] = useState('VK_POST')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    text?: string
    imageUrl?: string
  } | null>(null)
  const [generations, setGenerations] = useState<Generation[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  useEffect(() => {
    fetchGenerationHistory()
  }, [])

  const fetchGenerationHistory = async () => {
    try {
      const response = await fetch('/api/generations/history')
      if (response.ok) {
        const data = await response.json()
        setGenerations(data.generations || [])
      }
    } catch (error) {
      console.error('Failed to fetch generation history:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleGenerate = async () => {
    if (isAuthLoading) {
      alert('Загрузка профиля... Попробуйте через секунду.')
      return
    }
    
    // Проверяем наличие куки graphly-user-id (главный индикатор авторизации)
    const hasAuthCookie = document.cookie.includes('graphly-user-id=')
    
    if (!user || !hasAuthCookie) {
      alert('Авторизуйтесь через VK ID, чтобы генерировать контент')
      window.location.href = '/auth/login'
      return
    }
    if (!prompt.trim()) return

    // Check usage limits
    if (user?.subscriptionStatus === 'FREE' && user?.usageCountDay >= 25) {
      alert('Вы исчерпали дневной лимит бесплатных генераций. Перейдите на Pro для безлимитного доступа!')
      return
    }

    setIsLoading(true)
    try {
      const getAccessToken = () => {
        try {
          const direct = localStorage.getItem('sb-access-token')
          if (direct) return direct
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i) as string
            if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) {
              const v = localStorage.getItem(k)
              if (!v) continue
              const json = JSON.parse(v)
              const token = json?.access_token || json?.currentSession?.access_token
              if (token) return token
            }
          }
        } catch {}
        return null
      }

      const headers: any = { 'Content-Type': 'application/json' }
      const bearer = getAccessToken()
      if (bearer) headers['Authorization'] = `Bearer ${bearer}`

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          prompt,
          templateType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Generation failed')
      }

      const data = await response.json()
      setResult(data)
      
      // Обновляем локальный счётчик, если API вернул remainingTokens
      if (typeof data?.remainingTokens?.daily === 'number') {
        const used = 10 - data.remainingTokens.daily
        if (!isNaN(used)) {
          const nextUser = { ...(user as any), usageCountDay: used }
          setUser(nextUser)
          localStorage.setItem('user', JSON.stringify(nextUser))
        }
        if (data.upsell) {
          alert('Лимит триала исчерпан. Оформите Pro для продолжения.')
          window.location.href = '/pricing'
        }
      }
      
      // Refresh generation history
      fetchGenerationHistory()
    } catch (error) {
      console.error('Generation failed:', error)
      const msg = error instanceof Error ? error.message : ''
      if (msg.includes('LIMIT') || msg.includes('429')) {
        alert('Лимит триала исчерпан. Оформите Pro для продолжения.')
        window.location.href = '/pricing'
      } else if (msg.includes('Unauthorized')) {
        alert('Авторизуйтесь, чтобы генерировать контент')
        window.location.href = '/auth/login'
      } else {
        alert('Произошла ошибка при генерации. Попробуйте еще раз.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Текст скопирован в буфер обмена!')
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const getRemainingGenerations = () => {
    if (!user) return 0
    if (user.subscriptionStatus === 'FREE') {
      return Math.max(0, 10 - user.usageCountDay)
    }
    return 'Безлимит'
  }

  const getUsagePercentage = () => {
    if (!user || user.subscriptionStatus !== 'FREE') return 0
    return (user.usageCountDay / 10) * 100
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Создавайте уникальный контент с помощью искусственного интеллекта
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Generation */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 text-primary-600" size={20} />
                  Генерация контента
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип контента
                  </label>
                  <Select
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                  >
                    <option value="VK_POST">{t('template.vk_post')}</option>
                    <option value="TELEGRAM_POST">{t('template.telegram_post')}</option>
                    <option value="EMAIL_CAMPAIGN">{t('template.email')}</option>
                    <option value="BLOG_ARTICLE">{t('template.article')}</option>
                    <option value="VIDEO_SCRIPT">{t('template.video_script')}</option>
                    <option value="IMAGE_GENERATION">{t('template.image')}</option>
                  </Select>
                </div>

                {/* Prompt Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание контента
                  </label>
                  <Textarea
                    placeholder={t('hero.placeholder')}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || isAuthLoading || !prompt.trim() || (user?.subscriptionStatus === 'FREE' && (user?.usageCountDay || 0) >= 25)}
                  variant="primary"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="animate-spin mr-2" size={20} />
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2" size={20} />
                      {t('hero.generate')}
                    </>
                  )}
                </Button>

                {/* Result Display */}
                {result && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Результат генерации
                      </h3>
                      <div className="flex space-x-2">
                        {result.text && (
                          <Button
                            onClick={() => handleCopy(result.text!)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy size={16} className="mr-1" />
                            {t('hero.copy')}
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Download size={16} className="mr-1" />
                          {t('hero.export')}
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {result.text && (
                        <Card className="p-4">
                          <div className="prose max-w-none">
                            <pre className="whitespace-pre-wrap text-gray-800 font-sans text-sm">
                              {result.text}
                            </pre>
                          </div>
                        </Card>
                      )}
                      
                      {result.imageUrl && (
                        <Card className="p-4">
                          <Image
                            src={result.imageUrl}
                            alt="Generated content"
                            width={512}
                            height={384}
                            className="max-w-full h-auto rounded-lg"
                          />
                        </Card>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generation History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 text-primary-600" size={20} />
                  История генераций
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <p className="text-gray-500">Загружаем историю...</p>
                ) : generations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Пока нет генераций. Создайте свой первый контент!
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {generations.slice(0, 10).map((generation) => (
                      <div key={generation.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-primary-600">
                            {t(`template.${generation.templateType.toLowerCase()}`)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(generation.timestamp).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                          {generation.prompt}
                        </p>
                        {generation.outputText && (
                          <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 line-clamp-3">
                            {generation.outputText}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 text-primary-600" size={20} />
                  Использование
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.subscriptionStatus === 'FREE' ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Сегодня</span>
                        <span className="text-sm font-medium">
                          {user.usageCountDay}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getUsagePercentage()}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">
                        Осталось генераций: <strong>{getRemainingGenerations()}</strong>
                      </p>
                      {user.usageCountDay >= 8 && (
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-3">
                          <p className="text-sm text-yellow-800">
                            ⚠️ Лимит почти исчерпан! Переходите на Pro
                          </p>
                        </div>
                      )}
                      <Link href="/pricing">
                        <Button variant="primary" size="sm" className="w-full">
                          <Crown className="mr-1" size={16} />
                          Купить Pro
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center text-green-600">
                      <Crown size={20} className="mr-2" />
                      <span className="font-medium">Pro подписка</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Безлимитные генерации активны
                    </p>
                    <p className="text-xs text-gray-500">
                      Использовано в этом месяце: {user?.usageCountMonth || 0}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Настройки профиля
                  </Button>
                </Link>
                <Link href="/pricing" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Управление подпиской
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  Экспорт истории
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Совет дня</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Для лучших результатов указывайте целевую аудиторию и ключевые преимущества в промпте.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}