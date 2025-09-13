# 🔧 Исправление ошибки регистрации

## 🚨 ПРОБЛЕМА: "Внутренняя ошибка сервера"

Давайте пошагово исправим ошибку регистрации.

## 📋 ДИАГНОСТИКА

### Шаг 1: Проверьте диагностику
Откройте в браузере: `http://localhost:3000/api/debug-registration`

**Ожидаемый ответ:**
```json
{
  "status": "OK",
  "message": "Диагностика регистрации завершена",
  "environment": {
    "DATABASE_URL": "✅ Найден",
    "JWT_SECRET": "✅ Найден"
  },
  "database": {
    "connected": true,
    "userCount": 0,
    "hasEmailVerification": true
  }
}
```

### Шаг 2: Обновите схему Supabase
1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите проект `mpsrlymennzlzoogkpvc`
3. Перейдите в **SQL Editor**
4. Выполните SQL из файла `update-supabase-schema.sql`:

```sql
-- Добавляем новые поля в таблицу users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "emailVerificationToken" TEXT;

-- Создаем индекс для быстрого поиска по токену подтверждения
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token 
ON users("emailVerificationToken");

-- Обновляем существующих пользователей (если есть)
UPDATE users 
SET "emailVerified" = true 
WHERE "emailVerified" IS NULL;
```

### Шаг 3: Протестируйте упрощенную регистрацию
1. Откройте `http://localhost:3000`
2. Нажмите "Регистрация"
3. Заполните форму:
   - **Email**: test@example.com
   - **Пароль**: 123456
   - **Имя**: Тестовый Пользователь
4. Нажмите "Зарегистрироваться"

## 🔍 ВОЗМОЖНЫЕ ПРОБЛЕМЫ И РЕШЕНИЯ

### ❌ "Ошибка структуры базы данных"
**Причина:** Отсутствуют поля `emailVerified` и `emailVerificationToken`
**Решение:**
1. Выполните SQL из `update-supabase-schema.sql`
2. Перезапустите приложение

### ❌ "Ошибка подключения к базе данных"
**Причина:** Неправильный DATABASE_URL
**Решение:**
1. Проверьте DATABASE_URL в Vercel
2. Убедитесь, что пароль правильный
3. Проверьте, что проект Supabase активен

### ❌ "Unique constraint" ошибка
**Причина:** Пользователь уже существует
**Решение:**
1. Используйте другой email
2. Или удалите пользователя из Supabase

### ❌ "Column does not exist"
**Причина:** Схема базы данных не обновлена
**Решение:**
1. Выполните SQL обновления
2. Проверьте, что поля добавлены

## 🧪 ТЕСТИРОВАНИЕ

### Тест 1: Диагностика
```bash
curl http://localhost:3000/api/debug-registration
```

### Тест 2: Упрощенная регистрация
```bash
curl -X POST http://localhost:3000/api/auth/register-simple \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test User"}'
```

### Тест 3: Проверка базы данных
```bash
curl http://localhost:3000/api/test-db
```

## 📊 ЧТО ДОЛЖНО РАБОТАТЬ ПОСЛЕ ИСПРАВЛЕНИЙ

✅ **Диагностика** - показывает статус БД и переменных  
✅ **Схема БД** - содержит поля `emailVerified` и `emailVerificationToken`  
✅ **Регистрация** - создает пользователя с подтверждением email  
✅ **Уведомления** - показывает сообщения об успехе/ошибках  
✅ **Вход** - работает только после подтверждения email  

## 🚀 СЛЕДУЮЩИЕ ШАГИ

1. **Если диагностика показывает ошибки:**
   - Исправьте переменные окружения
   - Обновите схему базы данных

2. **Если регистрация работает:**
   - Протестируйте подтверждение email
   - Проверьте вход с подтвержденными данными

3. **Если все работает:**
   - Переключитесь обратно на основной API регистрации
   - Удалите тестовые файлы

## 📞 ПОДДЕРЖКА

Если проблема не решается:
1. Запустите диагностику: `http://localhost:3000/api/debug-registration`
2. Скопируйте полный ответ диагностики
3. Опишите, на каком шаге происходит сбой

**Текущий статус:** Готово к диагностике! 🎯
