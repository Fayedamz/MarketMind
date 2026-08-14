import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123456', 10)
  const user = await prisma.user.create({
    data: {
      email: 'demo@marketmind.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  })
  console.log('✅ Created demo user')

  // Create demo portfolio
  const portfolio = await prisma.portfolio.create({
    data: {
      userId: user.id,
      name: 'My First Portfolio',
      type: 'PAPER',
      balance: 10000,
    },
  })
  console.log('✅ Created demo portfolio')

  // Create some positions
  await prisma.position.createMany({
    data: [
      {
        portfolioId: portfolio.id,
        symbol: 'AAPL',
        quantity: 10,
        avgPrice: 145.50,
      },
      {
        portfolioId: portfolio.id,
        symbol: 'MSFT',
        quantity: 5,
        avgPrice: 425.00,
      },
      {
        portfolioId: portfolio.id,
        symbol: 'GOOGL',
        quantity: 8,
        avgPrice: 135.00,
      },
    ],
  })
  console.log('✅ Created demo positions')

  // Create lessons
  const lessons = [
    {
      title: 'What Are Stocks?',
      description: 'Learn the fundamentals of stock ownership',
      content: 'Stock lesson content here...',
      order: 1,
      category: 'Basics',
      difficulty: 'BEGINNER',
    },
    {
      title: 'How Stock Markets Work',
      description: 'Understand how stock exchanges operate',
      content: 'Market lesson content here...',
      order: 2,
      category: 'Basics',
      difficulty: 'BEGINNER',
    },
    {
      title: 'Understanding P/E Ratios',
      description: 'Master valuation metrics',
      content: 'P/E ratio lesson content here...',
      order: 3,
      category: 'Valuation',
      difficulty: 'INTERMEDIATE',
    },
  ]

  for (const lesson of lessons) {
    await prisma.lesson.create({ data: lesson })
  }
  console.log('✅ Created lessons')

  // Create sample achievement
  await prisma.achievement.create({
    data: {
      userId: user.id,
      type: 'FIRST_TRADE',
      title: 'First Trade',
      description: 'Completed your first trade!',
    },
  })
  console.log('✅ Created achievement')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
