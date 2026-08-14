import { Router } from 'express'
import { z } from 'zod'
import { asyncHandler } from '../middleware/asyncHandler'
import { authService } from '../services/auth.service'
import { authenticate, AuthRequest } from '../middleware/auth.middleware'

const router = Router()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

router.post('/register', asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body)
  
  const result = await authService.register(data.email, data.password, data.name)
  
  res.status(201).json(result)
}))

router.post('/login', asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body)
  
  const result = await authService.login(data.email, data.password)
  
  res.json(result)
}))

router.get('/me', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  res.json({ user: req.user })
}))

export default router
