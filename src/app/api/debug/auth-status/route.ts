import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getUserProfile } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('=== AUTH DEBUG START ===')
    
    // Проверяем все куки
    const allCookies = request.cookies.getAll()
    console.log('All cookies:', allCookies)
    
    // Проверяем заголовки
    const authHeader = request.headers.get('authorization')
    console.log('Authorization header:', authHeader)
    
    // Проверяем конкретные куки
    const sbToken = request.cookies.get('sb-access-token')?.value
    const graphlyUserId = request.cookies.get('graphly-user-id')?.value
    
    console.log('sb-access-token:', sbToken ? `${sbToken.substring(0, 20)}...` : 'NOT_SET')
    console.log('graphly-user-id:', graphlyUserId || 'NOT_SET')
    
    // Пробуем получить пользователя
    const authUser = await getUserFromRequest(request)
    console.log('getUserFromRequest result:', authUser ? { id: authUser.id, email: authUser.email } : 'NULL')
    
    let userProfile = null
    if (authUser) {
      try {
        userProfile = await getUserProfile(authUser.id)
        console.log('User profile:', userProfile ? { id: userProfile.id, subscription: userProfile.subscription_status } : 'NULL')
      } catch (e) {
        console.log('Error getting profile:', e)
      }
    }
    
    console.log('=== AUTH DEBUG END ===')
    
    return NextResponse.json({
      success: true,
      debug: {
        cookies: allCookies.map(c => ({ name: c.name, hasValue: !!c.value })),
        authHeader: authHeader ? 'SET' : 'NOT_SET',
        sbToken: sbToken ? 'SET' : 'NOT_SET',
        graphlyUserId: graphlyUserId || 'NOT_SET',
        authUser: authUser ? { id: authUser.id, email: authUser.email } : null,
        userProfile: userProfile ? { 
          id: userProfile.id, 
          subscription: userProfile.subscription_status,
          usageDay: userProfile.usage_count_day 
        } : null
      }
    })
    
  } catch (error) {
    console.error('Auth debug error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
