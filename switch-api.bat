@echo off
echo ========================================
echo    Переключение API роута
echo ========================================
echo.

if "%1"=="simple" (
    echo 🔄 Переключение на ПРОСТОЙ API роут...
    if exist "src\app\api\generate\route.ts" (
        move "src\app\api\generate\route.ts" "src\app\api\generate\route.complex.ts"
        echo ✅ Сложный роут сохранен как route.complex.ts
    )
    if exist "src\app\api\generate\route.simple.ts" (
        copy "src\app\api\generate\route.simple.ts" "src\app\api\generate\route.ts"
        echo ✅ Простой роут активирован
    )
    echo.
    echo 🎯 Теперь используется ПРОСТОЙ API без зависимостей
) else if "%1"=="complex" (
    echo 🔄 Переключение на СЛОЖНЫЙ API роут...
    if exist "src\app\api\generate\route.ts" (
        move "src\app\api\generate\route.ts" "src\app\api\generate\route.simple.ts"
        echo ✅ Простой роут сохранен
    )
    if exist "src\app\api\generate\route.complex.ts" (
        copy "src\app\api\generate\route.complex.ts" "src\app\api\generate\route.ts"
        echo ✅ Сложный роут активирован
    )
    echo.
    echo 🎯 Теперь используется СЛОЖНЫЙ API с Yandex GPT
) else (
    echo Использование:
    echo   switch-api.bat simple   - Включить простой API
    echo   switch-api.bat complex  - Включить сложный API с Yandex GPT
    echo.
    echo Текущий статус:
    if exist "src\app\api\generate\route.simple.ts" (
        echo ✅ Простой API доступен
    ) else (
        echo ❌ Простой API не найден
    )
    if exist "src\app\api\generate\route.complex.ts" (
        echo ✅ Сложный API доступен
    ) else (
        echo ❌ Сложный API не найден
    )
    if exist "src\app\api\generate\route.ts" (
        echo ✅ Активный API роут найден
        findstr "simple" "src\app\api\generate\route.ts" >nul
        if %errorlevel% equ 0 (
            echo 🎯 Сейчас активен: ПРОСТОЙ API
        ) else (
            echo 🎯 Сейчас активен: СЛОЖНЫЙ API
        )
    ) else (
        echo ❌ Активный API роут не найден
    )
)

echo.
pause
