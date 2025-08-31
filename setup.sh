#!/bin/bash

echo "🚀 Setting up AIКонтент project..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Setting up database..."
npx prisma generate
npx prisma db push

# Create initial data (optional)
echo "✅ Project setup complete!"
echo ""
echo "To start the development server:"
echo "npm run dev"
echo ""
echo "The application will be available at http://localhost:3000"