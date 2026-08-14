import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  getMe: () => api.get('/auth/me'),
}

// Stocks API
export const stocksAPI = {
  search: (query: string) => api.get(`/stocks/search?q=${query}`),
  
  getQuote: (symbol: string) => api.get(`/stocks/${symbol}/quote`),
  
  getOverview: (symbol: string) => api.get(`/stocks/${symbol}/overview`),
  
  getStock: (symbol: string) => api.get(`/stocks/${symbol}`),
  
  getIntraday: (symbol: string, interval: string = '5min') =>
    api.get(`/stocks/${symbol}/intraday?interval=${interval}`),
}

// Portfolio API
export const portfolioAPI = {
  getAll: () => api.get('/portfolios'),
  
  getById: (id: string) => api.get(`/portfolios/${id}`),
  
  create: (name: string, type: 'PAPER' | 'REAL' = 'PAPER') =>
    api.post('/portfolios', { name, type }),
  
  getPerformance: (id: string) => api.get(`/portfolios/${id}/performance`),
  
  executeTrade: (id: string, symbol: string, type: 'BUY' | 'SELL', quantity: number) =>
    api.post(`/portfolios/${id}/trades`, { symbol, type, quantity }),
}

// Academy API
export const academyAPI = {
  getLessons: (category?: string) =>
    api.get(`/academy/lessons${category ? `?category=${category}` : ''}`),
  
  getLesson: (id: string) => api.get(`/academy/lessons/${id}`),
  
  getCategories: () => api.get('/academy/categories'),
  
  getProgress: () => api.get('/academy/progress'),
  
  startLesson: (id: string) => api.post(`/academy/lessons/${id}/start`),
  
  completeLesson: (id: string, score?: number) =>
    api.post(`/academy/lessons/${id}/complete`, { score }),
}

// AI API
export const aiAPI = {
  chat: (message: string, conversationHistory?: any[], userLevel: string = 'beginner') =>
    api.post('/ai/chat', { message, conversationHistory, userLevel }),
  
  explainStock: (symbol: string) => api.get(`/ai/explain/${symbol}`),
  
  analyzeCompany: (symbol: string) => api.get(`/ai/analyze/${symbol}`),
  
  explainPortfolio: (portfolioId: string) => api.get(`/ai/portfolio/${portfolioId}`),
}

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (name: string) => api.patch('/users/profile', { name }),
  
  getAchievements: () => api.get('/users/achievements'),
}

export default api
