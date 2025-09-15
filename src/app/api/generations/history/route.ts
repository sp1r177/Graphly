import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

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

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data: generations, error } = await supabase
      .from('generations')
      .select(`
        id,
        prompt,
        output_text,
        output_image_url,
        template_type,
        created_at
      `)
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching generations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch generations' },
        { status: 500 }
      )
    }

    // Transform data to match expected format
    const formattedGenerations = generations?.map(gen => ({
      id: gen.id,
      prompt: gen.prompt,
      outputText: gen.output_text,
      outputImageUrl: gen.output_image_url,
      templateType: gen.template_type,
      timestamp: gen.created_at,
    })) || []

    return NextResponse.json(formattedGenerations)
  } catch (error) {
    console.error('Generation history fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}