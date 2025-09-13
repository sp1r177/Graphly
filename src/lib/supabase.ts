import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Проверяем только в runtime, не во время сборки
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Missing Supabase environment variables in production')
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Типы для пользователя
export interface UserProfile {
  id: string
  email: string
  name?: string
  subscription_status: 'FREE' | 'PRO' | 'ULTRA'
  usage_count_day: number
  usage_count_month: number
  email_confirmed_at?: string
  created_at: string
  updated_at: string
}

// Функции для работы с профилем пользователя
export const createUserProfile = async (userId: string, email: string, name?: string) => {
  // Проверяем наличие переменных окружения
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase не настроен, пропускаем создание профиля')
    return null
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      email,
      name,
      subscription_status: 'FREE',
      usage_count_day: 0,
      usage_count_month: 0,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  // Проверяем наличие переменных окружения
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase не настроен, возвращаем null для профиля')
    return null
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No rows returned
    throw error
  }
  return data
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  // Проверяем наличие переменных окружения
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase не настроен, пропускаем обновление профиля')
    return null
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
