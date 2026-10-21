import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma'
import { AppError } from '../middleware/errorHandler'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').trim(),
  description: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional().nullable(),
  dueTime: z.string().optional().nullable(),
  label: z.string().optional().nullable(),
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(['pending', 'completed']).optional(),
})

export const queryTaskSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['pending', 'completed', 'all']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'all']).optional(),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export async function getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const search = req.query.search as string | undefined
    const status = req.query.status as string | undefined
    const priority = req.query.priority as string | undefined
    const projectId = req.query.projectId as string | undefined
    const dueDate = req.query.dueDate as string | undefined
    const sortBy = (req.query.sortBy as string) || 'createdAt'
    const order = (req.query.order as 'asc' | 'desc') || 'desc'

    const where: any = { userId }

    if (status && status !== 'all') {
      where.status = status
    }

    if (priority && priority !== 'all') {
      where.priority = priority
    }

    if (projectId) {
      where.projectId = projectId === 'none' ? null : projectId
    }

    if (dueDate) {
      where.dueDate = dueDate
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { label: { contains: search } },
      ]
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { [sortBy]: order },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    })

    const formattedTasks = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description || undefined,
      projectId: t.projectId || '',
      project: t.project || undefined,
      status: t.status as 'pending' | 'completed',
      priority: t.priority as 'low' | 'medium' | 'high',
      dueDate: t.dueDate || undefined,
      dueTime: t.dueTime || undefined,
      label: t.label || undefined,
      completedAt: t.completedAt ? t.completedAt.toISOString() : undefined,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }))

    res.json({ tasks: formattedTasks })
  } catch (error) {
    next(error)
  }
}

export async function getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const task = await prisma.task.findFirst({
      where: { id, userId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    })

    if (!task) {
      throw new AppError('Task not found or unauthorized', 404, 'NOT_FOUND')
    }

    res.json({
      task: {
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        projectId: task.projectId || '',
        project: task.project || undefined,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate || undefined,
        dueTime: task.dueTime || undefined,
        label: task.label || undefined,
        completedAt: task.completedAt ? task.completedAt.toISOString() : undefined,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const data = req.body

    // Validate project ownership if projectId is provided
    if (data.projectId) {
      const project = await prisma.project.findFirst({
        where: { id: data.projectId, userId },
      })
      if (!project) {
        throw new AppError('Associated project not found or does not belong to you', 400, 'INVALID_PROJECT')
      }
    }

    const task = await prisma.task.create({
      data: {
        userId,
        projectId: data.projectId || null,
        title: data.title,
        description: data.description,
        priority: data.priority || 'medium',
        status: 'pending',
        dueDate: data.dueDate,
        dueTime: data.dueTime,
        label: data.label,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    })

    res.status(201).json({
      message: 'Task created successfully',
      task: {
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        projectId: task.projectId || '',
        project: task.project || undefined,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate || undefined,
        dueTime: task.dueTime || undefined,
        label: task.label || undefined,
        completedAt: undefined,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const data = req.body

    const existing = await prisma.task.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      throw new AppError('Task not found or unauthorized', 404, 'NOT_FOUND')
    }

    if (data.projectId) {
      const project = await prisma.project.findFirst({
        where: { id: data.projectId, userId },
      })
      if (!project) {
        throw new AppError('Associated project not found or does not belong to you', 400, 'INVALID_PROJECT')
      }
    }

    const updatePayload: any = {}
    if (data.title !== undefined) updatePayload.title = data.title
    if (data.description !== undefined) updatePayload.description = data.description
    if (data.projectId !== undefined) updatePayload.projectId = data.projectId || null
    if (data.priority !== undefined) updatePayload.priority = data.priority
    if (data.dueDate !== undefined) updatePayload.dueDate = data.dueDate
    if (data.dueTime !== undefined) updatePayload.dueTime = data.dueTime
    if (data.label !== undefined) updatePayload.label = data.label

    if (data.status !== undefined) {
      updatePayload.status = data.status
      if (data.status === 'completed' && existing.status !== 'completed') {
        updatePayload.completedAt = new Date()
      } else if (data.status === 'pending') {
        updatePayload.completedAt = null
      }
    }

    const updated = await prisma.task.update({
      where: { id },
      data: updatePayload,
      include: {
        project: {
          select: { id: true, name: true, color: true },
        },
      },
    })

    res.json({
      message: 'Task updated successfully',
      task: {
        id: updated.id,
        title: updated.title,
        description: updated.description || undefined,
        projectId: updated.projectId || '',
        project: updated.project || undefined,
        status: updated.status,
        priority: updated.priority,
        dueDate: updated.dueDate || undefined,
        dueTime: updated.dueTime || undefined,
        label: updated.label || undefined,
        completedAt: updated.completedAt ? updated.completedAt.toISOString() : undefined,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function toggleTaskComplete(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const existing = await prisma.task.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      throw new AppError('Task not found or unauthorized', 404, 'NOT_FOUND')
    }

    const isCompleting = existing.status !== 'completed'
    const updated = await prisma.task.update({
      where: { id },
      data: {
        status: isCompleting ? 'completed' : 'pending',
        completedAt: isCompleting ? new Date() : null,
      },
      include: {
        project: {
          select: { id: true, name: true, color: true },
        },
      },
    })

    res.json({
      message: isCompleting ? 'Task marked as completed' : 'Task reopened',
      task: {
        id: updated.id,
        title: updated.title,
        description: updated.description || undefined,
        projectId: updated.projectId || '',
        project: updated.project || undefined,
        status: updated.status,
        priority: updated.priority,
        dueDate: updated.dueDate || undefined,
        dueTime: updated.dueTime || undefined,
        label: updated.label || undefined,
        completedAt: updated.completedAt ? updated.completedAt.toISOString() : undefined,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const existing = await prisma.task.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      throw new AppError('Task not found or unauthorized', 404, 'NOT_FOUND')
    }

    await prisma.task.delete({
      where: { id },
    })

    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    next(error)
  }
}
