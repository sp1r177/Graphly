# Обновление переменных окружения для Yandex GPT

## 🚨 Проблема
У вас в .env файлах все еще настроен Hugging Face, а не Yandex GPT.

## ✅ Решение

### 1. Создайте .env.local файл

Скопируйте содержимое файла `env.local.template` в новый файл `.env.local`:

```bash
# Windows
copy env.local.template .env.local

# Linux/Mac
cp env.local.template .env.local
```

### 2. Отредактируйте .env.local

Замените следующие значения на реальные:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/graphly"

# JWT Secret for authentication
JWT_SECRET="your-super-secret-jwt-key-here"

# Yandex Cloud API Configuration
YANDEX_API_KEY="your-yandex-api-key-here"  # ← ЗАМЕНИТЕ НА РЕАЛЬНЫЙ КЛЮЧ
YANDEX_FOLDER_ID="your-yandex-folder-id-here"  # ← ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ID

# Supabase Configuration (if using Supabase)
SUPABASE_URL="your-supabase-url-here"
SUPABASE_ANON_KEY="your-supabase-anon-key-here"

# Next.js Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

### 3. Получите API ключи Yandex Cloud

1. **Зарегистрируйтесь в Yandex Cloud**
   - Перейдите на [cloud.yandex.com](https://cloud.yandex.com)
   - Создайте аккаунт или войдите

2. **Создайте проект**
   - В консоли создайте новый проект
   - Запомните ID проекта (это будет `YANDEX_FOLDER_ID`)

3. **Создайте сервисный аккаунт**
   - Перейдите в "Сервисные аккаунты"
   - Создайте новый сервисный аккаунт
   - Назначьте роли: `ai.languageModels.user` и `ai.languageModels.admin`

4. **Получите API ключ**
   - Создайте API ключ для сервисного аккаунта
   - Скопируйте ключ (это будет `YANDEX_API_KEY`)

### 4. Обновите Vercel переменные

В Vercel Dashboard добавьте:

```
YANDEX_API_KEY = your-yandex-api-key-here
YANDEX_FOLDER_ID = your-yandex-folder-id-here
```

### 5. Проверьте настройки

Запустите тест:

```bash
npm run dev
```

Откройте: `http://localhost:3000/api/generate`

Должны увидеть:
```json
{
  "status": "OK",
  "environment": {
    "YANDEX_API_KEY": "✅ Найден",
    "YANDEX_FOLDER_ID": "✅ Найден"
  }
}
```

## 🔧 Альтернативный способ

Если у вас есть старый .env файл с Hugging Face:

1. **Найдите старый .env файл**
2. **Замените строки:**
   ```env
   # Старое (Hugging Face)
   HUGGING_FACE_TOKEN="..."
   
   # Новое (Yandex GPT)
   YANDEX_API_KEY="your-yandex-api-key-here"
   YANDEX_FOLDER_ID="your-yandex-folder-id-here"
   ```

3. **Удалите старые переменные:**
   - `HUGGING_FACE_TOKEN`
   - `HUGGING_FACE_API_URL`

## 📝 Чек-лист

- [ ] Создан .env.local файл
- [ ] Добавлен YANDEX_API_KEY
- [ ] Добавлен YANDEX_FOLDER_ID
- [ ] Удалены старые Hugging Face переменные
- [ ] Обновлены переменные в Vercel
- [ ] Протестирован API endpoint
- [ ] Протестирована генерация контента

## 🚨 Важно

- **НЕ коммитьте .env.local в git** (он уже в .gitignore)
- **Обновите переменные в Vercel Dashboard**
- **Проверьте, что старые Hugging Face переменные удалены**

## 📞 Поддержка

Если что-то не работает:
1. Проверьте [YANDEX_GPT_SETUP.md](./YANDEX_GPT_SETUP.md)
2. Проверьте логи в Vercel Dashboard
3. Убедитесь, что API ключи правильные
