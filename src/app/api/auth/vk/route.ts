import { NextRequest, NextResponse } from 'next/server'
import { authenticateWithVK } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('=== VK AUTH START ===')
    
    // Проверяем переменные окружения VK
    const vkClientId = process.env.VK_CLIENT_ID
    const vkClientSecret = process.env.VK_CLIENT_SECRET
    const vkRedirectUri = process.env.VK_REDIRECT_URI
    
    console.log('VK env check:', {
      hasClientId: !!vkClientId,
      hasClientSecret: !!vkClientSecret,
      hasRedirectUri: !!vkRedirectUri
    })
    
    if (!vkClientId || !vkClientSecret || !vkRedirectUri) {
      console.error('VK environment variables missing')
      return NextResponse.json(
        { error: 'VK authentication not configured' },
        { status: 500 }
      )
    }
    
    const { code, state } = await request.json()
    console.log('VK auth request:', { hasCode: !!code, hasState: !!state })

    if (!code) {
      console.log('VK auth error: No authorization code')
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    // Получаем VK токен доступа
    const vkTokenResponse = await fetch('https://oauth.vk.com/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: vkClientId,
        client_secret: vkClientSecret,
        redirect_uri: vkRedirectUri,
        code,
      }),
    })

    const tokenData = await vkTokenResponse.json()
    console.log('VK token response:', { 
      status: vkTokenResponse.status, 
      hasAccessToken: !!tokenData.access_token,
      hasEmail: !!tokenData.email,
      error: tokenData.error
    })

    if (!tokenData.access_token) {
      console.error('VK token error:', tokenData)
      return NextResponse.json(
        { error: 'Failed to get VK access token' },
        { status: 400 }
      )
    }

    // Получаем информацию о пользователе из VK
    const userInfoResponse = await fetch(
      `https://api.vk.com/method/users.get?access_token=${tokenData.access_token}&v=5.131&fields=photo_200,email`
    )
    
    const userInfoData = await userInfoResponse.json()
    console.log('VK user info response:', { 
      status: userInfoResponse.status,
      hasResponse: !!userInfoData.response,
      responseLength: userInfoData.response?.length || 0,
      error: userInfoData.error
    })

    if (!userInfoData.response || userInfoData.response.length === 0) {
      console.error('VK user info error:', userInfoData)
      return NextResponse.json(
        { error: 'Failed to get VK user info' },
        { status: 400 }
      )
    }

    const vkUser = userInfoData.response[0]
    const vkUserId = vkUser.id.toString()
    const email = tokenData.email || `${vkUserId}@vk.id`
    const name = `${vkUser.first_name} ${vkUser.last_name}`
    
    console.log('VK user data:', { 
      vkUserId, 
      email, 
      name,
      hasPhoto: !!vkUser.photo_200
    })

    // Создаем или получаем пользователя через Prisma
    const authResult = await authenticateWithVK(vkUserId, email, name)

    console.log('VK auth success:', {
      userId: authResult.user.id,
      email: authResult.user.email,
      plan: authResult.user.plan
    })

    const response = NextResponse.json({
      message: 'VK authentication successful',
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

    return response

  } catch (error: any) {
    console.error('VK auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
