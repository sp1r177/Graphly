'use client'

export default function TestEnvPage() {
  console.log('=== ENVIRONMENT VARIABLES DEBUG ===')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET')
  console.log('VK_CLIENT_ID:', process.env.VK_CLIENT_ID ? 'SET' : 'NOT SET')
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('=====================================')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-2">
        <p><strong>DATABASE_URL:</strong> {process.env.DATABASE_URL ? 'SET' : 'NOT SET'}</p>
        <p><strong>NEXTAUTH_SECRET:</strong> {process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET'}</p>
        <p><strong>VK_CLIENT_ID:</strong> {process.env.VK_CLIENT_ID ? 'SET' : 'NOT SET'}</p>
        <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
      </div>
    </div>
  )
}
