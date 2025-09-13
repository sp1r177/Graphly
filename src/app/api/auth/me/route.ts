import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getUserProfile } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile from Supabase
    const userProfile = await getUserProfile(authUser.id)

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.name || userProfile.name,
      subscriptionStatus: userProfile.subscription_status,
      usageCountDay: userProfile.usage_count_day,
      usageCountMonth: userProfile.usage_count_month,
      createdAt: userProfile.created_at,
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}