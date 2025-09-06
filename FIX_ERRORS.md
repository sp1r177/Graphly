# 🔧 Исправление ошибок приложения

## Проблема: Ошибки регистрации и генерации контента

### Причины:
1. ❌ База данных не подключена
2. ❌ Переменные окружения не настроены
3. ❌ Схема базы данных не применена

## 🚀 Пошаговое исправление:

### 1. Создайте файл .env.local в корне проекта:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[ВАШ_ПАРОЛЬ]@db.tlorolxxxyztzrjlsjbwi.supabase.co:5432/postgres"

# Supabase API Keys
SUPABASE_URL="https://tlorolxxxyztzrjlsjbwi.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsb3JvbHh4eXp0cnpqbHNqYndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxOTY5OTQsImV4cCI6MjA3Mjc3Mjk5NH0.GyGKbEOyjHynaAskHEZnamcTAkoY-C3_sFO_Y_1IX5M"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Yandex GPT API
YANDEX_GPT_API_KEY="your-yandex-gpt-api-key-here"
YANDEX_GPT_FOLDER_ID="your-yandex-folder-id-here"
YANDEX_GPT_API_URL="https://llm.api.cloud.yandex.net/foundationModels/v1/completion"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# Environment
NODE_ENV="development"
```

### 2. Получите пароль базы данных:

1. Зайдите на https://supabase.com/dashboard
2. Войдите в проект `tlorolxxxyztzrjlsjbwi`
3. **Settings** → **Database** → **Database Password**
4. Сгенерируйте пароль (если нет)
5. Замените `[ВАШ_ПАРОЛЬ]` в DATABASE_URL

### 3. Инициализируйте базу данных:

```bash
# Переключиться на PostgreSQL схему
node switch-db.js production

# Применить схему к базе данных
npx prisma db push

# Запустить приложение
npm run dev
```

### 4. Проверьте работу:

1. Откройте http://localhost:3000
2. Попробуйте зарегистрироваться
3. Попробуйте создать контент

## 🔍 Диагностика проблем:

### Если ошибка "Database connection failed":
- Проверьте DATABASE_URL
- Убедитесь, что пароль БД правильный
- Проверьте, что Supabase доступен

### Если ошибка "Table doesn't exist":
- Запустите `npx prisma db push`
- Проверьте, что схема применена

### Если ошибка "JWT Secret not found":
- Проверьте JWT_SECRET в .env.local
- Перезапустите приложение

### Если ошибка "Yandex GPT API error":
- Проверьте API ключи
- Приложение будет использовать мок-генерацию

## 🆘 Если ничего не помогает:

1. **Проверьте консоль браузера** (F12) на ошибки JavaScript
2. **Проверьте терминал** на ошибки сервера
3. **Запустите диагностику**: `node debug-app.js`
4. **Проверьте логи Vercel** (если деплоите)

## 📞 Поддержка:

- 📖 Подробные инструкции: `SUPABASE_CONFIG.md`
- 🔧 Настройка Vercel: `VERCEL_DEPLOYMENT.md`
- 🚀 Быстрый старт: `QUICK_START.md`
