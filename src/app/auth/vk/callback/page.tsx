'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/app/providers'

export default function VkCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useUser()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        if (error) {
          setError('Ошибка авторизации VK ID')
          setStatus('error')
          return
        }

        if (!code) {
          setError('Не получен код авторизации')
          setStatus('error')
          return
        }

        // Проверяем state для безопасности
        const savedState = localStorage.getItem('vk_auth_state')
        if (state !== savedState) {
          setError('Неверный state параметр')
          setStatus('error')
          return
        }

        // Очищаем сохраненный state
        localStorage.removeItem('vk_auth_state')

        // Отправляем код на сервер для получения токена
        const response = await fetch('/api/auth/vk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Ошибка авторизации')
        }

        // Устанавливаем пользователя в контекст
        setUser(data.user)
        setStatus('success')

        // Перенаправляем на dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)

      } catch (error) {
        console.error('VK callback error:', error)
        setError(error instanceof Error ? error.message : 'Произошла ошибка')
        setStatus('error')
      }
    }

    handleCallback()
  }, [searchParams, setUser, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        {status === 'loading' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Завершение авторизации
            </h2>
            <p className="text-gray-600">
              Обрабатываем данные от VK ID...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Успешная авторизация!
            </h2>
            <p className="text-gray-600">
              Перенаправляем вас в личный кабинет...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="text-red-600 text-5xl mb-4">✗</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Ошибка авторизации
            </h2>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Вернуться к входу
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
