'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

// Language Context
export type Language = 'ru' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Simple translations object
const translations = {
  ru: {
    // Header
    'header.login': 'Вход',
    'header.register': 'Регистрация',
    'header.pricing': 'Цены',
    'header.contacts': 'Контакты',
    'header.dashboard': 'Дашборд',
    'header.profile': 'Профиль',
    'header.logout': 'Выход',
    
    // Landing page
    'hero.title': 'Генерируй контент мгновенно',
    'hero.subtitle': 'Создавайте профессиональный контент для социальных сетей, email-кампаний и блогов с помощью ИИ',
    'hero.placeholder': 'Опишите, какой контент вам нужен...',
    'hero.generate': 'Сгенерировать',
    'hero.copy': 'Копировать',
    'hero.export': 'Экспорт',
    
    // Templates
    'template.vk_post': 'Пост для ВК',
    'template.telegram_post': 'Пост для Telegram',
    'template.email': 'Email-кампания',
    'template.article': 'Статья для блога',
    'template.video_script': 'Сценарий видео',
    'template.image': 'Генерация изображения',
    
    // Pricing
    'pricing.free.title': 'Бесплатный',
    'pricing.free.price': '0 ₽',
    'pricing.free.features': '10 генераций в день',
    'pricing.pro.title': 'Pro',
    'pricing.pro.price': '1,000 ₽/мес',
    'pricing.pro.features': 'Безлимитные генерации',
    'pricing.ultra.title': 'Ultra',
    'pricing.ultra.price': '2,000 ₽/мес',
    'pricing.ultra.features': 'Для бизнеса + приоритет',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Произошла ошибка',
    'common.success': 'Успешно!',
  },
  en: {
    // Header
    'header.login': 'Login',
    'header.register': 'Register',
    'header.pricing': 'Pricing',
    'header.contacts': 'Contacts',
    'header.dashboard': 'Dashboard',
    'header.profile': 'Profile',
    'header.logout': 'Logout',
    
    // Landing page
    'hero.title': 'Generate Content Instantly',
    'hero.subtitle': 'Create professional content for social media, email campaigns, and blogs with AI',
    'hero.placeholder': 'Describe what content you need...',
    'hero.generate': 'Generate',
    'hero.copy': 'Copy',
    'hero.export': 'Export',
    
    // Templates
    'template.vk_post': 'VK Post',
    'template.telegram_post': 'Telegram Post',
    'template.email': 'Email Campaign',
    'template.article': 'Blog Article',
    'template.video_script': 'Video Script',
    'template.image': 'Image Generation',
    
    // Pricing
    'pricing.free.title': 'Free',
    'pricing.free.price': '$0',
    'pricing.free.features': '10 generations per day',
    'pricing.pro.title': 'Pro',
    'pricing.pro.price': '$14/month',
    'pricing.pro.features': 'Unlimited generations',
    'pricing.ultra.title': 'Ultra',
    'pricing.ultra.price': '$28/month',
    'pricing.ultra.features': 'For business + priority',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
  }
}

// User Context
interface User {
  id: string
  email: string
  name?: string
  subscriptionStatus: 'FREE' | 'PRO' | 'ULTRA'
  usageCountDay: number
  usageCountMonth: number
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function Providers({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru')
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ru']] || key
  }

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth in provider...')
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        })
        
        console.log('Auth response status:', response.status)
        
        if (response.ok) {
          const userData = await response.json()
          console.log('User data from API:', userData)
          setUser(userData)
        } else {
          console.log('Auth failed, setting user to null')
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <UserContext.Provider value={{ user, setUser, isLoading }}>
        {children}
      </UserContext.Provider>
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}