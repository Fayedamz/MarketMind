import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { portfolioAPI } from '@/lib/api'

export function usePortfolios() {
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: async () => {
      const response = await portfolioAPI.getAll()
      return response.data.portfolios
    },
  })
}

export function usePortfolio(id: string) {
  return useQuery({
    queryKey: ['portfolio', id],
    queryFn: async () => {
      const response = await portfolioAPI.getById(id)
      return response.data.portfolio
    },
    enabled: !!id,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export function usePortfolioPerformance(id: string) {
  return useQuery({
    queryKey: ['portfolio-performance', id],
    queryFn: async () => {
      const response = await portfolioAPI.getPerformance(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, type }: { name: string; type: 'PAPER' | 'REAL' }) =>
      portfolioAPI.create(name, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] })
    },
  })
}

export function useExecuteTrade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      portfolioId,
      symbol,
      type,
      quantity,
    }: {
      portfolioId: string
      symbol: string
      type: 'BUY' | 'SELL'
      quantity: number
    }) => portfolioAPI.executeTrade(portfolioId, symbol, type, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', variables.portfolioId] })
      queryClient.invalidateQueries({ queryKey: ['portfolios'] })
    },
  })
}
