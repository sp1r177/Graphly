@echo off
echo.
echo ========================================
echo    ПРОВЕРКА И ИСПРАВЛЕНИЕ ФАЙЛОВ
echo ========================================
echo.

echo Проверяю наличие необходимых файлов...
echo.

REM Проверка .env.local
if not exist ".env.local" (
    echo ❌ .env.local не найден
    if exist "env.local.ready" (
        echo Создаю .env.local из шаблона...
        copy "env.local.ready" ".env.local"
        echo ✅ .env.local создан
    ) else (
        echo ❌ Шаблон env.local.ready не найден!
        echo Создайте .env.local вручную со следующим содержимым:
        echo DATABASE_URL="file:./prisma/dev.db"
        echo JWT_SECRET="super-secret-jwt-key-change-this-in-production-12345"
        echo YANDEX_API_KEY=""
        echo YANDEX_FOLDER_ID=""
        echo SUPABASE_URL=""
        echo SUPABASE_ANON_KEY=""
        echo NEXT_PUBLIC_BASE_URL="http://localhost:3000"
        echo NODE_ENV="development"
    )
) else (
    echo ✅ .env.local найден
)
echo.

REM Проверка QUICK-START.bat
if not exist "QUICK-START.bat" (
    echo ❌ QUICK-START.bat не найден
    echo Создайте файл QUICK-START.bat со следующим содержимым:
    echo @echo off
    echo echo Запуск Graphly...
    echo npm run dev
) else (
    echo ✅ QUICK-START.bat найден
)
echo.

REM Проверка package.json
if not exist "package.json" (
    echo ❌ package.json не найден!
    echo Это критическая ошибка - файл package.json должен существовать
) else (
    echo ✅ package.json найден
)
echo.

REM Проверка src директории
if not exist "src" (
    echo ❌ Директория src не найдена!
    echo Это критическая ошибка - директория src должна существовать
) else (
    echo ✅ Директория src найдена
)
echo.

REM Проверка API роутов
if not exist "src\app\api\generate\route.ts" (
    echo ❌ API роут генерации не найден!
    echo Это критическая ошибка - файл должен существовать
) else (
    echo ✅ API роут генерации найден
)
echo.

if not exist "src\app\api\auth\register\route.ts" (
    echo ❌ API роут регистрации не найден!
    echo Это критическая ошибка - файл должен существовать
) else (
    echo ✅ API роут регистрации найден
)
echo.

REM Проверка тестовых файлов
if not exist "local-test.html" (
    echo ❌ local-test.html не найден
    echo Этот файл нужен для локального тестирования
) else (
    echo ✅ local-test.html найден
)
echo.

if not exist "test-auth-and-generate.html" (
    echo ❌ test-auth-and-generate.html не найден
    echo Этот файл нужен для тестирования функций
) else (
    echo ✅ test-auth-and-generate.html найден
)
echo.

echo ========================================
echo    ПРОВЕРКА ЗАВЕРШЕНА
echo ========================================
echo.
echo Если есть критические ошибки (❌), исправьте их перед запуском.
echo.
echo Для запуска системы выполните:
echo 1. QUICK-START.bat (полная настройка)
echo 2. local-test.html (проверка статуса)
echo.
pause
