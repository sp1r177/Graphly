'use client'

import { useLanguage, useUser } from '@/app/providers'
import { Button } from '@/components/ui'
import { Crown, Zap, Users } from 'lucide-react'
import Link from 'next/link'

export function PricingBanner() {
  const { t } = useLanguage()
  const { user } = useUser()

  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Начните генерировать контент прямо сейчас
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Бесплатно 10 генераций в день. Для безлимитного доступа — подписка Pro всего за 1000 руб/мес
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {/* Free Tier */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-center">
                <Zap className="mx-auto mb-4 text-white" size={32} />
                <h3 className="text-xl font-semibold mb-2">{t('pricing.free.title')}</h3>
                <p className="text-3xl font-bold mb-4">{t('pricing.free.price')}</p>
                <p className="text-primary-100 mb-6">{t('pricing.free.features')}</p>
                <ul className="text-sm text-primary-100 space-y-2 mb-6">
                  <li>• Все типы контента</li>
                  <li>• Базовые шаблоны</li>
                  <li>• Экспорт результатов</li>
                </ul>
                {!user && (
                  <Link href="/auth/register">
                    <Button variant="default" className="w-full">
                      Начать бесплатно
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Pro Tier */}
            <div className="bg-white rounded-lg p-6 text-gray-900 transform scale-105 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                  Популярный выбор
                </span>
              </div>
              <div className="text-center">
                <Crown className="mx-auto mb-4 text-primary-600" size={32} />
                <h3 className="text-xl font-semibold mb-2">{t('pricing.pro.title')}</h3>
                <p className="text-3xl font-bold mb-4 text-primary-600">{t('pricing.pro.price')}</p>
                <p className="text-gray-600 mb-6">{t('pricing.pro.features')}</p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Безлимитные генерации*</li>
                  <li>• Премиум шаблоны</li>
                  <li>• Приоритетная поддержка</li>
                  <li>• API доступ</li>
                </ul>
                <Link href="/pricing">
                  <Button variant="primary" className="w-full">
                    Выбрать Pro
                  </Button>
                </Link>
              </div>
            </div>

            {/* Ultra Tier */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-center">
                <Users className="mx-auto mb-4 text-white" size={32} />
                <h3 className="text-xl font-semibold mb-2">{t('pricing.ultra.title')}</h3>
                <p className="text-3xl font-bold mb-4">{t('pricing.ultra.price')}</p>
                <p className="text-primary-100 mb-6">{t('pricing.ultra.features')}</p>
                <ul className="text-sm text-primary-100 space-y-2 mb-6">
                  <li>• Все функции Pro</li>
                  <li>• Командная работа</li>
                  <li>• Белые лейблы</li>
                  <li>• Персональный менеджер</li>
                </ul>
                <Link href="/pricing">
                  <Button variant="default" className="w-full">
                    Связаться с нами
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-primary-100 mb-4">
              * Мягкий лимит 1000 генераций/месяц для честного использования
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Комиссия Yandex.Kassa 2-3%
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Отмена подписки в любое время
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Поддержка 24/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}