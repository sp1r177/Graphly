@echo off
echo.
echo ========================================
echo    ОЧИСТКА И ДЕПЛОЙ НА VERCEL
echo ========================================
echo.

echo Этот скрипт:
echo 1. Удалит лишние файлы
echo 2. Настроит проект для Vercel
echo 3. Задеплоит на Vercel
echo.
pause

echo.
echo ШАГ 1: Удаление лишних файлов...
echo.

REM Удаляем дубли и временные файлы
if exist "*.bat" (
    echo Удаляю лишние .bat файлы...
    del /q "setup-*.bat" 2>nul
    del /q "debug-*.bat" 2>nul
    del /q "check-*.bat" 2>nul
    del /q "run-*.bat" 2>nul
    del /q "switch-*.bat" 2>nul
    del /q "start-*.bat" 2>nul
    del /q "update-*.bat" 2>nul
    del /q "test-*.bat" 2>nul
    del /q "ultimate-*.js" 2>nul
    del /q "simple-*.js" 2>nul
    del /q "system-*.js" 2>nul
    del /q "test-*.js" 2>nul
    del /q "check-*.js" 2>nul
    echo ✅ Лишние скрипты удалены
)

REM Удаляем тестовые HTML файлы
if exist "*.html" (
    echo Удаляю тестовые HTML файлы...
    del /q "test-*.html" 2>nul
    del /q "local-*.html" 2>nul
    echo ✅ Тестовые HTML удалены
)

REM Удаляем лишние markdown файлы
if exist "*DEBUG*.md" (
    echo Удаляю лишние документы...
    del /q "*DEBUG*.md" 2>nul
    del /q "*SETUP*.md" 2>nul
    del /q "*GUIDE*.md" 2>nul
    del /q "MIGRATION*.md" 2>nul
    del /q "TESTING*.md" 2>nul
    del /q "WINDOWS*.md" 2>nul
    del /q "DATABASE*.md" 2>nul
    echo ✅ Лишние документы удалены
)

REM Удаляем дубли env файлов
if exist "env.*" (
    echo Удаляю дубли env файлов...
    del /q "env.example" 2>nul
    del /q "env.local.template" 2>nul
    del /q "env.local.ready" 2>nul
    echo ✅ Дубли env файлов удалены
)

REM Удаляем текстовые файлы-помощники
if exist "*.txt" (
    echo Удаляю текстовые файлы...
    del /q "ПОМОГИТЕ*.txt" 2>nul
    del /q "QUICK*.txt" 2>nul
    echo ✅ Текстовые файлы удалены
)

echo.
echo ШАГ 2: Настройка для Vercel...
echo.

REM Создаем правильный .env.example для Vercel
echo # Vercel Environment Variables > .env.example
echo DATABASE_URL=postgresql://user:pass@host:port/db >> .env.example
echo JWT_SECRET=your-jwt-secret-here >> .env.example
echo YANDEX_API_KEY=your-yandex-api-key >> .env.example
echo YANDEX_FOLDER_ID=your-yandex-folder-id >> .env.example
echo NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app >> .env.example
echo NODE_ENV=production >> .env.example
echo ✅ .env.example создан для Vercel

REM Проверяем основные файлы для Vercel
if exist "vercel.json" (
    echo ✅ vercel.json найден
) else (
    echo Создаю vercel.json...
    echo { > vercel.json
    echo   "buildCommand": "npx prisma generate && next build", >> vercel.json
    echo   "framework": "nextjs", >> vercel.json
    echo   "env": { >> vercel.json
    echo     "NODE_ENV": "production" >> vercel.json
    echo   } >> vercel.json
    echo } >> vercel.json
    echo ✅ vercel.json создан
)

if exist "package.json" (
    echo ✅ package.json найден
) else (
    echo ❌ package.json не найден! Критическая ошибка!
    pause
    exit /b 1
)

echo.
echo ШАГ 3: Подготовка к деплою...
echo.

echo Добавляю изменения в git...
git add .
if %errorlevel% neq 0 (
    echo ❌ Ошибка git add
    echo Инициализирую git репозиторий...
    git init
    git add .
)

git status
echo.

echo Создаю коммит...
git commit -m "Clean project and prepare for Vercel deployment"
if %errorlevel% neq 0 (
    echo ⚠️  Нет изменений для коммита или git не настроен
)

echo.
echo ========================================
echo    ПРОЕКТ ОЧИЩЕН И ГОТОВ К ДЕПЛОЮ!
echo ========================================
echo.
echo СЛЕДУЮЩИЕ ШАГИ:
echo.
echo 1. Настройте переменные окружения в Vercel Dashboard:
echo    - DATABASE_URL (PostgreSQL)
echo    - JWT_SECRET
echo    - YANDEX_API_KEY
echo    - YANDEX_FOLDER_ID
echo    - NEXT_PUBLIC_BASE_URL
echo.
echo 2. Задеплойте на Vercel:
echo    git push origin main
echo    (или подключите репозиторий к Vercel)
echo.
echo 3. После деплоя проверьте:
echo    https://your-domain.vercel.app/api/generate
echo.
pause
