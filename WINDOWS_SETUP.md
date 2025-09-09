# 🚀 Настройка Graphly на Windows - Простая инструкция

## ШАГ 1: Подготовка переменных окружения

1. **Найдите файл** `env.local.ready` в папке проекта
2. **Скопируйте его** и переименуйте в `.env.local`
3. **Откройте `.env.local`** в текстовом редакторе
4. **Проверьте значения**:
```env
# Database (локально SQLite)
DATABASE_URL="file:./prisma/dev.db"

# JWT Secret
JWT_SECRET="super-secret-jwt-key-change-this-in-production-12345"

# Yandex (оставьте пустыми, если нет ключей)
YANDEX_API_KEY=""
YANDEX_FOLDER_ID=""

# Supabase (оставьте пустыми)
SUPABASE_URL=""
SUPABASE_ANON_KEY=""

# Next.js
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

## ШАГ 2: Настройка базы данных

1. **Откройте командную строку** в папке проекта
2. **Выполните команды** по одной:

```cmd
# Переключение на локальную схему (SQLite)
node switch-db.js local

# Генерация Prisma клиента
npx prisma generate

# Создание базы данных
npx prisma db push
```

## ШАГ 3: Запуск приложения

1. **Установите зависимости** (если еще не):
```cmd
npm install
```

2. **Запустите приложение**:
```cmd
npm run dev
```

## ШАГ 4: Тестирование

### Проверьте API:
- Откройте браузер: `http://localhost:3000/api/generate`
- Должны увидеть статус переменных окружения

### Протестируйте регистрацию:
1. Откройте: `http://localhost:3000/auth/register`
2. Введите:
   - Email: `test@example.com`
   - Password: `Test123456`
   - Name: `Test User`
3. Нажмите "Зарегистрироваться"

### Протестируйте генерацию:
1. Откройте главную страницу
2. Введите: "Создай пост для ВКонтакте о новом продукте"
3. Выберите тип: VK_POST
4. Нажмите "Сгенерировать"

## ШАГ 5: Настройка Vercel

### Добавьте переменные в Vercel:
1. **Vercel Dashboard** → **Project** → **Settings** → **Environment Variables**
2. **Добавьте для Production**:
```
DATABASE_URL = postgresql://user:pass@host:5432/db  # Ваша прод БД
JWT_SECRET = super-secret-jwt-key-change-this-in-production-12345
YANDEX_API_KEY = your-yandex-api-key  # Если есть
YANDEX_FOLDER_ID = your-yandex-folder-id  # Если есть
NEXT_PUBLIC_BASE_URL = https://your-domain.vercel.app
NODE_ENV = production
```

### Деплой:
```cmd
git add .
git commit -m "Setup complete: local env, db fixes"
git push origin main
```

## 🔧 Быстрый запуск через скрипт

Если команды выше не работают, запустите:
```cmd
setup-local.bat
```

Это автоматически:
- Создаст `.env.local`
- Настроит базу данных
- Подготовит всё для запуска

## 🚨 Возможные проблемы и решения

### "Команда node не найдена"
- Установите Node.js с [nodejs.org](https://nodejs.org)
- Перезапустите командную строку

### "База данных не создана"
- Проверьте, что файл `prisma/dev.db` создан
- Попробуйте: `npx prisma db push --force-reset`

### "Регистрация не работает"
- Проверьте `/api/generate` - должны быть все переменные ✅ Найден
- Проверьте консоль браузера на ошибки

### "Генерация возвращает пустой текст"
- Это нормально, если нет YANDEX_API_KEY (работает с мок-данными)
- Добавьте Yandex ключи для реальной генерации

## 📞 Поддержка

Если что-то не работает:
1. **Проверьте логи** в командной строке
2. **Проверьте браузерную консоль** (F12)
3. **Проверьте файл** `.env.local` на правильность
4. **Запустите заново** `setup-local.bat`

## ✅ Чек-лист готовности

- [ ] Создан `.env.local` с правильными значениями
- [ ] Настроена локальная БД (файл `prisma/dev.db` существует)
- [ ] Приложение запускается без ошибок
- [ ] Регистрация работает (создает пользователя в БД)
- [ ] Генерация контента работает (даже с мок-данными)
- [ ] Настроены переменные в Vercel
- [ ] Продакшн версия работает
