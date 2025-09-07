import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Supabase Test:')
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Найден' : '❌ Не найден')
    console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Найден' : '❌ Не найден')
    
    // Test Supabase connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Supabase connection failed',
        error: error.message,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }
    
    console.log('✅ Supabase connection successful')
    
    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      data: data,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Supabase test failed:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Supabase test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
