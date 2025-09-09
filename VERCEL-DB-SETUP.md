# 🔧 Настройка базы данных на Vercel - Простая инструкция

## 🎯 ПРОБЛЕМА: Регистрация не работает из-за отсутствия БД

## 📋 РЕШЕНИЕ В 3 ШАГА:

### ШАГ 1: Создайте базу данных

**Вариант A: Vercel Postgres (рекомендуется)**
1. Vercel Dashboard → Storage → Create Database
2. Выберите Postgres
3. Скопируйте `POSTGRES_URL` 
4. Добавьте как `DATABASE_URL` в Environment Variables

**Вариант B: Supabase (бесплатно)**
1. Зайдите на [supabase.com](https://supabase.com)
2. Create New Project
3. Settings → Database → Connection string
4. Скопируйте строку подключения
5. Добавьте как `DATABASE_URL` в Vercel

### ШАГ 2: Добавьте переменные в Vercel

**Vercel Dashboard → Settings → Environment Variables:**
```env
DATABASE_URL = postgresql://user:password@host:5432/database
JWT_SECRET = your-jwt-secret-here
YANDEX_API_KEY = your-yandex-api-key (опционально)
YANDEX_FOLDER_ID = your-yandex-folder-id (опционально)
NEXT_PUBLIC_BASE_URL = https://your-domain.vercel.app
```

### ШАГ 3: Инициализация БД через API

После деплоя:
1. **Откройте**: `https://your-domain.vercel.app/api/setup-db`
2. **Нажмите POST** (или используйте Postman)
3. **Ожидаемый ответ**:
```json
{
  "status": "success", 
  "message": "Database tables created successfully",
  "userCount": 0
}
```

## 🧪 АЛЬТЕРНАТИВНЫЙ СПОСОБ

### Через Prisma CLI:
```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите и свяжите проект
vercel login
vercel link

# Получите переменные окружения
vercel env pull .env.local

# Примените схему
npx prisma db push
```

## 🔍 ПРОВЕРКА РАБОТЫ

### Тест 1: Статус БД
`https://your-domain.vercel.app/api/setup-db` (GET)

**Успех:**
```json
{
  "status": "connected",
  "userCount": 0,
  "message": "Database is accessible"
}
```

### Тест 2: Регистрация
`https://your-domain.vercel.app/auth/register`

1. Введите email и пароль
2. Должно создать пользователя в БД
3. Перенаправить на дашборд

### Тест 3: Логи в Vercel
**Function Logs должны показать:**
```
✅ Подключение к БД успешно
✅ Таблица users существует
✅ Пользователь создан в БД: test@example.com
```

## 🚨 РЕШЕНИЕ ПРОБЛЕМ

### "Database connection failed"
- Проверьте `DATABASE_URL` в Vercel
- Убедитесь, что БД доступна извне
- Проверьте права доступа

### "Table doesn't exist"
- Запустите `/api/setup-db` POST
- Или: `npx prisma db push` локально с прод DATABASE_URL

### "User creation failed"
- Проверьте уникальность email
- Проверьте схему БД
- Проверьте права записи

## 🎯 БЫСТРОЕ РЕШЕНИЕ

Если ничего не помогает:

### Используйте готовые настройки Supabase:
```env
DATABASE_URL = "postgresql://postgres:ВАШ_ПАРОЛЬ@db.tlorolxxxyztzrjlsjbwi.supabase.co:5432/postgres"
SUPABASE_URL = "https://tlorolxxxyztzrjlsjbwi.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsb3JvbHh4eXp0cnpqbHNqYndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxOTY5OTQsImV4cCI6MjA3Mjc3Mjk5NH0.GyGKbEOyjHynaAskHEZnamcTAkoY-C3_sFO_Y_1IX5M"
```

1. Получите пароль в Supabase Dashboard
2. Замените `ВАШ_ПАРОЛЬ` на реальный пароль
3. Добавьте в Vercel Environment Variables

## 📊 ОЖИДАЕМЫЙ РЕЗУЛЬТАТ

После настройки БД:
- ✅ **Регистрация работает** - создает пользователей в PostgreSQL
- ✅ **Логин работает** - находит пользователей в БД
- ✅ **Генерация работает** - сохраняет историю в БД
- ✅ **Лимиты работают** - отслеживает использование

## 🚀 СЛЕДУЮЩИЕ ШАГИ

1. **Настройте БД** (Vercel Postgres или Supabase)
2. **Добавьте переменные** в Vercel
3. **Инициализируйте таблицы** через `/api/setup-db`
4. **Протестируйте регистрацию**
5. **Добавьте Yandex GPT ключи** для реальной генерации

**База данных - ключ к работе регистрации!** 🔑
