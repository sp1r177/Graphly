@echo off
echo ========================================
echo    AIКонтент - Деплой всех изменений
echo ========================================
echo.

echo [1/4] Проверка статуса Git...
git status

echo.
echo [2/4] Добавление всех файлов...
git add -A

echo.
echo [3/4] Создание коммита...
git commit -m "Add all diagnostic tests and debug endpoints"

echo.
echo [4/4] Отправка на GitHub...
git push origin main

echo.
echo ========================================
echo    Деплой завершен!
echo ========================================
echo.
echo Проверьте через 2-3 минуты:
echo https://graphly-five.vercel.app/api/test
echo https://graphly-five.vercel.app/api/generate
echo.
pause
