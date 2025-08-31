import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromRequest, validateEmail } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    const authUser = getUserFromRequest(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, email } = await request.json()

    // For now, only allow name updates (email changes require verification)
    const updateData: any = {}
    
    if (name !== undefined) {
      updateData.name = name.trim() || null
    }

    // If email is different, we'd need to implement email verification
    // For this MVP, we'll skip email updates
    
    const updatedUser = await prisma.user.update({
      where: { id: authUser.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionStatus: true,
        usageCountDay: true,
        usageCountMonth: true,
        lastGenerationDate: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}