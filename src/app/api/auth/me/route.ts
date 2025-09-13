import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get fresh user data from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id,email,name,subscriptionStatus,usageCountDay,usageCountMonth,lastGenerationDate,createdAt')
      .eq('id', authUser.userId)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}