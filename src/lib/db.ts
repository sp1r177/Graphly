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

// Supabase client (create only if both URL and KEY are valid)
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

function isValidHttpUrl(url?: string) {
  if (!url) return false
  return url.startsWith('http://') || url.startsWith('https://')
}

export const supabase = (isValidHttpUrl(supabaseUrl) && !!supabaseKey)
  ? createClient(supabaseUrl as string, supabaseKey as string)
  : null