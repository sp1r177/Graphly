'use client'

import { useLanguage, useUser } from '@/app/providers'
import { Button, Input, Textarea, Select, Card } from '@/components/ui'
import { Copy, Download, Sparkles, Wand2, Globe, Crown, Zap, CheckCircle, LogIn, UserPlus } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { AuthModal } from './AuthModal'

export function LandingHero() {
  const { t, language, setLanguage } = useLanguage()
  const { user } = useUser()
  const [prompt, setPrompt] = useState('')
  const [templateType, setTemplateType] = useState('VK_POST')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    text?: string
    imageUrl?: string
  } | null>(null)
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean
    mode: 'login' | 'register'
  }>({ isOpen: false, mode: 'login' })

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    } catch (error) {
      console.error('Generation failed:', error)
      // Никаких фиктивных результатов — показываем ошибку
      alert('Ошибка генерации. Проверьте ключи Yandex GPT и повторите попытку.')
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

  const handleBuyPro = () => {
    // Интеграция с Яндекс.Касса
    window.open('/pricing', '_blank')
  }

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModal({ isOpen: true, mode })
  }

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' })
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Globe size={16} />
          {language === 'ru' ? 'EN' : 'RU'}
        </Button>
      </div>

      {/* Auth Buttons */}
      <div className="absolute top-4 left-4 z-10">
        {!user ? (
          <div className="flex gap-2">
            <Button
              onClick={() => openAuthModal('login')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogIn size={16} />
              Вход
            </Button>
            <Button
              onClick={() => openAuthModal('register')}
              variant="primary"
              size="sm"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus size={16} />
              Регистрация
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Привет, {user.name || user.email}!</span>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
              size="sm"
            >
              Дашборд
            </Button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap size={16} />
            Новый ИИ для маркетинга
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Создавайте
            </span>
            <br />
            контент за секунды
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Профессиональные посты для ВК, Telegram, email-кампании и статьи для SMM-щиков, фрилансеров и малого бизнеса
          </p>

          {/* Pricing Banner */}
          <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-lg inline-block mb-8">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={16} />
                <span className="text-gray-700">Бесплатно: 1 генерация/день</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="text-blue-500" size={16} />
                <span className="text-gray-700">Старт: 1000 ₽/мес (100 генераций)</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="text-purple-500" size={16} />
                <span className="text-gray-700">Бизнес: 3000 ₽/мес (500 генераций)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Generator */}
        <div className="max-w-5xl mx-auto mb-20">
          <Card className="p-8 md:p-10 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Выберите тип контента
                </label>
                <Select
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value)}
                  className="text-lg"
                >
                  <option value="VK_POST">📱 Пост для ВКонтакте</option>
                  <option value="TELEGRAM_POST">📢 Пост для Telegram</option>
                  <option value="EMAIL_CAMPAIGN">📧 Email-кампания</option>
                  <option value="BLOG_ARTICLE">📝 Статья для блога</option>
                  <option value="INSTAGRAM_POST">📸 Пост для Instagram</option>
                  <option value="AD_COPY">🎯 Рекламный текст</option>
                </Select>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Опишите, что нужно создать
                </label>
                <Textarea
                  placeholder="Например: Напиши пост для ВК про кофейню в Москве с атмосферным описанием и призывом к действию"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="text-lg resize-none"
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                variant="primary"
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Wand2 className="animate-spin mr-3" size={24} />
                    Создаю контент...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3" size={24} />
                    Сгенерировать контент
                  </>
                )}
              </Button>

              {/* Buy Pro Button */}
              {!user && (
                <div className="text-center">
                  <Button
                    onClick={handleBuyPro}
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                  >
                    <Crown className="mr-2" size={20} />
                    Купить Pro
                  </Button>
                </div>
              )}
            </div>

            {/* Result Display */}
            {result && (
              <div className="mt-10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    ✨ Ваш контент готов!
                  </h3>
                  <div className="flex space-x-3">
                    {result.text && (
                      <Button
                        onClick={() => handleCopy(result.text!)}
                        variant="outline"
                        size="lg"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Copy size={18} className="mr-2" />
                        Копировать
                      </Button>
                    )}
                    <Button variant="outline" size="lg" className="border-gray-300">
                      <Download size={18} className="mr-2" />
                      Скачать
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6">
                  {result.text && (
                    <Card className="p-6 border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-white">
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-gray-800 font-sans text-lg leading-relaxed">
                          {result.text}
                        </pre>
                      </div>
                    </Card>
                  )}
                  
                  {result.imageUrl && (
                    <Card className="p-6 border-2 border-blue-100">
                      <Image
                        src={result.imageUrl}
                        alt="Сгенерированный контент"
                        width={512}
                        height={384}
                        className="max-w-full h-auto rounded-xl shadow-lg"
                      />
                    </Card>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Examples Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Примеры созданного контента
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Посмотрите, что может создать наш ИИ
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* VK Post Example */}
            <Card className="p-6 text-left hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">ВК</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Пост для ВКонтакте</h4>
                  <p className="text-sm text-gray-500">Кофейня "Уют"</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                ☕️ Доброе утро, друзья! Сегодня хочу поделиться с вами уютным местом в центре Москвы - кофейней "Уют" на Тверской...
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <span>❤️ 24</span>
                <span>💬 8</span>
                <span>📤 12</span>
              </div>
            </Card>

            {/* Email Example */}
            <Card className="p-6 text-left hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">📧</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email-рассылка</h4>
                  <p className="text-sm text-gray-500">Магазин одежды</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                🎉 Только сегодня! Скидка 30% на всю коллекцию летней одежды. Успейте обновить гардероб к сезону...
              </p>
              <div className="mt-4">
                <Button size="sm" variant="primary" className="w-full">
                  Открыть письмо
                </Button>
              </div>
            </Card>

            {/* Blog Article Example */}
            <Card className="p-6 text-left hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">📝</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Статья для блога</h4>
                  <p className="text-sm text-gray-500">Маркетинг</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                📊 10 эффективных способов продвижения в социальных сетях в 2024 году. От базовых принципов до продвинутых техник...
              </p>
              <div className="mt-4 text-xs text-gray-500">
                <span>⏱️ 5 мин чтения</span>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="p-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
            <h2 className="text-4xl font-bold mb-6">
              Готовы создавать контент как профессионал?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Присоединяйтесь к тысячам SMM-щиков и маркетологов, которые уже используют наш ИИ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleBuyPro}
                size="lg"
                className="h-14 px-8 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100"
              >
                <Crown className="mr-2" size={24} />
                Начать бесплатно
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600"
              >
                Посмотреть примеры
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={closeAuthModal}
      />
    </section>
  )
}