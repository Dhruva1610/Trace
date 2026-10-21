import { describe, it, expect, beforeEach } from 'vitest'
import { storage } from '@/lib/storage'
import type { Project, Task } from '@/types'

describe('Typed Local Storage Service', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('starts with a clean empty initial state for a fresh deployment', () => {
    const projects = storage.getProjects()
    expect(projects).toEqual([])
    const tasks = storage.getTasks()
    expect(tasks).toEqual([])
  })

  it('persists and retrieves user projects', () => {
    const customProject: Project = {
      id: 'proj-123',
      name: 'Production Workspace Architecture',
      description: 'Zero demo data, fully deployable project.',
      color: '#D5F47A',
      status: 'active',
      startDate: '2026-10-20',
      dueDate: '2026-11-20',
      createdAt: '2026-10-20T00:00:00Z',
      updatedAt: '2026-10-20T00:00:00Z',
      spatialCoords: { x: 0, y: 1, z: 0 },
    }
    storage.saveProjects([customProject])
    const loaded = storage.getProjects()
    expect(loaded.length).toBe(1)
    expect(loaded[0].name).toBe('Production Workspace Architecture')
  })

  it('persists and retrieves user tasks', () => {
    const customTask: Task = {
      id: 'task-101',
      title: 'Deploy TRACE to production hosting',
      projectId: 'proj-123',
      priority: 'high',
      status: 'pending',
      createdAt: '2026-10-20T00:00:00Z',
    }
    storage.saveTasks([customTask])
    const loaded = storage.getTasks()
    expect(loaded.length).toBe(1)
    expect(loaded[0].title).toBe('Deploy TRACE to production hosting')
  })

  it('clears all workspace data back to empty state cleanly', () => {
    storage.saveProjects([
      {
        id: 'proj-1',
        name: 'Temporary',
        description: '',
        color: '#D5F47A',
        status: 'active',
        startDate: '2026-10-20',
        dueDate: '2026-11-20',
        createdAt: '',
        updatedAt: '',
        spatialCoords: { x: 0, y: 0, z: 0 },
      },
    ])
    expect(storage.getProjects().length).toBe(1)

    const clearResult = storage.clearAllData()
    expect(clearResult.projects.length).toBe(0)
    expect(clearResult.tasks.length).toBe(0)
    expect(storage.getProjects().length).toBe(0)
  })

  it('imports external backup files properly', () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projects: [
        {
          id: 'proj-imported',
          name: 'Imported Deliverable',
          description: 'Restored from JSON backup',
          color: '#9D84FD',
          status: 'active' as const,
          startDate: '2026-10-20',
          dueDate: '2026-11-30',
          createdAt: '',
          updatedAt: '',
          spatialCoords: { x: 1, y: 1, z: 0 },
        },
      ],
      tasks: [],
      focusSessions: [],
    }

    const res = storage.importData(backup)
    expect(res.projects.length).toBe(1)
    expect(res.projects[0].name).toBe('Imported Deliverable')
    expect(storage.getProjects()[0].id).toBe('proj-imported')
  })

  it('provides default focus duration of 60m (1hr), short break of 10m, and long break of 30m', () => {
    const settings = storage.getSettings()
    expect(settings.focusDuration).toBe(60)
    expect(settings.shortBreakDuration).toBe(10)
    expect(settings.longBreakDuration).toBe(30)
  })

  it('migrates legacy 25m/5m/15m defaults to 60m/10m/30m while preserving custom user values', () => {
    // Simulate legacy storage with 25, 5, 15
    window.localStorage.setItem(
      'trace_settings_v1',
      JSON.stringify({
        theme: 'dark',
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
      })
    )
    const migrated = storage.getSettings()
    expect(migrated.focusDuration).toBe(60)
    expect(migrated.shortBreakDuration).toBe(10)
    expect(migrated.longBreakDuration).toBe(30)

    // Ensure custom user values (e.g. 45 min) are preserved
    window.localStorage.setItem(
      'trace_settings_v1',
      JSON.stringify({
        theme: 'dark',
        focusDuration: 45,
        shortBreakDuration: 12,
        longBreakDuration: 25,
      })
    )
    const custom = storage.getSettings()
    expect(custom.focusDuration).toBe(45)
    expect(custom.shortBreakDuration).toBe(12)
    expect(custom.longBreakDuration).toBe(25)
  })

  it('saves, retrieves, and clears active timer state', () => {
    expect(storage.getActiveTimer()).toBeNull()

    storage.saveActiveTimer({
      timerActive: true,
      timerMode: 'focus',
      secondsRemaining: 3540,
      totalSeconds: 3600,
      timerTaskId: 'task-1',
      timerSoundEnabled: true,
      elapsedFocusSeconds: 60,
      savedAt: Date.now(),
    })

    const timer = storage.getActiveTimer()
    expect(timer).not.toBeNull()
    expect(timer?.secondsRemaining).toBe(3540)
    expect(timer?.timerMode).toBe('focus')
    expect(timer?.elapsedFocusSeconds).toBe(60)

    storage.saveActiveTimer(null)
    expect(storage.getActiveTimer()).toBeNull()
  })
})

