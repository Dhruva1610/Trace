import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma'
import { AppError } from '../middleware/errorHandler'

export const updatePreferencesSchema = z.object({
  theme: z.enum(['dark', 'light', 'system']).optional(),
  focusDuration: z.number().int().min(1).max(180).optional(),
  shortBreakDuration: z.number().int().min(1).max(60).optional(),
  longBreakDuration: z.number().int().min(1).max(90).optional(),
  soundEnabled: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
  autoStartBreaks: z.boolean().optional(),
})

export async function getPreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id

    let prefs = await prisma.userPreferences.findUnique({
      where: { userId },
    })

    if (!prefs) {
      prefs = await prisma.userPreferences.create({
        data: {
          userId,
          theme: 'dark',
          focusDuration: 60,
          shortBreakDuration: 10,
          longBreakDuration: 30,
          soundEnabled: true,
          reducedMotion: false,
          autoStartBreaks: false,
        },
      })
    }

    res.json({
      preferences: {
        theme: prefs.theme,
        focusDuration: prefs.focusDuration,
        shortBreakDuration: prefs.shortBreakDuration,
        longBreakDuration: prefs.longBreakDuration,
        soundEnabled: prefs.soundEnabled,
        reducedMotion: prefs.reducedMotion,
        autoStartBreaks: prefs.autoStartBreaks,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function updatePreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id
    const updates = req.body

    const prefs = await prisma.userPreferences.upsert({
      where: { userId },
      update: updates,
      create: {
        userId,
        theme: updates.theme || 'dark',
        focusDuration: updates.focusDuration || 60,
        shortBreakDuration: updates.shortBreakDuration || 10,
        longBreakDuration: updates.longBreakDuration || 30,
        soundEnabled: updates.soundEnabled ?? true,
        reducedMotion: updates.reducedMotion ?? false,
        autoStartBreaks: updates.autoStartBreaks ?? false,
      },
    })

    res.json({
      message: 'Preferences updated',
      preferences: {
        theme: prefs.theme,
        focusDuration: prefs.focusDuration,
        shortBreakDuration: prefs.shortBreakDuration,
        longBreakDuration: prefs.longBreakDuration,
        soundEnabled: prefs.soundEnabled,
        reducedMotion: prefs.reducedMotion,
        autoStartBreaks: prefs.autoStartBreaks,
      },
    })
  } catch (error) {
    next(error)
  }
}
