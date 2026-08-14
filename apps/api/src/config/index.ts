import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: parseInt(process.env.API_PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-4-turbo-preview',
  },
  
  alphaVantage: {
    apiKey: process.env.ALPHA_VANTAGE_API_KEY || 'demo',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
}

// Validate required configs
export function validateConfig() {
  const required = ['DATABASE_URL', 'JWT_SECRET']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
