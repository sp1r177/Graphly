import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json(
      { error: 'Email confirmation is not supported. Please use VK ID authentication.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Send confirmation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
