import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { academyAPI } from '@/lib/api'

export function useLessons(category?: string) {
  return useQuery({
    queryKey: ['lessons', category],
    queryFn: async () => {
      const response = await academyAPI.getLessons(category)
      return response.data.lessons
    },
  })
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: async () => {
      const response = await academyAPI.getLesson(id)
      return response.data.lesson
    },
    enabled: !!id,
  })
}

export function useAcademyProgress() {
  return useQuery({
    queryKey: ['academy-progress'],
    queryFn: async () => {
      const response = await academyAPI.getProgress()
      return response.data
    },
  })
}

export function useStartLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessonId: string) => academyAPI.startLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy-progress'] })
    },
  })
}

export function useCompleteLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ lessonId, score }: { lessonId: string; score?: number }) =>
      academyAPI.completeLesson(lessonId, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy-progress'] })
    },
  })
}
