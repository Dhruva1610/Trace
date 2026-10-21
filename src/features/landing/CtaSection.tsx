import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const CtaSection: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section
      style={{
        paddingTop: 'clamp(80px, 14vh, 160px)',
        paddingBottom: 'clamp(80px, 14vh, 160px)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Background radial highlight */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60vw',
          height: '60vw',
          maxWidth: '600px',
          maxHeight: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-surface) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px',
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Find your flow. Trace your progress.
          </span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            color: 'var(--text-primary)',
            marginBottom: '24px',
          }}
        >
          Make room for meaningful work.
        </h2>

        <p
          style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '40px',
            maxWidth: '560px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Experience a productivity workspace crafted for stillness, spatial clarity, and creative momentum. Instant local access. Zero login barriers.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Button
            variant="accent"
            size="lg"
            iconRight={<ArrowRight size={18} />}
            onClick={() => navigate('/app')}
          >
            Enter your workspace
          </Button>
        </div>
      </div>
    </section>
  )
}
