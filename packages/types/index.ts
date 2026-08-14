// User Types
export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

// Portfolio Types
export enum PortfolioType {
  PAPER = 'PAPER',
  REAL = 'REAL',
}

export interface Portfolio {
  id: string
  userId: string
  name: string
  type: PortfolioType
  balance: number
  createdAt: Date
  updatedAt: Date
  positions?: Position[]
}

export interface Position {
  id: string
  portfolioId: string
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice?: number
  totalValue?: number
  gainLoss?: number
  gainLossPercent?: number
}

export interface Trade {
  id: string
  portfolioId: string
  symbol: string
  type: 'BUY' | 'SELL'
  quantity: number
  price: number
  total: number
  createdAt: Date
}

// Stock Types
export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap?: number
  volume?: number
  pe?: number
  eps?: number
  high52Week?: number
  low52Week?: number
}

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  timestamp: Date
}

export interface CompanyProfile {
  symbol: string
  name: string
  description: string
  industry: string
  sector: string
  ceo: string
  employees: number
  website: string
  logo?: string
}

// Lesson Types
export enum LessonDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface Lesson {
  id: string
  title: string
  description: string
  content: string
  order: number
  category: string
  difficulty: LessonDifficulty
  duration?: number
  createdAt: Date
  updatedAt: Date
}

export interface UserLesson {
  id: string
  userId: string
  lessonId: string
  completed: boolean
  score?: number
  completedAt?: Date
}

// AI Types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
}

export interface AIExplanation {
  symbol: string
  explanation: string
  factors: string[]
  sentiment?: 'positive' | 'negative' | 'neutral'
}

// Achievement Types
export interface Achievement {
  id: string
  userId: string
  type: string
  title: string
  description: string
  createdAt: Date
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
