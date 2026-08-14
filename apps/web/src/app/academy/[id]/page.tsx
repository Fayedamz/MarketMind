'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLesson, useStartLesson, useCompleteLesson } from '@/hooks/useAcademy'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { data: lesson, isLoading } = useLesson(id)
  const startLesson = useStartLesson()
  const completeLesson = useCompleteLesson()

  useEffect(() => {
    if (isAuthenticated && lesson) {
      startLesson.mutate(id)
    }
  }, [isAuthenticated, lesson, id])

  const handleComplete = async () => {
    await completeLesson.mutateAsync({ lessonId: id, score: 100 })
    router.push('/academy')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!lesson) {
    return <div>Lesson not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/academy">
            <Button variant="ghost" className="mb-6">← Back to Academy</Button>
          </Link>

          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {lesson.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
            <p className="text-xl text-gray-600 mb-8">{lesson.description}</p>

            <div className="prose max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>

            {isAuthenticated && (
              <div className="flex gap-4">
                <Button onClick={handleComplete} size="lg" disabled={completeLesson.isPending}>
                  {completeLesson.isPending ? 'Completing...' : 'Mark as Complete'}
                </Button>
                <Link href="/academy">
                  <Button variant="outline" size="lg">Back to Lessons</Button>
                </Link>
              </div>
            )}

            {!isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <Link href="/register" className="font-medium underline">Register</Link> to track your progress
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
