import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, ArrowRight, Eye, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useWorkspace } from '@/context/WorkspaceContext'

const CURATED_SHOWCASE_NODES = [
  {
    id: 'node-arch',
    name: 'Spatial Graphing & Canvas',
    description: 'Immersive node graphing, 3D orbit dynamics, and camera framing controls.',
    color: '#D5F47A',
    coords: '(-2.2, 0.8)',
  },
  {
    id: 'node-tokens',
    name: 'Tactile Token Architecture',
    description: 'Refined CSS variable system, typographic scale, and tactile glass panels.',
    color: '#9D84FD',
    coords: '(2.1, 1.1)',
  },
  {
    id: 'node-focus',
    name: 'Precision Focus Engine',
    description: 'Uninterrupted deep work countdown with acoustic cues and session tracking.',
    color: '#38BDF8',
    coords: '(0.2, -1.4)',
  },
]

export const SpatialPreviewSection: React.FC = () => {
  const navigate = useNavigate()
  const { projects } = useWorkspace()

  const displayNodes =
    projects.length >= 3
      ? projects.slice(0, 3).map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          color: p.color,
          coords: `(${p.spatialCoords.x.toFixed(1)}, ${p.spatialCoords.y.toFixed(1)})`,
        }))
      : CURATED_SHOWCASE_NODES

  return (
    <section
      id="spatial"
      style={{
        paddingTop: 'clamp(60px, 10vh, 120px)',
        paddingBottom: 'clamp(60px, 10vh, 120px)',
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            <Compass size={14} style={{ color: 'var(--accent)' }} />
            Signature Spatial Dimension
          </div>
          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '16px',
            }}
          >
            Spatial thinking for complex deliverables.
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Break free from flat kanbans and endless vertical feeds. Experience your active projects clustered in responsive 3D space with real physics and orbit controls.
          </p>
        </div>

        {/* Spatial Preview Canvas Stage */}
        <div
          style={{
            maxWidth: '1040px',
            margin: '0 auto',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-strong)',
            background: 'var(--bg-surface)',
            padding: 'clamp(24px, 4vw, 48px)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          {/* Spatial Nodes Grid representation */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {displayNodes.map((node, index) => (
              <Card
                key={node.id}
                variant="elevated"
                interactive
                onClick={() => navigate('/app/spatial')}
                style={{
                  position: 'relative',
                  borderTop: `3px solid ${node.color}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    NODE #0{index + 1}
                  </span>
                  <Badge variant="accent" size="sm" dot>
                    Active Orbit
                  </Badge>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                  {node.name}
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                  {node.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Spatial Coord: {node.coords}</span>
                  <Eye size={14} style={{ color: 'var(--text-secondary)' }} />
                </div>
              </Card>
            ))}
          </div>

          {/* Action Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <Sparkles size={16} style={{ color: 'var(--accent)' }} />
              Works seamlessly on desktop mouse, touchpad, and touch devices.
            </div>
            <Button
              variant="accent"
              size="md"
              iconRight={<ArrowRight size={16} />}
              onClick={() => navigate('/app/spatial')}
            >
              Open Spatial Canvas
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
