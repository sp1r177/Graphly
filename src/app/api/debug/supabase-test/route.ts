import { NextResponse } from 'next/server'
import { supabase, getUserProfile } from '@/lib/supabase'

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase not configured',
        config: {
          SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT_SET',
          SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
        }
      })
    }

    // Test Supabase connection
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase connection failed',
        error: error.message,
        code: error.code
      })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection working',
      data: data
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Supabase test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
