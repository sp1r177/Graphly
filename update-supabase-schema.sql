-- Обновление схемы Supabase для добавления полей подтверждения email
-- Выполните этот SQL в Supabase SQL Editor

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

-- Проверяем результат
SELECT 
  id, 
  email, 
  name, 
  "emailVerified", 
  "emailVerificationToken",
  "subscriptionStatus",
  "createdAt"
FROM users 
LIMIT 5;
