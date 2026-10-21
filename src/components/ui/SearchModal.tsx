import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FolderGit2, CheckSquare, ArrowRight, X } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { useWorkspace } from '@/context/WorkspaceContext'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const { projects, tasks } = useWorkspace()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
    }
  }, [isOpen])

  const filteredProjects = query.trim()
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : projects.slice(0, 3)

  const filteredTasks = query.trim()
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          (t.label && t.label.toLowerCase().includes(query.toLowerCase())) ||
          (t.description && t.description.toLowerCase().includes(query.toLowerCase()))
      )
    : tasks.slice(0, 4)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Global Search" subtitle="Jump anywhere in your workspace">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-strong)',
          }}
        >
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tasks, labels..."
            autoFocus
            style={{
              width: '100%',
              background: 'transparent',
              fontSize: '1rem',
              color: 'var(--text-primary)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Projects Group */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FolderGit2 size={13} />
              Projects ({filteredProjects.length})
            </div>
            {filteredProjects.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                No matching projects
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onClose()
                      navigate('/app/projects')
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)',
                    }}
                    className="hover-card-bg"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {p.name}
                      </span>
                    </div>
                    <Badge variant="default" size="sm">
                      {p.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tasks Group */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckSquare size={13} />
              Tasks ({filteredTasks.length})
            </div>
            {filteredTasks.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '8px 0' }}>
                No matching tasks
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filteredTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onClose()
                      navigate('/app/tasks')
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                    className="hover-card-bg"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: t.status === 'completed' ? 'var(--accent)' : 'var(--text-muted)',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: t.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: t.status === 'completed' ? 'line-through' : 'none',
                        }}
                      >
                        {t.title}
                      </span>
                    </div>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
