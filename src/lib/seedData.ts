import type { Project, Task, FocusSession, UserSettings } from '@/types'

// Production initial state: clean workspace ready for real user initiatives
export const INITIAL_PROJECTS: Project[] = []
export const INITIAL_TASKS: Task[] = []
export const INITIAL_FOCUS_SESSIONS: FocusSession[] = []

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  focusDuration: 60,
  shortBreakDuration: 10,
  longBreakDuration: 30,
  soundEnabled: true,
  reducedMotion: false,
  autoStartBreaks: false,
}
