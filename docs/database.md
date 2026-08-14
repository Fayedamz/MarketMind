# Database Schema Documentation

## Overview

MarketMind uses PostgreSQL as the primary database with Prisma ORM for type-safe database access.

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │
└─────────────┘
      │
      ├─── Has Many ──> Portfolio
      ├─── Has Many ──> UserLesson
      └─── Has Many ──> Achievement

┌─────────────┐
│  Portfolio  │
└─────────────┘
      │
      ├─── Has Many ──> Position
      └─── Has Many ──> Trade

┌─────────────┐
│   Lesson    │
└─────────────┘
      │
      └─── Has Many ──> UserLesson
```

## Tables

### Users

Stores user account information.

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  name          String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Indexes:**
- Primary: `id`
- Unique: `email`

### Portfolios

Stores user portfolios (both paper and real).

```prisma
model Portfolio {
  id          String    @id @default(uuid())
  userId      String
  name        String
  type        String    // PAPER, REAL
  balance     Float     @default(10000)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**Indexes:**
- Primary: `id`
- Foreign Key: `userId` -> `users.id`

### Positions

Stores current holdings in portfolios.

```prisma
model Position {
  id          String    @id @default(uuid())
  portfolioId String
  symbol      String
  quantity    Int
  avgPrice    Float
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**Indexes:**
- Primary: `id`
- Foreign Key: `portfolioId` -> `portfolios.id`
- Composite: `(portfolioId, symbol)` for quick lookups

### Trades

Records all buy/sell transactions.

```prisma
model Trade {
  id          String    @id @default(uuid())
  portfolioId String
  symbol      String
  type        String    // BUY, SELL
  quantity    Int
  price       Float
  total       Float
  createdAt   DateTime  @default(now())
}
```

**Indexes:**
- Primary: `id`
- Foreign Key: `portfolioId` -> `portfolios.id`
- Index on `createdAt` for chronological queries

### Lessons

Stores educational lesson content.

```prisma
model Lesson {
  id          String    @id @default(uuid())
  title       String
  description String
  content     String    @db.Text
  order       Int
  category    String
  difficulty  String    // BEGINNER, INTERMEDIATE, ADVANCED
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

**Indexes:**
- Primary: `id`
- Index on `category` and `difficulty`
- Index on `order` for sequential retrieval

### UserLessons

Tracks user progress through lessons.

```prisma
model UserLesson {
  id          String    @id @default(uuid())
  userId      String
  lessonId    String
  completed   Boolean   @default(false)
  score       Int?
  completedAt DateTime?
  createdAt   DateTime  @default(now())
}
```

**Indexes:**
- Primary: `id`
- Unique: `(userId, lessonId)`
- Foreign Keys: `userId` -> `users.id`, `lessonId` -> `lessons.id`

### Achievements

Stores user achievements and milestones.

```prisma
model Achievement {
  id          String    @id @default(uuid())
  userId      String
  type        String
  title       String
  description String
  createdAt   DateTime  @default(now())
}
```

**Indexes:**
- Primary: `id`
- Foreign Key: `userId` -> `users.id`
- Index on `type` for filtering

## Common Queries

### Get User Portfolio with Positions

```typescript
const portfolio = await prisma.portfolio.findUnique({
  where: { id: portfolioId },
  include: {
    positions: true,
    trades: {
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
  },
})
```

### Get User Learning Progress

```typescript
const progress = await prisma.userLesson.findMany({
  where: { userId },
  include: {
    lesson: true,
  },
  orderBy: {
    lesson: { order: 'asc' },
  },
})
```

### Calculate Portfolio Value

```typescript
const positions = await prisma.position.findMany({
  where: { portfolioId },
})

// Then fetch current prices and calculate
```

## Database Migrations

### Running Migrations

```bash
# Create new migration
npm run db:migrate

# Apply migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

### Seeding Data

```bash
npm run db:seed
```

## Backup Strategy

1. **Automated Backups**: Daily at 2 AM UTC
2. **Retention**: 30 days
3. **Location**: AWS S3
4. **Recovery**: Point-in-time recovery enabled

## Performance Considerations

1. **Indexes**: Strategic indexes on frequently queried columns
2. **Connection Pooling**: Prisma connection pooling enabled
3. **Query Optimization**: Use `select` to limit returned fields
4. **Caching**: Redis for frequently accessed data

## Security

1. **Encryption**: Data encrypted at rest
2. **Access Control**: Row-level security policies
3. **Audit Logging**: All data modifications logged
4. **Backups**: Encrypted backups with restricted access
