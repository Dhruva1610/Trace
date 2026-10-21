import React from 'react'
import { Sparkles, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useWorkspace } from '@/context/WorkspaceContext'

export const ProgressWidget: React.FC = () => {
  const { tasks } = useWorkspace()

  // Calculate today's tasks
  const todayStr = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr)
  const completedToday = todayTasks.filter((t) => t.status === 'completed').length
  const totalToday = todayTasks.length
  const dailyPercentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0

  const getStatusMessage = (pct: number, total: number) => {
    if (total === 0) return 'No tasks scheduled for today. Create an intentional task to begin.'
    if (pct === 100) return 'All daily milestones resolved. Exceptional focus and momentum.'
    if (pct >= 75) return 'High daily velocity. Closing out the final key deliverables.'
    if (pct >= 40) return 'Steady momentum in progress. Keep tracing your flow.'
    return 'Starting today’s focus. Pick your highest leverage task first.'
  }

  const message = getStatusMessage(dailyPercentage, totalToday)

  return (
    <Card
      variant="elevated"
      style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '4px solid var(--accent)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              marginBottom: '6px',
            }}
          >
            <Sparkles size={13} style={{ color: 'var(--accent)' }} />
            Today's Trajectory
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Daily Momentum
          </h3>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div
            className="font-mono"
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--accent)',
              lineHeight: 1,
            }}
          >
            {dailyPercentage}%
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {completedToday} of {totalToday} items done
          </span>
        </div>
      </div>

      {/* Progress Bar with glow */}
      <div style={{ marginBottom: '14px' }}>
        <ProgressBar percentage={dailyPercentage} height={8} />
      </div>

      {/* Contextual Status Message */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          background: 'var(--bg-hover)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <TrendingUp size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <span>{message}</span>
      </div>
    </Card>
  )
}
