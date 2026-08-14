import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { z } from 'zod'
import { authenticate, AuthRequest } from '../middleware/auth.middleware'
import { aiService } from '../services/ai.service'
import { marketService } from '../services/market.service'
import { portfolioService } from '../services/portfolio.service'

const router = Router()

const chatSchema = z.object({
  message: z.string(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })).optional(),
  userLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
})

// AI Chat endpoint
router.post('/chat', asyncHandler(async (req, res) => {
  const { message, conversationHistory, userLevel } = chatSchema.parse(req.body)
  
  const result = await aiService.chatWithTutor(message, conversationHistory, userLevel)
  res.json(result)
}))

// Explain stock movement
router.get('/explain/:symbol', asyncHandler(async (req, res) => {
  const { symbol } = req.params
  
  const quote = await marketService.getStockQuote(symbol)
  const explanation = await aiService.explainStockMovement(
    symbol,
    quote.change,
    quote.changePercent
  )
  
  res.json(explanation)
}))

// Analyze company
router.get('/analyze/:symbol', asyncHandler(async (req, res) => {
  const { symbol } = req.params
  
  const companyData = await marketService.getCompanyOverview(symbol)
  const analysis = await aiService.analyzeCompany(symbol, companyData)
  
  res.json(analysis)
}))

// Explain portfolio (requires auth)
router.get('/portfolio/:id', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const portfolio = await portfolioService.getPortfolioById(
    req.params.id,
    req.user!.id
  )
  
  const insights = await aiService.explainPortfolio(portfolio)
  res.json(insights)
}))

export default router
