import { BarChart3 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useWorkspace } from '@/context/WorkspaceContext'

export const WeeklyActivityWidget: React.FC = () => {
  const { tasks } = useWorkspace()

  // Calculate completions for the last 7 days dynamically
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(today.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const dayName = days[d.getDay()]
    const isToday = i === 6

    const count = tasks.filter((t) => {
      if (t.status !== 'completed' || !t.completedAt) return false
      return t.completedAt.startsWith(dateStr)
    }).length

    return {
      day: dayName,
      dateStr,
      count,
      isToday,
    }
  })

  const maxCount = Math.max(1, ...weekData.map((d) => d.count))
  const totalCompletedThisWeek = weekData.reduce((sum, d) => sum + d.count, 0)

  return (
    <Card variant="elevated" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
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
              marginBottom: '4px',
            }}
          >
            <BarChart3 size={13} style={{ color: 'var(--accent)' }} />
            Weekly Velocity
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Activity Pulse</h4>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>
            {totalCompletedThisWeek}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            tasks this week
          </span>
        </div>
      </div>

      {/* Visual Chart Bars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '110px',
          gap: '8px',
          paddingTop: '10px',
        }}
      >
        {weekData.map((d, index) => {
          // ensure a min height for visual aesthetics if 0
          const barHeightPct = d.count === 0 ? 8 : Math.max(15, Math.round((d.count / maxCount) * 100))

          return (
            <div
              key={index}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                height: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: d.isToday ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {d.count > 0 ? d.count : ''}
              </span>
              <div
                style={{
                  width: '100%',
                  height: `${barHeightPct}%`,
                  borderRadius: '4px',
                  backgroundColor: d.isToday
                    ? 'var(--accent)'
                    : d.count > 0
                    ? 'var(--accent-secondary)'
                    : 'var(--bg-hover)',
                  boxShadow: d.isToday ? '0 0 10px var(--accent-glow)' : 'none',
                  transition: 'height 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                title={`${d.day}: ${d.count} tasks completed`}
              />
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: d.isToday ? 700 : 500,
                  color: d.isToday ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {d.day}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
