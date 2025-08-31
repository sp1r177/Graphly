'use client'

import { useLanguage, useUser } from '@/app/providers'
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Header } from '@/components/Header'
import { Check, Crown, Zap, Users, Star } from 'lucide-react'
import { useState } from 'react'

const pricingPlans = [
  {
    id: 'FREE',
    name: 'Бесплатный',
    price: '0 ₽',
    period: 'навсегда',
    description: 'Идеально для знакомства с платформой',
    icon: Zap,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    features: [
      '10 генераций в день',
      'Все типы контента',
      'Базовые шаблоны',
      'Экспорт результатов',
      'Поддержка по email',
    ],
    limitations: [
      'Ограничение 10/день',
      'Базовый приоритет поддержки',
    ],
    buttonText: 'Текущий план',
    popular: false,
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: '1,000 ₽',
    period: 'в месяц',
    description: 'Для профессионалов и растущих брендов',
    icon: Crown,
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
    features: [
      'Безлимитные генерации*',
      'Все типы контента',
      'Премиум шаблоны',
      'Приоритетная поддержка',
      'API доступ',
      'Экспорт в различные форматы',
      'История генераций',
      'Аналитика использования',
    ],
    limitations: [
      '*Мягкий лимит 1000 генераций/месяц для честного использования',
    ],
    buttonText: 'Выбрать Pro',
    popular: true,
  },
  {
    id: 'ULTRA',
    name: 'Ultra',
    price: '2,000 ₽',
    period: 'в месяц',
    description: 'Для команд и крупного бизнеса',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    features: [
      'Все функции Pro',
      'Командная работа (до 5 пользователей)',
      'Белые лейблы',
      'Персональный менеджер',
      'SLA 99.9% uptime',
      'Интеграция с CRM',
      'Кастомные шаблоны',
      'Приоритет в очереди генерации',
    ],
    limitations: [],
    buttonText: 'Связаться с нами',
    popular: false,
  },
]

export default function PricingPage() {
  const { t } = useLanguage()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      alert('Пожалуйста, войдите в аккаунт для оформления подписки')
      return
    }

    if (planId === 'FREE' || planId === user.subscriptionStatus) {
      return
    }

    if (planId === 'ULTRA') {
      // For Ultra plan, redirect to contact
      window.open('mailto:sales@aikontent.ru?subject=Ultra план - заявка', '_blank')
      return
    }

    setIsLoading(true)
    setLoadingPlan(planId)

    try {
      // Create payment session with Yandex.Kassa
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          returnUrl: window.location.origin + '/dashboard?payment=success',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment creation failed')
      }

      // Redirect to Yandex.Kassa payment page
      window.location.href = data.paymentUrl
    } catch (error) {
      console.error('Payment error:', error)
      alert('Произошла ошибка при создании платежа. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Выберите подходящий план
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Создавайте профессиональный контент с помощью ИИ. Начните бесплатно, 
            перейдите на Pro для безлимитного доступа.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              Без скрытых платежей
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              Отмена в любое время
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              Поддержка 24/7
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-2" />
              Безопасные платежи
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = user?.subscriptionStatus === plan.id
            const canSubscribe = user && plan.id !== 'FREE' && !isCurrentPlan
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${
                  plan.popular ? 'ring-2 ring-primary-600 scale-105' : ''
                } hover:shadow-lg transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star size={14} className="mr-1" />
                      Популярный выбор
                    </span>
                  </div>
                )}

                <CardHeader className={`text-center ${plan.bgColor} -m-6 mb-6 rounded-t-lg`}>
                  <div className={`mx-auto w-12 h-12 ${plan.bgColor} rounded-full flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${plan.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-500 ml-1">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Включено:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Ограничения:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-500">
                            <span className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0">•</span>
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4">
                    {isCurrentPlan ? (
                      <Button 
                        variant="secondary" 
                        className="w-full"
                        disabled
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Активный план
                      </Button>
                    ) : canSubscribe ? (
                      <Button
                        variant={plan.popular ? "primary" : "outline"}
                        className="w-full"
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isLoading}
                      >
                        {loadingPlan === plan.id ? 'Обрабатываем...' : plan.buttonText}
                      </Button>
                    ) : !user ? (
                      <Button
                        variant={plan.popular ? "primary" : "outline"}
                        className="w-full"
                        onClick={() => window.location.href = '/auth/register'}
                      >
                        Начать бесплатно
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleSubscribe(plan.id)}
                      >
                        {plan.buttonText}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Часто задаваемые вопросы
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Что включает в себя &quot;мягкий лимит&quot; в Pro плане?
              </h3>
              <p className="text-gray-600">
                Pro план предоставляет безлимитный доступ для честного использования. 
                Мягкий лимит 1000 генераций в месяц означает, что при превышении этого порога 
                мы можем связаться с вами для обсуждения перехода на Ultra план.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Можно ли отменить подписку?
              </h3>
              <p className="text-gray-600">
                Да, вы можете отменить подписку в любое время через настройки профиля. 
                Доступ к функциям Pro сохраняется до конца оплаченного периода.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Какие способы оплаты поддерживаются?
              </h3>
              <p className="text-gray-600">
                Мы принимаем оплату банковскими картами (Visa, MasterCard, МИР) 
                через защищенную систему Yandex.Kassa. Комиссия составляет 2-3%.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Есть ли корпоративные скидки?
              </h3>
              <p className="text-gray-600">
                Да! При покупке Ultra плана для команд от 10 человек предоставляются 
                специальные скидки. Свяжитесь с нами для индивидуального предложения.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-primary-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Нужна помощь с выбором?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Наши эксперты помогут выбрать подходящий план и ответят на все вопросы 
            о функциональности платформы.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="primary">
              Написать в поддержку
            </Button>
            <Button variant="outline">
              Заказать звонок
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}