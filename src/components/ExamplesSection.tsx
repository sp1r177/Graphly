'use client'

import { useLanguage } from '@/app/providers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { MessageCircle, Mail, FileText, Video, Image } from 'lucide-react'

const examples = [
  {
    id: 1,
    type: 'VK_POST',
    icon: MessageCircle,
    title: 'Пост для ВКонтакте',
    content: `🎯 Новая коллекция осень-зима уже в продаже!

Встречайте тренды сезона:
✨ Уютные свитера из кашемира
🧥 Стильные пальто с поясом  
👠 Элегантные ботильоны на каблуке

Скидка 20% по промокоду AUTUMN20
Действует до 15 ноября!

#мода #осень2024 #скидки #новаяколлекция`,
    image: '/api/placeholder/300/200'
  },
  {
    id: 2,
    type: 'EMAIL',
    icon: Mail,
    title: 'Email-кампания',
    content: `Тема: Персональная скидка специально для вас! 🎁

Здравствуйте, Анна!

Мы заметили, что вы интересовались нашими зимними куртками. 

Специально для вас действует эксклюзивная скидка 25% на всю зимнюю коллекцию!

Промокод: WINTER25
Действует до: 20.11.2024

[КНОПКА: Выбрать куртку]`,
    image: null
  },
  {
    id: 3,
    type: 'ARTICLE',
    icon: FileText,
    title: 'Статья для блога',
    content: `Как выбрать идеальную куртку на зиму: 5 важных критериев

1. Материал утеплителя
Натуральный пух обеспечивает лучшую теплоизоляцию...

2. Водоотталкивающая обработка
Важно, чтобы куртка была защищена от влаги...

3. Длина и крой
Выбирайте длину в зависимости от вашего роста...`,
    image: '/api/placeholder/300/200'
  },
  {
    id: 4,
    type: 'VIDEO_SCRIPT',
    icon: Video,
    title: 'Сценарий видео',
    content: `СЦЕНА 1: Крупный план - руки листают каталог

ЗАКАДРОВЫЙ ГОЛОС: "Как найти идеальную куртку за 60 секунд?"

СЦЕНА 2: Показываем 3 куртки разных стилей

ТЕКСТ НА ЭКРАНЕ: "3 простых шага"

СЦЕНА 3: Девушка примеряет куртки
ГОЛОС: "Шаг 1: Определите стиль..."`,
    image: '/api/placeholder/300/200'
  }
]

export function ExamplesSection() {
  const { language } = useLanguage()

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Примеры сгенерированного контента
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Посмотрите, какой профессиональный контент можно создать за несколько секунд
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {examples.map((example) => {
            const Icon = example.icon
            return (
              <Card key={example.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Icon size={20} className="mr-2 text-primary-600" />
                    {example.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                        {example.content}
                      </pre>
                    </div>
                    {example.image && (
                      <div className="rounded-lg overflow-hidden">
                        <div className="w-full h-32 bg-gradient-to-r from-primary-100 to-primary-200 flex items-center justify-center">
                          <Image size={48} className="text-primary-400" alt="Сгенерированное изображение" />
                          <span className="ml-2 text-primary-600 font-medium">
                            Сгенерированное изображение
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Все примеры созданы с помощью AIКонтент за несколько секунд
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="px-3 py-1 bg-gray-100 rounded-full">✨ Уникальный контент</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">⚡ Мгновенная генерация</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">🎯 Готовые шаблоны</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">📱 Адаптация под платформы</span>
          </div>
        </div>
      </div>
    </section>
  )
}