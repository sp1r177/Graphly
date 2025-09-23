'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    setEnvVars({
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      VK_CLIENT_ID: process.env.VK_CLIENT_ID ? 'SET' : 'NOT_SET',
      VK_CLIENT_SECRET: process.env.VK_CLIENT_SECRET ? 'SET' : 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV,
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Environment Variables</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b">
                <span className="font-mono text-sm">{key}:</span>
                <span className={`font-mono text-sm ${value === 'SET' ? 'text-green-600' : 'text-red-600'}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Database Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span>Database URL:</span>
              <span className={envVars.DATABASE_URL === 'SET' ? 'text-green-600' : 'text-red-600'}>
                {envVars.DATABASE_URL === 'SET' ? '✅ Set' : '❌ Not Set'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>NextAuth Secret:</span>
              <span className={envVars.NEXTAUTH_SECRET === 'SET' ? 'text-green-600' : 'text-red-600'}>
                {envVars.NEXTAUTH_SECRET === 'SET' ? '✅ Set' : '❌ Not Set'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">VK ID Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span>VK Client ID:</span>
              <span className={envVars.VK_CLIENT_ID === 'SET' ? 'text-green-600' : 'text-red-600'}>
                {envVars.VK_CLIENT_ID === 'SET' ? '✅ Set' : '❌ Not Set'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>VK Client Secret:</span>
              <span className={envVars.VK_CLIENT_SECRET === 'SET' ? 'text-green-600' : 'text-red-600'}>
                {envVars.VK_CLIENT_SECRET === 'SET' ? '✅ Set' : '❌ Not Set'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <p className="text-sm text-gray-700">
            If environment variables are not set, add them to your CapRover environment variables:
          </p>
          <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
            <li>Go to CapRover Dashboard → Apps → Your App → Environment Variables</li>
            <li>Add DATABASE_URL, NEXTAUTH_SECRET, VK_CLIENT_ID, VK_CLIENT_SECRET</li>
            <li>Redeploy your project</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
