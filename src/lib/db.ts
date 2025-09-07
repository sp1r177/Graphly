import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://tlorolxxxyztzrjlsjbwi.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)