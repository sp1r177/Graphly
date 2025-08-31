@echo off
echo 🚀 Setting up AIКонтент project...

echo 📦 Installing dependencies...
npm install

echo 🗄️ Setting up database...
npx prisma generate
npx prisma db push

echo ✅ Project setup complete!
echo.
echo To start the development server:
echo npm run dev
echo.
echo The application will be available at http://localhost:3000

pause