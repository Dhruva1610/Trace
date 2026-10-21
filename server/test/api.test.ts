import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/index'
import { prisma } from '../src/config/prisma'

describe('TRACE Full-Stack REST API Integration Tests', () => {
  const testUserA = {
    email: `alice_${Date.now()}@example.com`,
    name: 'Alice Developer',
    password: 'Password123!',
  }

  const testUserB = {
    email: `bob_${Date.now()}@example.com`,
    name: 'Bob Designer',
    password: 'Password456!',
  }

  let tokenUserA = ''
  let tokenUserB = ''
  let projectAId = ''
  let taskAId = ''

  afterAll(async () => {
    // Clean up test data created during this suite
    try {
      await prisma.user.deleteMany({
        where: {
          email: { in: [testUserA.email, testUserB.email] },
        },
      })
      await prisma.$disconnect()
    } catch {
      // Ignore cleanup error
    }
  })

  describe('System & Health Endpoints', () => {
    it('GET /api/v1/health returns healthy status and connected database', async () => {
      const res = await request(app).get('/api/v1/health')
      expect(res.status).toBe(200)
      expect(res.body.status).toBe('healthy')
      expect(res.body.database).toBe('connected')
      expect(res.body.service).toBe('TRACE API')
    })
  })

  describe('Authentication Lifecycle', () => {
    it('POST /api/v1/auth/register creates a new user and returns token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUserA)

      expect(res.status).toBe(201)
      expect(res.body.user).toBeDefined()
      expect(res.body.user.email).toBe(testUserA.email.toLowerCase())
      expect(res.body.token).toBeDefined()
      tokenUserA = res.body.token
    })

    it('POST /api/v1/auth/register rejects duplicate email with 409 Conflict', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUserA)

      expect(res.status).toBe(409)
      expect(res.body.error.code).toBe('CONFLICT')
    })

    it('POST /api/v1/auth/login succeeds with correct credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUserA.email,
          password: testUserA.password,
        })

      expect(res.status).toBe(200)
      expect(res.body.token).toBeDefined()
      expect(res.body.user.name).toBe('Alice Developer')
    })

    it('POST /api/v1/auth/login fails with invalid password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUserA.email,
          password: 'WrongPassword!',
        })

      expect(res.status).toBe(401)
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS')
    })

    it('GET /api/v1/auth/me returns current authenticated user details', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${tokenUserA}`)

      expect(res.status).toBe(200)
      expect(res.body.user.email).toBe(testUserA.email.toLowerCase())
    })

    it('Rejects unauthenticated access to protected endpoints', async () => {
      const res = await request(app).get('/api/v1/projects')
      expect(res.status).toBe(401)
    })
  })

  describe('Project Management with Ownership Enforcement', () => {
    it('POST /api/v1/projects creates a project for authenticated user', async () => {
      const res = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          name: 'Hyperdrive Core',
          description: 'Production infrastructure rollout',
          color: '#D5F47A',
          status: 'active',
          startDate: '2026-10-20',
          dueDate: '2026-11-20',
        })

      expect(res.status).toBe(201)
      expect(res.body.project.name).toBe('Hyperdrive Core')
      expect(res.body.project.id).toBeDefined()
      projectAId = res.body.project.id
    })

    it('GET /api/v1/projects returns authenticated user projects', async () => {
      const res = await request(app)
        .get('/api/v1/projects')
        .set('Authorization', `Bearer ${tokenUserA}`)

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body.projects)).toBe(true)
      expect(res.body.projects.length).toBeGreaterThanOrEqual(1)
      expect(res.body.projects[0].id).toBe(projectAId)
    })

    it('PATCH /api/v1/projects/:id updates project details', async () => {
      const res = await request(app)
        .patch(`/api/v1/projects/${projectAId}`)
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          name: 'Hyperdrive Core V2',
          status: 'completed',
        })

      expect(res.status).toBe(200)
      expect(res.body.project.name).toBe('Hyperdrive Core V2')
      expect(res.body.project.status).toBe('completed')
    })
  })

  describe('Task Management Lifecycle', () => {
    it('POST /api/v1/tasks creates a task linked to project', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          title: 'Implement database indices',
          projectId: projectAId,
          priority: 'high',
          dueDate: '2026-10-25',
        })

      expect(res.status).toBe(201)
      expect(res.body.task.title).toBe('Implement database indices')
      expect(res.body.task.status).toBe('pending')
      taskAId = res.body.task.id
    })

    it('PATCH /api/v1/tasks/:id/toggle toggles task completion', async () => {
      const res = await request(app)
        .patch(`/api/v1/tasks/${taskAId}/toggle`)
        .set('Authorization', `Bearer ${tokenUserA}`)

      expect(res.status).toBe(200)
      expect(res.body.task.status).toBe('completed')
      expect(res.body.task.completedAt).toBeDefined()
    })
  })

  describe('Focus Sessions & Analytics', () => {
    it('POST /api/v1/focus-sessions records a completed deep work block', async () => {
      const res = await request(app)
        .post('/api/v1/focus-sessions')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          taskId: taskAId,
          type: 'focus',
          durationMinutes: 60,
          status: 'completed',
        })

      expect(res.status).toBe(201)
      expect(res.body.session.durationMinutes).toBe(60)
      expect(res.body.session.type).toBe('focus')
    })

    it('GET /api/v1/insights/overview calculates real statistics from database', async () => {
      const res = await request(app)
        .get('/api/v1/insights/overview')
        .set('Authorization', `Bearer ${tokenUserA}`)

      expect(res.status).toBe(200)
      expect(res.body.overview.totalTasks).toBeGreaterThanOrEqual(1)
      expect(res.body.overview.completedTasks).toBeGreaterThanOrEqual(1)
      expect(res.body.overview.totalFocusMinutes).toBeGreaterThanOrEqual(60)
    })

    it('GET /api/v1/insights/activity returns 7-day trailing activity array', async () => {
      const res = await request(app)
        .get('/api/v1/insights/activity')
        .set('Authorization', `Bearer ${tokenUserA}`)

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body.activity)).toBe(true)
      expect(res.body.activity.length).toBe(7)
    })
  })

  describe('Preferences Management', () => {
    it('GET /api/v1/preferences returns default 60m focus, 10m short break, 30m long break', async () => {
      const res = await request(app)
        .get('/api/v1/preferences')
        .set('Authorization', `Bearer ${tokenUserA}`)

      expect(res.status).toBe(200)
      expect(res.body.preferences.focusDuration).toBe(60)
      expect(res.body.preferences.shortBreakDuration).toBe(10)
      expect(res.body.preferences.longBreakDuration).toBe(30)
    })

    it('PATCH /api/v1/preferences updates theme and durations', async () => {
      const res = await request(app)
        .patch('/api/v1/preferences')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          theme: 'light',
          focusDuration: 60,
        })

      expect(res.status).toBe(200)
      expect(res.body.preferences.theme).toBe('light')
    })
  })

  describe('Multi-Tenant Cross-User Data Isolation', () => {
    beforeAll(async () => {
      // Register User B
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUserB)
      tokenUserB = res.body.token
    })

    it('User B cannot view or access User A project by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/projects/${projectAId}`)
        .set('Authorization', `Bearer ${tokenUserB}`)

      expect(res.status).toBe(404)
    })

    it('User B cannot update or mutate User A task', async () => {
      const res = await request(app)
        .patch(`/api/v1/tasks/${taskAId}`)
        .set('Authorization', `Bearer ${tokenUserB}`)
        .send({ title: 'Hacked task title' })

      expect(res.status).toBe(404)
    })

    it('User B cannot delete User A project', async () => {
      const res = await request(app)
        .delete(`/api/v1/projects/${projectAId}`)
        .set('Authorization', `Bearer ${tokenUserB}`)

      expect(res.status).toBe(404)
    })
  })
})
