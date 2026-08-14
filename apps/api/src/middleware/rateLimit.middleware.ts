import { Request, Response, NextFunction } from 'express'
import { redis } from '../lib/cache'

interface RateLimitOptions {
  windowMs: number
  maxRequests: number
}

export function rateLimit(options: RateLimitOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.socket.remoteAddress || 'unknown'
      const key = `ratelimit:${ip}`
      
      const current = await redis.incr(key)
      
      if (current === 1) {
        await redis.pexpire(key, options.windowMs)
      }
      
      if (current > options.maxRequests) {
        return res.status(429).json({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
        })
      }
      
      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', options.maxRequests)
      res.setHeader('X-RateLimit-Remaining', Math.max(0, options.maxRequests - current))
      
      next()
    } catch (error) {
      // If rate limiting fails, allow the request
      next()
    }
  }
}

// Preset rate limiters
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
})

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
})

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
})
