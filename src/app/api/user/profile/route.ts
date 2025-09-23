import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { updateUserProfile, getUserById } from '@/lib/user'

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

    // Update user profile in Prisma
    try {
      const updates: any = {}
      if (name !== undefined) updates.name = name
      if (email && email !== authUser.email) updates.email = email
      
      if (Object.keys(updates).length > 0) {
        await updateUserProfile(authUser.id, updates)
      }
      
      // Get updated profile
      const updatedProfile = await getUserById(authUser.id)
      
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