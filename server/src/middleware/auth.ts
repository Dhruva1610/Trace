import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma'
import { verifyToken } from '../utils/tokens'
import { AUTH_COOKIE_NAME } from '../utils/cookies'
import { AppError } from './errorHandler'

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
      sessionId?: string
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    let token = req.cookies?.[AUTH_COOKIE_NAME]

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7)
    }

    if (!token) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED')
    }

    let payload: { userId: string; sessionId: string }
    try {
      payload = verifyToken(token)
    } catch {
      throw new AppError('Invalid or expired session token', 401, 'UNAUTHORIZED')
    }

    // Verify session in database
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            status: true,
          },
        },
      },
    })

    if (!session || session.revoked || session.expiresAt < new Date()) {
      throw new AppError('Session expired or revoked', 401, 'UNAUTHORIZED')
    }

    if (session.user.status !== 'active') {
      throw new AppError('Account is inactive or suspended', 403, 'FORBIDDEN')
    }

    // Update last activity timestamp asynchronously
    prisma.session
      .update({
        where: { id: session.id },
        data: { lastActiveAt: new Date() },
      })
      .catch((e) => console.warn('[TRACE Auth] Failed to touch session:', e))

    req.user = session.user
    req.sessionId = session.id

    next()
  } catch (error) {
    next(error)
  }
}
