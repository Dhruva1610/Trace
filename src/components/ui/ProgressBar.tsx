import React from 'react'

interface ProgressBarProps {
  percentage: number
  color?: string
  height?: number
  showLabel?: boolean
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = 'var(--accent)',
  height = 6,
  showLabel = false,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, percentage))

  return (
    <div className={`w-full ${className}`} style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span>Progress</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{clamped}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'var(--bg-hover)',
          borderRadius: 'var(--radius-pill)',
          overflow: 'hidden',
          position: 'relative',
        }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          style={{
            height: '100%',
            width: `${clamped}%`,
            backgroundColor: color,
            borderRadius: 'var(--radius-pill)',
            transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: clamped > 0 ? `0 0 8px ${color}66` : 'none',
          }}
        />
      </div>
    </div>
  )
}
