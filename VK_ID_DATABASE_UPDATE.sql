-- Обновление базы данных для поддержки VK ID
-- Выполните эти команды в вашей Supabase базе данных

-- Добавляем новые поля в таблицу user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS vk_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';

-- Создаем индекс для быстрого поиска по VK ID
CREATE INDEX IF NOT EXISTS idx_user_profiles_vk_id ON user_profiles(vk_id);

-- Обновляем функцию создания профиля пользователя
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, avatar_url, vk_id, provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'vk_id',
    COALESCE(NEW.raw_user_meta_data->>'provider', 'email')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Проверяем, что триггер существует
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;
