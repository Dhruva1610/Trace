import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Compass,
  ArrowRight,
  Plus,
  CheckCircle2,
} from 'lucide-react'
import { SpatialCanvas } from '@/three/SpatialCanvas'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useWorkspace } from '@/context/WorkspaceContext'
import { calculateProjectProgress } from '@/lib/calculations'
import { ProjectDetailModal } from '@/features/projects/ProjectDetailModal'
import { ProjectModal } from '@/features/projects/ProjectModal'
import type { Project, ProjectStatus } from '@/types'

export const SpatialWorkspacePage: React.FC = () => {
  const { projects, tasks, updateProject, toggleTaskComplete } = useWorkspace()
  const navigate = useNavigate()

  const [selectedProject, setSelectedProject] = useState<Project | null>(() => projects[0] || null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const activeProj = selectedProject || projects[0] || null
  const projectTasks = activeProj ? tasks.filter((t) => t.projectId === activeProj.id) : []
  const { completed, total, percentage } = activeProj
    ? calculateProjectProgress(activeProj.id, tasks)
    : { completed: 0, total: 0, percentage: 0 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
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
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent)',
              marginBottom: '6px',
            }}
          >
            <Compass size={14} />
            3D Spatial Orbit Mode
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '4px',
            }}
          >
            Spatial Project Canvas
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Hover and click nodes in 3D orbit to inspect dependencies, adjust milestones, and execute work.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/app/projects')}
          >
            Grid view
          </Button>
          <Button
            variant="accent"
            size="md"
            icon={<Plus size={16} />}
            onClick={() => setEditModalOpen(true)}
          >
            New project
          </Button>
        </div>
      </div>

      {/* Main Spatial Stage & Inspector Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(300px, 1fr)',
          gap: '24px',
          alignItems: 'stretch',
        }}
        className="spatial-grid-layout"
      >
        {/* 3D Canvas Column */}
        <div style={{ minHeight: '480px', display: 'flex', flexDirection: 'column' }}>
          <SpatialCanvas
            projects={projects}
            selectedProject={activeProj}
            onSelectProject={(p) => setSelectedProject(p)}
          />

          {/* Quick Node Selector Pills underneath canvas */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginTop: '12px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}
          >
            {projects.map((p) => {
              const isSelected = activeProj?.id === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                    border: `1px solid ${isSelected ? p.color : 'var(--border-subtle)'}`,
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                  {p.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Inspector Side Panel */}
        {activeProj ? (
          <Card
            variant="elevated"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: `4px solid ${activeProj.color}`,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Header */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <StatusBadge status={activeProj.status} />
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    XYZ: ({activeProj.spatialCoords.x.toFixed(1)}, {activeProj.spatialCoords.y.toFixed(1)})
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {activeProj.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {activeProj.description}
                </p>
              </div>

              {/* Status Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Project Status
                </label>
                <select
                  value={activeProj.status}
                  onChange={(e) => updateProject(activeProj.id, { status: e.target.value as ProjectStatus })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Calculated Progress */}
              <div style={{ background: 'var(--bg-hover)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>Milestone Completion</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>
                    {percentage}%
                  </span>
                </div>
                <ProgressBar percentage={percentage} color={activeProj.color} height={6} />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {completed} of {total} deliverables complete
                </div>
              </div>

              {/* Associated Tasks Preview */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Project Tasks ({projectTasks.length})
                </div>
                {projectTasks.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                    No tasks assigned yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                    {projectTasks.map((t) => {
                      const isDone = t.status === 'completed'
                      return (
                        <div
                          key={t.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            background: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid var(--border-subtle)',
                            fontSize: '0.8125rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                            <button
                              onClick={() => toggleTaskComplete(t.id)}
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: '4px',
                                border: isDone ? 'none' : '1.5px solid var(--border-strong)',
                                background: isDone ? 'var(--accent)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--accent-contrast)',
                                flexShrink: 0,
                              }}
                            >
                              {isDone && <CheckCircle2 size={12} />}
                            </button>
                            <span
                              style={{
                                textDecoration: isDone ? 'line-through' : 'none',
                                color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
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

            {/* Bottom Actions */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', marginTop: '16px' }}>
              <Button
                variant="secondary"
                size="sm"
                style={{ width: '100%' }}
                iconRight={<ArrowRight size={14} />}
                onClick={() => setDetailModalOpen(true)}
              >
                Inspect full specifications
              </Button>
            </div>
          </Card>
        ) : (
          <Card
            variant="elevated"
            style={{
              padding: '36px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Compass size={40} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
              Spatial Inspector Ready
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5, maxWidth: '320px' }}>
              Create your first initiative to populate 3D spatial orbit coordinates, track milestone deliverables, and inspect live dependencies.
            </p>
            <Button
              variant="accent"
              size="md"
              icon={<Plus size={16} />}
              onClick={() => setEditModalOpen(true)}
            >
              Create first project
            </Button>
          </Card>
        )}
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={activeProj}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onEdit={() => {
          setDetailModalOpen(false)
          setEditModalOpen(true)
        }}
        onAddTask={() => navigate('/app/tasks')}
      />

      {/* Create / Edit Project Modal */}
      <ProjectModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        projectToEdit={null}
      />

      <style>{`
        @media (max-width: 960px) {
          .spatial-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
