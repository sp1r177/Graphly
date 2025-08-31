import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Template-specific generation logic
const generateContent = async (prompt: string, templateType: string) => {
  // This is a stub implementation - in production, integrate with actual AI APIs
  const templates = {
    VK_POST: {
      prefix: '🎯 ',
      structure: 'social_media',
      maxLength: 280,
      includeHashtags: true,
    },
    TELEGRAM_POST: {
      prefix: '📢 ',
      structure: 'social_media',
      maxLength: 500,
      includeHashtags: true,
    },
    EMAIL_CAMPAIGN: {
      prefix: 'Тема: ',
      structure: 'email',
      maxLength: 1000,
      includeHashtags: false,
    },
    BLOG_ARTICLE: {
      prefix: '',
      structure: 'article',
      maxLength: 2000,
      includeHashtags: false,
    },
    VIDEO_SCRIPT: {
      prefix: 'СЦЕНА 1: ',
      structure: 'script',
      maxLength: 800,
      includeHashtags: false,
    },
    IMAGE_GENERATION: {
      prefix: '',
      structure: 'image_prompt',
      maxLength: 200,
      includeHashtags: false,
    },
  }

  const template = templates[templateType as keyof typeof templates]
  
  // Simulate AI generation delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Generate mock content based on template
  let generatedText = ''
  let imageUrl = null

  switch (templateType) {
    case 'VK_POST':
      generatedText = `${template.prefix}${prompt}

✨ Уникальный контент для вашего бренда
🚀 Привлекает внимание аудитории  
💡 Повышает вовлеченность

Закажите подобный контент прямо сейчас!

#контент #smm #маркетинг #бизнес #${prompt.split(' ')[0].toLowerCase()}`
      break

    case 'TELEGRAM_POST':
      generatedText = `${template.prefix}${prompt}

📈 Этот контент поможет вам:
• Увеличить охваты
• Повысить конверсию  
• Привлечь новых клиентов

💬 Поделитесь в комментариях, какой контент вам нужен!

#telegram #контент #smm`
      break

    case 'EMAIL_CAMPAIGN':
      generatedText = `Тема: ${prompt} - Персональное предложение для вас! 🎁

Здравствуйте!

Мы подготовили специальный материал на тему "${prompt}".

📧 В этом письме вы найдете:
✅ Актуальную информацию
✅ Практические советы
✅ Эксклюзивные предложения

[КНОПКА: Узнать больше]

С наилучшими пожеланиями,
Команда AIКонтент`
      break

    case 'BLOG_ARTICLE':
      generatedText = `${prompt}: Полное руководство

Введение

${prompt} - это важная тема, которую стоит разобрать подробно. В этой статье мы рассмотрим основные аспекты и дадим практические рекомендации.

Основная часть

1. Первый важный момент
Подробное объяснение первого аспекта темы...

2. Второй ключевой элемент  
Разбор второго важного компонента...

3. Практические советы
Конкретные рекомендации по применению...

Заключение

Подводя итоги, можно сказать, что ${prompt} требует внимательного подхода и правильной стратегии.`
      break

    case 'VIDEO_SCRIPT':
      generatedText = `СЦЕНА 1: Крупный план - ${prompt}

ЗАКАДРОВЫЙ ГОЛОС: "Сегодня мы расскажем про ${prompt}"

СЦЕНА 2: Показываем основные элементы

ТЕКСТ НА ЭКРАНЕ: "3 главных момента"

СЦЕНА 3: Демонстрация примеров
ГОЛОС: "Первый момент - это..."

СЦЕНА 4: Призыв к действию
ГОЛОС: "Подписывайтесь на канал для новых видео!"

КОНЕЦ`
      break

    case 'IMAGE_GENERATION':
      generatedText = `Промпт для генерации изображения: "${prompt}"

Стиль: Современный, профессиональный
Цвета: Синий, белый, серый  
Композиция: Центрированная
Качество: Высокое разрешение`
      imageUrl = '/api/placeholder/512/512'
      break

    default:
      generatedText = `Сгенерированный контент на тему: ${prompt}\n\nЭто пример того, как AI создает уникальный и качественный контент для ваших задач.`
  }

  return { text: generatedText, imageUrl }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, templateType } = await request.json()

    if (!prompt || !templateType) {
      return NextResponse.json(
        { error: 'Prompt and template type are required' },
        { status: 400 }
      )
    }

    // Check if user is authenticated for usage tracking
    const authHeader = request.headers.get('authorization')
    let userId = null
    
    if (authHeader) {
      // In production, verify JWT token here
      // For now, we'll allow anonymous generation for demo
    }

    // Generate content
    const result = await generateContent(prompt, templateType)

    // Save generation to database if user is authenticated
    if (userId) {
      try {
        await prisma.generation.create({
          data: {
            userId,
            prompt,
            outputText: result.text,
            outputImageUrl: result.imageUrl,
            templateType: templateType as any,
          },
        })

        // Update user usage count
        await prisma.user.update({
          where: { id: userId },
          data: {
            usageCountDay: { increment: 1 },
            usageCountMonth: { increment: 1 },
            lastGenerationDate: new Date(),
          },
        })
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Continue even if DB fails
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}