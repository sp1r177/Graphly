import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'Logout successful'
    })

    // Clear access token cookie
    response.cookies.set('sb-access-token', '', {
      httpOnly: false, // Изменено на false для отладки
      secure: false,   // Изменено на false для отладки
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    // Clear refresh token cookie if exists
    response.cookies.set('sb-refresh-token', '', {
      httpOnly: false, // Изменено на false для отладки
      secure: false,   // Изменено на false для отладки
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}