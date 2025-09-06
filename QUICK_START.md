# 🚀 Быстрый старт AIКонтент

## Для локальной разработки

### 1. Клонирование и установка
```bash
git clone <your-repo-url>
cd Graphly
npm install
```

### 2. Настройка локальной базы данных
```bash
# Переключиться на SQLite для локальной разработки
npm run db:local
```

### 3. Настройка переменных окружения
Создайте файл `.env`:
```env
# База данных (SQLite для локальной разработки)
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="your-local-jwt-secret"

# Yandex GPT API (получите на https://console.cloud.yandex.ru/)
YANDEX_GPT_API_KEY="your-yandex-gpt-api-key"
YANDEX_GPT_FOLDER_ID="your-yandex-folder-id"
YANDEX_GPT_API_URL="https://llm.api.cloud.yandex.net/foundationModels/v1/completion"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-local-nextauth-secret"
NODE_ENV="development"
```

### 4. Запуск
```bash
npm run dev
```

Откройте http://localhost:3000

---

## Для деплоя на Vercel

### 1. Настройка базы данных

**Рекомендуется Neon (PostgreSQL):**
1. Зайдите на https://neon.tech/
2. Создайте аккаунт через GitHub
3. Создайте новый проект
4. Скопируйте Connection String

### 2. Настройка Vercel

1. **Импорт проекта:**
   - Зайдите на https://vercel.com/
   - Войдите через GitHub
   - Импортируйте ваш репозиторий

2. **Переключение на продакшн схему:**
   ```bash
   npm run db:production
   ```

3. **Настройка переменных окружения в Vercel:**
   - Settings → Environment Variables
   - Добавьте все переменные из `.env` с продакшн значениями

### 3. Переменные для Vercel
```env
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
JWT_SECRET=your-production-jwt-secret
YANDEX_GPT_API_KEY=your-yandex-gpt-api-key
YANDEX_GPT_FOLDER_ID=your-yandex-folder-id
YANDEX_GPT_API_URL=https://llm.api.cloud.yandex.net/foundationModels/v1/completion
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-production-nextauth-secret
NODE_ENV=production
```

### 4. Деплой
Vercel автоматически задеплоит при пуше в main ветку.

---

## Получение API ключей Yandex GPT

1. **Регистрация:**
   - https://console.cloud.yandex.ru/
   - Войдите или зарегистрируйтесь

2. **Создание сервисного аккаунта:**
   - IAM → Сервисные аккаунты → Создать
   - Назначьте роль "ai.languageModels.user"

3. **Получение API ключа:**
   - IAM → API ключи → Создать
   - Скопируйте ключ

4. **Получение Folder ID:**
   - Скопируйте ID папки из консоли Yandex Cloud

---

## Команды для работы с БД

```bash
# Локальная разработка (SQLite)
npm run db:local

# Продакшн (PostgreSQL)
npm run db:production

# Генерация Prisma клиента
npm run db:generate

# Применение изменений схемы
npm run db:push

# Открыть Prisma Studio
npm run db:studio
```

---

## Структура проекта

```
src/
├── app/
│   ├── api/           # API маршруты
│   ├── auth/          # Страницы входа/регистрации
│   └── dashboard/     # Главная страница
├── components/        # React компоненты
└── lib/              # Утилиты и конфигурация

prisma/
├── schema.prisma      # Основная схема (PostgreSQL)
├── schema.local.prisma # Локальная схема (SQLite)
└── seed.js           # Тестовые данные
```

---

## Возможные проблемы

### ❌ "Database connection failed"
- Проверьте DATABASE_URL
- Убедитесь, что база данных доступна
- Для Vercel используйте внешнюю БД (Neon/PlanetScale)

### ❌ "Prisma generate failed"
- Запустите `npm run db:generate`
- Проверьте схему Prisma

### ❌ "Yandex GPT API error"
- Проверьте API ключи
- Убедитесь в правильности Folder ID
- Проверьте права сервисного аккаунта

### ❌ "Build failed on Vercel"
- Проверьте переменные окружения
- Убедитесь, что используется правильная схема БД
- Проверьте логи сборки

---

## Поддержка

- 📖 Подробные инструкции: `VERCEL_DEPLOYMENT.md`
- 🔧 Настройка: `SETUP_INSTRUCTIONS.md`
- 🐛 Проблемы: Проверьте консоль браузера и логи Vercel
