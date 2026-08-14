import { Router } from 'express'
import { z } from 'zod'
import { asyncHandler } from '../middleware/asyncHandler'
import { authenticate, AuthRequest } from '../middleware/auth.middleware'
import { academyService } from '../services/academy.service'

const router = Router()

const completeLessonSchema = z.object({
  score: z.number().min(0).max(100).optional(),
})

// Get all lessons
router.get('/lessons', asyncHandler(async (req, res) => {
  const { category } = req.query
  
  let lessons
  if (category && typeof category === 'string') {
    lessons = await academyService.getLessonsByCategory(category)
  } else {
    lessons = await academyService.getAllLessons()
  }
  
  res.json({ lessons })
}))

// Get lesson categories
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await academyService.getCategories()
  res.json({ categories })
}))

// Get lesson by ID
router.get('/lessons/:id', asyncHandler(async (req, res) => {
  const lesson = await academyService.getLessonById(req.params.id)
  res.json({ lesson })
}))

// Get user progress (requires auth)
router.get('/progress', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const progress = await academyService.getUserProgress(req.user!.id)
  res.json(progress)
}))

// Start lesson (requires auth)
router.post('/lessons/:id/start', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const userLesson = await academyService.startLesson(req.user!.id, req.params.id)
  res.json({ userLesson })
}))

// Complete lesson (requires auth)
router.post('/lessons/:id/complete', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const data = completeLessonSchema.parse(req.body)
  const userLesson = await academyService.completeLesson(
    req.user!.id,
    req.params.id,
    data.score
  )
  res.json({ userLesson })
}))

export default router
