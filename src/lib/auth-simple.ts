// Простая версия аутентификации без Supabase для тестирования
import { NextRequest } from 'next/server'

// Временные данные пользователей (в реальном проекте это будет в базе данных)
const users = new Map<string, { id: string; email: string; password: string; name?: string }>()

// Регистрация пользователя (упрощенная версия)
export async function signUp(email: string, password: string, name?: string) {
  if (users.has(email)) {
    throw new Error('Пользователь с таким email уже существует')
  }

  const userId = Math.random().toString(36).substr(2, 9)
  users.set(email, {
    id: userId,
    email,
    password, // В реальном проекте пароль должен быть захеширован
    name
  })

  return {
    user: { id: userId, email, user_metadata: { name } },
    session: null,
    needsEmailConfirmation: false
  }
}

// Вход пользователя (упрощенная версия)
export async function signIn(email: string, password: string) {
  const user = users.get(email)
  
  if (!user || user.password !== password) {
    throw new Error('Неверный email или пароль')
  }

  return {
    user: { id: user.id, email: user.email, user_metadata: { name: user.name } },
    session: null
  }
}

// Выход пользователя
export async function signOut() {
  // В упрощенной версии ничего не делаем
  return
}

// Получение текущего пользователя
export async function getCurrentUser() {
  // В упрощенной версии возвращаем null
  return null
}

// Получение сессии
export async function getSession() {
  // В упрощенной версии возвращаем null
  return null
}

// Сброс пароля
export async function resetPassword(email: string) {
  throw new Error('Сброс пароля не реализован в упрощенной версии')
}

// Обновление пароля
export async function updatePassword(newPassword: string) {
  throw new Error('Обновление пароля не реализовано в упрощенной версии')
}

// Получение пользователя из запроса (для API роутов)
export async function getUserFromRequest(request: NextRequest) {
  // В упрощенной версии возвращаем null
  return null
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
