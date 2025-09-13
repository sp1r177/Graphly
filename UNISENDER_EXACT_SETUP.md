# 🎯 ТОЧНЫЕ НАСТРОЙКИ UNISENDER

## 1. В UniSender:
1. Зайдите на unisender.com
2. Зарегистрируйтесь/войдите
3. **Настройки → API → Создать API ключ**
4. **Скопируйте API ключ** (длинная строка)

## 2. В Vercel Dashboard:
**Settings → Environment Variables → Add:**
```
UNISENDER_API_KEY = ваш_ключ_от_unisender
UNISENDER_SENDER_EMAIL = noreply@yourdomain.com
SITE_URL = https://your-domain.vercel.app
```

## 3. В Supabase Dashboard:
**Authentication → Settings:**
- **Site URL**: `https://your-domain.vercel.app`
- **Redirect URLs**: `https://your-domain.vercel.app/auth/callback`
- **Disable email confirmation** (мы отправляем сами)

## 4. Redeploy проект

## 5. Тест:
1. Зарегистрируйтесь
2. Проверьте email
3. Кликните по ссылке
4. Должно сработать

## ❌ Если не работает:
1. Проверьте папку "Спам"
2. Проверьте правильность API ключа
3. Проверьте лимиты в UniSender
4. Посмотрите логи в Vercel Functions

**ТОЧНО ТАК И НИКАК ИНАЧЕ!** 🎯
