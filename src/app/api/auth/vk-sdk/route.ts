import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserProfile, createUserProfile } from '@/lib/supabase'

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

    const vkUserId = userId.toString()
    const userEmail = email || `${vkUserId}@vk.id`
    const userName = `${firstName || ''} ${lastName || ''}`.trim()

    // Проверяем, существует ли пользователь с таким VK ID
    const { data: existingUser } = await admin.auth.admin.listUsers()
    let supabaseUser = existingUser?.users?.find(user => 
      user.user_metadata?.vk_id === vkUserId
    )

    if (!supabaseUser) {
      // Создаем нового пользователя в Supabase
      const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email: userEmail,
        email_confirm: true, // VK ID уже подтвердил email
        user_metadata: {
          vk_id: vkUserId,
          name: userName,
          avatar_url: avatarUrl,
          provider: 'vk',
          first_name: firstName,
          last_name: lastName,
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
          userEmail,
          userName,
          avatarUrl,
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

    if (sessionError) {
      console.error('Error generating session:', sessionError)
      // Попробуем создать простую сессию без токена
      const response = NextResponse.json({
        message: 'VK ID authentication successful',
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
      return response
    }

    // Получаем токен из ответа
    let sessionToken = null
    if (sessionData?.properties?.hashed_token) {
      sessionToken = sessionData.properties.hashed_token
    } else if (sessionData?.action_link) {
      // Извлекаем токен из action_link
      const url = new URL(sessionData.action_link)
      sessionToken = url.searchParams.get('token')
    }

    const response = NextResponse.json({
      message: 'VK ID authentication successful',
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

    // Устанавливаем куку с токеном доступа только если токен есть
    if (sessionToken) {
      console.log('Setting cookie with token:', sessionToken.substring(0, 20) + '...')
      response.cookies.set('sb-access-token', sessionToken, {
        httpOnly: false, // Изменено на false для отладки
        secure: false,   // Изменено на false для отладки
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    } else {
      console.log('No session token to set in cookie')
    }

    // Всегда ставим вспомогательную куку с id пользователя, чтобы API мог авторизовать по ней
    console.log('Setting graphly-user-id cookie for user:', supabaseUser.id)
    response.cookies.set('graphly-user-id', supabaseUser.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    
    console.log('VK auth completed for user:', {
      id: supabaseUser.id,
      email: supabaseUser.email,
      hasProfile: !!userProfile
    })

    // Также устанавливаем куку с refresh токеном если есть
    if (sessionData?.properties?.refresh_token) {
      response.cookies.set('sb-refresh-token', sessionData.properties.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    return response

  } catch (error: any) {
    console.error('VK ID SDK auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
