import { NextRequest } from 'next/server'
import { createOrGetUser, getUserById, getUserByVkId } from './user'
import jwt from 'jsonwebtoken'

// VK ID авторизация
export async function authenticateWithVK(vkId: string, email?: string, name?: string) {
  try {
    const user = await createOrGetUser(vkId, email, name)
    
    // Создаем JWT токен
    const token = jwt.sign(
      { 
        userId: user.id, 
        vkId: user.vk_id,
        email: user.email 
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    )

    return {
      user: {
        id: user.id,
        vk_id: user.vk_id,
        email: user.email,
        name: user.name,
        plan: user.plan?.name || 'FREE'
      },
      token
    }
  } catch (error) {
    console.error('VK authentication error:', error)
    throw new Error('Authentication failed')
  }
}

// Получение пользователя из JWT токена
export async function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any
    const user = await getUserById(decoded.userId)
    return user
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Получение пользователя из запроса (для API роутов)
export async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  let token = authHeader?.replace('Bearer ', '') || undefined

  console.log('Authorization header:', authHeader)
  console.log('Token from header:', token)

  // Пытаемся прочитать токен из куки, если заголовка нет
  if (!token) {
    const cookieToken = request.cookies.get('graphly-auth-token')?.value
    console.log('Token from cookie:', cookieToken)
    token = cookieToken
  }

  // Если токен поврежден или нет - используем fallback по graphly-user-id
  if (!token || token.split('.').length !== 3) {
    console.log('No valid token found, trying fallback auth')
    const fallbackUserId = request.cookies.get('graphly-user-id')?.value
    console.log('Fallback user ID from cookie:', fallbackUserId)
    
    if (!fallbackUserId) {
      console.log('No fallback user ID found in cookies')
      console.log('Available cookies:', request.cookies.getAll().map(c => c.name))
      return null
    }
    
    try {
      console.log('Attempting to get profile for fallback user:', fallbackUserId)
      const profile = await getUserById(fallbackUserId)
      console.log('Profile lookup result:', profile ? 'FOUND' : 'NOT_FOUND')
      
      if (!profile) {
        console.log('No profile found for fallback user ID:', fallbackUserId)
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
    const user = await getUserFromToken(token)
    if (!user) {
      console.log('No user found for token')
      return null
    }
    console.log('User found:', user.id, user.email)
    return {
      id: user.id,
      email: user.email,
      user_metadata: { name: user.name },
    } as any
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