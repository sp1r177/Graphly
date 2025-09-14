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

    if (sessionError || !sessionData.properties?.hashed_token) {
      console.error('Error generating session:', sessionError)
      return NextResponse.json(
        { error: 'Failed to create user session' },
        { status: 500 }
      )
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
    console.error('VK ID SDK auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
