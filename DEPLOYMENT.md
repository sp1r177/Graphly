# Deployment Guide for AIКонтент

## Vercel Deployment

### Prerequisites
1. Install dependencies locally first:
   ```bash
   npm install
   npx prisma generate
   ```

2. Test build locally:
   ```bash
   npm run build
   ```

### Environment Variables
Configure these in Vercel dashboard:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
NEXTAUTH_URL="https://your-domain.vercel.app"
YANDEX_KASSA_SHOP_ID="your-shop-id"
YANDEX_KASSA_SECRET_KEY="your-secret-key"
```

### Database Setup
For production, consider using:
- **Vercel Postgres** (recommended)
- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)

Update `DATABASE_URL` accordingly and run:
```bash
npx prisma db push
```

### Build Commands
Vercel automatically detects Next.js and uses:
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: `.next`

### Common Issues & Solutions

#### 1. ESLint Errors
Already fixed in `.eslintrc.json`:
```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "react/no-unescaped-entities": "off"
  }
}
```

#### 2. TypeScript Errors
If you encounter missing dependencies during build:
- Ensure all dependencies are in `package.json`
- Use `npm ci` for clean install
- Check imports use correct paths

#### 3. Database Issues
- SQLite doesn't work in serverless (use Postgres)
- Update schema for production database
- Run migrations in build process

#### 4. API Routes
- All API routes are in `/src/app/api/`
- Environment variables must be set in Vercel
- Check CORS settings for production

### Performance Optimization

#### 1. Static Generation
Already configured for optimal performance:
- Static generation where possible
- ISR for dynamic content
- Edge runtime for API routes

#### 2. Images
Consider using:
- Vercel Image Optimization
- External CDN for AI-generated images
- WebP format for better compression

#### 3. Bundle Size
Monitor with:
```bash
npm run build
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database connected and migrated
- [ ] Yandex.Kassa credentials set
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Error tracking setup (Sentry)
- [ ] Analytics configured
- [ ] Email service connected

### Rollback Strategy
1. Keep previous deployment active
2. Use Vercel's instant rollback
3. Database migrations are irreversible (backup first)

### Monitoring
Set up:
- Vercel Analytics
- Error boundaries in React
- API response monitoring
- Database performance tracking

### Cost Optimization
- Use Vercel Pro for better performance
- Monitor function execution time
- Optimize API calls
- Consider edge functions for global performance