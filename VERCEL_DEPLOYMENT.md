# Деплой на Vercel с базой данных

## Настройка базы данных

### Вариант 1: Supabase (PostgreSQL) - Рекомендуется 🆓

1. **Создайте аккаунт на Supabase:**
   - Перейдите на https://supabase.com/
   - Войдите через GitHub
   - Создайте новый проект
   - **БЕЗ КАРТЫ!**

2. **Получите строку подключения:**
   - Settings → Database → Connection string → URI
   - Выглядит так: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### Вариант 2: Railway (PostgreSQL) 🆓

1. **Создайте аккаунт на Railway:**
   - Перейдите на https://railway.app/
   - Войдите через GitHub
   - New Project → Database → PostgreSQL
   - **БЕЗ КАРТЫ!**

2. **Получите строку подключения:**
   - Скопируйте DATABASE_URL из панели Railway

## Настройка Vercel

### 1. Подключение к GitHub

1. Зайдите на https://vercel.com/
2. Войдите через GitHub
3. Импортируйте ваш репозиторий

### 2. Настройка переменных окружения в Vercel

В панели Vercel перейдите в Settings → Environment Variables и добавьте:

```env
# База данных
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# JWT Secret (сгенерируйте случайную строку)
JWT_SECRET=your-super-secret-jwt-key-for-production

# Yandex GPT API
YANDEX_GPT_API_KEY=your-yandex-gpt-api-key
YANDEX_GPT_FOLDER_ID=your-yandex-folder-id
YANDEX_GPT_API_URL=https://llm.api.cloud.yandex.net/foundationModels/v1/completion

# Next.js
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-for-production

# Environment
NODE_ENV=production
```

### 3. Настройка Build Command

В настройках проекта Vercel:
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## Локальная разработка

### 1. Создайте файл .env.local:

```env
# База данных (используйте строку подключения от Neon/PlanetScale)
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# JWT Secret
JWT_SECRET=your-local-jwt-secret

# Yandex GPT API
YANDEX_GPT_API_KEY=your-yandex-gpt-api-key
YANDEX_GPT_FOLDER_ID=your-yandex-folder-id
YANDEX_GPT_API_URL=https://llm.api.cloud.yandex.net/foundationModels/v1/completion

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-local-nextauth-secret

# Environment
NODE_ENV=development
```

### 2. Инициализация базы данных:

```bash
# Установка зависимостей
npm install

# Генерация Prisma клиента
npx prisma generate

# Применение схемы к базе данных
npx prisma db push

# (Опционально) Заполнение тестовыми данными
npm run seed
```

### 3. Запуск приложения:

```bash
npm run dev
```

## Получение API ключей Yandex GPT

1. **Создайте аккаунт в Yandex Cloud:**
   - Перейдите на https://console.cloud.yandex.ru/
   - Зарегистрируйтесь или войдите

2. **Создайте сервисный аккаунт:**
   - Перейдите в IAM → Сервисные аккаунты
   - Создайте новый сервисный аккаунт
   - Назначьте роль "ai.languageModels.user"

3. **Получите API ключ:**
   - Перейдите в IAM → API ключи
   - Создайте новый API ключ для вашего сервисного аккаунта

4. **Получите Folder ID:**
   - В консоли Yandex Cloud скопируйте ID папки из URL или из информации о проекте

## Проверка работы

1. **Локально:**
   - Откройте http://localhost:3000
   - Зарегистрируйтесь
   - Попробуйте создать контент

2. **На Vercel:**
   - Откройте ваш домен на Vercel
   - Зарегистрируйтесь
   - Проверьте создание контента

## Возможные проблемы

### 1. "Database connection failed"
- Проверьте правильность DATABASE_URL
- Убедитесь, что база данных доступна
- Проверьте SSL настройки

### 2. "Prisma generate failed"
- Запустите `npx prisma generate` локально
- Проверьте, что Prisma схема корректна

### 3. "Yandex GPT API error"
- Проверьте API ключи
- Убедитесь, что у сервисного аккаунта есть права на YandexGPT
- Проверьте Folder ID

### 4. "Build failed on Vercel"
- Проверьте переменные окружения
- Убедитесь, что все зависимости установлены
- Проверьте логи сборки в Vercel

## Мониторинг

- **Vercel Analytics:** Включите в настройках проекта
- **База данных:** Используйте встроенные инструменты Neon/PlanetScale
- **Логи:** Проверяйте в панели Vercel → Functions
