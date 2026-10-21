import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export interface TokenPayload {
  userId: string
  sessionId: string
}

export function generateToken(payload: TokenPayload, expiresIn: string = env.SESSION_EXPIRES_IN): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn } as jwt.SignOptions)
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function generateRandomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex')
}
