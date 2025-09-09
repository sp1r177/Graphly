# Graphly - AI Content Generation Platform

Modern platform for generating marketing content using Yandex GPT 5.1.

## 🚀 Features

- **Content Generation**: Create posts for VK, Telegram, email campaigns and articles
- **Templates**: Ready-made templates for different content types
- **Multi-language**: Russian and English support
- **Mobile Responsive**: Optimized for all devices
- **User Management**: Registration, authentication, and subscription management

## 🛠 Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Prisma + PostgreSQL
- **AI**: Yandex GPT 5.1 (Yandex Cloud API)
- **Deployment**: Vercel

## 🌐 Deployment on Vercel

### 1. Environment Variables

Add these variables in Vercel Dashboard → Settings → Environment Variables:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-super-secret-jwt-key-for-production"
YANDEX_API_KEY="your-yandex-cloud-api-key"
YANDEX_FOLDER_ID="your-yandex-cloud-folder-id"
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"
NODE_ENV="production"
```

### 2. Database Setup

For production, you need PostgreSQL:
- Use Vercel Postgres, Supabase, or Railway
- Apply schema: `npx prisma migrate deploy`

### 3. Yandex Cloud API Setup

1. Create project in [Yandex Cloud Console](https://console.cloud.yandex.ru/)
2. Create service account with `ai.languageModels.user` role
3. Generate API key and get Folder ID
4. Add to Vercel environment variables

### 4. Deploy

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

Connect repository to Vercel and deploy.

## 📊 API Endpoints

- `GET /api/generate` - Check API status
- `POST /api/generate` - Generate content
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile

## 🎯 Content Types

- **VK_POST** - VKontakte posts
- **TELEGRAM_POST** - Telegram posts  
- **EMAIL_CAMPAIGN** - Email campaigns
- **BLOG_ARTICLE** - Blog articles
- **VIDEO_SCRIPT** - Video scripts
- **IMAGE_GENERATION** - Image descriptions

## 🔒 Authentication

- JWT-based authentication
- HTTP-only cookies for security
- User roles and subscription management

## 📱 Subscription Plans

- **Free**: Limited daily generations
- **Pro**: Increased limits
- **Ultra**: Unlimited generations

## 🚀 Getting Started

1. Clone repository
2. Set up environment variables in Vercel
3. Deploy to Vercel
4. Configure database and API keys
5. Test functionality

## 📞 Support

For issues and questions, check the deployment logs in Vercel Dashboard → Functions.

## 📄 License

This project is private and proprietary.