#!/bin/bash

echo "🚀 Starting MarketMind development servers..."

# Start Docker services if not running
if command -v docker &> /dev/null; then
    echo "📦 Checking database services..."
    docker-compose up -d
fi

# Start development servers
npm run dev
