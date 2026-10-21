import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma'
import { hashPassword, comparePassword } from '../utils/password'
import { generateToken, generateRandomToken, hashToken } from '../utils/tokens'
import { setAuthCookie, clearAuthCookie } from '../utils/cookies'
import { AppError } from '../middleware/errorHandler'
import { env } from '../config/env'

export const registerSchema = z.object({
  email: z.string().email('Please provide a valid email address').trim().toLowerCase(),
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email address').trim().toLowerCase(),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'New password must be at least 8 characters'),
})

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, name, password } = req.body

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new AppError('An account with this email address already exists', 409, 'CONFLICT')
    }

    const passwordHash = await hashPassword(password)

    // Create user and default preferences in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      })

      await tx.userPreferences.create({
        data: {
          userId: newUser.id,
          theme: 'dark',
          focusDuration: 60,
          shortBreakDuration: 10,
          longBreakDuration: 30,
          soundEnabled: true,
          reducedMotion: false,
          autoStartBreaks: false,
        },
      })

      return newUser
    })

    // Create active session
    const sessionToken = generateRandomToken(32)
    const tokenHashed = hashToken(sessionToken)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: tokenHashed,
        expiresAt,
      },
    })

    const token = generateToken({ userId: user.id, sessionId: session.id })
    setAuthCookie(res, token)

    res.status(201).json({
      message: 'Account successfully registered',
      user,
      token,
    })
  } catch (error) {
    next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Constant-time check mitigation: always verify hash even if user not found
    const dummyHash = '$2a$12$e8Y4k925uO7N5yA7fK9PyeH1O3i7a7H8b3s5uO7N5yA7fK9PyeH1O'
    const match = await comparePassword(password, user ? user.passwordHash : dummyHash)

    if (!user || !match) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
    }

    if (user.status !== 'active') {
      throw new AppError('Account is suspended. Please contact support.', 403, 'FORBIDDEN')
    }

    const sessionToken = generateRandomToken(32)
    const tokenHashed = hashToken(sessionToken)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: tokenHashed,
        expiresAt,
      },
    })

    const token = generateToken({ userId: user.id, sessionId: session.id })
    setAuthCookie(res, token)

    res.json({
      message: 'Logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.sessionId) {
      await prisma.session.updateMany({
        where: { id: req.sessionId },
        data: { revoked: true },
      })
    }

    clearAuthCookie(res)
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401, 'UNAUTHORIZED')
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        preferences: true,
      },
    })

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND')
    }

    res.json({ user })
  } catch (error) {
    next(error)
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401, 'UNAUTHORIZED')
    }

    const { currentPassword, newPassword } = req.body

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND')
    }

    const match = await comparePassword(currentPassword, user.passwordHash)
    if (!match) {
      throw new AppError('Current password is incorrect', 400, 'INVALID_PASSWORD')
    }

    const newHash = await hashPassword(newPassword)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      }),
      // Revoke other sessions for security
      prisma.session.updateMany({
        where: {
          userId: user.id,
          id: { not: req.sessionId },
        },
        data: { revoked: true },
      }),
    ])

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    next(error)
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    let resetTokenValue: string | undefined

    if (user) {
      const rawToken = generateRandomToken(32)
      const tokenHashed = hashToken(rawToken)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: tokenHashed,
          expiresAt,
        },
      })

      resetTokenValue = rawToken
    }

    // Always return generic response to prevent account enumeration
    const responsePayload: { message: string; devResetToken?: string } = {
      message: 'If an account exists with that email, instructions have been sent.',
    }

    // In local dev/test only: return token to facilitate automated tests
    if (env.NODE_ENV !== 'production' && resetTokenValue) {
      responsePayload.devResetToken = resetTokenValue
    }

    res.json(responsePayload)
  } catch (error) {
    next(error)
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, password } = req.body
    const tokenHashed = hashToken(token)

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: tokenHashed },
      include: { user: true },
    })

    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
      throw new AppError('Password reset link is invalid or has expired', 400, 'INVALID_TOKEN')
    }

    const newHash = await hashPassword(password)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash: newHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
      // Invalidate all previous sessions
      prisma.session.updateMany({
        where: { userId: resetRecord.userId },
        data: { revoked: true },
      }),
    ])

    res.json({ message: 'Password has been successfully reset. You may now log in.' })
  } catch (error) {
    next(error)
  }
}
