@echo off
echo ========================================
echo    Обновление переменных окружения
echo    для Yandex GPT
echo ========================================
echo.

echo Создаем .env.local файл...
echo # Database > .env.local
echo DATABASE_URL="postgresql://username:password@localhost:5432/graphly" >> .env.local
echo. >> .env.local
echo # JWT Secret for authentication >> .env.local
echo JWT_SECRET="your-super-secret-jwt-key-here" >> .env.local
echo. >> .env.local
echo # Yandex Cloud API Configuration >> .env.local
echo YANDEX_API_KEY="your-yandex-api-key-here" >> .env.local
echo YANDEX_FOLDER_ID="your-yandex-folder-id-here" >> .env.local
echo. >> .env.local
echo # Supabase Configuration (if using Supabase) >> .env.local
echo SUPABASE_URL="your-supabase-url-here" >> .env.local
echo SUPABASE_ANON_KEY="your-supabase-anon-key-here" >> .env.local
echo. >> .env.local
echo # Next.js Configuration >> .env.local
echo NEXT_PUBLIC_BASE_URL="http://localhost:3000" >> .env.local
echo. >> .env.local
echo # Environment >> .env.local
echo NODE_ENV="development" >> .env.local

echo.
echo ✅ .env.local файл создан!
echo.
echo ⚠️  ВАЖНО: Отредактируйте .env.local файл и замените:
echo    - your-yandex-api-key-here на ваш реальный API ключ
echo    - your-yandex-folder-id-here на ваш реальный Folder ID
echo    - your-super-secret-jwt-key-here на ваш JWT секрет
echo    - your-database-url на вашу базу данных
echo.
echo Для получения API ключей Yandex Cloud:
echo 1. Перейдите на https://cloud.yandex.com
echo 2. Создайте проект
echo 3. Получите YANDEX_API_KEY и YANDEX_FOLDER_ID
echo.
echo После настройки запустите: npm run dev
echo.
pause
