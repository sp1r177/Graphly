# Исправление проблем с Supabase

## 🚨 Проблемы, которые нужно исправить:

### 1. **Переменные окружения Supabase**
В Vercel Dashboard → Settings → Environment Variables добавьте:

```env
# Supabase Configuration
SUPABASE_URL="your-supabase-project-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 2. **Структура базы данных Supabase**
В Supabase Dashboard → SQL Editor выполните:

```sql
-- Создание таблицы профилей пользователей
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  vk_id TEXT,
  provider TEXT DEFAULT 'email',
  subscription_status TEXT DEFAULT 'FREE' CHECK (subscription_status IN ('FREE', 'PRO', 'ULTRA')),
  usage_count_day INTEGER DEFAULT 0,
  usage_count_month INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы генераций
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  output_text TEXT,
  output_image_url TEXT,
  template_type TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы платежей
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'RUB',
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')),
  yandex_payment_id TEXT,
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('FREE', 'PRO', 'ULTRA')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включение RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Политики безопасности для user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Политики безопасности для generations
CREATE POLICY "Users can view own generations" ON generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" ON generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Политики безопасности для payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 3. **Проверка работы**
После настройки проверьте:

1. **Тест Supabase**: `https://graphly.ru/api/debug/supabase-test`
2. **Тест переменных**: `https://graphly.ru/api/debug/env-check`
3. **Тест генерации**: Попробуйте сгенерировать контент на сайте

### 4. **Что исправлено в коде:**
- ✅ Убрал Prisma, переключился на Supabase
- ✅ Исправил API роут генерации
- ✅ Обновил функции аутентификации
- ✅ Добавил тесты для диагностики

### 5. **Следующие шаги:**
1. Добавьте переменные Supabase в Vercel
2. Выполните SQL скрипт в Supabase
3. Перезапустите деплой
4. Протестируйте работу

## 🔧 Если что-то не работает:

### Проверьте логи в Vercel:
- Functions → Logs
- Ищите ошибки с "Supabase" или "auth"

### Проверьте Supabase Dashboard:
- Authentication → Users
- Database → Tables
- Logs → API Logs

### Проверьте переменные окружения:
- Убедитесь, что все переменные добавлены
- Проверьте правильность URL и ключей
- Убедитесь, что переменные доступны для всех окружений
