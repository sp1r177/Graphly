'use client'

import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Mail, MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      alert('Произошла ошибка при отправке сообщения. Попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Остались вопросы?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Свяжитесь с нами, и мы поможем вам начать создавать профессиональный контент
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Мы всегда на связи
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="text-primary-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-gray-900">Email поддержка</h4>
                    <p className="text-gray-600">support@aikontent.ru</p>
                    <p className="text-sm text-gray-500">Ответим в течение 2 часов</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <MessageCircle className="text-primary-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-gray-900">Telegram</h4>
                    <p className="text-gray-600">@aikontent_support</p>
                    <p className="text-sm text-gray-500">Онлайн 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 p-6 rounded-lg">
              <h4 className="font-semibold text-primary-900 mb-2">
                Для бизнес-клиентов
              </h4>
              <p className="text-primary-800 text-sm mb-4">
                Нужна интеграция с вашей CRM или особые требования? 
                Мы поможем настроить AIКонтент под ваши задачи.
              </p>
              <p className="text-primary-700 font-medium text-sm">
                📞 +7 (495) 123-45-67
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Напишите нам</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Имя
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.ru"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тема
                  </label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="О чем хотите написать?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Сообщение
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Расскажите подробнее о ваших вопросах или предложениях..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Send className="animate-pulse mr-2" size={16} />
                      Отправляем...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2" size={16} />
                      Отправить сообщение
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}