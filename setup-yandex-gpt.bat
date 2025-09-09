@echo off
echo ========================================
echo    Настройка Yandex GPT для Graphly
echo ========================================
echo.

echo Проверяем наличие .env.local файла...
if not exist .env.local (
    echo Создаем .env.local файл...
    copy env.example .env.local
    echo.
    echo ⚠️  ВАЖНО: Отредактируйте .env.local файл и добавьте ваши API ключи:
    echo    - YANDEX_API_KEY
    echo    - YANDEX_FOLDER_ID
    echo.
    pause
) else (
    echo .env.local файл уже существует
)

echo.
echo Устанавливаем зависимости...
call npm install

echo.
echo Проверяем конфигурацию...
call npm run build

echo.
echo ========================================
echo    Настройка завершена!
echo ========================================
echo.
echo Следующие шаги:
echo 1. Отредактируйте .env.local с вашими API ключами
echo 2. Запустите: npm run dev
echo 3. Откройте: http://localhost:3000/api/generate
echo 4. Проверьте статус переменных окружения
echo.
echo Для деплоя на Vercel:
echo 1. Добавьте переменные в Vercel Dashboard
echo 2. Выполните: git add . && git commit -m "Add Yandex GPT" && git push
echo.
pause
