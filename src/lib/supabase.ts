import { createClient } from '@supabase/supabase-js'

// Функция для получения переменных окружения
const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  
  console.log('Supabase config check:', {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
    finalUrl: url,
    finalKey: key ? 'SET' : 'NOT_SET'
  })
  
  if (!url || !key) {
    console.warn('Supabase environment variables not found:', {
      hasUrl: !!url,
      hasKey: !!key,
      nodeEnv: process.env.NODE_ENV
    })
    return null
  }
  
  return { url, key }
}

// Создаем клиент только если переменные доступны
const config = getSupabaseConfig()
export const supabase = config 
  ? createClient(config.url, config.key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null

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
  if (!supabase) {
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
  if (!supabase) {
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
  if (!supabase) {
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
