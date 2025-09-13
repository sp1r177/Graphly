'use client'

import { useState } from 'react'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const testEmail = async () => {
    setLoading(true)
    setStatus('')
    
    try {
      const response = await fetch('/api/auth/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          confirmationUrl: 'https://your-domain.vercel.app/auth/callback?test=true',
          name: 'Тестовый пользователь'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setStatus('✅ Письмо отправлено! Проверьте почту.')
      } else {
        setStatus(`❌ Ошибка: ${data.error}`)
      }
    } catch (error: any) {
      setStatus(`❌ Ошибка: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Тест отправки email</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email для теста:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <button
          onClick={testEmail}
          disabled={loading || !email}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? 'Отправляем...' : 'Отправить тестовое письмо'}
        </button>
        
        {status && (
          <div className={`p-3 rounded ${status.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  )
}
