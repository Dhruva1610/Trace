import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderGit2,
  Compass,
  CheckSquare,
  Timer,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { TraceLogo } from '@/components/brand/TraceLogo'

export const AppSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { to: '/app', label: 'Overview', icon: <LayoutDashboard size={19} />, end: true },
    { to: '/app/projects', label: 'Projects', icon: <FolderGit2 size={19} /> },
    { to: '/app/spatial', label: 'Spatial View', icon: <Compass size={19} /> },
    { to: '/app/tasks', label: 'Tasks', icon: <CheckSquare size={19} /> },
    { to: '/app/focus', label: 'Focus', icon: <Timer size={19} /> },
    { to: '/app/insights', label: 'Insights', icon: <BarChart3 size={19} /> },
    { to: '/app/settings', label: 'Settings', icon: <Settings size={19} /> },
  ]

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '240px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width var(--transition-normal)',
        position: 'relative',
        zIndex: 20,
        flexShrink: 0,
      }}
      className="hidden-mobile-sidebar"
      aria-label="Application Navigation"
    >
      {/* Header with Logo */}
      <div>
        <div
          style={{
            height: '70px',
            padding: collapsed ? '0 16px' : '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Link to="/" title="Go to TRACE home">
            <TraceLogo size={collapsed ? 'sm' : 'md'} showMarkOnly={collapsed} />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            padding: '16px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: collapsed ? '10px 0' : '10px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'all var(--transition-fast)',
              })}
              className="trace-navlink"
            >
              <span style={{ color: 'inherit', display: 'flex' }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Collapse Toggle Footer */}
      <div
        style={{
          padding: '14px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'space-between',
          alignItems: 'center',
        }}
      >
        {!collapsed && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Collapse Menu
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            background: 'var(--bg-hover)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .hidden-mobile-sidebar { display: none !important; }
        }
        .trace-navlink:hover {
          background-color: var(--bg-hover) !important;
          color: var(--text-primary) !important;
        }
      `}</style>
    </aside>
  )
}
