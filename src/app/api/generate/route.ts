import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Template-specific generation logic
const generateContent = async (prompt: string, templateType: string) => {
  // This is a stub implementation - in production, integrate with actual AI APIs
  const templates = {
    VK_POST: {
      prefix: '📱 ',
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
      prefix: '📧 ',
      structure: 'email',
      maxLength: 1000,
      includeHashtags: false,
    },
    BLOG_ARTICLE: {
      prefix: '📝 ',
      structure: 'article',
      maxLength: 2000,
      includeHashtags: false,
    },
    INSTAGRAM_POST: {
      prefix: '📸 ',
      structure: 'social_media',
      maxLength: 300,
      includeHashtags: true,
    },
    AD_COPY: {
      prefix: '🎯 ',
      structure: 'advertising',
      maxLength: 150,
      includeHashtags: false,
    },
  }

  const template = templates[templateType as keyof typeof templates]
  
  // Simulate AI generation delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Generate mock content based on template
  let generatedText = ''
  let imageUrl = null

  switch (templateType) {
    case 'VK_POST':
      generatedText = `${template.prefix}${prompt}

✨ Что вас ждет:
• Уникальный контент для вашего бренда
• Привлекательные заголовки и описания
• Эмодзи и хештеги для лучшего охвата

🚀 Этот пост поможет:
- Увеличить вовлеченность аудитории
- Привлечь новых подписчиков
- Повысить узнаваемость бренда

💡 Совет: Публикуйте в пиковые часы активности вашей аудитории

#контент #smm #маркетинг #бизнес #${prompt.split(' ')[0].toLowerCase()} #россия`
      break

    case 'TELEGRAM_POST':
      generatedText = `${template.prefix}${prompt}

📈 Этот контент создан специально для Telegram-аудитории:

✅ Легко читается на мобильных устройствах
✅ Содержит полезную информацию
✅ Призывает к действию

🎯 Цель: привлечь внимание и вызвать интерес

💬 Поделитесь в комментариях, какой контент вам нужен!

#telegram #контент #smm #${prompt.split(' ')[0].toLowerCase()}`
      break

    case 'EMAIL_CAMPAIGN':
      generatedText = `Тема: ${prompt} - Персональное предложение для вас! 🎁

Здравствуйте, дорогой клиент!

Мы подготовили специальный материал на тему "${prompt}", который будет полезен именно вам.

📧 В этом письме вы найдете:
✅ Актуальную информацию по вашей теме
✅ Практические советы от экспертов
✅ Эксклюзивные предложения и скидки

🔥 Только для подписчиков:
- Специальные цены
- Ранний доступ к новинкам
- Персональные консультации

[КНОПКА: Узнать больше]

С наилучшими пожеланиями,
Команда AIКонтент

P.S. Если у вас есть вопросы, просто ответьте на это письмо!`
      break

    case 'BLOG_ARTICLE':
      generatedText = `${prompt}: Полное руководство для профессионалов

📖 Введение

${prompt} - это важная тема, которую стоит разобрать подробно. В этой статье мы рассмотрим основные аспекты и дадим практические рекомендации, основанные на реальном опыте.

🎯 Основные разделы:

1. Что такое ${prompt}?
Подробное объяснение первого аспекта темы с примерами из практики.

2. Почему это важно для вашего бизнеса?
Разбор второго важного компонента и его влияния на результаты.

3. Как правильно применять на практике?
Конкретные рекомендации по внедрению и использованию.

4. Частые ошибки и как их избежать
Анализ типичных проблем и способы их решения.

💡 Практические советы:
• Начните с малого
• Тестируйте разные подходы
• Анализируйте результаты

📊 Заключение

Подводя итоги, можно сказать, что ${prompt} требует внимательного подхода и правильной стратегии. При грамотном использовании это может стать мощным инструментом для развития вашего бизнеса.

🔗 Полезные ссылки:
- Дополнительные материалы
- Консультации экспертов
- Инструменты для работы`
      break

    case 'INSTAGRAM_POST':
      generatedText = `${template.prefix}${prompt}

✨ Создаем контент, который:
• Привлекает внимание в ленте
• Вызывает эмоции и желание поделиться
• Соответствует стилю Instagram

🎨 Визуальные элементы:
- Яркие цвета
- Современные шрифты
- Привлекательные изображения

💬 Вопрос для аудитории:
Какой контент вам больше всего нравится в Instagram?

#instagram #контент #smm #${prompt.split(' ')[0].toLowerCase()} #дизайн`
      break

    case 'AD_COPY':
      generatedText = `${template.prefix}${prompt}

🔥 ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ!

${prompt} - это именно то, что вам нужно прямо сейчас!

⚡ Почему стоит действовать немедленно:
• Эксклюзивные условия
• Лучшие цены сезона
• Гарантированный результат

🎯 Призыв к действию:
"Нажмите кнопку ниже и получите персональное предложение!"

⏰ Предложение действует только 24 часа!

#реклама #${prompt.split(' ')[0].toLowerCase()} #спецпредложение`
      break

    default:
      generatedText = `Сгенерированный контент на тему: ${prompt}

✨ Что мы создали для вас:
• Уникальный текст, соответствующий вашим требованиям
• Профессиональный стиль и структуру
• Готовый к использованию материал

🚀 Этот контент поможет:
- Привлечь внимание целевой аудитории
- Повысить вовлеченность
- Достичь ваших маркетинговых целей

💡 Рекомендации по использованию:
Адаптируйте текст под ваш бренд и аудиторию для лучших результатов.`
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