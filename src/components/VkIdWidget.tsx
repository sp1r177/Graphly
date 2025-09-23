'use client'

import { useEffect, useRef } from 'react'
import { useUser } from '@/app/providers'
import { useRouter } from 'next/navigation'

interface VkIdWidgetProps {
  onSuccess?: () => void
  className?: string
}

declare global {
  interface Window {
    VKIDSDK: any
  }
}

export function VkIdWidget({ onSuccess, className }: VkIdWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { setUser } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Загружаем VK ID SDK
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js'
    script.async = true
    
    script.onload = () => {
      if ('VKIDSDK' in window && containerRef.current) {
        const VKID = window.VKIDSDK

        VKID.Config.init({
          app: 54144051, // Ваш VK ID App ID
          redirectUrl: 'https://graphly.ru/',
          responseMode: VKID.ConfigResponseMode.Callback,
          source: VKID.ConfigSource.LOWCODE,
          scope: 'email', // Запрашиваем доступ к email
        })

        const oneTap = new VKID.OneTap()

        oneTap.render({
          container: containerRef.current,
          showAlternativeLogin: false
        })
        .on(VKID.WidgetEvents.ERROR, vkidOnError)
        .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, function (payload: any) {
          const code = payload.code
          const deviceId = payload.device_id

          // Обрабатываем в текущем окне, без дополнительных вкладок
          VKID.Auth.exchangeCode(code, deviceId)
            .then(vkidOnSuccess)
            .catch(vkidOnError)
        })
      }
    }

    document.head.appendChild(script)

    return () => {
      // Очистка при размонтировании
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  async function vkidOnSuccess(data: any) {
    try {
      console.log('VK ID success data:', data)
      
      // Отправляем данные на наш сервер для создания/входа пользователя
      const response = await fetch('/api/auth/vk-sdk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: data.access_token,
          userId: data.user_id,
          name: `${data.firstName} ${data.lastName}`,
          firstName: data.first_name,
          lastName: data.last_name,
          avatarUrl: data.avatar_url,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка авторизации')
      }

      // Устанавливаем пользователя в контекст
      setUser(result.user)
      
      // Сохраняем пользователя в localStorage как backup
      localStorage.setItem('user', JSON.stringify(result.user))
      // Ставим вспомогательную куку с id (подхват на бэкенде при проблемах с токеном)
      document.cookie = `graphly-user-id=${encodeURIComponent(result.user.id)}; path=/; max-age=${60*60*24*7}`
      
      // Вызываем callback если есть
      if (onSuccess) {
        onSuccess()
      } else {
        // Обновляем страницу для корректной работы авторизации
        window.location.href = '/dashboard'
      }

    } catch (error) {
      console.error('VK ID auth error:', error)
      alert('Ошибка авторизации: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'))
    }
  }

  function vkidOnError(error: any) {
    console.error('VK ID error:', error)
    alert('Ошибка VK ID: ' + (error?.message || 'Неизвестная ошибка'))
  }

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ minHeight: '48px' }}
    />
  )
}
