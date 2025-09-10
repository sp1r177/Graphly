// Обновление конфигурации для новой Supabase БД
console.log('🔄 Обновление конфигурации для новой Supabase БД\n');

const newSupabaseProject = 'mpsrlymennzlzoogkpvc';
const newSupabaseUrl = `https://${newSupabaseProject}.supabase.co`;

console.log('📋 Новые настройки Supabase:');
console.log('Project ID:', newSupabaseProject);
console.log('Project URL:', newSupabaseUrl);
console.log();

console.log('🔧 Переменные для Vercel Environment Variables:');
console.log('=' .repeat(60));

console.log('Name: DATABASE_URL');
console.log(`Value: postgresql://postgres:[ВАШ_ПАРОЛЬ]@db.${newSupabaseProject}.supabase.co:5432/postgres`);
console.log('Environment: Production, Preview, Development');
console.log();

console.log('Name: SUPABASE_URL');
console.log(`Value: ${newSupabaseUrl}`);
console.log('Environment: Production, Preview, Development');
console.log();

console.log('Name: SUPABASE_ANON_KEY');
console.log('Value: [ПОЛУЧИТЕ_В_SUPABASE_DASHBOARD_SETTINGS_API]');
console.log('Environment: Production, Preview, Development');
console.log();

console.log('Name: JWT_SECRET');
console.log('Value: your-production-jwt-secret-123456789');
console.log('Environment: Production, Preview, Development');
console.log();

console.log('Name: NEXT_PUBLIC_BASE_URL');
console.log('Value: https://graphly-five.vercel.app');
console.log('Environment: Production, Preview, Development');
console.log();

console.log('=' .repeat(60));
console.log('📋 СЛЕДУЮЩИЕ ШАГИ:');
console.log('1. Получите пароль БД в Supabase Dashboard');
console.log('2. Получите ANON KEY в Settings → API');
console.log('3. Замените [ВАШ_ПАРОЛЬ] на реальный пароль');
console.log('4. Добавьте все переменные в Vercel');
console.log('5. Redeploy на Vercel');
console.log('6. Создайте таблицы через SQL Editor');
console.log('7. Протестируйте регистрацию');
console.log();

console.log('🎯 SQL для создания таблиц:');
console.log('Выполните в Supabase SQL Editor:');
console.log();

const createTablesSQL = `
-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  "subscriptionStatus" TEXT DEFAULT 'FREE',
  "usageCountDay" INTEGER DEFAULT 0,
  "usageCountMonth" INTEGER DEFAULT 0,
  "lastGenerationDate" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Создание таблицы генераций
CREATE TABLE IF NOT EXISTS generations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  "outputText" TEXT,
  "outputImageUrl" TEXT,
  "templateType" TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Создание таблицы платежей
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'RUB',
  status TEXT DEFAULT 'PENDING',
  "yandexPaymentId" TEXT,
  "subscriptionType" TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
`;

console.log(createTablesSQL);
console.log();
console.log('🎉 После выполнения всех шагов регистрация заработает!');
console.log('📊 Проверьте: https://graphly-five.vercel.app/api/debug');
