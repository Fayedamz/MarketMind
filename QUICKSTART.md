# 🚀 MarketMind - Quick Start

Get MarketMind running in under 5 minutes!

## Prerequisites

- Node.js 18+
- Docker (recommended) OR PostgreSQL + Redis installed locally

## Installation

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repo
git clone https://github.com/Fayedamz/MarketMind.git
cd MarketMind

# Run the magic setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Or use Make
make setup
```

### Option 2: Quick Manual Setup

```bash
# Clone
git clone https://github.com/Fayedamz/MarketMind.git
cd MarketMind

# Install dependencies
npm install

# Start databases (Docker)
docker-compose up -d

# Setup environment
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Database setup
cd apps/api
npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed.ts
cd ../..
```

## Run Development Servers

```bash
npm run dev
```

Or:
```bash
make dev
```

## Access the Application

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **Database UI**: Run `make db-studio`

## Demo Login

```
Email: demo@marketmind.com
Password: demo123456
```

## What You Can Do

1. **Learn Investing** - Complete interactive lessons
2. **Ask AI Tutor** - Get answers about investing
3. **Explore Stocks** - Search and analyze companies
4. **Paper Trade** - Practice trading with virtual money
5. **Track Portfolio** - Monitor your holdings and P&L

## Useful Commands

```bash
make dev          # Start dev servers
make db-studio    # Open database UI
make db-seed      # Add demo data
make docker-up    # Start Docker services
make clean        # Clean everything
```

## Troubleshooting

### Ports in use?
```bash
# Kill processes on ports
lsof -i :3000
lsof -i :3001
kill -9 <PID>
```

### Database issues?
```bash
make db-reset   # Reset database (WARNING: deletes data)
```

### Docker not working?
Install PostgreSQL and Redis locally:
- PostgreSQL: https://www.postgresql.org/download/
- Redis: https://redis.io/docs/getting-started/

Then update DATABASE_URL and REDIS_URL in `apps/api/.env`

## Next Steps

- Read [Getting Started Guide](./docs/getting-started.md)
- Check [API Documentation](./docs/api.md)
- View [Architecture Overview](./docs/architecture.md)
- Explore [Features](./docs/features.md)

## Need Help?

- 📖 [Full Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/Fayedamz/MarketMind/issues)
- 💬 [Discussions](https://github.com/Fayedamz/MarketMind/discussions)

---

Built with ❤️ using Next.js, Express, PostgreSQL, and OpenAI
