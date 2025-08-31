'use client'

import { useLanguage, useUser } from '@/app/providers'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { Header } from '@/components/Header'
import { User, Mail, Lock, CreditCard, Calendar, Shield, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  subscriptionType: string
  timestamp: string
}

export default function ProfilePage() {
  const { t } = useLanguage()
  const { user, setUser } = useUser()
  const [activeTab, setActiveTab] = useState('profile')
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email,
      })
    }
  }, [user])

  useEffect(() => {
    fetchPaymentHistory()
  }, [])

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch('/api/payments/history')
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Update failed')
      }

      setUser(data.user)
      alert('Профиль успешно обновлен!')
    } catch (error) {
      console.error('Profile update error:', error)
      setErrors({ profile: error instanceof Error ? error.message : 'Произошла ошибка' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ password: 'Пароли не совпадают' })
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setErrors({ password: 'Пароль должен содержать минимум 6 символов' })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Password change failed')
      }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      alert('Пароль успешно изменен!')
    } catch (error) {
      console.error('Password change error:', error)
      setErrors({ password: error instanceof Error ? error.message : 'Произошла ошибка' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Вы уверены, что хотите отменить подписку? Доступ к функциям Pro сохранится до конца оплаченного периода.')) {
      return
    }

    try {
      const response = await fetch('/api/payments/cancel', {
        method: 'POST',
      })

      if (response.ok) {
        alert('Подписка отменена. Доступ сохранится до конца текущего периода.')
        // Refresh user data
        const userResponse = await fetch('/api/auth/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData)
        }
      } else {
        throw new Error('Failed to cancel subscription')
      }
    } catch (error) {
      console.error('Subscription cancellation error:', error)
      alert('Произошла ошибка при отмене подписки. Обратитесь в поддержку.')
    }
  }

  const tabs = [
    { id: 'profile', name: 'Профиль', icon: User },
    { id: 'subscription', name: 'Подписка', icon: CreditCard },
    { id: 'security', name: 'Безопасность', icon: Shield },
    { id: 'payments', name: 'Платежи', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Настройки профиля</h1>
          <p className="text-gray-600">Управляйте своим аккаунтом и подпиской</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={16} className="mr-3" />
                        {tab.name}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2" size={20} />
                    Информация профиля
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    {errors.profile && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {errors.profile}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Имя
                      </label>
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ваше имя"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Для изменения email обратитесь в поддержку
                      </p>
                    </div>

                    <Button type="submit" disabled={isLoading} variant="primary">
                      {isLoading ? 'Сохраняем...' : 'Сохранить изменения'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'subscription' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2" size={20} />
                    Управление подпиской
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Текущий план: {user?.subscriptionStatus}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {user?.subscriptionStatus === 'FREE' ? (
                            <>Бесплатный план • {user.usageCountDay}/10 генераций сегодня</>
                          ) : user?.subscriptionStatus === 'PRO' ? (
                            <>Pro подписка • {user.usageCountMonth || 0} генераций в месяце</>
                          ) : (
                            <>Ultra подписка • Безлимитные генерации</>
                          )}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        {user?.subscriptionStatus === 'FREE' ? (
                          <Button variant="primary" onClick={() => window.location.href = '/pricing'}>
                            Обновить план
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={handleCancelSubscription}>
                            Отменить подписку
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {user?.subscriptionStatus !== 'FREE' && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Статистика использования</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border rounded-lg p-4">
                          <p className="text-sm text-gray-600">Сегодня</p>
                          <p className="text-2xl font-bold text-gray-900">{user.usageCountDay || 0}</p>
                        </div>
                        <div className="bg-white border rounded-lg p-4">
                          <p className="text-sm text-gray-600">В этом месяце</p>
                          <p className="text-2xl font-bold text-gray-900">{user.usageCountMonth || 0}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2" size={20} />
                    Безопасность аккаунта
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Смена пароля</h3>
                      
                      {errors.password && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                          {errors.password}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Текущий пароль
                          </label>
                          <Input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Новый пароль
                          </label>
                          <Input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Подтвердите новый пароль
                          </label>
                          <Input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading} variant="primary">
                      {isLoading ? 'Изменяем...' : 'Изменить пароль'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'payments' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2" size={20} />
                    История платежей
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      История платежей пуста
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">
                              {payment.subscriptionType} подписка
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(payment.timestamp).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {payment.amount} {payment.currency}
                            </p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {payment.status === 'COMPLETED' ? 'Оплачено' :
                               payment.status === 'PENDING' ? 'В процессе' :
                               'Отменено'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}