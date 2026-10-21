import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { prisma } from './config/prisma'
import { apiLimiter } from './middleware/rateLimiter'
import { errorHandler } from './middleware/errorHandler'

import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'
import taskRoutes from './routes/taskRoutes'
import focusRoutes from './routes/focusRoutes'
import insightsRoutes from './routes/insightsRoutes'
import preferencesRoutes from './routes/preferencesRoutes'

export const app = express()

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
  })
)

// CORS Configuration
const allowedOrigins = env.CLIENT_ORIGIN.split(',').map((o) => o.trim())
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true)
      } else {
        callback(new Error(`Origin ${origin} not permitted by CORS policy`))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Body and Cookie Parsers
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(cookieParser())

// Health check endpoint
app.get('/api/v1/health', async (_req, res) => {
  try {
    // Ping database
    await prisma.$queryRaw`SELECT 1`
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'TRACE API',
      version: '1.0.0',
      database: 'connected',
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'TRACE API',
      database: 'disconnected',
    })
  }
})

// Apply general API rate limiting to data endpoints
app.use('/api/v1', apiLimiter)

// Mount API routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/projects', projectRoutes)
app.use('/api/v1/tasks', taskRoutes)
app.use('/api/v1/focus-sessions', focusRoutes)
app.use('/api/v1/insights', insightsRoutes)
app.use('/api/v1/preferences', preferencesRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  })
})

// Centralized Error Handler
app.use(errorHandler)

// Server Lifecycle Management
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(env.PORT, () => {
    console.log(`[TRACE] Server running in ${env.NODE_ENV} mode on port ${env.PORT}`)
    console.log(`[TRACE] Health check: http://localhost:${env.PORT}/api/v1/health`)
  })

  const shutdown = async (signal: string) => {
    console.log(`[TRACE] Received ${signal}. Gracefully shutting down...`)
    server.close(async () => {
      console.log('[TRACE] HTTP server closed.')
      await prisma.$disconnect()
      console.log('[TRACE] Prisma client disconnected.')
      process.exit(0)
    })

    // Force exit after 10s if hanging
    setTimeout(() => {
      console.error('[TRACE] Forced shutdown after timeout.')
      process.exit(1)
    }, 10000)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

export default app
