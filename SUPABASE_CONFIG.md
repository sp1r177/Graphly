# 🔧 Настройка Supabase для вашего проекта

## У вас есть API ключ! Теперь нужно получить пароль БД:

### 1. Получите пароль базы данных
1. Зайдите на https://supabase.com/dashboard
2. Войдите в ваш проект `tlorolxxxyztzrjlsjbwi`
3. Перейдите в **Settings** → **Database**
4. Найдите раздел **Database Password**
5. Если пароль не установлен, нажмите **Generate new password**
6. **СОХРАНИТЕ ПАРОЛЬ!** (он больше не будет показан)

### 2. Получите строку подключения
1. В том же разделе **Settings** → **Database**
2. Найдите **Connection string** → **URI**
3. Скопируйте строку (выглядит так):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.tlorolxxxyztzrjlsjbwi.supabase.co:5432/postgres
   ```

### 3. Создайте файл .env
Создайте файл `.env` в корне проекта со следующим содержимым:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[ВАШ_ПАРОЛЬ]@db.tlorolxxxyztzrjlsjbwi.supabase.co:5432/postgres"

# Supabase API Keys
SUPABASE_URL="https://tlorolxxxyztzrjlsjbwi.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsb3JvbHh4eXp0cnpqbHNqYndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxOTY5OTQsImV4cCI6MjA3Mjc3Mjk5NH0.GyGKbEOyjHynaAskHEZnamcTAkoY-C3_sFO_Y_1IX5M"

# JWT Secret (сгенерируйте случайную строку)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Yandex GPT API (получите на https://console.cloud.yandex.ru/)
YANDEX_GPT_API_KEY="your-yandex-gpt-api-key-here"
YANDEX_GPT_FOLDER_ID="your-yandex-folder-id-here"
YANDEX_GPT_API_URL="https://llm.api.cloud.yandex.net/foundationModels/v1/completion"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# Environment
NODE_ENV="development"
```

### 4. Инициализация базы данных
После создания .env файла выполните:

```bash
# Переключиться на PostgreSQL схему
npm run db:production

# Применить схему к Supabase
npm run db:push

# Запустить приложение
npm run dev
```

### 5. Проверка работы
1. Откройте http://localhost:3000
2. Зарегистрируйтесь
3. Попробуйте создать контент

## Ваша информация:
- **Project ID:** `tlorolxxxyztzrjlsjbwi`
- **Supabase URL:** `https://tlorolxxxyztzrjlsjbwi.supabase.co`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Следующие шаги:
1. ✅ Получите пароль БД из панели Supabase
2. ✅ Создайте файл .env с правильным DATABASE_URL
3. ✅ Запустите `npm run db:production && npm run db:push`
4. ✅ Запустите `npm run dev`
5. ✅ Протестируйте регистрацию и создание контента

## Если что-то не работает:
- Проверьте, что пароль БД правильный
- Убедитесь, что DATABASE_URL содержит правильный пароль
- Проверьте консоль браузера на ошибки
- Проверьте логи в терминале
