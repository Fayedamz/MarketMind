import Link from 'next/link'
import { formatCurrency, formatPercent } from '@marketmind/utils'

interface StockCardProps {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

export function StockCard({ symbol, name, price, change, changePercent }: StockCardProps) {
  const isPositive = change >= 0

  return (
    <Link href={`/stock/${symbol}`}>
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{symbol}</h3>
            <p className="text-sm text-gray-600 truncate">{name}</p>
          </div>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {formatPercent(changePercent)}
          </span>
        </div>

        <div className="mb-2">
          <span className="text-3xl font-bold text-gray-900">{formatCurrency(price)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? '↑' : '↓'} {formatCurrency(Math.abs(change))}
          </span>
        </div>
      </div>
    </Link>
  )
}
