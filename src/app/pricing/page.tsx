'use client'

import { Button, Card } from '@/components/ui'
import { Crown, Check, Star, Zap, Users, Rocket } from 'lucide-react'
import { useState } from 'react'

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const plans = [
    {
      id: 'free',
      name: 'Бесплатный',
      price: '0 ₽',
      period: 'навсегда',
      description: 'Идеально для знакомства с платформой',
      features: [
        '1 генерация в день',
        'Базовые шаблоны',
        'Поддержка по email',
        'Экспорт в текстовом формате'
      ],
      buttonText: 'Начать бесплатно',
      popular: false,
      icon: Zap
    },
    {
      id: 'start',
      name: 'Старт',
      price: '1000 ₽',
      period: 'в месяц',
      description: 'Для фрилансеров и малого бизнеса',
      features: [
        '100 генераций в месяц',
        'Все шаблоны контента',
        'Приоритетная поддержка',
        'Экспорт в разных форматах',
        'История генераций',
        'API доступ'
      ],
      buttonText: 'Выбрать план',
      popular: true,
      icon: Crown
    },
    {
      id: 'business',
      name: 'Бизнес',
      price: '3000 ₽',
      period: 'в месяц',
      description: 'Для команд и агентств',
      features: [
        '500 генераций в месяц',
        'Все шаблоны + кастомизация',
        '24/7 поддержка',
        'Белый лейбл',
        'Интеграция с CRM',
        'Аналитика и отчеты',
        'Персональный менеджер'
      ],
      buttonText: 'Выбрать план',
      popular: false,
      icon: Rocket
    }
  ]

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    
    // Здесь будет интеграция с Яндекс.Касса
    if (planId === 'start') {
      // Создание платежа для плана Старт
      createPayment('start', 1000)
    } else if (planId === 'business') {
      // Создание платежа для плана Бизнес
      createPayment('business', 3000)
    }
  }

  const createPayment = async (planId: string, amount: number) => {
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          amount,
          currency: 'RUB'
        }),
      })

      if (response.ok) {
        const paymentData = await response.json()
        // Перенаправление на страницу оплаты Яндекс.Касса
        window.location.href = paymentData.paymentUrl
      } else {
        throw new Error('Failed to create payment')
      }
    } catch (error) {
      console.error('Payment creation error:', error)
      alert('Ошибка при создании платежа. Попробуйте еще раз.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Выберите подходящий план
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Начните бесплатно и масштабируйтесь по мере роста вашего бизнеса. 
            Все планы включают доступ к нашему ИИ для создания контента.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const IconComponent = plan.icon
            return (
              <Card 
                key={plan.id}
                className={`p-8 relative ${
                  plan.popular 
                    ? 'border-2 border-blue-500 shadow-2xl transform scale-105' 
                    : 'border border-gray-200 hover:shadow-xl transition-shadow duration-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      <Star size={16} />
                      Популярный
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    plan.id === 'free' ? 'bg-gray-100' :
                    plan.id === 'start' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    <IconComponent 
                      size={32} 
                      className={
                        plan.id === 'free' ? 'text-gray-600' :
                        plan.id === 'start' ? 'text-blue-600' : 'text-purple-600'
                      } 
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 ml-2">
                      {plan.period}
                    </span>
                  </div>
                  
                  <p className="text-gray-600">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  className={`w-full h-12 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' 
                      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Часто задаваемые вопросы
          </h2>
          
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Можно ли отменить подписку?
              </h3>
              <p className="text-gray-600">
                Да, вы можете отменить подписку в любое время. Оплата за неиспользованный период не возвращается.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Что происходит с неиспользованными генерациями?
              </h3>
              <p className="text-gray-600">
                Неиспользованные генерации не переносятся на следующий месяц. Каждый месяц начинается с нового лимита.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Есть ли пробный период?
              </h3>
              <p className="text-gray-600">
                Да, у нас есть бесплатный план с 1 генерацией в день. Вы можете использовать его неограниченное время.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Какие способы оплаты принимаются?
              </h3>
              <p className="text-gray-600">
                Мы принимаем оплату через Яндекс.Касса: банковские карты, электронные кошельки, мобильные платежи.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="p-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
            <h2 className="text-4xl font-bold mb-6">
              Готовы начать создавать контент?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Присоединяйтесь к тысячам профессионалов, которые уже используют наш ИИ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => handleSelectPlan('start')}
                size="lg"
                className="h-14 px-8 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100"
              >
                <Crown className="mr-2" size={24} />
                Начать с плана Старт
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600"
              >
                Связаться с нами
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
