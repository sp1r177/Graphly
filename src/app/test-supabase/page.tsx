'use client'

import { useEffect, useState } from 'react'

export default function TestSupabasePage() {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [serverData, setServerData] = useState<any>(null)

  useEffect(() => {
    const testSupabase = async () => {
      try {
        console.log('Testing Supabase connection...')
        
        // Тест через API роут (серверная сторона)
        const response = await fetch('/api/test-supabase')
        const data = await response.json()
        
        setServerData(data)
        setStatus(data.status)
        setError(data.message)
      } catch (err: any) {
        setStatus('error')
        setError(`Connection error: ${err.message}`)
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> 
          <span className={`ml-2 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </span>
        </div>
        
        {error && (
          <div className="bg-red-50 p-4 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {serverData && (
          <div className="bg-gray-50 p-4 rounded">
            <strong>Server Environment Variables:</strong>
            <ul className="mt-2 space-y-1">
              <li>SUPABASE_URL: {serverData.env?.SUPABASE_URL ? 'SET' : 'NOT SET'}</li>
              <li>SUPABASE_ANON_KEY: {serverData.env?.SUPABASE_ANON_KEY || 'NOT SET'}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
