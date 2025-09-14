'use client'

import { Card } from '@/components/ui'
import { VkIdWidget } from '@/components/VkIdWidget'
import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
}

export function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {mode === 'login' ? 'Вход в Graphly' : 'Регистрация в Graphly'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {mode === 'login' 
              ? 'Войдите через VK ID для доступа к личному кабинету'
              : 'Создайте аккаунт через VK ID для начала работы'
            }
          </p>
          
          <div className="mb-6">
            <VkIdWidget 
              onSuccess={onClose}
              className="w-full max-w-sm mx-auto"
            />
          </div>

          <p className="text-xs text-gray-500">
            {mode === 'register' && (
              <>
                Создавая аккаунт, вы соглашаетесь с{' '}
                <a href="#" className="underline hover:text-gray-700">Условиями использования</a>{' '}
                и{' '}
                <a href="#" className="underline hover:text-gray-700">Политикой конфиденциальности</a>
              </>
            )}
            {mode === 'login' && '🎉 Получите 10 бесплатных генераций!'}
          </p>
        </div>
      </Card>
    </div>
  )
}