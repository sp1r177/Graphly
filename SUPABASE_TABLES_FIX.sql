-- Создание таблицы user_profiles в Supabase
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    name text,
    avatar_url text,
    vk_id text,
    provider text DEFAULT 'email',
    subscription_status text DEFAULT 'FREE' CHECK (subscription_status IN ('FREE', 'PRO', 'ULTRA')),
    usage_count_day integer DEFAULT 0,
    usage_count_month integer DEFAULT 0,
    email_confirmed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Создание таблицы generations
CREATE TABLE IF NOT EXISTS public.generations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    prompt text NOT NULL,
    output_text text,
    output_image_url text,
    template_type text NOT NULL,
    tokens_used integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Включение RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Политики безопасности для user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Политики безопасности для generations
CREATE POLICY "Users can view own generations" ON public.generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" ON public.generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Создание индексов для производительности
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_vk_id ON public.user_profiles(vk_id);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at DESC);
