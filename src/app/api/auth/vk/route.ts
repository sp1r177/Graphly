import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserProfile, createUserProfile } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json()

    if (!code) {
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
        client_id: process.env.VK_CLIENT_ID!,
        client_secret: process.env.VK_CLIENT_SECRET!,
        redirect_uri: process.env.VK_REDIRECT_URI!,
        code,
      }),
    })

    const tokenData = await vkTokenResponse.json()

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

    if (!userInfoData.response || userInfoData.response.length === 0) {
      return NextResponse.json(
        { error: 'Failed to get VK user info' },
        { status: 400 }
      )
    }

    const vkUser = userInfoData.response[0]
    const vkUserId = vkUser.id.toString()
    const email = tokenData.email || `${vkUserId}@vk.id`

    // Создаем или получаем Supabase клиент
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey)

    // Проверяем, существует ли пользователь с таким VK ID
    const { data: existingUser } = await admin.auth.admin.listUsers()
    let supabaseUser = existingUser?.users?.find(user => 
      user.user_metadata?.vk_id === vkUserId
    )

    if (!supabaseUser) {
      // Создаем нового пользователя в Supabase
      const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email,
        email_confirm: true, // VK уже подтвердил email
        user_metadata: {
          vk_id: vkUserId,
          name: `${vkUser.first_name} ${vkUser.last_name}`,
          avatar_url: vkUser.photo_200,
          provider: 'vk'
        }
      })

      if (createError || !newUser.user) {
        console.error('Error creating Supabase user:', createError)
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        )
      }

      supabaseUser = newUser.user

      // Создаем профиль пользователя
      try {
        await createUserProfile(
          supabaseUser.id,
          email,
          `${vkUser.first_name} ${vkUser.last_name}`,
          vkUser.photo_200,
          vkUserId,
          'vk'
        )
      } catch (profileError) {
        console.error('Error creating user profile:', profileError)
      }
    }

    // Получаем профиль пользователя
    let userProfile = null
    try {
      userProfile = await getUserProfile(supabaseUser.id)
    } catch (profileError) {
      console.error('Error fetching user profile:', profileError)
    }

    // Создаем сессию для пользователя
    const { data: sessionData, error: sessionError } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: supabaseUser.email!,
    })

    if (sessionError || !sessionData.properties?.hashed_token) {
      console.error('Error generating session:', sessionError)
      return NextResponse.json(
        { error: 'Failed to create user session' },
        { status: 500 }
      )
    }

    const response = NextResponse.json({
      message: 'VK authentication successful',
      user: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.name || userProfile?.name,
        avatar_url: supabaseUser.user_metadata?.avatar_url,
        subscriptionStatus: userProfile?.subscription_status || 'FREE',
        usageCountDay: userProfile?.usage_count_day || 0,
        usageCountMonth: userProfile?.usage_count_month || 0,
      }
    })

    // Устанавливаем куку с токеном доступа
    response.cookies.set('sb-access-token', sessionData.properties.hashed_token, {
      httpOnly: true,
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
