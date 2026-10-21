import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TraceLogo } from '@/components/brand/TraceLogo'
import { useTheme } from '@/context/ThemeContext'
import { useWorkspace } from '@/context/WorkspaceContext'

interface AppTopBarProps {
  onOpenNewTaskModal?: () => void
  onOpenSearchModal?: () => void
}

export const AppTopBar: React.FC<AppTopBarProps> = ({
  onOpenNewTaskModal,
  onOpenSearchModal,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme()
  const { timerActive, secondsRemaining, totalSeconds } = useWorkspace()
  const location = useLocation()

  const hours = Math.floor(secondsRemaining / 3600)
  const mins = Math.floor((secondsRemaining % 3600) / 60)
  const secs = secondsRemaining % 60
  const formattedTimer = totalSeconds >= 3600
    ? `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${String(Math.floor(secondsRemaining / 60)).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  const getPageTitle = (path: string) => {
    if (path === '/app') return 'Overview'
    if (path.startsWith('/app/projects')) return 'Projects'
    if (path.startsWith('/app/spatial')) return 'Spatial Workspace'
    if (path.startsWith('/app/tasks')) return 'Tasks'
    if (path.startsWith('/app/focus')) return 'Focus Mode'
    if (path.startsWith('/app/insights')) return 'Insights'
    if (path.startsWith('/app/settings')) return 'Settings'
    return 'Workspace'
  }

  const pageTitle = getPageTitle(location.pathname)

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 clamp(16px, 3vw, 32px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 15,
      }}
    >
      {/* Left: Mobile Brand & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="mobile-only-logo" style={{ display: 'none' }}>
          <Link to="/">
            <TraceLogo size="sm" showMarkOnly />
          </Link>
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {pageTitle}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="hidden-xs">
            TRACE Workspace · Spatial Productivity
          </span>
        </div>
      </div>

      {/* Right Controls: Search, New Task, Theme, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Active Focus Session Badge */}
        {(timerActive || secondsRemaining < totalSeconds) && location.pathname !== '/app/focus' && (
          <Link
            to="/app/focus"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(213, 244, 122, 0.1)',
              border: '1px solid var(--accent)',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
            title="Focus timer running. Click to view focus room."
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: timerActive ? 'var(--accent)' : 'var(--text-muted)',
              }}
            />
            <span className="font-mono">{formattedTimer}</span>
            <span className="hidden-xs" style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
              {timerActive ? 'Focusing' : 'Paused'}
            </span>
          </Link>
        )}

        {/* Search trigger */}
        <button
          onClick={onOpenSearchModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--bg-hover)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '0.8125rem',
            cursor: 'pointer',
          }}
          title="Search tasks and projects"
        >
          <Search size={15} />
          <span className="hidden-xs">Search...</span>
          <kbd
            className="font-mono hidden-xs"
            style={{
              fontSize: '0.7rem',
              background: 'var(--bg-surface)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--bg-hover)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Quick New Task */}
        {onOpenNewTaskModal && (
          <Button
            variant="accent"
            size="sm"
            icon={<Plus size={15} />}
            onClick={onOpenNewTaskModal}
          >
            <span className="hidden-xs">New task</span>
          </Button>
        )}
      </div>

      <style>{`
        @media (max-width: 820px) {
          .mobile-only-logo { display: block !important; }
        }
        @media (max-width: 540px) {
          .hidden-xs { display: none !important; }
        }
      `}</style>
    </header>
  )
}
