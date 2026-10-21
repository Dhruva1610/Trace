import { describe, it, expect } from 'vitest'
import {
  calculateProjectProgress,
  calculateWorkspaceStats,
  formatDuration,
  getGreeting,
  formatDateLabel,
} from '@/lib/calculations'
import type { Project, Task, FocusSession } from '@/types'

describe('Calculations and Progress Logic', () => {
  const mockProjects: Project[] = [
    {
      id: 'proj-1',
      name: 'Alpha Project',
      description: 'Alpha description',
      color: '#D5F47A',
      status: 'active',
      startDate: '2026-10-01',
      dueDate: '2026-10-31',
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-01T00:00:00Z',
      spatialCoords: { x: 0, y: 0, z: 0 },
    },
  ]

  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'First milestone',
      projectId: 'proj-1',
      priority: 'high',
      status: 'completed',
      dueDate: '2026-10-20',
      createdAt: '2026-10-18T00:00:00Z',
      completedAt: '2026-10-20T10:00:00Z',
    },
    {
      id: 'task-2',
      title: 'Second milestone',
      projectId: 'proj-1',
      priority: 'medium',
      status: 'pending',
      dueDate: '2026-10-20',
      createdAt: '2026-10-19T00:00:00Z',
    },
  ]

  const mockSessions: FocusSession[] = [
    {
      id: 'focus-1',
      durationMinutes: 25,
      completedAt: '2026-10-20T10:30:00Z',
      type: 'focus',
    },
    {
      id: 'focus-2',
      durationMinutes: 5,
      completedAt: '2026-10-20T11:00:00Z',
      type: 'short_break',
    },
  ]

  it('calculates project progress percentage accurately', () => {
    const result = calculateProjectProgress('proj-1', mockTasks)
    expect(result.total).toBe(2)
    expect(result.completed).toBe(1)
    expect(result.percentage).toBe(50)
  })

  it('returns 0% for projects with no associated tasks', () => {
    const result = calculateProjectProgress('non-existent', mockTasks)
    expect(result.total).toBe(0)
    expect(result.completed).toBe(0)
    expect(result.percentage).toBe(0)
  })

  it('derives workspace stats correctly', () => {
    const stats = calculateWorkspaceStats(mockProjects, mockTasks, mockSessions, '2026-10-20')
    expect(stats.totalTasks).toBe(2)
    expect(stats.completedTasks).toBe(1)
    expect(stats.pendingTasks).toBe(1)
    expect(stats.completionRate).toBe(50)
    expect(stats.activeProjects).toBe(1)
    expect(stats.todayCompletedCount).toBe(1)
    expect(stats.totalFocusMinutes).toBe(25) // only type === 'focus'
  })

  it('includes in-flight active focus minutes in workspace stats in real-time', () => {
    // 25 mins from mockSessions + 130 seconds active focus (2 mins) = 27 mins
    const statsWithActive = calculateWorkspaceStats(mockProjects, mockTasks, mockSessions, '2026-10-20', 130)
    expect(statsWithActive.totalFocusMinutes).toBe(27)

    // After 1 minute (65 seconds) active focus: 25 + 1 = 26 mins
    const statsAfterOneMin = calculateWorkspaceStats(mockProjects, mockTasks, mockSessions, '2026-10-20', 65)
    expect(statsAfterOneMin.totalFocusMinutes).toBe(26)
  })

  it('formats durations into clean hour and minute strings', () => {
    expect(formatDuration(25)).toBe('25m')
    expect(formatDuration(60)).toBe('1h')
    expect(formatDuration(85)).toBe('1h 25m')
  })

  it('provides a valid greeting and subtext based on current time', () => {
    const { greeting, subtext } = getGreeting()
    expect(greeting).toMatch(/Good morning|Good afternoon|Good evening/)
    expect(subtext.length).toBeGreaterThan(10)
  })

  it('handles date labels with fallbacks', () => {
    expect(formatDateLabel()).toBe('No due date')
  })
})
