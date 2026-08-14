import axios from 'axios'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

// Alpha Vantage API
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo'
const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query'

// Cache TTL
const QUOTE_CACHE_TTL = 60 // 1 minute
const COMPANY_CACHE_TTL = 3600 // 1 hour

export class MarketService {
  async getStockQuote(symbol: string) {
    const cacheKey = `quote:${symbol}`
    
    // Check cache
    const cached = await redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    try {
      // Fetch from Alpha Vantage
      const response = await axios.get(ALPHA_VANTAGE_BASE, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: ALPHA_VANTAGE_KEY,
        },
      })

      const quote = response.data['Global Quote']
      if (!quote || !quote['05. price']) {
        throw new Error('Stock not found')
      }

      const data = {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        latestTradingDay: quote['07. latest trading day'],
        previousClose: parseFloat(quote['08. previous close']),
      }

      // Cache result
      await redis.setex(cacheKey, QUOTE_CACHE_TTL, JSON.stringify(data))

      return data
    } catch (error) {
      // Return mock data if API fails (for demo purposes)
      return this.getMockQuote(symbol)
    }
  }

  async getCompanyOverview(symbol: string) {
    const cacheKey = `company:${symbol}`
    
    // Check cache
    const cached = await redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE, {
        params: {
          function: 'OVERVIEW',
          symbol,
          apikey: ALPHA_VANTAGE_KEY,
        },
      })

      const overview = response.data
      if (!overview.Symbol) {
        throw new Error('Company not found')
      }

      const data = {
        symbol: overview.Symbol,
        name: overview.Name,
        description: overview.Description,
        sector: overview.Sector,
        industry: overview.Industry,
        marketCap: parseInt(overview.MarketCapitalization) || 0,
        peRatio: parseFloat(overview.PERatio) || 0,
        eps: parseFloat(overview.EPS) || 0,
        dividendYield: parseFloat(overview.DividendYield) || 0,
        week52High: parseFloat(overview['52WeekHigh']) || 0,
        week52Low: parseFloat(overview['52WeekLow']) || 0,
      }

      // Cache result
      await redis.setex(cacheKey, COMPANY_CACHE_TTL, JSON.stringify(data))

      return data
    } catch (error) {
      return this.getMockCompany(symbol)
    }
  }

  async searchStocks(query: string) {
    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: query,
          apikey: ALPHA_VANTAGE_KEY,
        },
      })

      const matches = response.data.bestMatches || []
      return matches.slice(0, 10).map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        currency: match['8. currency'],
      }))
    } catch (error) {
      return []
    }
  }

  async getIntradayData(symbol: string, interval: string = '5min') {
    const cacheKey = `intraday:${symbol}:${interval}`
    
    const cached = await redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE, {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol,
          interval,
          apikey: ALPHA_VANTAGE_KEY,
        },
      })

      const timeSeries = response.data[`Time Series (${interval})`]
      if (!timeSeries) {
        throw new Error('No data available')
      }

      const data = Object.entries(timeSeries).slice(0, 100).map(([timestamp, values]: [string, any]) => ({
        timestamp,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      }))

      await redis.setex(cacheKey, 300, JSON.stringify(data)) // 5 min cache

      return data
    } catch (error) {
      return []
    }
  }

  private getMockQuote(symbol: string) {
    const basePrice = Math.random() * 500 + 50
    const change = (Math.random() - 0.5) * 10
    return {
      symbol: symbol.toUpperCase(),
      price: parseFloat(basePrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(((change / basePrice) * 100).toFixed(2)),
      volume: Math.floor(Math.random() * 10000000),
      latestTradingDay: new Date().toISOString().split('T')[0],
      previousClose: parseFloat((basePrice - change).toFixed(2)),
    }
  }

  private getMockCompany(symbol: string) {
    return {
      symbol: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Company`,
      description: 'Company description not available',
      sector: 'Technology',
      industry: 'Software',
      marketCap: Math.floor(Math.random() * 1000000000000),
      peRatio: Math.random() * 50,
      eps: Math.random() * 10,
      dividendYield: Math.random() * 5,
      week52High: Math.random() * 500,
      week52Low: Math.random() * 200,
    }
  }
}

export const marketService = new MarketService()
