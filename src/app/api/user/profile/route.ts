import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { supabase, updateUserProfile, getUserProfile } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    const authUser = await getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, email } = await request.json()

    // Validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Update Supabase auth user if email is being changed
    if (email && email !== authUser.email) {
      try {
        const { error: authError } = await supabase.auth.updateUser({
          email: email
        })
        
        if (authError) {
          return NextResponse.json(
            { error: 'Failed to update email in auth system' },
            { status: 400 }
          )
        }
      } catch (authUpdateError) {
        return NextResponse.json(
          { error: 'Email update failed' },
          { status: 400 }
        )
      }
    }

    // Update user metadata if name is being changed
    if (name) {
      try {
        await supabase.auth.updateUser({
          data: { name: name }
        })
      } catch (metadataError) {
        console.error('Failed to update user metadata:', metadataError)
      }
    }

    // Update user profile in our custom table
    try {
      const updates: any = {}
      if (name !== undefined) updates.name = name
      if (email && email !== authUser.email) updates.email = email
      
      if (Object.keys(updates).length > 0) {
        await updateUserProfile(authUser.id, updates)
      }
      
      // Get updated profile
      const updatedProfile = await getUserProfile(authUser.id)
      
      return NextResponse.json({
        id: authUser.id,
        name: updatedProfile?.name || name,
        email: updatedProfile?.email || authUser.email,
      })
    } catch (profileError) {
      console.error('Profile update error:', profileError)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}