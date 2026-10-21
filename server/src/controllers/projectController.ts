import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma'
import { AppError } from '../middleware/errorHandler'

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').trim(),
  description: z.string().optional().nullable(),
  color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Valid hex color required').default('#D5F47A'),
  status: z.enum(['planning', 'active', 'on_hold', 'completed']).default('active'),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  spatialX: z.number().default(0),
  spatialY: z.number().default(0),
  spatialZ: z.number().default(0),
})

export const updateProjectSchema = createProjectSchema.partial()

export const queryProjectSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'all']).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'dueDate']).default('updatedAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export async function getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const search = req.query.search as string | undefined
    const status = req.query.status as string | undefined
    const sortBy = (req.query.sortBy as string) || 'updatedAt'
    const order = (req.query.order as 'asc' | 'desc') || 'desc'

    const where: any = { userId }

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { [sortBy]: order },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    })

    const projectsWithProgress = projects.map((p) => {
      const totalTasks = p.tasks.length
      const completedTasks = p.tasks.filter((t) => t.status === 'completed').length
      const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      // Map to frontend-friendly structure
      return {
        id: p.id,
        name: p.name,
        description: p.description || '',
        color: p.color,
        status: p.status,
        startDate: p.startDate || '',
        dueDate: p.dueDate || '',
        spatialCoords: {
          x: p.spatialX,
          y: p.spatialY,
          z: p.spatialZ,
        },
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        totalTasks,
        completedTasks,
        progressPercentage,
      }
    })

    res.json({ projects: projectsWithProgress })
  } catch (error) {
    next(error)
  }
}

export async function getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!project) {
      throw new AppError('Project not found', 404, 'NOT_FOUND')
    }

    const totalTasks = project.tasks.length
    const completedTasks = project.tasks.filter((t) => t.status === 'completed').length
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    res.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description || '',
        color: project.color,
        status: project.status,
        startDate: project.startDate || '',
        dueDate: project.dueDate || '',
        spatialCoords: {
          x: project.spatialX,
          y: project.spatialY,
          z: project.spatialZ,
        },
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        totalTasks,
        completedTasks,
        progressPercentage,
        tasks: project.tasks,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const data = req.body

    // If spatial coordinates are not provided, arrange organically
    let spatialX = data.spatialX || 0
    let spatialY = data.spatialY || 0
    let spatialZ = data.spatialZ || 0

    if (data.spatialCoords) {
      spatialX = data.spatialCoords.x ?? spatialX
      spatialY = data.spatialCoords.y ?? spatialY
      spatialZ = data.spatialCoords.z ?? spatialZ
    } else if (spatialX === 0 && spatialY === 0 && spatialZ === 0) {
      const existingCount = await prisma.project.count({ where: { userId } })
      const angle = (existingCount * 1.25) % (Math.PI * 2)
      const radius = 2.2 + (existingCount % 2) * 0.5
      spatialX = Math.cos(angle) * radius
      spatialY = Math.sin(angle) * 1.2 + ((existingCount % 3) - 1) * 0.4
      spatialZ = Math.sin(angle * 1.5) * 1.2
    }

    const project = await prisma.project.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        color: data.color || '#D5F47A',
        status: data.status || 'active',
        startDate: data.startDate,
        dueDate: data.dueDate,
        spatialX,
        spatialY,
        spatialZ,
      },
    })

    res.status(201).json({
      message: 'Project created successfully',
      project: {
        id: project.id,
        name: project.name,
        description: project.description || '',
        color: project.color,
        status: project.status,
        startDate: project.startDate || '',
        dueDate: project.dueDate || '',
        spatialCoords: {
          x: project.spatialX,
          y: project.spatialY,
          z: project.spatialZ,
        },
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        totalTasks: 0,
        completedTasks: 0,
        progressPercentage: 0,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const data = req.body

    const existing = await prisma.project.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      throw new AppError('Project not found or unauthorized', 404, 'NOT_FOUND')
    }

    const updatePayload: any = {}
    if (data.name !== undefined) updatePayload.name = data.name
    if (data.description !== undefined) updatePayload.description = data.description
    if (data.color !== undefined) updatePayload.color = data.color
    if (data.status !== undefined) updatePayload.status = data.status
    if (data.startDate !== undefined) updatePayload.startDate = data.startDate
    if (data.dueDate !== undefined) updatePayload.dueDate = data.dueDate
    if (data.spatialCoords) {
      if (data.spatialCoords.x !== undefined) updatePayload.spatialX = data.spatialCoords.x
      if (data.spatialCoords.y !== undefined) updatePayload.spatialY = data.spatialCoords.y
      if (data.spatialCoords.z !== undefined) updatePayload.spatialZ = data.spatialCoords.z
    }

    const updated = await prisma.project.update({
      where: { id },
      data: updatePayload,
      include: {
        tasks: { select: { id: true, status: true } },
      },
    })

    const totalTasks = updated.tasks.length
    const completedTasks = updated.tasks.filter((t) => t.status === 'completed').length
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    res.json({
      message: 'Project updated successfully',
      project: {
        id: updated.id,
        name: updated.name,
        description: updated.description || '',
        color: updated.color,
        status: updated.status,
        startDate: updated.startDate || '',
        dueDate: updated.dueDate || '',
        spatialCoords: {
          x: updated.spatialX,
          y: updated.spatialY,
          z: updated.spatialZ,
        },
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        totalTasks,
        completedTasks,
        progressPercentage,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const deleteTasks = req.query.deleteTasks === 'true'

    const existing = await prisma.project.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      throw new AppError('Project not found or unauthorized', 404, 'NOT_FOUND')
    }

    await prisma.$transaction(async (tx) => {
      if (deleteTasks) {
        await tx.task.deleteMany({
          where: { projectId: id, userId },
        })
      } else {
        // Disassociate tasks rather than deleting them
        await tx.task.updateMany({
          where: { projectId: id, userId },
          data: { projectId: null },
        })
      }

      await tx.project.delete({
        where: { id },
      })
    })

    res.json({
      message: 'Project deleted successfully',
      deletedTasks: deleteTasks,
    })
  } catch (error) {
    next(error)
  }
}
