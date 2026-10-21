import React from 'react'
import { Link } from 'react-router-dom'
import { TraceLogo } from '@/components/brand/TraceLogo'

export const LandingFooter: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-primary)',
        paddingTop: '60px',
        paddingBottom: '60px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '32px',
            marginBottom: '48px',
          }}
        >
          {/* Brand info */}
          <div style={{ maxWidth: '320px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
              <TraceLogo size="md" />
            </Link>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A spatial productivity workspace designed for clarity, intentional momentum, and deep creative focus.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: '16px' }}>
                Product
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>
                  <Link to="/app" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }} className="hover-text-primary">
                    Workspace Overview
                  </Link>
                </li>
                <li>
                  <Link to="/app/projects" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }} className="hover-text-primary">
                    Project Portfolio
                  </Link>
                </li>
                <li>
                  <Link to="/app/spatial" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }} className="hover-text-primary">
                    Spatial Canvas
                  </Link>
                </li>
                <li>
                  <Link to="/app/focus" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }} className="hover-text-primary">
                    Focus Mode
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: '16px' }}>
                Workspace
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>
                  <Link to="/app/tasks" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }} className="hover-text-primary">
                    Task Management
                  </Link>
                </li>
                <li>
                  <Link to="/app/insights" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }} className="hover-text-primary">
                    Productivity Insights
                  </Link>
                </li>
                <li>
                  <Link to="/app/settings" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }} className="hover-text-primary">
                    Settings & Preferences
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div
          style={{
            paddingTop: '28px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>© {new Date().getFullYear()} TRACE Workspace. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
            <span>Find your flow. Trace your progress.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
