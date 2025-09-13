# 🚀 ПРОСТОЕ РЕШЕНИЕ - Настройка Supabase для писем

## ❌ Забудьте про UniSender - используем Supabase!

### 1. В Supabase Dashboard:
1. **Authentication → Settings → SMTP Settings**
2. **Оставьте "Use Supabase SMTP"** (включено по умолчанию)
3. **Site URL**: `https://your-domain.vercel.app`
4. **Redirect URLs**: `https://your-domain.vercel.app/auth/callback`

### 2. В Supabase Dashboard:
1. **Authentication → Templates**
2. **Confirm signup** - настройте красивый шаблон:

```html
<h1>🎉 Добро пожаловать в Graphly!</h1>
<p>Привет{{if .Name}}, {{.Name}}{{end}}!</p>
<p>Спасибо за регистрацию в нашем сервисе генерации контента с помощью ИИ.</p>
<p>Для завершения регистрации подтвердите ваш email:</p>
<a href="{{ .ConfirmationURL }}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">✅ Подтвердить email</a>
<p>Если кнопка не работает, скопируйте эту ссылку: {{ .ConfirmationURL }}</p>
<p>С уважением, команда Graphly</p>
```

### 3. В Vercel Dashboard:
Добавьте только:
```
SITE_URL = https://your-domain.vercel.app
```

### 4. Redeploy проект

## ✅ Готово!
- Письма будут приходить от Supabase
- Ссылки будут работать
- Подтверждение будет работать
- Красивый шаблон письма

**Никаких UniSender, никаких API ключей!** 🎉
