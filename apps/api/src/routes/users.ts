import { Router } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { asyncHandler } from '../middleware/asyncHandler'
import { authenticate, AuthRequest } from '../middleware/auth.middleware'

const router = Router()
const prisma = new PrismaClient()

// All user routes require authentication
router.use(authenticate)

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
})

// Get user profile
router.get('/profile', asyncHandler(async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  })
  
  res.json({ user })
}))

// Update user profile
router.patch('/profile', asyncHandler(async (req: AuthRequest, res) => {
  const data = updateProfileSchema.parse(req.body)
  
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
    },
  })
  
  res.json({ user })
}))

// Get user achievements
router.get('/achievements', asyncHandler(async (req: AuthRequest, res) => {
  const achievements = await prisma.achievement.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  })
  
  res.json({ achievements })
}))

export default router
