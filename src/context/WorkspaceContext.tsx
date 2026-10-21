import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import type { Project, Task, FocusSession, UserSettings, WorkspaceStats, FocusModeType } from '@/types'
import { storage } from '@/lib/storage'
import { calculateWorkspaceStats } from '@/lib/calculations'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type?: 'success' | 'info' | 'warning' | 'error'
}

interface WorkspaceContextType {
  projects: Project[]
  tasks: Task[]
  focusSessions: FocusSession[]
  settings: UserSettings
  stats: WorkspaceStats
  toasts: ToastMessage[]

  // Project operations
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'spatialCoords'>) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void

  // Task operations
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => Task
  updateTask: (id: string, updates: Partial<Task>) => void
  toggleTaskComplete: (id: string) => void
  deleteTask: (id: string) => void

  // Focus operations
  addFocusSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void

  // Global Persistent Focus Timer
  timerActive: boolean
  timerMode: FocusModeType
  secondsRemaining: number
  totalSeconds: number
  timerTaskId: string
  timerSoundEnabled: boolean
  elapsedFocusSeconds: number
  startTimer: () => void
  pauseTimer: () => void
  toggleTimer: () => void
  resetTimer: () => void
  switchTimerMode: (mode: FocusModeType) => void
  setTimerTaskId: (taskId: string) => void
  setTimerSoundEnabled: (enabled: boolean) => void
  finishFocusEarly: () => void

  // Settings & Reset
  updateSettings: (updates: Partial<UserSettings>) => void
  clearWorkspaceData: () => void
  importWorkspaceData: (backup: import('@/lib/storage').WorkspaceBackup) => void

  // Toast UI
  showToast: (toast: Omit<ToastMessage, 'id'>) => void
  dismissToast: (id: string) => void
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

