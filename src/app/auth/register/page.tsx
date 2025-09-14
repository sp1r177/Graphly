'use client'

import { useLanguage, useUser } from '@/app/providers'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { VkIdWidget } from '@/components/VkIdWidget'
import { Header } from '@/components/Header'
import { UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const { t } = useLanguage()
  const { setUser } = useUser()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
                <UserPlus className="h-6 w-6 text-primary-600" />
              </div>
              <CardTitle className="text-2xl">Регистрация в Graphly</CardTitle>
              <p className="text-gray-600">
                Создайте аккаунт через VK ID для начала работы
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-center mb-6">
                <VkIdWidget 
                  onSuccess={() => router.push('/dashboard')}
                  className="w-full"
                />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  🎉 Получите 10 бесплатных генераций сразу после регистрации!
                </p>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Создавая аккаунт, вы соглашаетесь с{' '}
                  <a href="#" className="underline hover:text-gray-600">Условиями использования</a>{' '}
                  и{' '}
                  <a href="#" className="underline hover:text-gray-600">Политикой конфиденциальности</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}