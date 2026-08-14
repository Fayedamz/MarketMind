import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { redis } from '../lib/cache'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'checking',
      redis: 'checking',
    },
  }

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`
    health.services.database = 'ok'
  } catch (error) {
    health.services.database = 'error'
    health.status = 'degraded'
  }

  try {
    // Check Redis
    await redis.ping()
    health.services.redis = 'ok'
  } catch (error) {
    health.services.redis = 'error'
    health.status = 'degraded'
  }

  const statusCode = health.status === 'ok' ? 200 : 503
  res.status(statusCode).json(health)
})

export default router
