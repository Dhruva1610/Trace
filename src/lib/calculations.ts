import type { Project, Task, FocusSession, WorkspaceStats } from '@/types'

export function calculateProjectProgress(projectId: string, tasks: Task[]): {
  total: number
  completed: number
  percentage: number
} {
  const projectTasks = tasks.filter((t) => t.projectId === projectId)
  if (projectTasks.length === 0) {
    return { total: 0, completed: 0, percentage: 0 }
  }
  const completed = projectTasks.filter((t) => t.status === 'completed').length
  const percentage = Math.round((completed / projectTasks.length) * 100)
  return {
    total: projectTasks.length,
    completed,
    percentage,
  }
}

export function calculateWorkspaceStats(
  projects: Project[],
  tasks: Task[],
  focusSessions: FocusSession[],
  todayStr: string = new Date().toISOString().split('T')[0],
  activeElapsedFocusSeconds: number = 0
): WorkspaceStats {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const pendingTasks = totalTasks - completedTasks
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const activeProjects = projects.filter((p) => p.status === 'active').length
  const totalProjects = projects.length

  const todayTasks = tasks.filter((t) => t.dueDate === todayStr)
  const todayTotalCount = todayTasks.length
  const todayCompletedCount = todayTasks.filter((t) => t.status === 'completed').length

  const completedFocusMinutes = focusSessions
    .filter((s) => s.type === 'focus')
    .reduce((sum, s) => sum + s.durationMinutes, 0)
  const activeFocusMinutes = Math.floor(activeElapsedFocusSeconds / 60)
  const totalFocusMinutes = completedFocusMinutes + activeFocusMinutes
  const focusSessionsCount = focusSessions.filter((s) => s.type === 'focus').length

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate,
    activeProjects,
    totalProjects,
    todayCompletedCount,
    todayTotalCount,
    totalFocusMinutes,
    focusSessionsCount,
  }
}

export function getGreeting(): { greeting: string; subtext: string } {
  const hour = new Date().getHours()
  if (hour < 12) {
    return {
      greeting: 'Good morning',
      subtext: "Let's make meaningful progress on what matters.",
    }
  }
  if (hour < 18) {
    return {
      greeting: 'Good afternoon',
      subtext: 'Maintain your momentum with intentional focus.',
    }
  }
  return {
    greeting: 'Good evening',
    subtext: 'Reflect on your progress and prepare space for tomorrow.',
  }
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMins = minutes % 60
  if (hours === 0) return `${remainingMins}m`
  if (remainingMins === 0) return `${hours}h`
  return `${hours}h ${remainingMins}m`
}

export function formatDateLabel(dateStr?: string): string {
  if (!dateStr) return 'No due date'
  try {
    const today = new Date().toISOString().split('T')[0]
    if (dateStr === today) return 'Today'
    const dateObj = new Date(dateStr)
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}
