# Getting Started with MarketMind

This guide will help you set up and run MarketMind on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Docker** (optional but recommended) - [Download](https://www.docker.com/)

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Fayedamz/MarketMind.git
cd MarketMind
```

### Step 2: Automated Setup (Recommended)

We provide a setup script that handles everything:

```bash
# Make script executable
chmod +x scripts/setup.sh

# Run setup
./scripts/setup.sh
```

Or using Make:

```bash
make setup
```

This script will:
- Start PostgreSQL and Redis using Docker
- Install all dependencies
- Create environment files
- Run database migrations
- Seed the database with demo data

### Step 3: Manual Setup (Alternative)

If you prefer manual setup or can't use Docker:

#### 3.1 Install Dependencies

```bash
npm install
```

#### 3.2 Set Up PostgreSQL

Install PostgreSQL 14+ and create a database:

```sql
CREATE DATABASE marketmind_dev;
CREATE USER marketmind WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE marketmind_dev TO marketmind;
```

#### 3.3 Set Up Redis

Install and start Redis:

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Windows - Use WSL or download from https://redis.io/
```

#### 3.4 Configure Environment Variables

Create `.env` files:

```bash
# Root .env
cp .env.example .env

# API .env
cp apps/api/.env.example apps/api/.env

# Web .env.local
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/api/.env`:

```env
DATABASE_URL="postgresql://marketmind:your_password@localhost:5432/marketmind_dev?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-random-secret-key"
OPENAI_API_KEY="your-openai-api-key"  # Optional
ALPHA_VANTAGE_API_KEY="your-alpha-vantage-key"  # Optional
```

Edit `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

#### 3.5 Run Database Migrations

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
cd ../..
```

## Running the Application

### Development Mode

Start all development servers:

```bash
npm run dev
```

Or using Make:

```bash
make dev
```

This starts:
- Web app on http://localhost:3000
- API server on http://localhost:3001

### Individual Services

Run services separately:

```bash
# Web app only
cd apps/web
npm run dev

# API server only
cd apps/api
npm run dev
```

## Accessing the Application

### Web Application

Visit http://localhost:3000

### Demo Account

Use these credentials to login:

```
Email: demo@marketmind.com
Password: demo123456
```

### API Documentation

API runs on http://localhost:3001

Endpoints:
- Health check: `GET /health`
- API routes: `GET /api/*`

See [API Documentation](./api.md) for details.

### Database Management

Open Prisma Studio to view and edit database:

```bash
make db-studio
# Or: cd apps/api && npx prisma studio
```

## Common Commands

```bash
# Development
npm run dev              # Start all dev servers
make dev                 # Alternative using Make

# Build
npm run build            # Build all apps
make build               # Alternative using Make

# Database
make db-migrate          # Run migrations
make db-seed             # Seed database
make db-reset            # Reset database (⚠️ deletes data)
make db-studio           # Open Prisma Studio

# Docker
make docker-up           # Start Docker services
make docker-down         # Stop Docker services
make docker-logs         # View logs

# Code Quality
npm run lint             # Run linter
npm run format           # Format code
npm test                 # Run tests

# Cleanup
make clean               # Remove build artifacts
```

## Troubleshooting

### Port Already in Use

If ports 3000 or 3001 are in use:

```bash
# Find process using port
lsof -i :3000
lsof -i :3001

# Kill process
kill -9 <PID>
```

Or change ports in `.env` files.

### Database Connection Issues

1. Ensure PostgreSQL is running:
```bash
docker-compose ps
# Or check local PostgreSQL service
```

2. Verify DATABASE_URL in `apps/api/.env`

3. Test connection:
```bash
cd apps/api
npx prisma db push
```

### Redis Connection Issues

1. Ensure Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

2. Verify REDIS_URL in `apps/api/.env`

### Missing Dependencies

```bash
# Clean install
make clean
npm install

# Or manually
rm -rf node_modules
rm -rf apps/*/node_modules
npm install
```

### Migration Errors

```bash
# Reset and recreate database
make db-reset

# Or manually
cd apps/api
npx prisma migrate reset
npx prisma migrate dev
npx tsx prisma/seed.ts
```

## Next Steps

- Read the [Architecture Documentation](./architecture.md)
- Explore the [API Documentation](./api.md)
- Check out [Database Schema](./database.md)
- Learn about [Deployment](./deployment.md)

## Getting Help

- **Documentation**: Check the `docs/` directory
- **Issues**: [GitHub Issues](https://github.com/Fayedamz/MarketMind/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Fayedamz/MarketMind/discussions)

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload in development

2. **API Testing**: Use tools like Postman or Thunder Client with the API

3. **Database Changes**: 
   - Modify `prisma/schema.prisma`
   - Run `npx prisma migrate dev`
   - Prisma Client updates automatically

4. **Code Organization**:
   - Frontend: `apps/web/src/`
   - Backend: `apps/api/src/`
   - Shared code: `packages/`

5. **Environment Variables**:
   - Never commit `.env` files
   - Update `.env.example` when adding new variables

Happy coding! 🚀
