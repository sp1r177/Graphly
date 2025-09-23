const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Создаем планы
  const plans = [
    {
      name: 'FREE',
      quota: 10,
      description: 'Бесплатный триал - 10 генераций'
    },
    {
      name: 'PRO100',
      quota: 100,
      price: 29900, // 299 рублей в копейках
      description: 'Pro 100 - 100 генераций в месяц'
    },
    {
      name: 'PRO300',
      quota: 300,
      price: 59900, // 599 рублей в копейках
      description: 'Pro 300 - 300 генераций в месяц'
    },
    {
      name: 'PRO1000',
      quota: 1000,
      price: 99900, // 999 рублей в копейках
      description: 'Pro 1000 - 1000 генераций в месяц'
    }
  ]

  for (const planData of plans) {
    const plan = await prisma.plan.upsert({
      where: { name: planData.name },
      update: planData,
      create: planData
    })
    console.log(`✅ Plan ${plan.name} created/updated`)
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
