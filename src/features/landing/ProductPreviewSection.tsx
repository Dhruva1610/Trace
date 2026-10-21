import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderGit2, Compass, Timer, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'

export const ProductPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'spatial' | 'focus'>('dashboard')
  const navigate = useNavigate()

  return (
    <section
      style={{
        paddingTop: 'clamp(60px, 10vh, 120px)',
        paddingBottom: 'clamp(60px, 10vh, 120px)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              display: 'inline-block',
              marginBottom: '12px',
            }}
          >
            Tactile Interface
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              marginBottom: '16px',
            }}
          >
            A calm, considered cockpit.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Switch between spatial mapping, high-density focus, and milestone tracking without friction.
          </p>
        </div>

        {/* Tab Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '32px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { id: 'dashboard', label: 'Overview Dashboard', icon: <LayoutDashboard size={16} /> },
            { id: 'projects', label: 'Project Portfolio', icon: <FolderGit2 size={16} /> },
            { id: 'spatial', label: 'Spatial Workspace', icon: <Compass size={16} /> },
            { id: 'focus', label: 'Deep Focus Mode', icon: <Timer size={16} /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'all var(--transition-fast)',
                  background: isActive ? 'var(--text-primary)' : 'var(--bg-elevated)',
                  color: isActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'transparent' : 'var(--border-subtle)'}`,
                  boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Interactive Preview Surface Frame */}
        <div
          style={{
            maxWidth: '1040px',
            margin: '0 auto',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-strong)',
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}
        >
          {/* Mock Browser Header Bar */}
          <div
            style={{
              padding: '12px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F87171' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FBBF24' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#34D399' }} />
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                background: 'var(--bg-surface)',
                padding: '4px 16px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              trace.workspace/{activeTab}
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconRight={<ArrowUpRight size={14} />}
              onClick={() => navigate('/app')}
            >
              Launch Live
            </Button>
          </div>

          {/* Preview Tab Dynamic Content */}
          <div style={{ padding: 'clamp(24px, 4vw, 40px)', minHeight: '380px' }}>
            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Good morning · Active Sprint</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      6 of 8 scheduled tasks completed today (75% momentum)
                    </p>
                  </div>
                  <Badge variant="accent" dot>High Momentum</Badge>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <Card variant="elevated" style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Focus Time</div>
                    <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 700, margin: '6px 0', color: 'var(--accent)' }}>3h 25m</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>4 completed deep sessions</div>
                  </Card>
                  <Card variant="elevated" style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Projects</div>
                    <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 700, margin: '6px 0', color: 'var(--accent-secondary)' }}>4 In Flight</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Next milestone due in 3 days</div>
                  </Card>
                  <Card variant="elevated" style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completion Rate</div>
                    <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 700, margin: '6px 0', color: '#34D399' }}>88%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>+14% from last week</div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <Card variant="elevated" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <Badge variant="accent" dot>Active</Badge>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due Oct 28</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Spatial Canvas Architecture</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Immersive 3D node graphing, orbit interaction, and camera framing controls.
                  </p>
                  <ProgressBar percentage={78} showLabel />
                </Card>

                <Card variant="elevated" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <Badge variant="violet" dot>Active</Badge>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due Nov 04</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Design System & Micro-surfaces</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Refined token architecture, typographic scale, and tactile glass panels.
                  </p>
                  <ProgressBar percentage={60} color="var(--accent-secondary)" showLabel />
                </Card>
              </div>
            )}

            {activeTab === 'spatial' && (
              <div
                style={{
                  height: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'radial-gradient(circle at center, var(--bg-elevated) 0%, var(--bg-surface) 100%)',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px dashed var(--border-strong)',
                }}
              >
                <div style={{ textAlign: 'center', zIndex: 2, padding: '24px' }}>
                  <Compass size={42} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
                    Full 3D Interactive Spatial Workspace
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px auto' }}>
                    Inspect floating project nodes in 3D orbit, rotate the spatial canvas, and manage dependencies visually.
                  </p>
                  <Button variant="accent" onClick={() => navigate('/app/spatial')} iconRight={<ArrowUpRight size={16} />}>
                    Enter Spatial Workspace
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'focus' && (
              <div
                style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <Badge variant="accent" dot>Deep Work Active</Badge>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '0.04em',
                    margin: '16px 0',
                  }}
                >
                  24:18
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '24px' }}>
                  Target: Finalize orbit dampening and camera bounds
                </p>
                <Button variant="accent" size="lg" onClick={() => navigate('/app/focus')}>
                  Launch Distraction-Free Focus
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
