'use client'

import { use } from 'react'
import { useStock } from '@/hooks/useStocks'
import { useStockExplanation } from '@/hooks/useAI'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPercent, formatNumber } from '@marketmind/utils'
import Link from 'next/link'

export default function StockDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params)
  const { data: stock, isLoading } = useStock(symbol.toUpperCase())
  const { data: explanation } = useStockExplanation(symbol.toUpperCase(), !!stock)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stock data...</p>
        </div>
      </div>
    )
  }

  if (!stock) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-900 mb-4">Stock not found</p>
          <Link href="/explore">
            <Button>Back to Explore</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isPositive = stock.change >= 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/explore">
              <Button variant="ghost">← Back</Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{stock.symbol}</h1>
          <p className="text-xl text-gray-600">{stock.name}</p>
        </div>

        {/* Price Card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-5xl font-bold text-gray-900 mb-2">
                {formatCurrency(stock.price)}
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xl font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {formatCurrency(stock.change)}
                </span>
                <span
                  className={`text-xl font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  ({formatPercent(stock.changePercent)})
                </span>
              </div>
            </div>
            <Link href={`/trade/${symbol}`}>
              <Button size="lg">Trade</Button>
            </Link>
          </div>
        </div>

        {/* AI Explanation */}
        {explanation && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">AI Analysis</h2>
            <p className="text-purple-100 mb-4">{explanation.explanation}</p>
            {explanation.factors && explanation.factors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {explanation.factors.map((factor: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/20 rounded-full text-sm"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Company Info */}
        {stock.description && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {stock.name}</h2>
            <p className="text-gray-700 mb-6">{stock.description}</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <InfoItem label="Sector" value={stock.sector || 'N/A'} />
              <InfoItem label="Industry" value={stock.industry || 'N/A'} />
              <InfoItem label="Market Cap" value={formatNumber(stock.marketCap || 0)} />
              <InfoItem label="P/E Ratio" value={stock.peRatio?.toFixed(2) || 'N/A'} />
              <InfoItem label="EPS" value={stock.eps?.toFixed(2) || 'N/A'} />
              <InfoItem label="Dividend Yield" value={stock.dividendYield ? `${(stock.dividendYield * 100).toFixed(2)}%` : 'N/A'} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  )
}
