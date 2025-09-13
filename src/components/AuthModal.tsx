'use client'

import { Button, Input, Card } from '@/components/ui'
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { signUp, signIn } from '@/lib/auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
}

export function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      if (mode === 'register') {
        const result = await signUp(formData.email, formData.password, formData.name)
        
        if (result.needsEmailConfirmation) {
          setEmailSent(true)
        } else {
          // Автоматический вход после регистрации
          onClose()
          window.location.reload()
        }
      } else {
        await signIn(formData.email, formData.password)
        onClose()
        window.location.reload()
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      let errorMessage = 'Произошла ошибка'
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Неверный email или пароль'
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Пожалуйста, подтвердите email перед входом'
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'Пользователь с таким email уже зарегистрирован'
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        errorMessage = 'Пароль должен содержать минимум 6 символов'
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = 'Некорректный формат email'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
          </h2>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Войдите, чтобы продолжить работу' 
              : 'Создайте аккаунт для доступа к функциям'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Ваше имя
              </label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Иван Иванов"
                  required={mode === 'register'}
                  className="pl-10"
                />
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ivan@example.com"
                required
                className="pl-10"
              />
              <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="pl-10 pr-10"
              />
              <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            size="lg"
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {mode === 'login' ? 'Входим...' : 'Регистрируем...'}
              </>
            ) : (
              mode === 'login' ? 'Войти' : 'Зарегистрироваться'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <button
              onClick={() => window.location.href = mode === 'login' ? '/register' : '/login'}
              className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Или</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 border-gray-300 hover:bg-gray-50"
              onClick={() => alert('Интеграция с Google будет добавлена позже')}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {mode === 'login' ? 'Войти через Google' : 'Регистрация через Google'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
