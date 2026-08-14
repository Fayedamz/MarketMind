import { Router } from 'express'
import { z } from 'zod'
import { asyncHandler } from '../middleware/asyncHandler'
import { authenticate, AuthRequest } from '../middleware/auth.middleware'
import { portfolioService } from '../services/portfolio.service'

const router = Router()

// All portfolio routes require authentication
router.use(authenticate)

const createPortfolioSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['PAPER', 'REAL']).default('PAPER'),
})

const tradeSchema = z.object({
  symbol: z.string().min(1),
  type: z.enum(['BUY', 'SELL']),
  quantity: z.number().int().positive(),
})

// Get user portfolios
router.get('/', asyncHandler(async (req: AuthRequest, res) => {
  const portfolios = await portfolioService.getUserPortfolios(req.user!.id)
  res.json({ portfolios })
}))

// Create portfolio
router.post('/', asyncHandler(async (req: AuthRequest, res) => {
  const data = createPortfolioSchema.parse(req.body)
  const portfolio = await portfolioService.createPortfolio(
    req.user!.id,
    data.name,
    data.type
  )
  res.status(201).json({ portfolio })
}))

// Get portfolio by ID
router.get('/:id', asyncHandler(async (req: AuthRequest, res) => {
  const portfolio = await portfolioService.getPortfolioById(
    req.params.id,
    req.user!.id
  )
  res.json({ portfolio })
}))

// Get portfolio performance
router.get('/:id/performance', asyncHandler(async (req: AuthRequest, res) => {
  const performance = await portfolioService.getPortfolioPerformance(
    req.params.id,
    req.user!.id
  )
  res.json(performance)
}))

// Execute trade
router.post('/:id/trades', asyncHandler(async (req: AuthRequest, res) => {
  const data = tradeSchema.parse(req.body)
  const trade = await portfolioService.executeTrade(
    req.params.id,
    req.user!.id,
    data.symbol,
    data.type,
    data.quantity
  )
  res.status(201).json({ trade })
}))

export default router
