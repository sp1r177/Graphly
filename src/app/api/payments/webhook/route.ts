import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // In production, verify webhook signature here
    // const signature = request.headers.get('x-webhook-signature')
    
    const body = await request.json()
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Handle different webhook events
    switch (body.event) {
      case 'payment.succeeded':
        // Update payment status
        await supabase
          .from('payments')
          .update({ status: 'COMPLETED' })
          .eq('yandex_payment_id', body.object.id)
        
        // Update user subscription
        const { data: payment } = await supabase
          .from('payments')
          .select('user_id, subscription_type')
          .eq('yandex_payment_id', body.object.id)
          .single()
        
        if (payment) {
          await supabase
            .from('user_profiles')
            .update({
              subscription_status: payment.subscription_type,
              usage_count_day: 0,
              usage_count_month: 0,
            })
            .eq('id', payment.user_id)
        }
        break
        
      case 'payment.cancelled':
        await supabase
          .from('payments')
          .update({ status: 'CANCELLED' })
          .eq('yandex_payment_id', body.object.id)
        break
        
      case 'payment.failed':
        await supabase
          .from('payments')
          .update({ status: 'FAILED' })
          .eq('yandex_payment_id', body.object.id)
        break
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}