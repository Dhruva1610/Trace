import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderGit2, Compass, CheckSquare, Timer, BarChart3 } from 'lucide-react'

export const MobileBottomNav: React.FC = () => {
  const items = [
    { to: '/app', label: 'Overview', icon: <LayoutDashboard size={20} />, end: true },
    { to: '/app/projects', label: 'Projects', icon: <FolderGit2 size={20} /> },
    { to: '/app/spatial', label: 'Spatial', icon: <Compass size={20} /> },
    { to: '/app/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { to: '/app/focus', label: 'Focus', icon: <Timer size={20} /> },
    { to: '/app/insights', label: 'Insights', icon: <BarChart3 size={20} /> },
  ]

  return (
    <nav
      style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        zIndex: 40,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 8px',
      }}
      className="mobile-bottom-nav"
      aria-label="Mobile Navigation"
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            color: isActive ? 'var(--accent)' : 'var(--text-muted)',
            fontSize: '0.68rem',
            fontWeight: isActive ? 600 : 500,
            textDecoration: 'none',
            padding: '6px 8px',
            borderRadius: 'var(--radius-sm)',
            transition: 'color var(--transition-fast)',
          })}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}

      <style>{`
        @media (max-width: 820px) {
          .mobile-bottom-nav { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