const getDurationForMode = (m: FocusModeType, s: UserSettings): number => {
  if (m === 'focus') return (s.focusDuration || 60) * 60
  if (m === 'short_break') return (s.shortBreakDuration || 10) * 60
  return (s.longBreakDuration || 30) * 60
}

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => storage.getProjects())
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks())
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => storage.getFocusSessions())
  const [settings, setSettings] = useState<UserSettings>(() => storage.getSettings())
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Load any previously persisted timer from local storage
  const initialSavedTimer = storage.getActiveTimer()
  const initialMode: FocusModeType = initialSavedTimer?.timerMode || 'focus'
  const initialTotalSeconds = initialSavedTimer?.totalSeconds || getDurationForMode(initialMode, settings)
  let initialSecondsRemaining = initialTotalSeconds
  let initialActive = false
  const initialTaskId = initialSavedTimer?.timerTaskId || ''
  const initialSound = initialSavedTimer?.timerSoundEnabled ?? settings.soundEnabled
  let initialElapsed = initialSavedTimer?.elapsedFocusSeconds || 0

  if (initialSavedTimer) {
    if (initialSavedTimer.timerActive) {
      const elapsedSinceSave = Math.floor((Date.now() - initialSavedTimer.savedAt) / 1000)
      const remaining = Math.max(0, initialSavedTimer.secondsRemaining - elapsedSinceSave)
      const addElapsed = Math.min(initialSavedTimer.secondsRemaining, elapsedSinceSave)
      initialSecondsRemaining = remaining
      if (initialSavedTimer.timerMode === 'focus') {
        initialElapsed += addElapsed
      }
      initialActive = remaining > 0
    } else {
      initialSecondsRemaining = initialSavedTimer.secondsRemaining
      initialActive = false
    }
  }

  // Persistent Focus Timer State
  const [timerActive, setTimerActive] = useState<boolean>(initialActive)
  const [timerMode, setTimerMode] = useState<FocusModeType>(initialMode)
  const [totalSeconds, setTotalSeconds] = useState<number>(initialTotalSeconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSecondsRemaining)
  const [timerTaskId, setTimerTaskId] = useState<string>(initialTaskId)
  const [timerSoundEnabled, setTimerSoundEnabled] = useState<boolean>(initialSound)
  const [elapsedFocusSeconds, setElapsedFocusSeconds] = useState<number>(initialElapsed)

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const newToast: ToastMessage = { ...toast, id }
    setToasts((prev) => [...prev.slice(-3), newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Recalculate stats including active focus in-flight elapsed time
  const stats = useMemo(() => {
    return calculateWorkspaceStats(projects, tasks, focusSessions, undefined, elapsedFocusSeconds)
  }, [projects, tasks, focusSessions, Math.floor(elapsedFocusSeconds / 60)])

  // Audio & confetti notification chime
  const playChimeAndCelebrate = () => {
    if (timerSoundEnabled) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AudioContextClass) {
          const ctx = new AudioContextClass()
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4) // A5
          gain.gain.setValueAtTime(0.2, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.75)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start()
          osc.stop(ctx.currentTime + 0.75)
        }
      } catch {
        // Fallback
      }
    }

    if (!settings.reducedMotion) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D5F47A', '#9D84FD', '#FFFFFF'],
        })
      } catch {
        // Fallback
      }
    }
  }

  // Timer completion handler
  const handleTimerCompleteRef = useRef<() => void>(() => {})
  handleTimerCompleteRef.current = () => {
    playChimeAndCelebrate()

    if (timerMode === 'focus') {
      const durationMins = Math.max(1, Math.round(totalSeconds / 60))
      const targetTask = tasks.find((t) => t.id === timerTaskId)
      const session: FocusSession = {
        id: `focus-${Date.now()}`,
        taskId: timerTaskId || undefined,
        taskTitle: targetTask?.title,
        projectId: targetTask?.projectId,
        durationMinutes: durationMins,
        completedAt: new Date().toISOString(),
        type: 'focus',
      }
      const updated = [session, ...focusSessions]
      setFocusSessions(updated)
      storage.saveFocusSessions(updated)
      setElapsedFocusSeconds(0)

      showToast({
        title: 'Focus block completed',
        description: `Logged ${durationMins}m of deep work`,
        type: 'success',
      })
    } else {
      showToast({
        title: timerMode === 'short_break' ? 'Short break complete' : 'Long break complete',
        description: 'Ready for your next deep work session',
        type: 'info',
      })
    }

    const nextDur = getDurationForMode(timerMode, settings)
    setSecondsRemaining(nextDur)
    setTotalSeconds(nextDur)
  }

  // Background interval ticker - survives route changes without resetting
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (timerActive && secondsRemaining > 0) {
      let lastTimestamp = Date.now()

      interval = setInterval(() => {
        const now = Date.now()
        const delta = Math.max(1, Math.round((now - lastTimestamp) / 1000))
        lastTimestamp = now

        setSecondsRemaining((prev) => {
          if (prev <= delta) {
            setTimerActive(false)
            setTimeout(() => {
              handleTimerCompleteRef.current()
            }, 0)
            return 0
          }
          return prev - delta
        })

        if (timerMode === 'focus') {
          setElapsedFocusSeconds((prev) => prev + delta)
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, secondsRemaining, timerMode])

  // Persist timer state to local storage
  useEffect(() => {
    storage.saveActiveTimer({
      timerActive,
      timerMode,
      secondsRemaining,
      totalSeconds,
      timerTaskId,
      timerSoundEnabled,
      elapsedFocusSeconds,
      savedAt: Date.now(),
    })
  }, [timerActive, timerMode, secondsRemaining, totalSeconds, timerTaskId, timerSoundEnabled, elapsedFocusSeconds])

  // Only adjust durations if the timer is inactive and hasn't started counting down yet
  useEffect(() => {
    if (!timerActive && secondsRemaining === totalSeconds) {
      const dur = getDurationForMode(timerMode, settings)
      setTotalSeconds(dur)
      setSecondsRemaining(dur)
    }
  }, [settings.focusDuration, settings.shortBreakDuration, settings.longBreakDuration])

  // Focus Timer controls
  const startTimer = () => {
    if (secondsRemaining <= 0) {
      const dur = getDurationForMode(timerMode, settings)
      setTotalSeconds(dur)
      setSecondsRemaining(dur)
    }
    setTimerActive(true)
  }

  const pauseTimer = () => {
    // Pauses cleanly without resetting remaining time
    setTimerActive(false)
  }

  const toggleTimer = () => {
    if (timerActive) {
      pauseTimer()
    } else {
      startTimer()
    }
  }

  const resetTimer = () => {
    setTimerActive(false)
    const dur = getDurationForMode(timerMode, settings)
    setTotalSeconds(dur)
    setSecondsRemaining(dur)
    setElapsedFocusSeconds(0)
  }

  const switchTimerMode = (newMode: FocusModeType) => {
    // Save any focus work >= 1 minute before switching modes
    if (timerMode === 'focus' && elapsedFocusSeconds >= 60) {
      const elapsedMins = Math.floor(elapsedFocusSeconds / 60)
      const targetTask = tasks.find((t) => t.id === timerTaskId)
      const session: FocusSession = {
        id: `focus-${Date.now()}`,
        taskId: timerTaskId || undefined,
        taskTitle: targetTask?.title,
        projectId: targetTask?.projectId,
        durationMinutes: elapsedMins,
        completedAt: new Date().toISOString(),
        type: 'focus',
      }
      const updated = [session, ...focusSessions]
      setFocusSessions(updated)
      storage.saveFocusSessions(updated)
    }

    setTimerActive(false)
    setTimerMode(newMode)
    setElapsedFocusSeconds(0)
    const dur = getDurationForMode(newMode, settings)
    setTotalSeconds(dur)
    setSecondsRemaining(dur)
  }

  const finishFocusEarly = () => {
    const elapsedMins = Math.floor(elapsedFocusSeconds / 60)
    if (timerMode === 'focus' && elapsedMins >= 1) {
      const targetTask = tasks.find((t) => t.id === timerTaskId)
      const session: FocusSession = {
        id: `focus-${Date.now()}`,
        taskId: timerTaskId || undefined,
        taskTitle: targetTask?.title,
        projectId: targetTask?.projectId,
        durationMinutes: elapsedMins,
        completedAt: new Date().toISOString(),
        type: 'focus',
      }
      const updated = [session, ...focusSessions]
      setFocusSessions(updated)
      storage.saveFocusSessions(updated)
      showToast({
        title: 'Focus block recorded',
        description: `Logged ${elapsedMins}m to your productivity stats`,
        type: 'success',
      })
    }
    setTimerActive(false)
    setElapsedFocusSeconds(0)
    const dur = getDurationForMode(timerMode, settings)
    setTotalSeconds(dur)
    setSecondsRemaining(dur)
  }

  // Project Actions
  const createProject = (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'spatialCoords'>): Project => {
    const now = new Date().toISOString()
    const count = projects.length
    const angle = (count * 1.25) % (Math.PI * 2)
    const radius = 2.2 + (count % 2) * 0.5
    const newProject: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      spatialCoords: {
        x: Math.cos(angle) * radius,
        y: (Math.sin(angle) * 1.2) + ((count % 3) - 1) * 0.4,
        z: Math.sin(angle * 1.5) * 1.2,
      },
    }

    const updated = [newProject, ...projects]
    setProjects(updated)
    storage.saveProjects(updated)
    showToast({ title: 'Project created', description: `"${newProject.name}" added to workspace`, type: 'success' })
    return newProject
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        return { ...p, ...updates, updatedAt: new Date().toISOString() }
      }
      return p
    })
    setProjects(updated)
    storage.saveProjects(updated)
    showToast({ title: 'Project updated', type: 'info' })
  }

  const deleteProject = (id: string) => {
    const projToDelete = projects.find((p) => p.id === id)
    const updatedProjects = projects.filter((p) => p.id !== id)
    const updatedTasks = tasks.filter((t) => t.projectId !== id)

    setProjects(updatedProjects)
    setTasks(updatedTasks)
    storage.saveProjects(updatedProjects)
    storage.saveTasks(updatedTasks)

    showToast({
      title: 'Project removed',
      description: projToDelete ? `"${projToDelete.name}" and associated tasks deleted` : undefined,
      type: 'warning',
    })
  }

  // Task Actions
  const createTask = (data: Omit<Task, 'id' | 'createdAt' | 'status'>): Task => {
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    const updated = [newTask, ...tasks]
    setTasks(updated)
    storage.saveTasks(updated)
    showToast({ title: 'Task scheduled', description: newTask.title, type: 'success' })
    return newTask
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    setTasks(updated)
    storage.saveTasks(updated)
    showToast({ title: 'Task updated', type: 'info' })
  }

  const toggleTaskComplete = (id: string) => {
    let nowCompleted = false
    const updated = tasks.map((t) => {
      if (t.id === id) {
        nowCompleted = t.status !== 'completed'
        return {
          ...t,
          status: nowCompleted ? ('completed' as const) : ('pending' as const),
          completedAt: nowCompleted ? new Date().toISOString() : undefined,
        }
      }
      return t
    })

    setTasks(updated)
    storage.saveTasks(updated)

    if (nowCompleted) {
      if (!settings.reducedMotion) {
        try {
          confetti({
            particleCount: 45,
            spread: 55,
            origin: { y: 0.8 },
            colors: ['#D5F47A', '#9D84FD', '#F4F4F0'],
          })
        } catch {
          // Fallback if canvas is unavailable
        }
      }
      showToast({ title: 'Task completed', description: 'Progress traced to your dashboard', type: 'success' })
    }
  }

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id)
    setTasks(updated)
    storage.saveTasks(updated)
    showToast({ title: 'Task deleted', type: 'warning' })
  }

  // Focus Actions
  const addFocusSession = (sessionData: Omit<FocusSession, 'id' | 'completedAt'>) => {
    const session: FocusSession = {
      ...sessionData,
      id: `focus-${Date.now()}`,
      completedAt: new Date().toISOString(),
    }
    const updated = [session, ...focusSessions]
    setFocusSessions(updated)
    storage.saveFocusSessions(updated)

    showToast({
      title: session.type === 'focus' ? 'Focus block logged' : 'Break completed',
      description: `${session.durationMinutes} minutes recorded`,
      type: 'success',
    })
  }

  // Settings
  const updateSettings = (updates: Partial<UserSettings>) => {
    const updated = { ...settings, ...updates }
    setSettings(updated)
    storage.saveSettings(updated)
    showToast({ title: 'Preferences saved', type: 'info' })
  }

  const clearWorkspaceData = () => {
    const res = storage.clearAllData()
    setProjects(res.projects)
    setTasks(res.tasks)
    setFocusSessions(res.focusSessions)
    setSettings(res.settings)
    resetTimer()
    showToast({ title: 'Workspace cleared', description: 'Reset to a clean workspace', type: 'info' })
  }

  const importWorkspaceData = (backup: import('@/lib/storage').WorkspaceBackup) => {
    const res = storage.importData(backup)
    setProjects(res.projects)
    setTasks(res.tasks)
    setFocusSessions(res.focusSessions)
    setSettings(res.settings)
    showToast({
      title: 'Workspace imported',
      description: `Loaded ${res.projects.length} projects and ${res.tasks.length} tasks`,
      type: 'success',
    })
  }

  return (
    <WorkspaceContext.Provider
      value={{
        projects,
        tasks,
        focusSessions,
        settings,
        stats,
        toasts,
        createProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        addFocusSession,
        timerActive,
        timerMode,
        secondsRemaining,
        totalSeconds,
        timerTaskId,
        timerSoundEnabled,
        elapsedFocusSeconds,
        startTimer,
        pauseTimer,
        toggleTimer,
        resetTimer,
        switchTimerMode,
        setTimerTaskId,
        setTimerSoundEnabled,
        finishFocusEarly,
        updateSettings,
        clearWorkspaceData,
        importWorkspaceData,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace(): WorkspaceContextType {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}
