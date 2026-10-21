import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderGit2, ArrowRight, Calendar, Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useWorkspace } from '@/context/WorkspaceContext'
import { calculateProjectProgress, formatDateLabel } from '@/lib/calculations'

export const ProjectsWidget: React.FC = () => {
  const { projects, tasks } = useWorkspace()
  const navigate = useNavigate()

  const activeProjects = projects.filter((p) => p.status === 'active').slice(0, 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FolderGit2 size={18} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Active Projects
          </h3>
        </div>
        {projects.length > 0 && (
          <button
            onClick={() => navigate('/app/projects')}
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
            View all ({projects.length})
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {activeProjects.length === 0 ? (
        <Card variant="subtle" style={{ padding: '36px 20px', textAlign: 'center' }}>
          <FolderGit2 size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
            No active projects yet
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto 16px auto' }}>
            Initiatives you create will be tracked here with live milestone progress and 3D spatial orbit representation.
          </p>
          <Button
            variant="accent"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => navigate('/app/projects')}
          >
            Create first project
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {activeProjects.map((project) => {
            const { completed, total, percentage } = calculateProjectProgress(project.id, tasks)

            return (
              <Card
                key={project.id}
                variant="elevated"
                interactive
                onClick={() => navigate('/app/projects')}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `3px solid ${project.color}`,
                }}
                tabIndex={0}
                role="button"
                aria-label={`View project ${project.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate('/app/projects')
                  }
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <StatusBadge status={project.status} />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Calendar size={12} />
                      <span>{formatDateLabel(project.dueDate)}</span>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                    {project.name}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '18px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {project.description}
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px',
                      fontSize: '0.75rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>
                      {completed} of {total} tasks
                    </span>
                    <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {percentage}%
                    </span>
                  </div>
                  <ProgressBar percentage={percentage} color={project.color} height={5} />
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
