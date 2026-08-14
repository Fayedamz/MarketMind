'use client'

import { useEffect, useState } from 'react'
import { usePortfolios, usePortfolio } from '@/hooks/usePortfolio'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPercent } from '@marketmind/utils'

export default function PortfolioPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { data: portfolios, isLoading } = usePortfolios()
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>()
  const { data: portfolio } = usePortfolio(selectedPortfolioId!)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (portfolios && portfolios.length > 0 && !selectedPortfolioId) {
      setSelectedPortfolioId(portfolios[0].id)
    }
  }, [portfolios, selectedPortfolioId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return <div>No portfolio found</div>
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Portfolio
            </h1>
            <p className="text-xl text-gray-600">
              Practice trading with virtual money
            </p>
          </div>
          <Button size="lg">New Trade</Button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            label="Portfolio Value"
            value={formatCurrency(portfolio.totalValue || 0)}
            change={formatPercent(((portfolio.totalValue || 0) - 10000) / 10000 * 100)}
            isPositive={(portfolio.totalValue || 0) >= 10000}
          />
          <SummaryCard
            label="Cash Balance"
            value={formatCurrency(portfolio.balance)}
            change=""
            isPositive={true}
          />
          <SummaryCard
            label="Total Gain/Loss"
            value={formatCurrency((portfolio.totalValue || 0) - 10000)}
            change={formatPercent(((portfolio.totalValue || 0) - 10000) / 10000 * 100)}
            isPositive={(portfolio.totalValue || 0) >= 10000}
          />
          <SummaryCard
            label="Positions"
            value={portfolio.positions?.length.toString() || '0'}
            change=""
            isPositive={true}
          />
        </div>

        {/* Holdings */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Holdings</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Symbol</th>
                  <th className="text-left py-3 px-4">Shares</th>
                  <th className="text-left py-3 px-4">Avg Price</th>
                  <th className="text-left py-3 px-4">Current Price</th>
                  <th className="text-left py-3 px-4">Total Value</th>
                  <th className="text-left py-3 px-4">Gain/Loss</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.positions && portfolio.positions.length > 0 ? (
                  portfolio.positions.map((position: any) => (
                    <HoldingRow
                      key={position.id}
                      symbol={position.symbol}
                      shares={position.quantity}
                      avgPrice={position.avgPrice}
                      currentPrice={position.currentPrice || position.avgPrice}
                      totalValue={position.totalValue || position.quantity * position.avgPrice}
                      gainLoss={position.gainLoss || 0}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No positions yet. Start trading to build your portfolio!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Portfolio Insights</h2>
          <p className="text-purple-100 mb-6">
            Get AI-powered analysis of your portfolio performance and suggestions
          </p>
          <Button variant="outline" className="bg-white text-purple-600 hover:bg-purple-50">
            View Insights
          </Button>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  change,
  isPositive,
}: {
  label: string
  value: string
  change: string
  isPositive: boolean
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {change && (
        <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </p>
      )}
    </div>
  )
}

function HoldingRow({
  symbol,
  shares,
  avgPrice,
  currentPrice,
  totalValue,
  gainLoss,
}: {
  symbol: string
  shares: number
  avgPrice: number
  currentPrice: number
  totalValue: number
  gainLoss: number
}) {
  const isPositive = gainLoss >= 0

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4 font-semibold">{symbol}</td>
      <td className="py-3 px-4">{shares}</td>
      <td className="py-3 px-4">${avgPrice.toFixed(2)}</td>
      <td className="py-3 px-4">${currentPrice.toFixed(2)}</td>
      <td className="py-3 px-4">${totalValue.toFixed(2)}</td>
      <td className={`py-3 px-4 font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}${gainLoss.toFixed(2)}
      </td>
    </tr>
  )
}
