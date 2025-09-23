import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Server-side Prisma test:', {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      prismaClient: prisma ? 'CREATED' : 'NULL'
    })

    // Тест подключения к базе данных
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      status: 'success',
      message: 'Prisma connection successful',
      data: { userCount },
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: `Connection error: ${error.message}`,
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
      }
    })
  }
}
