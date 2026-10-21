import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useWorkspace } from '@/context/WorkspaceContext'
import type { Project, ProjectStatus } from '@/types'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  projectToEdit?: Project | null
}

const COLOR_OPTIONS = [
  { label: 'Lime', value: '#D5F47A' },
  { label: 'Violet', value: '#9D84FD' },
  { label: 'Sky', value: '#38BDF8' },
  { label: 'Amber', value: '#FBBF24' },
  { label: 'Emerald', value: '#34D399' },
  { label: 'Coral', value: '#F87171' },
]

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const { createProject, updateProject } = useWorkspace()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#D5F47A')
  const [status, setStatus] = useState<ProjectStatus>('active')
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name)
      setDescription(projectToEdit.description)
      setColor(projectToEdit.color)
      setStatus(projectToEdit.status)
      setStartDate(projectToEdit.startDate)
      setDueDate(projectToEdit.dueDate)
    } else {
      setName('')
      setDescription('')
      setColor('#D5F47A')
      setStatus('active')
      const today = new Date().toISOString().split('T')[0]
      setStartDate(today)
      // default due date 30 days from now
      const d = new Date()
      d.setDate(d.getDate() + 30)
      setDueDate(d.toISOString().split('T')[0])
    }
    setError('')
  }, [projectToEdit, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Project name is required')
      return
    }
    if (!startDate || !dueDate) {
      setError('Start date and due date are required')
      return
    }
    if (new Date(dueDate) < new Date(startDate)) {
      setError('Due date cannot precede start date')
      return
    }

    if (projectToEdit) {
      updateProject(projectToEdit.id, {
        name: name.trim(),
        description: description.trim(),
        color,
        status,
        startDate,
        dueDate,
      })
    } else {
      createProject({
        name: name.trim(),
        description: description.trim(),
        color,
        status,
        startDate,
        dueDate,
      })
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Edit Project' : 'Create New Project'}
      subtitle="Establish spatial parameters and milestone targets."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#EF4444',
              fontSize: '0.85rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Project Name */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
            Project Name <span style={{ color: 'var(--color-coral)' }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError('')
            }}
            placeholder="e.g., Ambient Focus Soundscapes"
            autoFocus
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.9375rem',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Core deliverable and intent..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Status & Color Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
              }}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              Color Accent
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '42px' }}>
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  title={c.label}
                  aria-label={c.label}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: c.value,
                    border: color === c.value ? '2px solid var(--text-primary)' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'transform var(--transition-fast)',
                    transform: color === c.value ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Start Date & Due Date Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              Start Date <span style={{ color: 'var(--color-coral)' }}>*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              Due Date <span style={{ color: 'var(--color-coral)' }}>*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="accent" type="submit">
            {projectToEdit ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
