# Инструкции по настройке AIКонтент

## Проблемы и их решения

### 1. Проблема с регистрацией
**Причина:** База данных не инициализирована или отсутствуют переменные окружения.

**Решение:**
1. Создайте файл `.env` в корне проекта со следующим содержимым:
```env
# Database
DATABASE_URL="file:./dev.db"

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

2. Установите зависимости:
```bash
npm install
```

3. Инициализируйте базу данных:
```bash
npx prisma generate
npx prisma db push
```

### 2. Проблема с созданием контента
**Причина:** Не настроен Yandex GPT API или используется только мок-генерация.

**Решение:**
1. Получите API ключ от Yandex Cloud:
   - Зайдите в [Yandex Cloud Console](https://console.cloud.yandex.ru/)
   - Создайте сервисный аккаунт
   - Получите API ключ
   - Получите Folder ID

2. Обновите переменные в `.env`:
```env
YANDEX_GPT_API_KEY="ваш-реальный-api-ключ"
YANDEX_GPT_FOLDER_ID="ваш-folder-id"
```

### 3. Запуск приложения

1. Запустите сервер разработки:
```bash
npm run dev
```

2. Откройте браузер по адресу: http://localhost:3000

### 4. Тестирование

1. Перейдите на страницу регистрации: http://localhost:3000/auth/register
2. Создайте аккаунт
3. Войдите в систему
4. Попробуйте создать контент в дашборде

## Структура проекта

- `src/app/api/` - API маршруты
- `src/app/auth/` - Страницы аутентификации
- `src/app/dashboard/` - Главная страница приложения
- `src/components/` - React компоненты
- `src/lib/` - Утилиты и конфигурация
- `prisma/` - Схема базы данных

## Возможные ошибки

1. **"Database not found"** - Запустите `npx prisma db push`
2. **"JWT Secret not found"** - Проверьте файл `.env`
3. **"Yandex GPT API error"** - Проверьте API ключи в `.env`
4. **"User already exists"** - Пользователь с таким email уже зарегистрирован

## Поддержка

Если проблемы продолжаются, проверьте:
1. Консоль браузера на ошибки JavaScript
2. Логи сервера в терминале
3. Правильность переменных окружения
4. Подключение к интернету для Yandex GPT API
