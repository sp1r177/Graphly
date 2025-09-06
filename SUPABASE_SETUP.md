# 🆓 Настройка Supabase (БЕЗ КАРТЫ!)

## Почему Supabase?
- ✅ Полностью бесплатный PostgreSQL
- ✅ 500MB бесплатно (достаточно для старта)
- ✅ БЕЗ привязки карты
- ✅ Простая настройка
- ✅ Встроенная админка

## Пошаговая настройка

### 1. Создание аккаунта
1. Перейдите на https://supabase.com/
2. Нажмите "Start your project"
3. Войдите через GitHub (рекомендуется)
4. **НЕ ТРЕБУЕТ КАРТЫ!**

### 2. Создание проекта
1. Нажмите "New Project"
2. Выберите организацию (ваш GitHub аккаунт)
3. Введите название: `aikontent-db`
4. Введите пароль для БД (запомните!)
5. Выберите регион: `Frankfurt, Germany` (ближе к России)
6. Нажмите "Create new project"

### 3. Получение строки подключения
1. Дождитесь создания проекта (2-3 минуты)
2. Перейдите в Settings → Database
3. Найдите "Connection string" → "URI"
4. Скопируйте строку (выглядит так):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 4. Настройка Vercel
1. В панели Vercel → Settings → Environment Variables
2. Добавьте переменную:
   - **Name:** `DATABASE_URL`
   - **Value:** ваша строка подключения от Supabase
   - **Environment:** Production, Preview, Development

### 5. Локальная разработка
Создайте файл `.env.local`:
```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# JWT Secret
JWT_SECRET="your-local-jwt-secret"

# Yandex GPT API
YANDEX_GPT_API_KEY="your-yandex-gpt-api-key"
YANDEX_GPT_FOLDER_ID="your-yandex-folder-id"
YANDEX_GPT_API_URL="https://llm.api.cloud.yandex.net/foundationModels/v1/completion"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-local-nextauth-secret"
NODE_ENV="development"
```

### 6. Инициализация базы данных
```bash
# Переключиться на PostgreSQL схему
npm run db:production

# Применить схему к Supabase
npm run db:push
```

### 7. Проверка работы
1. Запустите локально: `npm run dev`
2. Откройте http://localhost:3000
3. Зарегистрируйтесь
4. Проверьте создание контента

## Альтернативы (если Supabase не подойдет)

### Railway (тоже без карты)
1. https://railway.app/
2. Войдите через GitHub
3. New Project → Database → PostgreSQL
4. Скопируйте DATABASE_URL

### ElephantSQL (очень простой)
1. https://www.elephantsql.com/
2. Sign up (без карты)
3. Create new instance → Tiny Turtle (free)
4. Скопируйте URL

### Render (надежный)
1. https://render.com/
2. New → PostgreSQL
3. Free plan
4. Скопируйте External Database URL

## Проверка подключения

После настройки проверьте подключение:
```bash
# Откройте Prisma Studio
npm run db:studio
```

Если открывается веб-интерфейс - подключение работает!

## Лимиты Supabase (бесплатный план)
- 🗄️ 500MB базы данных
- 👥 50,000 активных пользователей
- 📊 2GB bandwidth
- 🔄 500,000 запросов в месяц

Этого более чем достаточно для старта!

## Поддержка
- 📖 Документация: https://supabase.com/docs
- 💬 Discord: https://discord.supabase.com/
- 🐛 Проблемы: https://github.com/supabase/supabase
