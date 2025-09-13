import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Server-side Supabase test:', {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
      supabaseClient: supabase ? 'CREATED' : 'NULL'
    })

    if (!supabase) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase client is null',
        env: {
          SUPABASE_URL: process.env.SUPABASE_URL,
          SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET'
        }
      })
    }

    // Тест подключения
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      return NextResponse.json({
        status: 'error',
        message: `Supabase error: ${error.message}`,
        env: {
          SUPABASE_URL: process.env.SUPABASE_URL,
          SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET'
        }
      })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET'
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: `Connection error: ${error.message}`,
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET'
      }
    })
  }
}
