import { NextResponse } from 'next/server'
import { signOut } from '@/lib/auth-simple'

export async function POST() {
  try {
    await signOut()
    
    return NextResponse.json({
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}