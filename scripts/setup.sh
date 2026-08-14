#!/bin/bash

echo "🚀 Setting up MarketMind..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You'll need to set up PostgreSQL and Redis manually."
else
    echo "📦 Starting PostgreSQL and Redis with Docker..."
    docker-compose up -d
    echo "✅ Database services started"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment files
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your configuration"
fi

if [ ! -f "apps/api/.env" ]; then
    echo "📝 Creating apps/api/.env file..."
    cp apps/api/.env.example apps/api/.env
fi

if [ ! -f "apps/web/.env.local" ]; then
    echo "📝 Creating apps/web/.env.local file..."
    cp apps/web/.env.example apps/web/.env.local
fi

# Wait for database
echo "⏳ Waiting for database..."
sleep 5

# Run migrations
echo "🗄️  Running database migrations..."
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
echo "✅ Migrations complete"

# Seed database
echo "🌱 Seeding database..."
npx tsx prisma/seed.ts
echo "✅ Database seeded"

cd ../..

echo "
🎉 Setup complete!

Next steps:
1. Edit .env files with your API keys
2. Run 'npm run dev' to start development servers
3. Visit http://localhost:3000 for the web app
4. Visit http://localhost:3001 for the API

Demo account:
  Email: demo@marketmind.com
  Password: demo123456

Happy coding! 🚀
"
