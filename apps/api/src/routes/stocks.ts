import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { marketService } from '../services/market.service'

const router = Router()

// Search stocks (must be before /:symbol to avoid conflict)
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query
  
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter required' })
  }
  
  const results = await marketService.searchStocks(q)
  res.json({ results })
}))

// Get stock quote
router.get('/:symbol/quote', asyncHandler(async (req, res) => {
  const { symbol } = req.params
  
  const quote = await marketService.getStockQuote(symbol)
  res.json(quote)
}))

// Get company overview
router.get('/:symbol/overview', asyncHandler(async (req, res) => {
  const { symbol } = req.params
  
  const overview = await marketService.getCompanyOverview(symbol)
  res.json(overview)
}))

// Get intraday data
router.get('/:symbol/intraday', asyncHandler(async (req, res) => {
  const { symbol } = req.params
  const { interval } = req.query
  
  const data = await marketService.getIntradayData(
    symbol,
    (interval as string) || '5min'
  )
  res.json({ data })
}))

// Get stock by symbol (combined quote + overview)
router.get('/:symbol', asyncHandler(async (req, res) => {
  const { symbol } = req.params
  
  const [quote, overview] = await Promise.all([
    marketService.getStockQuote(symbol),
    marketService.getCompanyOverview(symbol),
  ])
  
  res.json({ ...quote, ...overview })
}))

export default router
