#!/bin/bash

echo "========================================"
echo "    AIКонтент - Настройка с Supabase"
echo "========================================"
echo
echo "🆓 Supabase - полностью бесплатный PostgreSQL БЕЗ КАРТЫ!"
echo

echo "[1/4] Установка зависимостей..."
npm install
if [ $? -ne 0 ]; then
    echo "Ошибка при установке зависимостей!"
    exit 1
fi

echo
echo "[2/4] Генерация Prisma клиента..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "Ошибка при генерации Prisma клиента!"
    exit 1
fi

echo
echo "[3/4] Создание файла .env..."
if [ ! -f .env ]; then
    echo "Создание файла .env..."
    cat > .env << EOF
# Supabase Database (БЕЗ КАРТЫ!)
# Получите строку подключения на https://supabase.com/
# Settings → Database → Connection string → URI
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

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
EOF
    echo
    echo "✅ Файл .env создан!"
    echo
    echo "📋 СЛЕДУЮЩИЕ ШАГИ:"
    echo "1. Зайдите на https://supabase.com/"
    echo "2. Войдите через GitHub"
    echo "3. Создайте новый проект"
    echo "4. Скопируйте Connection String"
    echo "5. Замените DATABASE_URL в файле .env"
    echo "6. Добавьте ваши API ключи Yandex GPT"
    echo
else
    echo "Файл .env уже существует."
fi

echo
echo "[4/4] Переключение на PostgreSQL схему..."
npm run db:production
if [ $? -ne 0 ]; then
    echo "Ошибка при переключении схемы!"
    exit 1
fi

echo
echo "========================================"
echo "    Настройка завершена!"
echo "========================================"
echo
echo "🆓 Supabase - полностью бесплатно!"
echo "📊 500MB базы данных"
echo "👥 50,000 пользователей"
echo "🔄 500,000 запросов в месяц"
echo
echo "Следующие шаги:"
echo "1. Настройте Supabase (https://supabase.com/)"
echo "2. Обновите DATABASE_URL в .env"
echo "3. Добавьте API ключи Yandex GPT"
echo "4. Запустите: npm run dev"
echo
echo "📖 Подробные инструкции: SUPABASE_SETUP.md"
echo
