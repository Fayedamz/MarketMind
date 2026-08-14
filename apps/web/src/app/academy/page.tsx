import Link from 'next/link'
import { Button } from '@/components/ui/button'

const lessons = [
  {
    id: 1,
    title: 'What Are Stocks?',
    description: 'Learn the fundamentals of stock ownership and how companies raise capital',
    difficulty: 'Beginner',
    duration: '10 min',
    category: 'Basics',
  },
  {
    id: 2,
    title: 'How Stock Markets Work',
    description: 'Understand how stock exchanges operate and how prices are determined',
    difficulty: 'Beginner',
    duration: '15 min',
    category: 'Basics',
  },
  {
    id: 3,
    title: 'Understanding P/E Ratios',
    description: 'Master one of the most important valuation metrics in investing',
    difficulty: 'Intermediate',
    duration: '12 min',
    category: 'Valuation',
  },
  {
    id: 4,
    title: 'Portfolio Diversification',
    description: 'Learn how to reduce risk through proper portfolio construction',
    difficulty: 'Intermediate',
    duration: '18 min',
    category: 'Strategy',
  },
]

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Investing Academy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Learn investing fundamentals through interactive lessons and real-world examples
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {lesson.category}
                </span>
                <span className="text-sm text-gray-500">{lesson.duration}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {lesson.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {lesson.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{lesson.difficulty}</span>
                <Link href={`/academy/${lesson.id}`}>
                  <Button size="sm">Start Lesson</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-blue-100 mb-6">
            Ask our AI tutor any questions about investing concepts
          </p>
          <Link href="/tutor">
            <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
              Chat with AI Tutor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
