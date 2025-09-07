@echo off
echo ========================================
echo    AIКонтент - ОТКЛЮЧАЕМ БД
echo ========================================
echo.

echo [1/3] Добавление изменений...
git add .

echo.
echo [2/3] Создание коммита...
git commit -m "Disable database temporarily - app will work"

echo.
echo [3/3] Отправка на GitHub...
git push

echo.
echo ========================================
echo    ГОТОВО!
echo ========================================
echo.
echo Теперь приложение будет работать БЕЗ базы данных:
echo 1. Регистрация работает (мок)
echo 2. Генерация контента работает (мок)
echo 3. Никаких ошибок БД
echo.
echo Проверьте через 2-3 минуты:
echo https://graphly-five.vercel.app
echo.
pause