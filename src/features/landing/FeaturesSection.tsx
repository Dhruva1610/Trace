import { ShieldCheck, TrendingUp, Check, Orbit, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const FeaturesSection: React.FC = () => {
  return (
    <section
      id="features"
      style={{
        paddingTop: 'clamp(60px, 10vh, 120px)',
        paddingBottom: 'clamp(60px, 10vh, 120px)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        {/* Feature 1: Asymmetric Row - See your projects clearly */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(32px, 6vw, 64px)',
            alignItems: 'center',
            marginBottom: 'clamp(80px, 12vh, 140px)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--accent-surface)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              <Orbit size={14} style={{ color: 'var(--accent)' }} />
              Spatial Perspective
            </div>
            <h3
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '20px',
              }}
            >
              See your projects clearly.
            </h3>
            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginBottom: '28px',
              }}
            >
              Flat lists collapse complex initiatives into overwhelming noise. In TRACE, projects exist as tangible spatial clusters with clear status rings, priority weight, and calculated progress.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                'Real-time task completion ratios calculated on the fly',
                'Dual-mode support: 3D spatial orbit and high-density list views',
                'Visual color identities for rapid recognition and context switching',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-contrast)',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card
            variant="glass"
            style={{
              padding: '32px',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <Badge variant="accent">3D Cluster Mesh</Badge>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                COORDS: -2.2, 0.8, -0.5
              </span>
            </div>
            <div
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent)' }} />
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Spatial Canvas Architecture</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Immersive 3D node graphing with orbit inertia and responsive camera framing.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Sprint Health</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Optimal (75%)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Feature 2: Inverted Row - Protect your focus */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(32px, 6vw, 64px)',
            alignItems: 'center',
            marginBottom: 'clamp(80px, 12vh, 140px)',
          }}
        >
          <div style={{ order: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--accent-secondary-surface)',
                color: 'var(--accent-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              <ShieldCheck size={14} />
              Unbroken Immersion
            </div>
            <h3
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '20px',
              }}
            >
              Protect your focus.
            </h3>
            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginBottom: '28px',
              }}
            >
              Enter a distraction-free sanctuary when it's time to execute. The focus engine pairs high-precision countdown intervals with calm 3D visuals, auto-break scheduling, and zero intrusive alerts.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                'Configurable deep work cycles: 1h Deep Work, 10m Rest, 30m Reset',
                'Task attachment: link active focus blocks directly to your task list',
                'Zero duplicate timers or ghost intervals when switching views',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'var(--accent-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card
            variant="glass"
            style={{
              order: 1,
              padding: '36px',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
                margin: '0 auto 20px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 32px var(--accent-glow)',
              }}
            >
              <Sparkles size={36} style={{ color: 'var(--accent-contrast)' }} />
            </div>
            <div className="font-mono" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
              25:00
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Focus session ready · Breathe and begin
            </p>
          </Card>
        </div>

        {/* Feature 3: Understand your progress */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(32px, 6vw, 64px)',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(52, 211, 153, 0.12)',
                color: '#34D399',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              <TrendingUp size={14} />
              Genuine Insights
            </div>
            <h3
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '20px',
              }}
            >
              Understand your progress.
            </h3>
            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginBottom: '28px',
              }}
            >
              No fabricated vanity stats or synthetic growth charts. TRACE computes all insights straight from your real completed tasks, weekly velocity, and recorded focus minutes.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                'Aggregated weekly output charts with daily velocity bars',
                'Project completion status distribution and backlog health',
                'Zero external telemetry: 100% private to your browser sandbox',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#34D399',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#11120F',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card
            variant="glass"
            style={{
              padding: '32px',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Weekly Velocity</span>
              <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>+28% momentum</span>
            </div>
            {/* Visual Bar chart representation */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', gap: '12px', paddingBottom: '8px' }}>
              {[
                { day: 'Mon', h: 45, count: 3 },
                { day: 'Tue', h: 70, count: 5 },
                { day: 'Wed', h: 60, count: 4 },
                { day: 'Thu', h: 90, count: 7, active: true },
                { day: 'Fri', h: 80, count: 6 },
                { day: 'Sat', h: 30, count: 2 },
                { day: 'Sun', h: 20, count: 1 },
              ].map((bar, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${bar.h}%`,
                      background: bar.active ? 'var(--accent)' : 'var(--bg-hover)',
                      borderRadius: '4px',
                      boxShadow: bar.active ? '0 0 12px var(--accent-glow)' : 'none',
                      transition: 'height 400ms ease',
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: bar.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
