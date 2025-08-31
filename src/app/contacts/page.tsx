import { Header } from '@/components/Header'
import { ContactForm } from '@/components/ContactForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Mail, MessageCircle, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Свяжитесь с нами
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы всегда готовы помочь вам в создании профессионального контента
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 text-primary-600" size={20} />
                Email поддержка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">support@aikontent.ru</p>
              <p className="text-sm text-gray-500">Ответим в течение 2 часов в рабочее время</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 text-primary-600" size={20} />
                Telegram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">@aikontent_support</p>
              <p className="text-sm text-gray-500">Онлайн чат 24/7</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 text-primary-600" size={20} />
                Телефон
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">+7 (495) 123-45-67</p>
              <p className="text-sm text-gray-500">Пн-Пт: 9:00-18:00 МСК</p>
            </CardContent>
          </Card>
        </div>

        {/* Office Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 text-primary-600" size={20} />
                Офис в Москве
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                г. Москва, ул. Тверская, д. 1, офис 101<br/>
                БЦ "Технопарк", 125009
              </p>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  🚇 Метро: Тверская, Пушкинская<br/>
                  🚗 Парковка: доступна для гостей<br/>
                  ♿ Доступность: есть пандус и лифт
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 text-primary-600" size={20} />
                Режим работы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Понедельник - Пятница:</span>
                  <span>9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Суббота:</span>
                  <span>10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Воскресенье:</span>
                  <span>Выходной</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-800">
                  💬 Онлайн поддержка работает 24/7 через Telegram
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form Section */}
        <ContactForm />

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Быстрые ответы
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  ❓ Как быстро отвечает поддержка?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Email: до 2 часов в рабочее время<br/>
                  Telegram: мгновенно 24/7<br/>
                  Телефон: сразу в рабочие часы
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  💳 Проблемы с оплатой?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Напишите в Telegram @aikontent_support с номером заказа. 
                  Решим проблему в течение 15 минут.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  🔧 Техническая поддержка
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Проблемы с генерацией контента? Опишите подробно 
                  ваш запрос и мы поможем оптимизировать результат.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  📈 Корпоративные клиенты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Для команд от 10 человек — персональный менеджер 
                  и специальные условия. Звоните +7 (495) 123-45-67.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}