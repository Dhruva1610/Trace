import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'subtle'
  interactive?: boolean
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  interactive = false,
  className = '',
  style,
  children,
  ...props
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-sm)',
    },
    elevated: {
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-strong)',
      boxShadow: 'var(--shadow-md)',
    },
    glass: {
      background: 'color-mix(in srgb, var(--bg-surface) 80%, transparent)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-glass)',
    },
    subtle: {
      background: 'var(--bg-hover)',
      border: '1px dashed var(--border-subtle)',
    },
  }

  return (
    <div
      style={{
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        transition: 'transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast)',
        cursor: interactive ? 'pointer' : 'default',
        ...variantStyles[variant],
        ...style,
      }}
      className={`trace-card ${interactive ? 'card-interactive' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
