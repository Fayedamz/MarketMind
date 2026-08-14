import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class AcademyService {
  async getAllLessons() {
    return prisma.lesson.findMany({
      orderBy: { order: 'asc' },
    })
  }

  async getLessonById(lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    })

    if (!lesson) {
      throw new Error('Lesson not found')
    }

    return lesson
  }

  async getLessonsByCategory(category: string) {
    return prisma.lesson.findMany({
      where: { category },
      orderBy: { order: 'asc' },
    })
  }

  async getUserProgress(userId: string) {
    const userLessons = await prisma.userLesson.findMany({
      where: { userId },
      include: { lesson: true },
      orderBy: { lesson: { order: 'asc' } },
    })

    const totalLessons = await prisma.lesson.count()
    const completedLessons = userLessons.filter((ul) => ul.completed).length
    const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

    return {
      userLessons,
      totalLessons,
      completedLessons,
      progressPercent,
    }
  }

  async startLesson(userId: string, lessonId: string) {
    // Check if user lesson already exists
    const existing = await prisma.userLesson.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    })

    if (existing) {
      return existing
    }

    // Create new user lesson
    return prisma.userLesson.create({
      data: {
        userId,
        lessonId,
        completed: false,
      },
    })
  }

  async completeLesson(userId: string, lessonId: string, score?: number) {
    const userLesson = await prisma.userLesson.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    })

    if (!userLesson) {
      throw new Error('Lesson not started')
    }

    const updated = await prisma.userLesson.update({
      where: { id: userLesson.id },
      data: {
        completed: true,
        score,
        completedAt: new Date(),
      },
    })

    // Award achievement for first lesson
    const completedCount = await prisma.userLesson.count({
      where: { userId, completed: true },
    })

    if (completedCount === 1) {
      await this.awardAchievement(userId, 'FIRST_LESSON', 'First Steps', 'Completed your first lesson!')
    }

    // Award achievement for completing 10 lessons
    if (completedCount === 10) {
      await this.awardAchievement(userId, 'TEN_LESSONS', 'Learning Journey', 'Completed 10 lessons!')
    }

    return updated
  }

  async getCategories() {
    const lessons = await prisma.lesson.findMany({
      select: { category: true },
      distinct: ['category'],
    })

    return lessons.map((l) => l.category)
  }

  private async awardAchievement(userId: string, type: string, title: string, description: string) {
    const existing = await prisma.achievement.findFirst({
      where: { userId, type },
    })

    if (!existing) {
      await prisma.achievement.create({
        data: {
          userId,
          type,
          title,
          description,
        },
      })
    }
  }
}

export const academyService = new AcademyService()
