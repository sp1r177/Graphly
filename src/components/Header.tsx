'use client'

import { useLanguage, useUser } from '@/app/providers'
import { Button } from '@/components/ui'
import { Globe, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const { language, setLanguage, t } = useLanguage()
  const { user, setUser } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              AIКонтент
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {t('header.dashboard')}
                </Link>
                <Link 
                  href="/profile" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {t('header.profile')}
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/pricing" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {t('header.pricing')}
                </Link>
                <Link 
                  href="/contacts" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {t('header.contacts')}
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center border rounded-lg p-1">
              <button
                onClick={() => setLanguage('ru')}
                className={`px-2 py-1 rounded text-sm transition-colors ${
                  language === 'ru' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-sm transition-colors ${
                  language === 'en' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                EN
              </button>
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{user.email}</span>
                <Button variant="outline" onClick={handleLogout}>
                  {t('header.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost">{t('header.login')}</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary">{t('header.register')}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-primary-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-600 hover:text-primary-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('header.dashboard')}
                  </Link>
                  <Link 
                    href="/profile" 
                    className="text-gray-600 hover:text-primary-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('header.profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-primary-600 py-2 text-left"
                  >
                    {t('header.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/pricing" 
                    className="text-gray-600 hover:text-primary-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('header.pricing')}
                  </Link>
                  <Link 
                    href="/contacts" 
                    className="text-gray-600 hover:text-primary-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('header.contacts')}
                  </Link>
                  <Link 
                    href="/auth/login" 
                    className="text-gray-600 hover:text-primary-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('header.login')}
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="text-primary-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('header.register')}
                  </Link>
                </>
              )}
              
              {/* Mobile Language Switcher */}
              <div className="flex items-center space-x-2 pt-3 border-t">
                <Globe size={16} className="text-gray-500" />
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-3 py-1 rounded text-sm ${
                    language === 'ru' ? 'bg-primary-600 text-white' : 'text-gray-600'
                  }`}
                >
                  RU
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-sm ${
                    language === 'en' ? 'bg-primary-600 text-white' : 'text-gray-600'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}