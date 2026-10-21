import React from 'react'

export const StatementSection: React.FC = () => {
  return (
    <section
      id="product"
      style={{
        paddingTop: 'clamp(50px, 8vh, 100px)',
        paddingBottom: 'clamp(50px, 8vh, 100px)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-elevated)',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              display: 'inline-block',
              marginBottom: '16px',
            }}
          >
            The Philosophy of TRACE
          </span>

          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 700,
              lineHeight: 1.25,
              color: 'var(--text-primary)',
              letterSpacing: '-0.025em',
              marginBottom: '24px',
            }}
          >
            Most tools fragment your attention with notifications, clutter, and endless checklists.
          </h2>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
            }}
          >
            TRACE is built differently. We believe depth follows stillness. By organizing your work across spatial planes, safeguarding your focus blocks, and tracing every milestone back to what matters, your output turns from reactive hustle into deliberate craft.
          </p>
        </div>
      </div>
    </section>
  )
}
