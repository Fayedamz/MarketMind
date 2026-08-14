'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStock } from '@/hooks/useStocks'
import { usePortfolios, useExecuteTrade } from '@/hooks/usePortfolio'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@marketmind/utils'
import Link from 'next/link'

export default function TradePage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params)
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { data: stock, isLoading: stockLoading } = useStock(symbol.toUpperCase())
  const { data: portfolios } = usePortfolios()
  const executeTrade = useExecuteTrade()

  const [selectedPortfolio, setSelectedPortfolio] = useState('')
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (portfolios && portfolios.length > 0 && !selectedPortfolio) {
      setSelectedPortfolio(portfolios[0].id)
    }
  }, [portfolios, selectedPortfolio])

  if (stockLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!stock) {
    return <div>Stock not found</div>
  }

  const total = stock.price * quantity

  const handleTrade = async () => {
    if (!selectedPortfolio) {
      setError('Please select a portfolio')
      return
    }

    if (quantity <= 0) {
      setError('Quantity must be greater than 0')
      return
    }

    try {
      await executeTrade.mutateAsync({
        portfolioId: selectedPortfolio,
        symbol: symbol.toUpperCase(),
        type: tradeType,
        quantity,
      })

      router.push('/portfolio')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Trade failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href={`/stock/${symbol}`}>
              <Button variant="ghost">← Back to {symbol}</Button>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Trade {stock.symbol}</h1>

            {/* Stock Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Current Price</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stock.price)}</p>
            </div>

            {/* Trade Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trade Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTradeType('BUY')}
                  className={`p-4 rounded-lg border-2 font-medium transition-colors ${
                    tradeType === 'BUY'
                      ? 'border-green-600 bg-green-50 text-green-900'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType('SELL')}
                  className={`p-4 rounded-lg border-2 font-medium transition-colors ${
                    tradeType === 'SELL'
                      ? 'border-red-600 bg-red-50 text-red-900'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            {/* Portfolio Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio
              </label>
              <select
                value={selectedPortfolio}
                onChange={(e) => setSelectedPortfolio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {portfolios?.map((portfolio: any) => (
                  <option key={portfolio.id} value={portfolio.id}>
                    {portfolio.name} - {formatCurrency(portfolio.balance)}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Total */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              onClick={handleTrade}
              className="w-full"
              size="lg"
              disabled={executeTrade.isPending}
            >
              {executeTrade.isPending
                ? 'Processing...'
                : `${tradeType} ${quantity} ${quantity === 1 ? 'Share' : 'Shares'}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
