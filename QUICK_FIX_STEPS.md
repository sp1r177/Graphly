# 🚀 Быстрый запуск Graphly - Пошаговая инструкция

## ШАГ 1: Настройка переменных окружения

### Для ЛОКАЛЬНОЙ РАЗРАБОТКИ:

1. **Создайте файл `.env.local`** в корне проекта:
```bash
copy env.local.template .env.local
```

2. **Откройте `.env.local`** и замените значения:
```env
# Database (локально SQLite)
DATABASE_URL="file:./prisma/dev.db"

# JWT Secret (любой случайный текст)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Yandex GPT (если есть ключи, иначе оставьте пустыми)
YANDEX_API_KEY="your-yandex-api-key-here"
YANDEX_FOLDER_ID="your-yandex-folder-id-here"

# Supabase (оставьте пустыми, если не используете)
SUPABASE_URL=""
SUPABASE_ANON_KEY=""

# Next.js
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

## ШАГ 2: Настройка базы данных

### Локальная SQLite база:

```bash
# Переключиться на локальную схему (SQLite)
node switch-db.js local

# Сгенерировать Prisma клиент
npx prisma generate

# Создать/обновить базу данных
npx prisma db push

# Запустить Prisma Studio (опционально, для просмотра данных)
npx prisma studio
```

## ШАГ 3: Запуск приложения

```bash
# Установить зависимости
npm install

# Запустить в режиме разработки
npm run dev
```

## ШАГ 4: Тестирование

### Проверить API:
1. Откройте: `http://localhost:3000/api/generate`
2. Должны увидеть статус переменных окружения

### Протестировать регистрацию:
1. Откройте: `http://localhost:3000/auth/register`
2. Заполните форму:
   - Email: `test@example.com`
   - Password: `Test123456`
   - Name: `Test User`

### Протестировать генерацию:
1. Откройте главную страницу
2. Введите текст: "Создай пост для ВКонтакте о новом продукте"
3. Выберите тип: VK_POST
4. Нажмите "Сгенерировать"

## ШАГ 5: Настройка Vercel (продакшн)

### Переменные окружения в Vercel:
1. **Vercel Dashboard** → **Project** → **Settings** → **Environment Variables**
2. **Production и Preview** окружения:
```
DATABASE_URL = postgresql://user:pass@host:5432/db  # Ваша прод БД
JWT_SECRET = your-production-jwt-secret
YANDEX_API_KEY = your-yandex-api-key
YANDEX_FOLDER_ID = your-yandex-folder-id
NEXT_PUBLIC_BASE_URL = https://your-domain.vercel.app
NODE_ENV = production
```

### Деплой:
```bash
git add .
git commit -m "Setup complete: env, db, fixes"
git push origin main
```

## ШАГ 6: Проверка после деплоя

1. **Откройте продакшн**: `https://your-domain.vercel.app/api/generate`
2. **Проверьте статус** переменных окружения
3. **Протестируйте** регистрацию и генерацию

## 🔧 Если что-то не работает

### Ошибка: "База данных не доступна"
```bash
# Проверить переменные окружения
echo $DATABASE_URL

# Проверить подключение к БД
npx prisma db push --force-reset
```

### Ошибка: "Не найден YANDEX_API_KEY"
```bash
# Локально - добавить в .env.local
# Vercel - добавить в Environment Variables
```

### Ошибка: "Не найден JWT_SECRET"
```bash
# Сгенерировать новый секрет
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📋 Чек-лист

- [ ] Создан `.env.local` с корректными значениями
- [ ] Настроена локальная БД (SQLite)
- [ ] Сгенерирован Prisma клиент
- [ ] Приложение запускается без ошибок
- [ ] Регистрация работает
- [ ] Генерация контента работает
- [ ] Настроены переменные в Vercel
- [ ] Продакшн деплой работает

## 🚨 Важные замечания

1. **Локально** используется SQLite (`file:./prisma/dev.db`)
2. **На Vercel** нужна PostgreSQL база данных
3. **JWT_SECRET** должен быть одинаковым в dev и prod
4. **YANDEX_API_KEY/FOLDER_ID** необязательны (будет работать с мок-генерацией)
5. **SUPABASE** переменные можно оставить пустыми

## 📞 Поддержка

Если что-то не работает:
1. Проверьте логи в терминале (`npm run dev`)
2. Проверьте `/api/generate` endpoint
3. Проверьте переменные окружения
4. Проверьте подключение к базе данных
