import { useMutation, useQuery } from '@tanstack/react-query'
import { aiAPI } from '@/lib/api'

export function useAIChat() {
  return useMutation({
    mutationFn: ({
      message,
      conversationHistory,
      userLevel,
    }: {
      message: string
      conversationHistory?: any[]
      userLevel?: string
    }) => aiAPI.chat(message, conversationHistory, userLevel),
  })
}

export function useStockExplanation(symbol: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['stock-explanation', symbol],
    queryFn: async () => {
      const response = await aiAPI.explainStock(symbol)
      return response.data
    },
    enabled: enabled && !!symbol,
  })
}

export function useCompanyAnalysis(symbol: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['company-analysis', symbol],
    queryFn: async () => {
      const response = await aiAPI.analyzeCompany(symbol)
      return response.data
    },
    enabled: enabled && !!symbol,
  })
}

export function usePortfolioInsights(portfolioId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['portfolio-insights', portfolioId],
    queryFn: async () => {
      const response = await aiAPI.explainPortfolio(portfolioId)
      return response.data
    },
    enabled: enabled && !!portfolioId,
  })
}
