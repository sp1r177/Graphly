'use client'

import { Button } from '@/components/ui'
import { useUser } from '@/app/providers'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface VkAuthButtonProps {
  onSuccess?: () => void
  className?: string
  children?: React.ReactNode
}

export function VkAuthButton({ onSuccess, className, children }: VkAuthButtonProps) {
  const { setUser } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleVkAuth = () => {
    setIsLoading(true)
    
    // VK ID параметры
    const vkClientId = process.env.NEXT_PUBLIC_VK_CLIENT_ID || '54144051' // Fallback для разработки
    const redirectUri = `${window.location.origin}/auth/vk/callback`
    
    if (!vkClientId) {
      console.error('VK_CLIENT_ID not configured')
      setIsLoading(false)
      return
    }

    // Генерируем случайный state для безопасности
    const state = Math.random().toString(36).substring(2, 15)
    localStorage.setItem('vk_auth_state', state)

    // Формируем URL для VK ID авторизации
    const vkAuthUrl = new URL('https://oauth.vk.com/authorize')
    vkAuthUrl.searchParams.set('client_id', vkClientId)
    vkAuthUrl.searchParams.set('redirect_uri', redirectUri)
    vkAuthUrl.searchParams.set('response_type', 'code')
    vkAuthUrl.searchParams.set('scope', 'email')
    vkAuthUrl.searchParams.set('state', state)
    vkAuthUrl.searchParams.set('v', '5.131')

    // Открываем окно авторизации VK ID
    window.location.href = vkAuthUrl.toString()
  }

  return (
    <Button
      onClick={handleVkAuth}
      disabled={isLoading}
      className={`bg-[#0077FF] hover:bg-[#0056CC] text-white ${className}`}
      type="button"
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Загрузка...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.785 16.241s1.645-1.893 2.148-2.949c.8-1.666.712-2.784.712-2.784s.504.445.504 1.26c0 .705-.445 1.26-.445 1.26s1.645 1.893 2.148 2.949c.8 1.666.712 2.784.712 2.784s-.504-.445-.504-1.26c0-.705.445-1.26.445-1.26s-1.645-1.893-2.148-2.949c-.8-1.666-.712-2.784-.712-2.784s-.504.445-.504 1.26c0 .705.445 1.26.445 1.26s-1.645 1.893-2.148 2.949c-.8 1.666-.712 2.784-.712 2.784s-.504-.445-.504-1.26c0-.705.445-1.26.445-1.26s-1.645-1.893-2.148-2.949c-.8-1.666-.712-2.784-.712-2.784s.504.445.504 1.26c0 .705-.445 1.26-.445 1.26s1.645 1.893 2.148 2.949c.8 1.666.712 2.784.712 2.784s-.504-.445-.504-1.26c0-.705.445-1.26.445-1.26z"/>
          </svg>
          {children || 'Войти через VK ID'}
        </div>
      )}
    </Button>
  )
}
