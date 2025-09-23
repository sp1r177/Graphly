import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getUserById, getUserLimits } from '@/lib/user'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('API /api/auth/me called')
    console.log('Cookies:', request.cookies.getAll())
    
    const authUser = await getUserFromRequest(request)
    console.log('Auth user:', authUser)
    
    if (!authUser) {
      // Hard fallback: try `graphly-user-id` cookie directly
      const fallbackUserId = request.cookies.get('graphly-user-id')?.value
      if (fallbackUserId) {
        try {
          const userProfile = await getUserById(fallbackUserId)
          if (userProfile) {
            const limits = await getUserLimits(userProfile.id)
            return NextResponse.json({
              id: userProfile.id,
              email: userProfile.email,
              name: userProfile.name,
              subscriptionStatus: userProfile.plan?.name || 'FREE',
              usageCountDay: limits.used,
              usageCountMonth: limits.used,
              remainingTokens: limits.remaining,
              createdAt: userProfile.createdAt,
            })
          }
        } catch (e) {
          console.log('Fallback by graphly-user-id failed:', e)
        }
      }
      console.log('No auth user found, returning 401')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile from Prisma
    const userProfile = await getUserById(authUser.id)

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Get user limits
    const limits = await getUserLimits(authUser.id)

    return NextResponse.json({
      id: authUser.id,
      email: userProfile.email,
      name: authUser.user_metadata?.name || userProfile.name,
      subscriptionStatus: userProfile.plan?.name || 'FREE',
      usageCountDay: limits.used,
      usageCountMonth: limits.used,
      remainingTokens: limits.remaining,
      createdAt: userProfile.createdAt,
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}