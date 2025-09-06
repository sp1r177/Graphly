#!/bin/bash

echo "========================================"
echo "    AIКонтент - Быстрая настройка"
echo "========================================"
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
echo "[3/4] Создание базы данных..."
npx prisma db push
if [ $? -ne 0 ]; then
    echo "Ошибка при создании базы данных!"
    exit 1
fi

echo
echo "[4/4] Проверка файла .env..."
if [ ! -f .env ]; then
    echo "Создание файла .env..."
    cat > .env << EOF
# Database
DATABASE_URL="file:./dev.db"

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
    echo "Файл .env создан! Не забудьте добавить ваши API ключи."
else
    echo "Файл .env уже существует."
fi

echo
echo "========================================"
echo "    Настройка завершена!"
echo "========================================"
echo
echo "Следующие шаги:"
echo "1. Отредактируйте файл .env и добавьте ваши API ключи Yandex GPT"
echo "2. Запустите: npm run dev"
echo "3. Откройте: http://localhost:3000"
echo
echo "Для получения API ключей Yandex GPT:"
echo "https://console.cloud.yandex.ru/"
echo
