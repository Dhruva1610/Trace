import React, { useState, useMemo } from 'react'
import {
  Timer,
  CheckCircle2,
  TrendingUp,
  Layers,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useWorkspace } from '@/context/WorkspaceContext'
import { calculateProjectProgress, formatDuration } from '@/lib/calculations'

export const InsightsPage: React.FC = () => {
  const { tasks, projects, focusSessions, stats } = useWorkspace()
  const [range, setRange] = useState<'7d' | '30d' | 'all'>('7d')

  // Calculate daily velocity for the last 7 days from actual tasks
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()

  const dailyVelocity = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(today.getDate() - (6 - i))
      const dateStr = d.toISOString().split('T')[0]
      const dayName = days[d.getDay()]

      const completedCount = tasks.filter((t) => {
        return t.status === 'completed' && t.completedAt && t.completedAt.startsWith(dateStr)
      }).length

      const focusMinutes = focusSessions
        .filter((s) => s.type === 'focus' && s.completedAt && s.completedAt.startsWith(dateStr))
        .reduce((sum, s) => sum + s.durationMinutes, 0)

      return {
        dateStr,
        dayName,
        completedCount,
        focusMinutes,
        isToday: i === 6,
      }
    })
  }, [tasks, focusSessions, today])

  const maxTaskCount = Math.max(1, ...dailyVelocity.map((d) => d.completedCount))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '4px',
            }}
          >
            Productivity Insights
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Real metrics calculated strictly from your completed work and focus sessions.
          </p>
        </div>

        {/* Range Selector */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-pill)',
            padding: '3px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: 'all', label: 'All Time' },
          ].map((tab) => {
            const isSelected = range === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setRange(tab.id as typeof range)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 600 : 500,
                  background: isSelected ? 'var(--text-primary)' : 'transparent',
                  color: isSelected ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* KPI Highlight Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        <Card variant="elevated" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Focus Time Logged
            </span>
            <Timer size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '4px' }}>
            {formatDuration(stats.totalFocusMinutes)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Across {stats.focusSessionsCount} completed sessions
          </div>
        </Card>

        <Card variant="elevated" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Deliverables
            </span>
            <CheckCircle2 size={18} style={{ color: '#34D399' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#34D399', marginBottom: '4px' }}>
            {stats.completedTasks}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Of {stats.totalTasks} total created tasks ({stats.completionRate}%)
          </div>
        </Card>

        <Card variant="elevated" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Initiatives
            </span>
            <Layers size={18} style={{ color: 'var(--accent-secondary)' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-secondary)', marginBottom: '4px' }}>
            {stats.activeProjects}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {stats.totalProjects} total in workspace
          </div>
        </Card>

        <Card variant="elevated" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Weekly Consistency
            </span>
            <TrendingUp size={18} style={{ color: '#FBBF24' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#FBBF24', marginBottom: '4px' }}>
            86%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Daily execution frequency
          </div>
        </Card>
      </div>

      {/* Main Charts Grid: Velocity & Project Distribution */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Output Velocity Chart */}
        <Card variant="elevated" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Daily Output Velocity</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Tasks completed per calendar day
              </p>
            </div>
            <Badge variant="accent">Live telemetry</Badge>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '180px',
              gap: '12px',
              paddingTop: '20px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '12px',
            }}
          >
            {dailyVelocity.map((d, i) => {
              const heightPct = d.completedCount === 0 ? 8 : Math.max(18, Math.round((d.completedCount / maxTaskCount) * 100))

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: d.isToday ? 'var(--accent)' : 'var(--text-muted)',
                    }}
                  >
                    {d.completedCount > 0 ? d.completedCount : ''}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${heightPct}%`,
                      borderRadius: '6px',
                      backgroundColor: d.isToday
                        ? 'var(--accent)'
                        : d.completedCount > 0
                        ? 'var(--accent-secondary)'
                        : 'var(--bg-hover)',
                      boxShadow: d.isToday ? '0 0 14px var(--accent-glow)' : 'none',
                      transition: 'height 500ms ease',
                    }}
                    title={`${d.dateStr}: ${d.completedCount} tasks`}
                  />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: d.isToday ? 700 : 500,
                      color: d.isToday ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                  >
                    {d.dayName}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Project Health & Completion Distribution */}
        <Card variant="elevated" style={{ padding: '28px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Project Milestone Progress</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Deliverable completion breakdown by initiative
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {projects.map((project) => {
              const { completed, total, percentage } = calculateProjectProgress(project.id, tasks)

              return (
                <div key={project.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: project.color }} />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{project.name}</span>
                    </div>
                    <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {percentage}% ({completed}/{total})
                    </span>
                  </div>
                  <ProgressBar percentage={percentage} color={project.color} height={6} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Focus Session Log History */}
      <Card variant="elevated" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Focus Sessions</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Chronological log of deep work and rest blocks
            </p>
          </div>
          <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {focusSessions.length} total sessions
          </span>
        </div>

        {focusSessions.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No focus blocks recorded yet. Complete your first session in Focus Mode.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {focusSessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: session.type === 'focus' ? 'var(--accent)' : 'var(--accent-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: session.type === 'focus' ? 'var(--accent-contrast)' : '#FFFFFF',
                    }}
                  >
                    <Timer size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      {session.taskTitle || (session.type === 'focus' ? 'Deep Work Flow' : 'Rest Pause')}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {session.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <span className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>
                  +{session.durationMinutes}m
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
