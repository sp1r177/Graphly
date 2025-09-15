import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { supabase, getUserProfile } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await getUserProfile(authUser.id)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Get recent generations for detailed stats
    const { data: recentGenerations, error: generationsError } = await supabase
      .from('generations')
      .select(`
        id,
        template_type,
        tokens_used,
        created_at
      `)
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (generationsError) {
      console.error('Error fetching recent generations:', generationsError)
    }

    // Calculate limits based on subscription
    const limits = {
      daily: user.subscription_status === 'FREE' ? 10 : -1,
      monthly: user.subscription_status === 'PRO' ? 100 : -1
    }

    const usage = {
      daily: {
        generations: user.usage_count_day,
        tokens: 0, // We'll implement token tracking later
        limit: limits.daily,
        remaining: limits.daily > 0 ? Math.max(0, limits.daily - user.usage_count_day) : -1
      },
      monthly: {
        generations: user.usage_count_month,
        tokens: 0, // We'll implement token tracking later
        limit: limits.monthly,
        remaining: limits.monthly > 0 ? Math.max(0, limits.monthly - user.usage_count_month) : -1
      }
    }

    // Format recent generations
    const formattedGenerations = recentGenerations?.map(gen => ({
      id: gen.id,
      templateType: gen.template_type,
      tokensUsed: gen.tokens_used,
      timestamp: gen.created_at
    })) || []

    return NextResponse.json({
      subscription: user.subscription_status,
      usage,
      recentGenerations: formattedGenerations,
      lastGeneration: null // We'll implement this later
    })

  } catch (error) {
    console.error('Token usage error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
