import React from 'react'

interface SceneFallbackProps {
  label?: string
  size?: number
}

export const SceneFallback: React.FC<SceneFallbackProps> = ({
  label = 'Spatial Core Active',
  size = 320,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: `${size}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none',
      }}
      aria-label="TRACE 3D Spatial Representation"
    >
      {/* Layered concentric ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, rgba(124, 92, 252, 0.15) 50%, transparent 75%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      {/* Stylized SVG orbital sculpture */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      >
        {/* Outer Orbit 1 */}
        <ellipse
          cx="150"
          cy="150"
          rx="120"
          ry="50"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          transform="rotate(-25 150 150)"
          className="opacity-60"
        />
        {/* Outer Orbit 2 */}
        <ellipse
          cx="150"
          cy="150"
          rx="110"
          ry="40"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeDasharray="180 40"
          transform="rotate(35 150 150)"
          className="opacity-80"
        />

        {/* Orbit Node */}
        <circle cx="230" cy="115" r="5" fill="var(--accent)" filter="drop-shadow(0 0 6px var(--accent))" />
        <circle cx="70" cy="190" r="3.5" fill="var(--accent-secondary)" />

        {/* Sculptural Core Spheres */}
        <circle
          cx="150"
          cy="150"
          r="68"
          fill="url(#coreGradient)"
          stroke="var(--border-strong)"
          strokeWidth="1"
          style={{ backdropFilter: 'blur(10px)' }}
        />
        <circle cx="150" cy="150" r="48" fill="url(#innerGradient)" className="opacity-70" />
        <circle cx="150" cy="150" r="24" fill="var(--accent)" className="opacity-90" />

        <defs>
          <radialGradient id="coreGradient" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="var(--bg-elevated)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="var(--bg-surface)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--bg-primary)" stopOpacity="0.95" />
          </radialGradient>
          <radialGradient id="innerGradient" cx="30%" cy="25%" r="65%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="70%" stopColor="var(--accent-secondary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <span
        style={{
          marginTop: '12px',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </span>
    </div>
  )
}
