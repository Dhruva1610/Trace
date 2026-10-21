import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckSquare, Plus, Clock, Trash2, Edit3, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { PriorityBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useWorkspace } from '@/context/WorkspaceContext'
import { TaskModal } from '@/features/tasks/TaskModal'
import type { Task } from '@/types'

export const TodayTasksWidget: React.FC = () => {
  const { tasks, projects, toggleTaskComplete, deleteTask } = useWorkspace()
  const navigate = useNavigate()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const todayStr = new Date().toISOString().split('T')[0]
  // Prioritize today's tasks first, then other pending tasks
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr)
  const displayTasks = todayTasks.length > 0 ? todayTasks : tasks.slice(0, 5)

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.name || 'General'
  }

  const getProjectColor = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.color || 'var(--accent)'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckSquare size={18} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Today's Focus Tasks
          </h3>
        </div>
        <button
          onClick={() => navigate('/app/tasks')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
          }}
          className="hover-text-primary"
        >
          All tasks ({tasks.length})
          <ArrowRight size={14} />
        </button>
      </div>

      <Card variant="elevated" style={{ padding: '8px 16px' }}>
        {displayTasks.length === 0 ? (
          <div style={{ padding: '36px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              No scheduled tasks for today. You are completely clear!
            </p>
            <Button
              variant="accent"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => {
                setEditingTask(null)
                setIsModalOpen(true)
              }}
            >
              Add a task
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {displayTasks.map((task, idx) => {
              const isCompleted = task.status === 'completed'
              const projName = getProjectName(task.projectId)
              const projColor = getProjectColor(task.projectId)

              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: idx === displayTasks.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                    gap: '12px',
                    transition: 'background var(--transition-fast)',
                  }}
                  className="task-row"
                >
                  {/* Left: Checkbox & Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      aria-label={`Mark task "${task.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '6px',
                        border: isCompleted ? 'none' : '2px solid var(--border-strong)',
                        backgroundColor: isCompleted ? 'var(--accent)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--accent-contrast)',
                        flexShrink: 0,
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
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {task.title}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-secondary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: projColor }} />
                          {projName}
                        </span>
                        {task.dueTime && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <Clock size={10} />
                            {task.dueTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Badges & Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <PriorityBadge priority={task.priority} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                        <Edit3 size={14} />
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
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        taskToEdit={editingTask}
      />

      <style>{`
        .hover-text-danger:hover {
          color: #EF4444 !important;
        }
      `}</style>
    </div>
  )
}
