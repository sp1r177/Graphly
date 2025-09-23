import { prisma } from './prisma'

export interface UserProfile {
  id: string
  vk_id: string
  email?: string
  name?: string
  createdAt: Date
  updatedAt: Date
  planId?: string
  plan?: {
    id: string
    name: string
    quota: number
    price?: number
  }
  usages: {
    id: string
    used: number
    updatedAt: Date
  }[]
}

// Создание или получение пользователя по VK ID
export async function createOrGetUser(
  vkId: string,
  name?: string
): Promise<UserProfile> {
  // Сначала пытаемся найти существующего пользователя
  let user = await prisma.user.findUnique({
    where: { vk_id: vkId },
    include: {
      plan: true,
      usages: true
    }
  })

  if (!user) {
    // Создаем нового пользователя
    user = await prisma.user.create({
      data: {
        vk_id: vkId,
        name: name || `VK User ${vkId}`,
        planId: null, // По умолчанию без плана (бесплатный)
        usages: {
          create: {
            used: 0
          }
        }
      },
      include: {
        plan: true,
        usages: true
      }
    })
  } else {
    // Обновляем данные пользователя, если они изменились
    if (name && name !== user.name) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name },
        include: {
          plan: true,
          usages: true
        }
      })
    }
  }

  return user as UserProfile
}

// Получение пользователя по ID
export async function getUserById(userId: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      plan: true,
      usages: true
    }
  })

  return user as UserProfile | null
}

// Получение пользователя по VK ID
export async function getUserByVkId(vkId: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { vk_id: vkId },
    include: {
      plan: true,
      usages: true
    }
  })

  return user as UserProfile | null
}

// Обновление профиля пользователя
export async function updateUserProfile(
  userId: string,
  updates: {
    name?: string
    planId?: string
  }
): Promise<UserProfile> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: updates,
    include: {
      plan: true,
      usages: true
    }
  })

  return user as UserProfile
}

// Получение лимитов пользователя
export async function getUserLimits(userId: string): Promise<{
  daily: number
  monthly: number
  used: number
  remaining: number
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      plan: true,
      usages: true
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Определяем лимиты на основе плана
  let dailyLimit = 10 // Бесплатный триал
  let monthlyLimit = 10

  if (user.plan) {
    switch (user.plan.name) {
      case 'PRO100':
        dailyLimit = 100
        monthlyLimit = 100
        break
      case 'PRO300':
        dailyLimit = 300
        monthlyLimit = 300
        break
      case 'PRO1000':
        dailyLimit = 1000
        monthlyLimit = 1000
        break
    }
  }

  const used = user.usages[0]?.used || 0
  const remaining = Math.max(0, dailyLimit - used)

  return {
    daily: dailyLimit,
    monthly: monthlyLimit,
    used,
    remaining
  }
}

// Увеличение счетчика использований
export async function incrementUserUsage(userId: string): Promise<void> {
  await prisma.usage.upsert({
    where: { userId },
    update: {
      used: {
        increment: 1
      }
    },
    create: {
      userId,
      used: 1
    }
  })
}

// Сброс счетчика использований (для новых планов)
export async function resetUserUsage(userId: string): Promise<void> {
  await prisma.usage.upsert({
    where: { userId },
    update: {
      used: 0
    },
    create: {
      userId,
      used: 0
    }
  })
}
