import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, templateType } = await request.json()

    if (!prompt || !templateType) {
      return NextResponse.json(
        { error: 'Prompt and template type are required' },
        { status: 400 }
      )
    }

    // Тестируем генерацию контента
    const result = await generateContent(prompt, templateType)

    return NextResponse.json({
      success: true,
      prompt,
      templateType,
      generatedText: result,
      textLength: result.length
    })

  } catch (error) {
    console.error('Test generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

async function generateContent(prompt: string, templateType: string): Promise<string> {
  // Simulate AI generation delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Создаем умную генерацию на основе промпта
  const generateSmartContent = (basePrompt: string, type: string) => {
    // Извлекаем ключевые слова из промпта
    const keywords = basePrompt.toLowerCase().split(' ').filter(word => 
      word.length > 3 && !['напиши', 'создай', 'сделай', 'пост', 'статью', 'контент'].includes(word)
    )
    
    // Создаем случайные варианты для разнообразия
    const randomVariants = [
      'Уникальное предложение!',
      'Не упустите возможность!',
      'Специально для вас!',
      'Ограниченное предложение!',
      'Только сегодня!'
    ]
    
    const randomVariant = randomVariants[Math.floor(Math.random() * randomVariants.length)]
    
    // Создаем контент на основе типа и ключевых слов
    switch (type) {
      case 'VK_POST':
        // Анализируем промпт и создаем соответствующий контент
        const isCoffee = basePrompt.includes('кофейн') || basePrompt.includes('кофе')
        const isKrasnodar = basePrompt.includes('краснодар')
        const isSale = basePrompt.includes('акци') || basePrompt.includes('скидк')
        const isLatte = basePrompt.includes('латте')
        const isRestaurant = basePrompt.includes('ресторан') || basePrompt.includes('кафе')
        
        // Если промпт очень короткий, создаем более общий контент
        const isShortPrompt = basePrompt.length < 20
        
        let businessType = 'Бизнес'
        let city = 'городе'
        let offer = '💎 Выгодные цены!'
        let description = 'Мы рады предложить вам качественные услуги!'
        let hashtags = '#бизнес #услуги #качество'
        
        if (isCoffee) {
          businessType = 'Кофейня'
          offer = isLatte ? '☕ Латте всего за 100 рублей!' : '☕ Ароматный кофе по выгодным ценам!'
          description = isShortPrompt ? 
            'Добро пожаловать в нашу уютную кофейню! Здесь вы можете насладиться ароматным кофе, свежей выпечкой и приятной атмосферой.' :
            'Приходите в нашу уютную кофейню и наслаждайтесь ароматным кофе!'
          hashtags = '#кофейня #кофе #латте #вкусно #уютно'
        } else if (isRestaurant) {
          businessType = 'Ресторан'
          offer = '🍽️ Вкусные блюда по доступным ценам!'
          description = isShortPrompt ?
            'Добро пожаловать в наш ресторан! Мы предлагаем широкий выбор блюд европейской и русской кухни, приготовленных из свежих продуктов.' :
            'Добро пожаловать в наш ресторан! Мы готовим с любовью!'
          hashtags = '#ресторан #еда #вкусно #уютно'
        } else if (isShortPrompt) {
          // Для коротких промптов создаем более общий контент
          businessType = 'Бизнес'
          offer = '✨ Новые возможности!'
          description = 'Мы рады предложить вам качественные услуги и индивидуальный подход к каждому клиенту!'
          hashtags = '#бизнес #услуги #качество #надежность'
        }
        
        if (isKrasnodar) {
          city = 'Краснодаре'
          hashtags += ' #краснодар'
        }
        
        if (isSale) {
          offer = '🎉 Специальное предложение!'
          hashtags += ' #акция #скидка'
        }
        
        return `🔥 ${businessType} в ${city}

${offer}

${description}

📍 Адрес: ул. Примерная, 123
🕒 Работаем: 8:00 - 22:00
📞 Телефон: +7 (XXX) XXX-XX-XX

💡 Совет: Используйте эмодзи и хештеги для лучшего охвата!

${hashtags}`

      default:
        return `✨ Сгенерированный контент

${basePrompt.includes('кофейн') ? 'Кофейня - это место, где люди могут отдохнуть и насладиться вкусным кофе.' : 'Качественный контент - основа успешного маркетинга.'}

${basePrompt.includes('акци') ? 'Специальные предложения помогают привлечь новых клиентов.' : 'Важно создавать контент, который будет полезен вашей аудитории.'}

---
*Создано с помощью AIКонтент*`
    }
  }
  
  return generateSmartContent(prompt, templateType)
}
