import React from 'react'

interface TraceLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showMarkOnly?: boolean
  className?: string
}

export const TraceLogo: React.FC<TraceLogoProps> = ({
  size = 'md',
  showMarkOnly = false,
  className = '',
}) => {
  const iconDimensions = {
    sm: 22,
    md: 28,
    lg: 38,
  }[size]

  const textStyles = {
    sm: 'text-sm font-bold tracking-widest',
    md: 'text-lg font-bold tracking-wider',
    lg: 'text-2xl font-extrabold tracking-wider',
  }[size]

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: size === 'sm' ? '8px' : '10px' }}
      aria-label="TRACE"
    >
      {/* Abstract geometric orbital emblem */}
      <svg
        width={iconDimensions}
        height={iconDimensions}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:rotate-12 duration-300"
      >
        {/* Outer dashed trajectory */}
        <circle
          cx="16"
          cy="16"
          r="12"
          stroke="var(--accent)"
          strokeWidth="2.2"
          strokeDasharray="28 14"
          strokeLinecap="round"
          className="opacity-95"
        />
        {/* Core celestial nucleus */}
        <circle cx="16" cy="16" r="4.5" fill="var(--accent)" />
        {/* Violet orbital satellite */}
        <circle cx="25" cy="10" r="2.5" fill="var(--accent-secondary)" />
      </svg>

      {!showMarkOnly && (
        <span
          className={textStyles}
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 800,
            letterSpacing: '0.12em',
            fontSize: size === 'sm' ? '0.95rem' : size === 'lg' ? '1.5rem' : '1.2rem',
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
          }}
        >
          TRACE
        </span>
      )}
    </div>
  )
}
