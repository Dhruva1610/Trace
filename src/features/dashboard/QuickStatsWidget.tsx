import React from 'react'
import { Timer, CheckCircle2, AlertTriangle, Layers } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useWorkspace } from '@/context/WorkspaceContext'
import { formatDuration } from '@/lib/calculations'

export const QuickStatsWidget: React.FC = () => {
  const { stats, tasks, timerActive, elapsedFocusSeconds } = useWorkspace()

  const highPriorityPending = tasks.filter(
    (t) => t.status === 'pending' && t.priority === 'high'
  ).length

  const statItems = [
    {
      label: 'Focus Minutes',
      value: formatDuration(stats.totalFocusMinutes),
      subtext: timerActive
        ? `● ${Math.floor(elapsedFocusSeconds / 60)}m active in session`
        : stats.totalFocusMinutes > 0
          ? `${stats.focusSessionsCount} completed blocks`
          : 'Ready for first session',
      icon: <Timer size={18} style={{ color: 'var(--accent)' }} />,
      accentColor: 'var(--accent)',
    },
    {
      label: 'Overall Completion',
      value: `${stats.completionRate}%`,
      subtext: `${stats.completedTasks} of ${stats.totalTasks} total tasks`,
      icon: <CheckCircle2 size={18} style={{ color: '#34D399' }} />,
      accentColor: '#34D399',
    },
    {
      label: 'Active Projects',
      value: stats.activeProjects,
      subtext: `${stats.totalProjects} total in portfolio`,
      icon: <Layers size={18} style={{ color: 'var(--accent-secondary)' }} />,
      accentColor: 'var(--accent-secondary)',
    },
    {
      label: 'High Priority',
      value: highPriorityPending,
      subtext: highPriorityPending === 0 ? 'No urgent blockers' : 'Requires immediate focus',
      icon: <AlertTriangle size={18} style={{ color: '#FBBF24' }} />,
      accentColor: '#FBBF24',
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}
    >
      {statItems.map((item, idx) => (
        <Card
          key={idx}
          variant="elevated"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {item.label}
            </span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </div>
          </div>

          <div>
            <div
              className="font-mono"
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1,
                marginBottom: '4px',
              }}
            >
              {item.value}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {item.subtext}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
