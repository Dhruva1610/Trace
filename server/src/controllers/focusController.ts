import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma'
import { AppError } from '../middleware/errorHandler'

export const createFocusSessionSchema = z.object({
  taskId: z.string().optional().nullable(),
  type: z.enum(['focus', 'short_break', 'long_break']).default('focus'),
  durationMinutes: z.number().int().positive('Duration must be positive').default(60),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  status: z.enum(['completed', 'interrupted']).default('completed'),
})

export const updateFocusSessionSchema = z.object({
  durationMinutes: z.number().int().positive().optional(),
  status: z.enum(['completed', 'interrupted']).optional(),
  completedAt: z.string().optional(),
})

export async function getFocusSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const limit = Math.min(parseInt((req.query.limit as string) || '50', 10), 100)

    const sessions = await prisma.focusSession.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: limit,
      include: {
        task: {
          select: {
            id: true,
            title: true,
            projectId: true,
          },
        },
      },
    })

    const formatted = sessions.map((s) => ({
      id: s.id,
      taskId: s.taskId || undefined,
      taskTitle: s.task?.title,
      projectId: s.task?.projectId || undefined,
      durationMinutes: s.durationMinutes,
      type: s.type,
      startedAt: s.startedAt.toISOString(),
      completedAt: s.completedAt.toISOString(),
      status: s.status,
    }))

    res.json({
      sessions: formatted,
      count: formatted.length,
    })
  } catch (error) {
    next(error)
  }
}

export async function createFocusSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const { taskId, type, durationMinutes, startedAt, completedAt, status } = req.body

    if (taskId) {
      const task = await prisma.task.findFirst({
        where: { id: taskId, userId },
      })
      if (!task) {
        throw new AppError('Task not found or access denied', 404, 'NOT_FOUND')
      }
    }

    const startDateTime = startedAt ? new Date(startedAt) : new Date(Date.now() - durationMinutes * 60 * 1000)
    const completeDateTime = completedAt ? new Date(completedAt) : new Date()

    const session = await prisma.focusSession.create({
      data: {
        userId,
        taskId: taskId || null,
        type,
        durationMinutes,
        startedAt: startDateTime,
        completedAt: completeDateTime,
        status,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            projectId: true,
          },
        },
      },
    })

    res.status(201).json({
      message: 'Focus session recorded',
      session: {
        id: session.id,
        taskId: session.taskId || undefined,
        taskTitle: session.task?.title,
        projectId: session.task?.projectId || undefined,
        durationMinutes: session.durationMinutes,
        type: session.type,
        startedAt: session.startedAt.toISOString(),
        completedAt: session.completedAt.toISOString(),
        status: session.status,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function updateFocusSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const { durationMinutes, status, completedAt } = req.body

    const existing = await prisma.focusSession.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      throw new AppError('Focus session not found or access denied', 404, 'NOT_FOUND')
    }

    const updated = await prisma.focusSession.update({
      where: { id },
      data: {
        durationMinutes: durationMinutes ?? existing.durationMinutes,
        status: status ?? existing.status,
        completedAt: completedAt ? new Date(completedAt) : existing.completedAt,
      },
    })

    res.json({
      message: 'Focus session updated',
      session: updated,
    })
  } catch (error) {
    next(error)
  }
}

export async function completeFocusSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const existing = await prisma.focusSession.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      throw new AppError('Focus session not found or access denied', 404, 'NOT_FOUND')
    }

    const completed = await prisma.focusSession.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    })

    res.json({
      message: 'Focus session marked as completed',
      session: completed,
    })
  } catch (error) {
    next(error)
  }
}
