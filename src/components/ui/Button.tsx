import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'accent' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      icon,
      iconRight,
      isLoading,
      children,
      className = '',
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '6px 14px', fontSize: '0.8125rem', gap: '6px', borderRadius: 'var(--radius-pill)' },
      md: { padding: '10px 20px', fontSize: '0.9375rem', gap: '8px', borderRadius: 'var(--radius-pill)' },
      lg: { padding: '14px 28px', fontSize: '1rem', gap: '10px', borderRadius: 'var(--radius-pill)' },
    }

    const variantStyles: Record<string, React.CSSProperties> = {
      accent: {
        background: 'var(--accent)',
        color: 'var(--accent-contrast)',
        boxShadow: '0 2px 10px var(--accent-glow)',
        fontWeight: 600,
        border: '1px solid transparent',
      },
      secondary: {
        background: 'var(--bg-elevated)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-subtle)',
        fontWeight: 500,
      },
      ghost: {
        background: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid transparent',
        fontWeight: 500,
      },
      danger: {
        background: 'rgba(239, 68, 68, 0.12)',
        color: '#EF4444',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        fontWeight: 500,
      },
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-sans)',
          cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all var(--transition-fast)',
          whiteSpace: 'nowrap',
          ...sizeStyles[size],
          ...variantStyles[variant],
          ...style,
        }}
        className={`trace-button trace-button-${variant} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span
            style={{
              width: 14,
              height: 14,
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
              display: 'inline-block',
            }}
          />
        ) : (
          icon
        )}
        {children}
        {!isLoading && iconRight}
      </button>
    )
  }
)

Button.displayName = 'Button'
