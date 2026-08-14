import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            MarketMind
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Learn the Market. Understand Your Decisions. Invest with Confidence.
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            AI-powered investing platform that makes stock markets easier to understand,
            learn, practice, and participate in.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link href="/academy">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Learning
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Explore Stocks
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <FeatureCard
              title="Learn"
              description="Interactive lessons and AI tutor to master investing fundamentals"
              icon="📚"
            />
            <FeatureCard
              title="Practice"
              description="Paper trading and virtual portfolios to build confidence"
              icon="💼"
            />
            <FeatureCard
              title="Invest"
              description="Transition to real investing when you're ready"
              icon="📈"
            />
          </div>
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
