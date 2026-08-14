'use client'

import { useState } from 'react'
import { useStockSearch } from '@/hooks/useStocks'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: searchResults } = useStockSearch(searchQuery)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Stocks
          </h1>
          <p className="text-xl text-gray-600">
            Search and analyze companies with AI-powered insights
          </p>
        </div>

        <div className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search for a company or ticker symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button size="lg">Search</Button>
          </div>
        </div>

        {searchResults && searchResults.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((stock: any) => (
                <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <h3 className="text-xl font-bold text-gray-900">{stock.symbol}</h3>
                    <p className="text-sm text-gray-600 truncate">{stock.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <h2 className="col-span-full text-xl font-semibold text-gray-900 mb-4">
              Popular Stocks
            </h2>
            <StockCard
              symbol="AAPL"
              name="Apple Inc."
              price={150.25}
              change={2.5}
              changePercent={1.69}
            />
            <StockCard
              symbol="MSFT"
              name="Microsoft Corporation"
              price={420.15}
              change={-3.25}
              changePercent={-0.77}
            />
            <StockCard
              symbol="GOOGL"
              name="Alphabet Inc."
              price={138.50}
              change={1.75}
              changePercent={1.28}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function StockCard({
  symbol,
  name,
  price,
  change,
  changePercent,
}: {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}) {
  const isPositive = change >= 0

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{symbol}</h3>
          <p className="text-sm text-gray-600">{name}</p>
        </div>
      </div>

      <div className="mb-2">
        <span className="text-3xl font-bold text-gray-900">
          ${price.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? '+' : ''}
          {change.toFixed(2)} ({changePercent.toFixed(2)}%)
        </span>
      </div>
    </div>
  )
}
