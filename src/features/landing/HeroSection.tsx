import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Compass, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TraceOrb } from '@/three/TraceOrb'
import { HeroFragments } from '@/three/HeroFragments'

export const HeroSection: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section
      style={{
        position: 'relative',
        paddingTop: 'clamp(40px, 8vh, 100px)',
        paddingBottom: 'clamp(60px, 10vh, 120px)',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient radial gradients */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '5%',
          width: '50vw',
          height: '50vw',
          maxWidth: '650px',
          maxHeight: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-surface) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(32px, 5vw, 64px)',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Editorial Copy */}
        <div style={{ maxWidth: '600px' }}>
          {/* Eyebrow badge */}
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
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
              }}
            >
              A workspace for intentional work
            </span>
          </div>

          {/* Large Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.2vw, 4.25rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              color: 'var(--text-primary)',
              marginBottom: '20px',
            }}
          >
            Make space for your best work.
          </h1>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
              lineHeight: 1.55,
              color: 'var(--text-secondary)',
              marginBottom: '36px',
              maxWidth: '520px',
            }}
          >
            Bring your projects, tasks, and focus into one considered workspace. Less noise. More meaningful progress.
          </p>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              alignItems: 'center',
              marginBottom: '32px',
            }}
          >
            <Button
              variant="accent"
              size="lg"
              iconRight={<ArrowRight size={18} />}
              onClick={() => navigate('/app')}
            >
              Enter your workspace
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<Compass size={18} />}
              onClick={() => {
                const el = document.getElementById('spatial')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Explore the experience
            </Button>
          </div>

          {/* Trust / Detail Note */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.8125rem',
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
              }}
            />
            Designed for clarity. Built for momentum.
          </div>
        </div>

        {/* Right Column: 3D Centerpiece & Floating Fragments */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(380px, 50vw, 560px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Floating contextual fragments */}
          <HeroFragments />

          {/* 3D Orb Scene */}
          <TraceOrb height="100%" />
        </div>
      </div>
    </section>
  )
}
