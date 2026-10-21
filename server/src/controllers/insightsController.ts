import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'

export async function getInsightsOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id

    const [projects, tasks, focusSessions] = await Promise.all([
      prisma.project.findMany({
        where: { userId },
        include: {
          tasks: {
            select: { id: true, status: true },
          },
        },
      }),
      prisma.task.findMany({
        where: { userId },
      }),
      prisma.focusSession.findMany({
        where: { userId, type: 'focus' },
      }),
    ])

    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.status === 'completed').length
    const pendingTasks = totalTasks - completedTasks
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const totalProjects = projects.length
    const activeProjects = projects.filter((p) => p.status === 'active').length

    const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0)
    const focusSessionsCount = focusSessions.length

    // Today's metrics (UTC comparison)
    const todayStr = new Date().toISOString().split('T')[0]
    const todayTasks = tasks.filter((t) => t.dueDate === todayStr)
    const todayCompletedCount = todayTasks.filter((t) => t.status === 'completed').length

    // Priority breakdown
    const priorityBreakdown = {
      high: tasks.filter((t) => t.priority === 'high' && t.status === 'pending').length,
      medium: tasks.filter((t) => t.priority === 'medium' && t.status === 'pending').length,
      low: tasks.filter((t) => t.priority === 'low' && t.status === 'pending').length,
    }

    // Project progress breakdown
    const projectBreakdown = projects.map((p) => {
      const pTotal = p.tasks.length
      const pCompleted = p.tasks.filter((t) => t.status === 'completed').length
      return {
        id: p.id,
        name: p.name,
        color: p.color,
        status: p.status,
        totalTasks: pTotal,
        completedTasks: pCompleted,
        percentage: pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0,
      }
    })

    res.json({
      overview: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate,
        totalProjects,
        activeProjects,
        totalFocusMinutes,
        focusSessionsCount,
        todayTasksCount: todayTasks.length,
        todayCompletedCount,
        priorityBreakdown,
        projectBreakdown,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function getInsightsActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id

    // Compute last 7 days activity window
    const now = new Date()
    const days: { date: string; dayName: string; completedTasks: number; focusMinutes: number }[] = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
      days.push({
        date: dateStr,
        dayName,
        completedTasks: 0,
        focusMinutes: 0,
      })
    }

    const startDate = new Date(days[0].date)
    startDate.setHours(0, 0, 0, 0)

    const [completedTasks, focusSessions] = await Promise.all([
      prisma.task.findMany({
        where: {
          userId,
          status: 'completed',
          completedAt: { gte: startDate },
        },
      }),
      prisma.focusSession.findMany({
        where: {
          userId,
          type: 'focus',
          completedAt: { gte: startDate },
        },
      }),
    ])

    days.forEach((day) => {
      day.completedTasks = completedTasks.filter((t) => {
        if (!t.completedAt) return false
        return t.completedAt.toISOString().split('T')[0] === day.date
      }).length

      day.focusMinutes = focusSessions
        .filter((s) => s.completedAt.toISOString().split('T')[0] === day.date)
        .reduce((sum, s) => sum + s.durationMinutes, 0)
    })

    res.json({
      activity: days,
    })
  } catch (error) {
    next(error)
  }
}
