export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed'

export interface Project {
  id: string
  name: string
  description: string
  color: string
  status: ProjectStatus
  startDate: string
  dueDate: string
  createdAt: string
  updatedAt: string
  spatialCoords: {
    x: number
    y: number
    z: number
  }
}

export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'pending' | 'completed'

export interface Task {
  id: string
  title: string
  description?: string
  projectId: string
  priority: TaskPriority
  status: TaskStatus
  dueDate?: string
  dueTime?: string
  label?: string
  createdAt: string
  completedAt?: string
}

export type FocusModeType = 'focus' | 'short_break' | 'long_break'

export interface FocusSession {
  id: string
  taskId?: string
  taskTitle?: string
  projectId?: string
  durationMinutes: number
  completedAt: string
  type: FocusModeType
}

export type ThemePreference = 'light' | 'dark' | 'system'

export interface UserSettings {
  theme: ThemePreference
  focusDuration: number // minutes
  shortBreakDuration: number // minutes
  longBreakDuration: number // minutes
  soundEnabled: boolean
  reducedMotion: boolean
  autoStartBreaks: boolean
}

export interface WorkspaceStats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  completionRate: number
  activeProjects: number
  totalProjects: number
  todayCompletedCount: number
  todayTotalCount: number
  totalFocusMinutes: number
  focusSessionsCount: number
}
