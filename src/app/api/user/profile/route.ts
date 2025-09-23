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

    const { name } = await request.json()

    // Update user profile in Prisma
    try {
      const updates: any = {}
      if (name !== undefined) updates.name = name
      
      if (Object.keys(updates).length > 0) {
        await updateUserProfile(authUser.id, updates)
      }
      
      // Get updated profile
      const updatedProfile = await getUserById(authUser.id)
      
      return NextResponse.json({
        id: authUser.id,
        name: updatedProfile?.name || name,
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