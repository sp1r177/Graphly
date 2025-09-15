import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      tests: []
    }

    // Test 1: Environment variables
    const envTest = {
      name: 'Environment Variables',
      status: 'unknown',
      details: {
        SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT_SET',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
        YANDEX_API_KEY: process.env.YANDEX_API_KEY ? 'SET' : 'NOT_SET',
        YANDEX_FOLDER_ID: process.env.YANDEX_FOLDER_ID ? 'SET' : 'NOT_SET',
      }
    }

    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      envTest.status = 'pass'
    } else {
      envTest.status = 'fail'
    }

    results.tests.push(envTest)

    // Test 2: Supabase connection
    const supabaseTest = {
      name: 'Supabase Connection',
      status: 'unknown',
      details: {}
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('count')
          .limit(1)

        if (error) {
          supabaseTest.status = 'fail'
          supabaseTest.details = { error: error.message, code: error.code }
        } else {
          supabaseTest.status = 'pass'
          supabaseTest.details = { message: 'Connection successful' }
        }
      } catch (err) {
        supabaseTest.status = 'fail'
        supabaseTest.details = { error: err instanceof Error ? err.message : 'Unknown error' }
      }
    } else {
      supabaseTest.status = 'fail'
      supabaseTest.details = { error: 'Supabase client not initialized' }
    }

    results.tests.push(supabaseTest)

    // Test 3: Database tables
    const tablesTest = {
      name: 'Database Tables',
      status: 'unknown',
      details: {}
    }

    if (supabase) {
      try {
        // Test user_profiles table
        const { error: profilesError } = await supabase
          .from('user_profiles')
          .select('id')
          .limit(1)

        // Test generations table
        const { error: generationsError } = await supabase
          .from('generations')
          .select('id')
          .limit(1)

        if (profilesError || generationsError) {
          tablesTest.status = 'fail'
          tablesTest.details = {
            profilesError: profilesError?.message,
            generationsError: generationsError?.message
          }
        } else {
          tablesTest.status = 'pass'
          tablesTest.details = { message: 'All tables accessible' }
        }
      } catch (err) {
        tablesTest.status = 'fail'
        tablesTest.details = { error: err instanceof Error ? err.message : 'Unknown error' }
      }
    } else {
      tablesTest.status = 'fail'
      tablesTest.details = { error: 'Supabase client not initialized' }
    }

    results.tests.push(tablesTest)

    // Overall status
    const allPassed = results.tests.every(test => test.status === 'pass')
    results.overall = allPassed ? 'PASS' : 'FAIL'

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        overall: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
