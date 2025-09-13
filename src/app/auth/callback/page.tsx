'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, createUserProfile } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Обмениваем код из URL на сессию (важно для подтверждения email)
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        
        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setMessage('Ошибка подтверждения email')
          return
        }

        if (data.session?.user) {
          const user = data.session.user
          
          // Создаем профиль пользователя, если он еще не создан
          try {
            await createUserProfile(
              user.id, 
              user.email!, 
              user.user_metadata?.name || ''
            )
          } catch (profileError: any) {
            // Если профиль уже существует, это нормально
            if (!profileError.message?.includes('duplicate key')) {
              console.error('Error creating user profile:', profileError)
            }
          }

          // Устанавливаем httpOnly cookie с access_token через серверный эндпоинт
          try {
            await fetch('/api/auth/set-cookie', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accessToken: data.session.access_token })
            })
          } catch (cookieError) {
            console.error('Failed to set cookie:', cookieError)
          }
          
          setStatus('success')
          setMessage('Email успешно подтвержден! Перенаправляем...')
          
          // Перенаправляем на главную страницу через 2 секунды
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('Не удалось получить данные пользователя')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        setStatus('error')
        setMessage('Произошла неожиданная ошибка')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Обработка подтверждения...
            </h2>
            <p className="text-gray-600">
              Пожалуйста, подождите
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Успешно!
            </h2>
            <p className="text-gray-600 mb-4">
              {message}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Ошибка
            </h2>
            <p className="text-gray-600 mb-4">
              {message}
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Вернуться на главную
            </button>
          </>
        )}
      </div>
    </div>
  )
}
