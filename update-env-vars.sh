#!/bin/bash

echo "========================================"
echo "   Обновление переменных окружения"
echo "   для Yandex GPT"
echo "========================================"
echo

echo "Создаем .env.local файл..."
cat > .env.local << 'EOF'
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/graphly"

# JWT Secret for authentication
JWT_SECRET="your-super-secret-jwt-key-here"

# Yandex Cloud API Configuration
YANDEX_API_KEY="your-yandex-api-key-here"
YANDEX_FOLDER_ID="your-yandex-folder-id-here"

# Supabase Configuration (if using Supabase)
SUPABASE_URL="your-supabase-url-here"
SUPABASE_ANON_KEY="your-supabase-anon-key-here"

# Next.js Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
EOF

echo
echo "✅ .env.local файл создан!"
echo
echo "⚠️  ВАЖНО: Отредактируйте .env.local файл и замените:"
echo "   - your-yandex-api-key-here на ваш реальный API ключ"
echo "   - your-yandex-folder-id-here на ваш реальный Folder ID"
echo "   - your-super-secret-jwt-key-here на ваш JWT секрет"
echo "   - your-database-url на вашу базу данных"
echo
echo "Для получения API ключей Yandex Cloud:"
echo "1. Перейдите на https://cloud.yandex.com"
echo "2. Создайте проект"
echo "3. Получите YANDEX_API_KEY и YANDEX_FOLDER_ID"
echo
echo "После настройки запустите: npm run dev"
echo
