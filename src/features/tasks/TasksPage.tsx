import React, { useState, useMemo } from 'react'
import {
  CheckSquare,
  Plus,
  Search,
  Trash2,
  Edit3,
  Calendar,
  Clock,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PriorityBadge } from '@/components/ui/Badge'
import { useWorkspace } from '@/context/WorkspaceContext'
import { TaskModal } from './TaskModal'
import { formatDateLabel } from '@/lib/calculations'
import type { Task, TaskPriority } from '@/types'

export const TasksPage: React.FC = () => {
  const { tasks, projects, toggleTaskComplete, deleteTask } = useWorkspace()

  const [tabFilter, setTabFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'due' | 'priority' | 'title' | 'newest'>('due')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const todayStr = new Date().toISOString().split('T')[0]

  // Filter tasks based on tabs, priority, project, and search
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        // Tab filter
        if (tabFilter === 'today') {
          if (t.dueDate !== todayStr) return false
        } else if (tabFilter === 'upcoming') {
          if (t.status === 'completed' || !t.dueDate || t.dueDate <= todayStr) return false
        } else if (tabFilter === 'completed') {
          if (t.status !== 'completed') return false
        }

        // Priority filter
        if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false

        // Project filter
        if (projectFilter !== 'all' && t.projectId !== projectFilter) return false

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchesTitle = t.title.toLowerCase().includes(q)
          const matchesDesc = Boolean(t.description?.toLowerCase().includes(q))
          const matchesLabel = Boolean(t.label?.toLowerCase().includes(q))
          if (!matchesTitle && !matchesDesc && !matchesLabel) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title)
        if (sortBy === 'priority') {
          const weights: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 }
          return weights[b.priority] - weights[a.priority]
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        // default: sort by due date
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
  }, [tasks, tabFilter, priorityFilter, projectFilter, searchQuery, sortBy, todayStr])

  const getProject = (projectId: string) => {
    return projects.find((p) => p.id === projectId)
  }

  // Count tab metrics dynamically
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      today: tasks.filter((t) => t.dueDate === todayStr).length,
      upcoming: tasks.filter((t) => t.status === 'pending' && t.dueDate && t.dueDate > todayStr).length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    }
  }, [tasks, todayStr])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '4px',
            }}
          >
            Tasks & Action Items
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Schedule milestones, track priority dependencies, and celebrate completed momentum.
          </p>
        </div>

        <Button
          variant="accent"
          size="md"
          icon={<Plus size={16} />}
          onClick={() => {
            setEditingTask(null)
            setIsModalOpen(true)
          }}
        >
          Create task
        </Button>
      </div>

      {/* Tab Filter Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'all', label: 'All Tasks', count: counts.all },
          { id: 'today', label: 'Today', count: counts.today },
          { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
          { id: 'completed', label: 'Completed', count: counts.completed },
        ].map((tab) => {
          const isActive = tabFilter === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setTabFilter(tab.id as typeof tabFilter)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 500,
                background: isActive ? 'var(--text-primary)' : 'var(--bg-elevated)',
                color: isActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-pill)',
                  background: isActive ? 'var(--bg-primary)' : 'var(--bg-hover)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Filter & Sorting Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-pill)',
            padding: '8px 16px',
            width: '100%',
            maxWidth: '300px',
          }}
        >
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks or labels..."
            style={{
              width: '100%',
              background: 'transparent',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Dropdowns */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Project select */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            aria-label="Filter by project"
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8125rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Priority select */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter by priority"
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8125rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            aria-label="Sort tasks"
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8125rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <option value="due">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="newest">Sort: Newest</option>
            <option value="title">Sort: Title</option>
          </select>
        </div>
      </div>

      {/* Task List Card */}
      <Card variant="elevated" style={{ padding: '0' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <CheckSquare size={38} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
              No tasks found
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '360px', margin: '0 auto 16px auto' }}>
              No items match your active filters. Relax or schedule a new task.
            </p>
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                setTabFilter('all')
                setPriorityFilter('all')
                setProjectFilter('all')
                setSearchQuery('')
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div>
            {filteredTasks.map((task, idx) => {
              const isCompleted = task.status === 'completed'
              const project = getProject(task.projectId)

              return (
                <div
                  key={task.id}
                  style={{
                    padding: '16px 20px',
                    borderBottom: idx === filteredTasks.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'background var(--transition-fast)',
                  }}
                  className="hover-card-bg"
                >
                  {/* Left: Checkbox & Info */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', minWidth: 0, flex: 1 }}>
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      aria-label={`Mark "${task.title}" as ${isCompleted ? 'pending' : 'completed'}`}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '6px',
                        border: isCompleted ? 'none' : '2px solid var(--border-strong)',
                        backgroundColor: isCompleted ? 'var(--accent)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--accent-contrast)',
                        flexShrink: 0,
                        marginTop: '2px',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      {isCompleted && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2.5 6L5 8.5L9.5 3.5"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          marginBottom: '4px',
                        }}
                      >
                        {task.title}
                      </div>

                      {task.description && (
                        <p
                          style={{
                            fontSize: '0.8125rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.4,
                            marginBottom: '8px',
                          }}
                        >
                          {task.description}
                        </p>
                      )}

                      {/* Meta badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        {project && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-secondary)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: project.color }} />
                            {project.name}
                          </span>
                        )}

                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Calendar size={12} />
                          {formatDateLabel(task.dueDate)}
                        </span>

                        {task.dueTime && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Clock size={12} />
                            {task.dueTime}
                          </span>
                        )}

                        {task.label && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: 'var(--text-muted)',
                              background: 'var(--bg-hover)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-pill)',
                            }}
                          >
                            #{task.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Priority & Action buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <PriorityBadge priority={task.priority} />

                    <button
                      onClick={() => {
                        setEditingTask(task)
                        setIsModalOpen(true)
                      }}
                      aria-label="Edit task"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '4px',
                      }}
                      className="hover-text-primary"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      aria-label="Delete task"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '4px',
                      }}
                      className="hover-text-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        taskToEdit={editingTask}
      />
    </div>
  )
}
