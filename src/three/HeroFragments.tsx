import React from 'react'
import { CheckCircle2, Clock, Play, ArrowUpRight } from 'lucide-react'

export const HeroFragments: React.FC = () => {
  return (
    <>
      {/* Fragment 1: Compact Task Card (Top Left) */}
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: '4%',
          zIndex: 10,
          background: 'color-mix(in srgb, var(--bg-surface) 88%, transparent)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '260px',
          animation: 'floatSlow 6s ease-in-out infinite',
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-contrast)',
            flexShrink: 0,
          }}
        >
          <CheckCircle2 size={14} strokeWidth={3} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Spatial orbit tuned
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Architecture · Today
          </div>
        </div>
      </div>

      {/* Fragment 2: Small Project Progress Panel (Bottom Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: '14%',
          left: '8%',
          zIndex: 10,
          background: 'color-mix(in srgb, var(--bg-surface) 88%, transparent)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          boxShadow: 'var(--shadow-md)',
          width: '210px',
          animation: 'floatSlow 7s ease-in-out infinite reverse',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Design System V2
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
            82%
          </span>
        </div>
        <div
          style={{
            height: '4px',
            background: 'var(--bg-hover)',
            borderRadius: 'var(--radius-pill)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '82%',
              height: '100%',
              background: 'var(--accent-secondary)',
              borderRadius: 'var(--radius-pill)',
            }}
          />
        </div>
        <div
          style={{
            marginTop: '8px',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>4 of 5 complete</span>
          <ArrowUpRight size={12} />
        </div>
      </div>

      {/* Fragment 3: Focus Timer Pill (Top Right) */}
      <div
        style={{
          position: 'absolute',
          top: '16%',
          right: '6%',
          zIndex: 10,
          background: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-pill)',
          padding: '8px 16px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'floatSlow 5.5s ease-in-out infinite 1s',
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            boxShadow: '0 0 8px var(--accent)',
          }}
        />
        <span
          className="font-mono"
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
          }}
        >
          24:18
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            paddingLeft: '6px',
            borderLeft: '1px solid var(--border-subtle)',
          }}
        >
          <Play size={10} fill="currentColor" />
          <span>Flow</span>
        </div>
      </div>

      {/* Fragment 4: Subtle Momentum Pulse Indicator (Bottom Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '8%',
          zIndex: 10,
          background: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'floatSlow 6.5s ease-in-out infinite 0.5s',
        }}
      >
        <div
          style={{
            background: 'var(--accent-surface)',
            color: 'var(--accent-contrast)',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Clock size={13} style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Deep Work State
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--accent)' }}>
            Calm & Uninterrupted
          </div>
        </div>
      </div>
    </>
  )
}
