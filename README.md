# MarketMind

## AI-Powered Investing Education & Trading Platform

[![CI](https://github.com/Fayedamz/MarketMind/actions/workflows/ci.yml/badge.svg)](https://github.com/Fayedamz/MarketMind/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

MarketMind is an AI-powered investing platform designed to make stock markets easier to understand, learn, practice, and participate in.

> **Learn the Market. Understand Your Decisions. Invest with Confidence.**

### 🎯 Mission

Traditional investment platforms are built for people who already understand financial markets. MarketMind takes a different approach by combining **interactive education, AI-powered explanations, simulated trading, and portfolio learning** into one seamless experience.

### ✨ Key Features

- 📚 **Interactive Academy** - Learn investing through structured lessons
- 🤖 **AI Tutor** - Get personalized explanations powered by GPT-4
- 📊 **Stock Explorer** - Search and analyze companies with real-time data
- 💼 **Paper Trading** - Practice investing with $10,000 virtual money
- 📈 **Portfolio Tracking** - Monitor holdings with P&L calculations
- 🧠 **AI Insights** - Understand market movements and portfolio performance

---

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/Fayedamz/MarketMind.git
cd MarketMind
make setup

# Start development
make dev
```

Visit http://localhost:3000 and login with:
- **Email**: demo@marketmind.com  
- **Password**: demo123456

📖 **[See Full Quickstart Guide →](./QUICKSTART.md)**

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or use Docker)
- Redis (or use Docker)
- Git

### Quick Start with Docker

```bash
# Clone and setup
git clone https://github.com/Fayedamz/MarketMind.git
cd MarketMind

# Run setup script (handles everything)
chmod +x scripts/setup.sh
./scripts/setup.sh

# Or use make
make setup

# Start development
npm run dev
# Or: make dev
```

### Manual Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Start databases** (if using Docker):
```bash
docker-compose up -d
```

3. **Set up environment variables**:
```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

4. **Run database migrations**:
```bash
cd apps/api
npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed.ts
cd ../..
```

5. **Start development servers**:
```bash
npm run dev
```

Visit:
- Web App: http://localhost:3000
- API: http://localhost:3001
- Prisma Studio: `make db-studio`

### Demo Account

```
Email: demo@marketmind.com
Password: demo123456
```

## Development

- `npm run dev` - Start all development servers
- `npm run build` - Build all applications
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Documentation

See the [docs](./docs) directory for detailed documentation:
- [Architecture](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Deployment](./docs/deployment.md)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

- Documentation: [docs](./docs)
- Issues: [GitHub Issues](https://github.com/Fayedamz/MarketMind/issues)
- Discussions: [GitHub Discussions](https://github.com/Fayedamz/MarketMind/discussions)

---

**MarketMind** — Learn the market. Understand your decisions. Invest with confidence.
