import { PrismaClient } from '@prisma/client'
import { marketService } from './market.service'

const prisma = new PrismaClient()

export class PortfolioService {
  async getUserPortfolios(userId: string) {
    return prisma.portfolio.findMany({
      where: { userId },
      include: {
        positions: true,
        _count: {
          select: { trades: true },
        },
      },
    })
  }

  async getPortfolioById(portfolioId: string, userId: string) {
    const portfolio = await prisma.portfolio.findFirst({
      where: { id: portfolioId, userId },
      include: {
        positions: true,
        trades: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    })

    if (!portfolio) {
      throw new Error('Portfolio not found')
    }

    // Enrich positions with current prices
    const enrichedPositions = await Promise.all(
      portfolio.positions.map(async (position) => {
        try {
          const quote = await marketService.getStockQuote(position.symbol)
          const totalValue = position.quantity * quote.price
          const gainLoss = (quote.price - position.avgPrice) * position.quantity
          const gainLossPercent = ((quote.price - position.avgPrice) / position.avgPrice) * 100

          return {
            ...position,
            currentPrice: quote.price,
            totalValue,
            gainLoss,
            gainLossPercent,
          }
        } catch (error) {
          return {
            ...position,
            currentPrice: position.avgPrice,
            totalValue: position.quantity * position.avgPrice,
            gainLoss: 0,
            gainLossPercent: 0,
          }
        }
      })
    )

    const totalPositionsValue = enrichedPositions.reduce(
      (sum, pos) => sum + pos.totalValue,
      0
    )
    const totalValue = totalPositionsValue + portfolio.balance

    return {
      ...portfolio,
      positions: enrichedPositions,
      totalPositionsValue,
      totalValue,
    }
  }

  async createPortfolio(userId: string, name: string, type: string = 'PAPER') {
    return prisma.portfolio.create({
      data: {
        userId,
        name,
        type,
        balance: type === 'PAPER' ? 10000 : 0,
      },
    })
  }

  async executeTrade(
    portfolioId: string,
    userId: string,
    symbol: string,
    type: 'BUY' | 'SELL',
    quantity: number
  ) {
    // Verify portfolio ownership
    const portfolio = await prisma.portfolio.findFirst({
      where: { id: portfolioId, userId },
    })

    if (!portfolio) {
      throw new Error('Portfolio not found')
    }

    // Get current stock price
    const quote = await marketService.getStockQuote(symbol)
    const price = quote.price
    const total = price * quantity

    if (type === 'BUY') {
      // Check if sufficient balance
      if (portfolio.balance < total) {
        throw new Error('Insufficient balance')
      }

      // Find existing position
      const existingPosition = await prisma.position.findFirst({
        where: { portfolioId, symbol },
      })

      if (existingPosition) {
        // Update existing position
        const newQuantity = existingPosition.quantity + quantity
        const newAvgPrice =
          (existingPosition.avgPrice * existingPosition.quantity + total) / newQuantity

        await prisma.position.update({
          where: { id: existingPosition.id },
          data: {
            quantity: newQuantity,
            avgPrice: newAvgPrice,
          },
        })
      } else {
        // Create new position
        await prisma.position.create({
          data: {
            portfolioId,
            symbol,
            quantity,
            avgPrice: price,
          },
        })
      }

      // Update portfolio balance
      await prisma.portfolio.update({
        where: { id: portfolioId },
        data: { balance: portfolio.balance - total },
      })
    } else if (type === 'SELL') {
      // Find position
      const position = await prisma.position.findFirst({
        where: { portfolioId, symbol },
      })

      if (!position || position.quantity < quantity) {
        throw new Error('Insufficient shares to sell')
      }

      // Update or delete position
      if (position.quantity === quantity) {
        await prisma.position.delete({ where: { id: position.id } })
      } else {
        await prisma.position.update({
          where: { id: position.id },
          data: { quantity: position.quantity - quantity },
        })
      }

      // Update portfolio balance
      await prisma.portfolio.update({
        where: { id: portfolioId },
        data: { balance: portfolio.balance + total },
      })
    }

    // Record trade
    const trade = await prisma.trade.create({
      data: {
        portfolioId,
        symbol,
        type,
        quantity,
        price,
        total,
      },
    })

    return trade
  }

  async getPortfolioPerformance(portfolioId: string, userId: string) {
    const portfolio = await this.getPortfolioById(portfolioId, userId)
    
    const totalInvested = 10000 // Initial balance for PAPER portfolios
    const currentValue = portfolio.totalValue
    const totalReturn = currentValue - totalInvested
    const totalReturnPercent = (totalReturn / totalInvested) * 100

    return {
      totalInvested,
      currentValue,
      totalReturn,
      totalReturnPercent,
      cashBalance: portfolio.balance,
      positionsValue: portfolio.totalPositionsValue,
    }
  }
}

export const portfolioService = new PortfolioService()
