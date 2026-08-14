import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-demo',
})

const AI_MODEL = process.env.AI_MODEL || 'gpt-4-turbo-preview'

export class AIService {
  async chatWithTutor(
    message: string,
    conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [],
    userLevel: string = 'beginner'
  ) {
    const systemPrompt = this.getSystemPrompt(userLevel)

    try {
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      return {
        response: response.choices[0].message.content,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      // Fallback response if API fails
      return {
        response: this.getFallbackResponse(message),
        timestamp: new Date().toISOString(),
      }
    }
  }

  async explainStockMovement(symbol: string, priceChange: number, changePercent: number) {
    const prompt = `Explain why stock ${symbol} moved ${changePercent >= 0 ? 'up' : 'down'} by ${Math.abs(changePercent).toFixed(2)}% (${priceChange >= 0 ? '+' : ''}$${priceChange.toFixed(2)}). Provide a brief, educational explanation focusing on general market factors that could cause such movement. Keep it under 150 words and beginner-friendly.`

    try {
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a financial educator helping beginners understand stock market movements. Provide clear, educational explanations without making specific predictions or investment advice.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      })

      return {
        symbol,
        explanation: response.choices[0].message.content,
        factors: this.extractFactors(response.choices[0].message.content || ''),
        sentiment: changePercent >= 0 ? 'positive' : 'negative',
      }
    } catch (error) {
      return {
        symbol,
        explanation: `${symbol} experienced a ${Math.abs(changePercent).toFixed(2)}% ${changePercent >= 0 ? 'increase' : 'decrease'}. Stock prices can move due to company news, earnings reports, market trends, economic indicators, or investor sentiment. This movement reflects the collective decisions of market participants.`,
        factors: ['Market Activity', 'Investor Sentiment', 'General Market Trends'],
        sentiment: changePercent >= 0 ? 'positive' : 'negative',
      }
    }
  }

  async analyzeCompany(symbol: string, companyData: any) {
    const prompt = `Provide a beginner-friendly analysis of ${symbol} (${companyData.name}). Sector: ${companyData.sector}. P/E Ratio: ${companyData.peRatio}. Market Cap: $${(companyData.marketCap / 1e9).toFixed(2)}B. Explain what these metrics mean and whether they suggest the company is growing, stable, or facing challenges. Keep it educational and under 200 words.`

    try {
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a financial educator helping beginners understand company analysis. Explain financial metrics in simple terms without giving specific investment advice.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 250,
      })

      return {
        symbol,
        analysis: response.choices[0].message.content,
      }
    } catch (error) {
      return {
        symbol,
        analysis: `${companyData.name} operates in the ${companyData.sector} sector. The company's financial metrics provide insights into its valuation and performance. Consider reviewing earnings reports, growth trends, and competitive position for a complete picture.`,
      }
    }
  }

  async explainPortfolio(portfolioData: any) {
    const positions = portfolioData.positions || []
    const topGainer = positions.reduce((max: any, pos: any) => 
      pos.gainLossPercent > (max?.gainLossPercent || -Infinity) ? pos : max, null
    )
    const topLoser = positions.reduce((min: any, pos: any) => 
      pos.gainLossPercent < (min?.gainLossPercent || Infinity) ? pos : min, null
    )

    const prompt = `Analyze this portfolio: Total value $${portfolioData.totalValue.toFixed(2)}, ${positions.length} positions. Top performer: ${topGainer?.symbol} (+${topGainer?.gainLossPercent.toFixed(2)}%). Worst performer: ${topLoser?.symbol} (${topLoser?.gainLossPercent.toFixed(2)}%). Provide educational insights about portfolio diversification and performance. Keep it under 150 words.`

    try {
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a financial educator helping users understand their portfolio performance and diversification principles.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      })

      return {
        insights: response.choices[0].message.content,
        topPerformer: topGainer,
        worstPerformer: topLoser,
      }
    } catch (error) {
      return {
        insights: 'Your portfolio shows a mix of performing assets. Diversification across different sectors and asset types can help manage risk. Consider reviewing each position regularly and understanding why stocks perform differently.',
        topPerformer: topGainer,
        worstPerformer: topLoser,
      }
    }
  }

  private getSystemPrompt(userLevel: string): string {
    const basePrompt = `You are MarketMind's AI Investment Tutor. Your role is to help users learn about investing through clear, educational explanations. 

Guidelines:
- Explain concepts in simple, beginner-friendly language
- Use real-world examples and analogies
- Never provide specific investment advice or recommendations
- Focus on financial education and understanding
- Encourage learning and critical thinking
- Be supportive and patient
- Keep responses concise (under 200 words unless asked for detail)`

    const levelPrompts = {
      beginner: '\n- Assume little to no prior knowledge\n- Define financial terms when you use them\n- Use everyday analogies',
      intermediate: '\n- Assume basic knowledge of stocks and markets\n- Can use common financial terms with brief context\n- Provide slightly more technical detail',
      advanced: '\n- Assume solid understanding of markets\n- Can use technical terms freely\n- Focus on deeper analysis and nuanced concepts',
    }

    return basePrompt + (levelPrompts[userLevel as keyof typeof levelPrompts] || levelPrompts.beginner)
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('p/e ratio') || lowerMessage.includes('pe ratio')) {
      return 'The P/E (Price-to-Earnings) ratio compares a stock\'s price to its earnings per share. A lower P/E might suggest a stock is undervalued, while a higher P/E might indicate growth expectations. However, P/E ratios should be compared within the same industry, as different sectors have different typical ranges.'
    }

    if (lowerMessage.includes('dividend')) {
      return 'Dividends are payments companies make to shareholders from their profits. They\'re like a "thank you" for owning the stock. Not all companies pay dividends - some prefer to reinvest profits for growth. Dividend-paying stocks can provide regular income, but dividends aren\'t guaranteed and can be reduced or eliminated.'
    }

    if (lowerMessage.includes('diversif')) {
      return 'Diversification means spreading your investments across different stocks, sectors, or asset types. The idea is "don\'t put all your eggs in one basket." If one investment performs poorly, others might do well, helping to balance your overall portfolio. It\'s a key strategy for managing risk.'
    }

    if (lowerMessage.includes('market cap')) {
      return 'Market capitalization (market cap) is the total value of all a company\'s shares. It\'s calculated by multiplying the stock price by the number of shares. Companies are often categorized as small-cap, mid-cap, or large-cap. Market cap helps investors understand a company\'s size and investment characteristics.'
    }

    return 'That\'s a great question about investing! I\'m here to help you learn. Could you rephrase or ask about specific topics like stocks, P/E ratios, dividends, diversification, or market basics? I\'m designed to make investing concepts easier to understand.'
  }

  private extractFactors(explanation: string): string[] {
    const factors: string[] = []
    const keywords = {
      'earnings': 'Earnings Reports',
      'revenue': 'Revenue Performance',
      'market': 'Market Conditions',
      'economy': 'Economic Factors',
      'interest': 'Interest Rates',
      'sentiment': 'Investor Sentiment',
      'news': 'Company News',
      'sector': 'Sector Trends',
    }

    for (const [keyword, factor] of Object.entries(keywords)) {
      if (explanation.toLowerCase().includes(keyword)) {
        factors.push(factor)
      }
    }

    return factors.length > 0 ? factors : ['Market Activity', 'General Trends']
  }
}

export const aiService = new AIService()
