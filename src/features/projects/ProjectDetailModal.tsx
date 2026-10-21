import React, { useState } from 'react'
import { Trash2, Edit3, Plus } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useWorkspace } from '@/context/WorkspaceContext'
import { calculateProjectProgress, formatDateLabel } from '@/lib/calculations'
import type { Project } from '@/types'

interface ProjectDetailModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onEdit: (project: Project) => void
  onAddTask: (projectId: string) => void
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onEdit,
  onAddTask,
}) => {
  const { tasks, toggleTaskComplete, deleteProject } = useWorkspace()
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!project) return null

  const projectTasks = tasks.filter((t) => t.projectId === project.id)
  const { completed, total, percentage } = calculateProjectProgress(project.id, tasks)

  const handleDelete = () => {
    deleteProject(project.id)
    setConfirmDelete(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setConfirmDelete(false)
        onClose()
      }}
      title={project.name}
      subtitle={`Timeline: ${formatDateLabel(project.startDate)} → ${formatDateLabel(project.dueDate)}`}
      maxWidth="620px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Status & Accent Banner */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-elevated)',
            borderLeft: `4px solid ${project.color}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StatusBadge status={project.status} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {project.status.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <Button
              variant="secondary"
              size="sm"
              icon={<Edit3 size={13} />}
              onClick={() => {
                onClose()
                onEdit(project)
              }}
            >
              Edit
            </Button>
            {!confirmDelete ? (
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 size={13} />}
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </Button>
            ) : (
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
              >
                Confirm Delete?
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {project.description}
        </p>

        {/* Progress Breakdown */}
        <div
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-hover)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 600 }}>Calculated Progress</span>
            <span className="font-mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>
              {percentage}% ({completed} of {total} tasks)
            </span>
          </div>
          <ProgressBar percentage={percentage} color={project.color} height={6} />
        </div>

        {/* Associated Tasks List */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              Associated Tasks ({projectTasks.length})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => {
                onClose()
                onAddTask(project.id)
              }}
            >
              Add task
            </Button>
          </div>

          {projectTasks.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No tasks currently tracked for this project.
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              {projectTasks.map((t) => {
                const isCompleted = t.status === 'completed'
                return (
                  <div
                    key={t.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <button
                        onClick={() => toggleTaskComplete(t.id)}
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '4px',
                          border: isCompleted ? 'none' : '1.5px solid var(--border-strong)',
                          backgroundColor: isCompleted ? 'var(--accent)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'var(--accent-contrast)',
                          flexShrink: 0,
                        }}
                      >
                        {isCompleted && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2.5 6L5 8.5L9.5 3.5"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                      <span
                        style={{
                          fontSize: '0.85rem',
                          color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {t.title}
                      </span>
                    </div>
                    <PriorityBadge priority={t.priority} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
