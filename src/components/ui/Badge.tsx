import React from 'react'
import type { ProjectStatus, TaskPriority } from '@/types'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'violet' | 'success' | 'warning' | 'danger' | 'neutral'
  size?: 'sm' | 'md'
  className?: string
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles: Record<string, { bg: string; color: string; border: string }> = {
    default: {
      bg: 'var(--bg-elevated)',
      color: 'var(--text-secondary)',
      border: 'var(--border-subtle)',
    },
    accent: {
      bg: 'var(--accent-surface)',
      color: 'var(--text-primary)',
      border: 'rgba(213, 244, 122, 0.4)',
    },
    violet: {
      bg: 'var(--accent-secondary-surface)',
      color: 'var(--accent-secondary)',
      border: 'rgba(157, 132, 253, 0.35)',
    },
    success: {
      bg: 'rgba(52, 211, 153, 0.12)',
      color: '#34D399',
      border: 'rgba(52, 211, 153, 0.3)',
    },
    warning: {
      bg: 'rgba(251, 191, 36, 0.12)',
      color: '#FBBF24',
      border: 'rgba(251, 191, 36, 0.3)',
    },
    danger: {
      bg: 'rgba(248, 113, 113, 0.12)',
      color: '#F87171',
      border: 'rgba(248, 113, 113, 0.3)',
    },
    neutral: {
      bg: 'var(--bg-hover)',
      color: 'var(--text-muted)',
      border: 'transparent',
    },
  }

  const currentVariant = variantStyles[variant] || variantStyles.default
  const isSm = size === 'sm'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: isSm ? '2px 8px' : '4px 10px',
        fontSize: isSm ? '0.7rem' : '0.78125rem',
        fontWeight: 600,
        borderRadius: 'var(--radius-pill)',
        background: currentVariant.bg,
        color: currentVariant.color,
        border: `1px solid ${currentVariant.border}`,
        lineHeight: 1.2,
        letterSpacing: '0.015em',
      }}
      className={className}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: currentVariant.color,
          }}
        />
      )}
      {children}
    </span>
  )
}

export const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const mapping: Record<ProjectStatus, { label: string; variant: BadgeProps['variant'] }> = {
    planning: { label: 'Planning', variant: 'warning' },
    active: { label: 'Active', variant: 'accent' },
    on_hold: { label: 'On Hold', variant: 'default' },
    completed: { label: 'Completed', variant: 'success' },
  }
  const item = mapping[status] || { label: status, variant: 'default' }
  return (
    <Badge variant={item.variant} dot>
      {item.label}
    </Badge>
  )
}

export const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const mapping: Record<TaskPriority, { label: string; variant: BadgeProps['variant'] }> = {
    high: { label: 'High', variant: 'danger' },
    medium: { label: 'Medium', variant: 'warning' },
    low: { label: 'Low', variant: 'neutral' },
  }
  const item = mapping[priority] || { label: priority, variant: 'neutral' }
  return (
    <Badge variant={item.variant} size="sm">
      {item.label}
    </Badge>
  )
}
