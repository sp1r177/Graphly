'use client'

import { useState } from 'react'

export default function SimpleDashboardPage() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, templateType: 'VK_POST' }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setResult(data.text || 'Результат получен')
      } else {
        setResult('Ошибка генерации')
      }
    } catch (error) {
      setResult('Ошибка: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Простой Dashboard</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Генерация контента</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Описание контента
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows={3}
              placeholder="Опишите, какой контент нужен..."
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Генерируем...' : 'Сгенерировать'}
          </button>
          
          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Результат:</h3>
              <p className="whitespace-pre-wrap">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
