import React, { useState, useMemo } from 'react'
import {
  FolderGit2,
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useWorkspace } from '@/context/WorkspaceContext'
import { calculateProjectProgress, formatDateLabel } from '@/lib/calculations'
import { ProjectModal } from './ProjectModal'
import { ProjectDetailModal } from './ProjectDetailModal'
import { TaskModal } from '@/features/tasks/TaskModal'
import type { Project } from '@/types'

export const ProjectsPage: React.FC = () => {
  const { projects, tasks } = useWorkspace()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'progress' | 'due' | 'name' | 'newest'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [newTaskProjectId, setNewTaskProjectId] = useState<string | null>(null)

  // Filter and Sort Projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'due') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        if (sortBy === 'progress') {
          const progA = calculateProjectProgress(a.id, tasks).percentage
          const progB = calculateProjectProgress(b.id, tasks).percentage
          return progB - progA
        }
        // default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }, [projects, tasks, searchQuery, statusFilter, sortBy])

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
              marginBottom: '6px',
            }}
          >
            Project Portfolio
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Organize complex initiatives into tangible milestones with real-time progress tracing.
          </p>
        </div>

        <Button
          variant="accent"
          size="md"
          icon={<Plus size={16} />}
          onClick={() => {
            setEditingProject(null)
            setIsCreateModalOpen(true)
          }}
        >
          Create project
        </Button>
      </div>

      {/* Controls Bar: Search, Filters, Sorting, View Toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Left: Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-pill)',
            padding: '8px 16px',
            width: '100%',
            maxWidth: '320px',
          }}
        >
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            style={{
              width: '100%',
              background: 'transparent',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Right Controls: Status filter, Sort, View Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Status Filter Pills */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-pill)',
              padding: '3px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'planning', label: 'Planning' },
              { id: 'on_hold', label: 'On Hold' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => {
              const isSelected = statusFilter === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 600 : 500,
                    background: isSelected ? 'var(--text-primary)' : 'transparent',
                    color: isSelected ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            aria-label="Sort projects"
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
            <option value="newest">Sort: Newest</option>
            <option value="progress">Sort: Progress</option>
            <option value="due">Sort: Due Date</option>
            <option value="name">Sort: Alphabetical</option>
          </select>

          {/* Grid / List View Toggle */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-pill)',
              padding: '3px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: viewMode === 'grid' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: viewMode === 'list' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <Card variant="subtle" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <FolderGit2 size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
            No projects found
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px auto' }}>
            No projects matched your active search and filter combination.
          </p>
          <Button
            variant="accent"
            size="sm"
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
            }}
          >
            Clear filters
          </Button>
        </Card>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredProjects.map((project) => {
            const { completed, total, percentage } = calculateProjectProgress(project.id, tasks)

            return (
              <Card
                key={project.id}
                variant="elevated"
                interactive
                onClick={() => setSelectedProject(project)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${project.color}`,
                  minHeight: '220px',
                }}
                tabIndex={0}
                role="button"
                aria-label={`Open details for project ${project.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedProject(project)
                  }
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
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
                      <Calendar size={13} />
                      <span>{formatDateLabel(project.dueDate)}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                    {project.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '20px',
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
                      marginBottom: '8px',
                      fontSize: '0.78rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>
                      {completed} of {total} tasks
                    </span>
                    <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {percentage}%
                    </span>
                  </div>
                  <ProgressBar percentage={percentage} color={project.color} height={6} />
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        /* List Mode View */
        <Card variant="elevated" style={{ padding: '0' }}>
          {filteredProjects.map((project, idx) => {
            const { percentage } = calculateProjectProgress(project.id, tasks)

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                style={{
                  padding: '16px 20px',
                  borderBottom: idx === filteredProjects.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  borderLeft: `4px solid ${project.color}`,
                }}
                className="hover-card-bg"
              >
                <div style={{ flex: 2, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{project.name}</h4>
                    <StatusBadge status={project.status} />
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {project.description}
                  </p>
                </div>

                <div style={{ flex: 1, minWidth: '140px' }} className="hidden-xs">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                    <span className="font-mono" style={{ fontWeight: 700 }}>{percentage}%</span>
                  </div>
                  <ProgressBar percentage={percentage} color={project.color} height={4} />
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {formatDateLabel(project.dueDate)}
                </div>
              </div>
            )
          })}
        </Card>
      )}

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        onEdit={(proj) => {
          setEditingProject(proj)
          setIsCreateModalOpen(true)
        }}
        onAddTask={(projId) => setNewTaskProjectId(projId)}
      />

      {/* Project Create / Edit Modal */}
      <ProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditingProject(null)
        }}
        projectToEdit={editingProject}
      />

      {/* Quick Task Creation from within project */}
      <TaskModal
        isOpen={Boolean(newTaskProjectId)}
        onClose={() => setNewTaskProjectId(null)}
      />
    </div>
  )
}
