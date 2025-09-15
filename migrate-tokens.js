const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateTokens() {
  try {
    console.log('Starting token tracking migration...')
    
    // Add token tracking columns to existing users
    const users = await prisma.user.findMany({
      select: { id: true }
    })
    
    console.log(`Found ${users.length} users to update`)
    
    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          tokensUsedDay: 0,
          tokensUsedMonth: 0
        }
      })
    }
    
    // Add token tracking to existing generations
    const generations = await prisma.generation.findMany({
      select: { id: true }
    })
    
    console.log(`Found ${generations.length} generations to update`)
    
    for (const generation of generations) {
      await prisma.generation.update({
        where: { id: generation.id },
        data: {
          tokensUsed: 100 // Default token count for existing generations
        }
      })
    }
    
    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateTokens()
