import { supabase, createUserProfile, getUserProfile } from './supabase'
import { NextRequest } from 'next/server'

// Регистрация пользователя
export async function signUp(email: string, password: string, name?: string, redirectTo?: string) {
  if (!supabase) {
    throw new Error('Supabase не настроен. Обратитесь к администратору.')
  }

  const emailRedirectTo = (redirectTo || `${process.env.SITE_URL || 'http://localhost:3000'}/auth/callback`).replace(/\/$/, '')

  // Стандартная регистрация с подтверждением email (Supabase отправляет письмо)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: { name: name || '' },
    }
  })

  if (error) throw error

  // Если пользователь уже подтвержден и вернулась сессия — создаем профиль
  if (data.user && data.session) {
    try {
      await createUserProfile(data.user.id, email, name)
    } catch (profileError) {
      console.error('Error creating user profile:', profileError)
    }
    return { user: data.user, session: data.session, needsEmailConfirmation: false }
  }

  // В обычном случае письма — сессии нет, требуется подтверждение email
  return { user: data.user, session: data.session, needsEmailConfirmation: true }
}

// Вход пользователя
export async function signIn(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase не настроен. Обратитесь к администратору.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error

  return {
    user: data.user,
    session: data.session
  }
}

// Выход пользователя
export async function signOut() {
  if (!supabase) {
    throw new Error('Supabase не настроен. Обратитесь к администратору.')
  }
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Получение текущего пользователя
export async function getCurrentUser() {
  if (!supabase) {
    throw new Error('Supabase не настроен. Обратитесь к администратору.')
  }
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Получение сессии
export async function getSession() {
  if (!supabase) {
    throw new Error('Supabase не настроен. Обратитесь к администратору.')
  }
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

// Сброс пароля
export async function resetPassword(email: string) {
  if (!supabase) {
    throw new Error('Supabase не настроен. Обратитесь к администратору.')
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.SITE_URL || 'http://localhost:3000'}/auth/reset-password`
  })
  if (error) throw error
}

// Обновление пароля
export async function updatePassword(newPassword: string) {
  if (!supabase) {
    throw new Error('Supabase не настроен. Обратитесь к администратору.')
  }
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })
  if (error) throw error
}

// Получение пользователя из запроса (для API роутов)
export async function getUserFromRequest(request: NextRequest) {
  if (!supabase) {
    console.warn('Supabase не настроен, возвращаем null для пользователя')
    return null
  }

  const authHeader = request.headers.get('authorization')
  let token = authHeader?.replace('Bearer ', '') || undefined

  console.log('Authorization header:', authHeader)
  console.log('Token from header:', token)

  // Пытаемся прочитать токен из куки, если заголовка нет
  if (!token) {
    const cookieToken = request.cookies.get('sb-access-token')?.value
    console.log('Token from cookie:', cookieToken)
    token = cookieToken
  }

  // Если токен поврежден или нет - используем fallback по graphly-user-id
  if (!token || token.split('.').length !== 3) {
    console.log('No valid token found, trying fallback auth')
    const fallbackUserId = request.cookies.get('graphly-user-id')?.value
    if (!fallbackUserId) {
      console.log('No fallback user ID found')
      return null
    }
    try {
      // Получим профиль и соберём минимальный объект пользователя
      const profile = await getUserProfile(fallbackUserId)
      if (!profile) {
        console.log('No profile found for fallback user ID')
        return null
      }
      console.log('Fallback auth successful for user:', profile.id)
      return {
        id: profile.id,
        email: profile.email,
        user_metadata: { name: profile.name },
      } as any
    } catch (e) {
      console.error('Fallback auth by graphly-user-id failed:', e)
      return null
    }
  }

  console.log('Using token:', token.substring(0, 20) + '...')

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error) {
      console.error('Error getting user from token:', error)
      return null
    }
    if (!user) {
      console.log('No user found for token')
      return null
    }
    console.log('User found:', user.id, user.email)
    return user
  } catch (error) {
    console.error('Exception getting user from token:', error)
    return null
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' }
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain uppercase, lowercase, and numeric characters' }
  }
  
  return { valid: true }
}