import { Router } from 'express'
import authRoutes from './auth'
import userRoutes from './users'
import stockRoutes from './stocks'
import portfolioRoutes from './portfolios'
import academyRoutes from './academy'
import aiRoutes from './ai'
import healthRoutes from './health'

const router = Router()

router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/stocks', stockRoutes)
router.use('/portfolios', portfolioRoutes)
router.use('/academy', academyRoutes)
router.use('/ai', aiRoutes)

export default router
