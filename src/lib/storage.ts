import type { Project, Task, FocusSession, UserSettings } from '@/types'
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_FOCUS_SESSIONS, DEFAULT_SETTINGS } from './seedData'

const STORAGE_KEYS = {
  PROJECTS: 'trace_projects_v1',
  TASKS: 'trace_tasks_v1',
  FOCUS_SESSIONS: 'trace_focus_sessions_v1',
  SETTINGS: 'trace_settings_v1',
  ACTIVE_TIMER: 'trace_active_timer_v1',
} as const

function safeParse<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = window.localStorage.getItem(key)
    if (!item) return fallback
    return JSON.parse(item) as T
  } catch (error) {
    console.warn(`[TRACE Storage] Error reading key "${key}":`, error)
    return fallback
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`[TRACE Storage] Failed writing to key "${key}":`, error)
  }
}

export interface PersistedTimerState {
  timerActive: boolean
  timerMode: 'focus' | 'short_break' | 'long_break'
  secondsRemaining: number
  totalSeconds: number
  timerTaskId: string
  timerSoundEnabled: boolean
  elapsedFocusSeconds: number
  savedAt: number
}

export interface WorkspaceBackup {
  version: string
  exportedAt: string
  projects: Project[]
  tasks: Task[]
  focusSessions: FocusSession[]
  settings?: UserSettings
}

export const storage = {
  getActiveTimer(): PersistedTimerState | null {
    return safeParse<PersistedTimerState | null>(STORAGE_KEYS.ACTIVE_TIMER, null)
  },

  saveActiveTimer(timer: PersistedTimerState | null): void {
    if (!timer) {
      if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMER)
      return
    }
    safeSet(STORAGE_KEYS.ACTIVE_TIMER, timer)
  },
  getProjects(): Project[] {
    return safeParse<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS)
  },

  saveProjects(projects: Project[]): void {
    safeSet(STORAGE_KEYS.PROJECTS, projects)
  },

  getTasks(): Task[] {
    return safeParse<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS)
  },

  saveTasks(tasks: Task[]): void {
    safeSet(STORAGE_KEYS.TASKS, tasks)
  },

  getFocusSessions(): FocusSession[] {
    return safeParse<FocusSession[]>(STORAGE_KEYS.FOCUS_SESSIONS, INITIAL_FOCUS_SESSIONS)
  },

  saveFocusSessions(sessions: FocusSession[]): void {
    safeSet(STORAGE_KEYS.FOCUS_SESSIONS, sessions)
  },

  getSettings(): UserSettings {
    const raw = safeParse<Partial<UserSettings>>(STORAGE_KEYS.SETTINGS, {})
    return {
      ...DEFAULT_SETTINGS,
      ...raw,
      // If legacy Pomodoro defaults (25, 5, 15) were stored, seamlessly upgrade to 60m focus, 10m short break, 30m long break
      focusDuration: raw.focusDuration && raw.focusDuration !== 25 ? raw.focusDuration : DEFAULT_SETTINGS.focusDuration,
      shortBreakDuration: raw.shortBreakDuration && raw.shortBreakDuration !== 5 ? raw.shortBreakDuration : DEFAULT_SETTINGS.shortBreakDuration,
      longBreakDuration: raw.longBreakDuration && raw.longBreakDuration !== 15 ? raw.longBreakDuration : DEFAULT_SETTINGS.longBreakDuration,
    }
  },

  saveSettings(settings: UserSettings): void {
    safeSet(STORAGE_KEYS.SETTINGS, settings)
  },

  clearAllData(): {
    projects: Project[]
    tasks: Task[]
    focusSessions: FocusSession[]
    settings: UserSettings
  } {
    safeSet(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS)
    safeSet(STORAGE_KEYS.TASKS, INITIAL_TASKS)
    safeSet(STORAGE_KEYS.FOCUS_SESSIONS, INITIAL_FOCUS_SESSIONS)
    return {
      projects: INITIAL_PROJECTS,
      tasks: INITIAL_TASKS,
      focusSessions: INITIAL_FOCUS_SESSIONS,
      settings: this.getSettings(),
    }
  },

  importData(backup: WorkspaceBackup): {
    projects: Project[]
    tasks: Task[]
    focusSessions: FocusSession[]
    settings: UserSettings
  } {
    const validProjects = Array.isArray(backup.projects) ? backup.projects : []
    const validTasks = Array.isArray(backup.tasks) ? backup.tasks : []
    const validSessions = Array.isArray(backup.focusSessions) ? backup.focusSessions : []
    const validSettings = backup.settings || this.getSettings()

    safeSet(STORAGE_KEYS.PROJECTS, validProjects)
    safeSet(STORAGE_KEYS.TASKS, validTasks)
    safeSet(STORAGE_KEYS.FOCUS_SESSIONS, validSessions)
    safeSet(STORAGE_KEYS.SETTINGS, validSettings)

    return {
      projects: validProjects,
      tasks: validTasks,
      focusSessions: validSessions,
      settings: validSettings,
    }
  },
}
