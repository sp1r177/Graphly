# 🚀 Настройка Graphly с базой данных - ПОЛНОЕ РУКОВОДСТВО

## 🎯 ЦЕЛЬ: Регистрация и генерация работают с базой данных

## 📋 ПОШАГОВАЯ ИНСТРУКЦИЯ

### ШАГ 1: Подготовка переменных окружения

1. **Создайте `.env.local`**:
```cmd
copy env.local.ready .env.local
```

2. **Проверьте содержимое** `.env.local`:
```env
# Database (локально SQLite)
DATABASE_URL="file:./prisma/dev.db"

# JWT Secret
JWT_SECRET="super-secret-jwt-key-change-this-in-production-12345"

# Yandex GPT (опционально)
YANDEX_API_KEY=""
YANDEX_FOLDER_ID=""

# Supabase (опционально)
SUPABASE_URL=""
SUPABASE_ANON_KEY=""

# Next.js
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

### ШАГ 2: Настройка базы данных

**Вариант A: Автоматическая настройка**
```cmd
# Запустите скрипт настройки БД
setup-database.bat
```

**Вариант B: Ручная настройка**
```cmd
# 1. Переключение на локальную схему
node switch-db.js local

# 2. Генерация Prisma клиента
npx prisma generate

# 3. Создание/обновление БД
npx prisma db push

# 4. Проверка
dir prisma\dev.db
```

### ШАГ 3: Проверка базы данных

```cmd
# Проверька статуса БД и создание тестового пользователя
node check-db-status.js
```

### ШАГ 4: Запуск системы

**Вариант A: Полный запуск**
```cmd
start-complete-system.bat
```

**Вариант B: Ручной запуск**
```cmd
npm install
npm run dev
```

### ШАГ 5: Тестирование

1. **Откройте тестовую страницу**:
   - Откройте `test-auth-and-generate.html` в браузере

2. **Протестируйте регистрацию**:
   - Нажмите "Быстрая регистрация" или заполните форму вручную
   - Проверьте консоль браузера (F12)
   - Должен создаться пользователь в БД

3. **Протестируйте генерацию**:
   - Нажмите "Быстрая генерация"
   - Должен сгенерироваться контент
   - Работает как с авторизацией, так и без неё

4. **Проверьте в браузере**:
   - Откройте `http://localhost:3000`
   - Зарегистрируйтесь/войдите
   - Протестируйте генерацию на главной странице

## 🔍 ПРОВЕРКА РАБОТЫ

### Логи сервера должны показывать:
```
✅ Пользователь создан в БД: test@example.com
🔐 Пользователь авторизован: test@example.com
✅ Генерация завершена, длина текста: 150
```

### База данных должна содержать:
- ✅ Таблица `users` с зарегистрированными пользователями
- ✅ Таблица `generations` с историей генераций
- ✅ Таблица `payments` для платежей (опционально)

## 🐛 РЕШЕНИЕ ПРОБЛЕМ

### "Ошибка подключения к БД"
```cmd
# Проверьте переменные
type .env.local

# Пересоздайте БД
npx prisma db push --force-reset

# Проверьте файл БД
dir prisma\dev.db
```

### "Пользователь не создается"
```cmd
# Проверьте логи сервера
# В консоли должно быть: "✅ Пользователь создан в БД"

# Проверьте БД напрямую
node check-db-status.js
```

### "Генерация не работает"
```cmd
# Проверьте авторизацию
# Если пользователь не авторизован - создается guest-пользователь

# Проверьте API статус
# Откройте: http://localhost:3000/api/generate
```

## 📊 СТРУКТУРА БАЗЫ ДАННЫХ

```
users:
├── id (String, Primary Key)
├── email (String, Unique)
├── password (String, Hashed)
├── name (String, Optional)
├── subscriptionStatus (FREE/PRO/ULTRA)
├── usageCountDay (Int)
├── usageCountMonth (Int)
├── lastGenerationDate (DateTime, Optional)
└── createdAt/updatedAt

generations:
├── id (String, Primary Key)
├── userId (Foreign Key → users.id)
├── prompt (String)
├── outputText (String, Optional)
├── outputImageUrl (String, Optional)
├── templateType (VK_POST, etc.)
└── timestamp (DateTime)

payments:
├── id (String, Primary Key)
├── userId (Foreign Key → users.id)
├── amount (Float)
├── currency (String)
├── status (PENDING/COMPLETED/FAILED)
├── yandexPaymentId (String, Optional)
├── subscriptionType (FREE/PRO/ULTRA)
└── timestamp (DateTime)
```

## 🎯 РЕЗУЛЬТАТ

После выполнения всех шагов:

✅ **Регистрация работает** - пользователи сохраняются в БД
✅ **Авторизация работает** - JWT токены и cookies
✅ **Генерация работает** - контент сохраняется в истории
✅ **База данных работает** - SQLite для разработки
✅ **API работает** - все роуты функционируют

## 🚀 ПРОДАКШН НАСТРОЙКА

Для продакшена замените в `.env.local`:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
```

И выполните:
```cmd
# Переключение на продакшн схему
node switch-db.js production

# Применение миграций
npx prisma migrate deploy
```

## 📞 ПОДДЕРЖКА

Если что-то не работает:
1. Запустите `node check-db-status.js`
2. Проверьте логи сервера в терминале
3. Откройте `test-auth-and-generate.html` для тестирования
4. Проверьте консоль браузера (F12)

**Система готова к использованию с полноценной базой данных!** 🎉
