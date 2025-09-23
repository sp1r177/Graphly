import { NextRequest, NextResponse } from 'next/server'
import { authenticateWithVK } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { 
      accessToken, 
      userId, 
      email, 
      firstName, 
      lastName, 
      avatarUrl 
    } = await request.json()

    if (!accessToken || !userId) {
      return NextResponse.json(
        { error: 'Access token and user ID are required' },
        { status: 400 }
      )
    }

    const vkUserId = userId.toString()
    const userEmail = email || `${vkUserId}@vk.id`
    const userName = `${firstName || ''} ${lastName || ''}`.trim()

    // Создаем или получаем пользователя через Prisma
    const authResult = await authenticateWithVK(vkUserId, userEmail, userName)

    const response = NextResponse.json({
      message: 'VK ID authentication successful',
      user: authResult.user
    })

    // Устанавливаем куки
    response.cookies.set('graphly-auth-token', authResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    response.cookies.set('graphly-user-id', authResult.user.id, {
      httpOnly: false, // Нужно для fallback
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    
    console.log('VK auth completed for user:', {
      id: authResult.user.id,
      email: authResult.user.email,
      plan: authResult.user.plan
    })

    return response

  } catch (error: any) {
    console.error('VK ID SDK auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
