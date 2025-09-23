import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    return NextResponse.json(
      { error: 'Password change is not supported. Please use VK ID authentication.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}