import { useQuery, useMutation } from '@tanstack/react-query'
import { stocksAPI } from '@/lib/api'

export function useStockQuote(symbol: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['stock-quote', symbol],
    queryFn: async () => {
      const response = await stocksAPI.getQuote(symbol)
      return response.data
    },
    enabled: enabled && !!symbol,
    refetchInterval: 60000, // Refetch every minute
  })
}

export function useStockOverview(symbol: string) {
  return useQuery({
    queryKey: ['stock-overview', symbol],
    queryFn: async () => {
      const response = await stocksAPI.getOverview(symbol)
      return response.data
    },
    enabled: !!symbol,
  })
}

export function useStockSearch(query: string) {
  return useQuery({
    queryKey: ['stock-search', query],
    queryFn: async () => {
      const response = await stocksAPI.search(query)
      return response.data.results
    },
    enabled: query.length >= 2,
  })
}

export function useStock(symbol: string) {
  return useQuery({
    queryKey: ['stock', symbol],
    queryFn: async () => {
      const response = await stocksAPI.getStock(symbol)
      return response.data
    },
    enabled: !!symbol,
  })
}
