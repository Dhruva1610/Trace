import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, FolderGit2, Compass } from 'lucide-react'
import { GreetingHeader } from './GreetingHeader'
import { ProgressWidget } from './ProgressWidget'
import { QuickStatsWidget } from './QuickStatsWidget'
import { ProjectsWidget } from './ProjectsWidget'
import { TodayTasksWidget } from './TodayTasksWidget'
import { WeeklyActivityWidget } from './WeeklyActivityWidget'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TaskModal } from '@/features/tasks/TaskModal'
import { ProjectModal } from '@/features/projects/ProjectModal'
import { useWorkspace } from '@/context/WorkspaceContext'

export const DashboardPage: React.FC = () => {
  const { projects, tasks, timerActive, timerMode, secondsRemaining, totalSeconds } = useWorkspace()
  const navigate = useNavigate()
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  const isFreshWorkspace = projects.length === 0 && tasks.length === 0

  const timerHours = Math.floor(secondsRemaining / 3600)
  const timerMins = Math.floor((secondsRemaining % 3600) / 60)
  const timerSecs = secondsRemaining % 60
  const timerFormatted = totalSeconds >= 3600
    ? `${String(timerHours).padStart(2, '0')}:${String(timerMins).padStart(2, '0')}:${String(timerSecs).padStart(2, '0')}`
    : `${String(Math.floor(secondsRemaining / 60)).padStart(2, '0')}:${String(timerSecs).padStart(2, '0')}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Editorial Greeting Header */}
      <GreetingHeader onNewTaskClick={() => setIsTaskModalOpen(true)} />

      {/* Active Focus Session Banner */}
      {(timerActive || secondsRemaining < totalSeconds) && (
        <Card
          variant="glass"
          style={{
            padding: '16px 24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--accent)',
            background: 'rgba(213, 244, 122, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: timerActive ? 'var(--accent)' : 'var(--text-muted)',
              }}
            />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.06em' }}>
                {timerActive ? 'Active Focus Session In Progress' : 'Focus Session Paused'}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {timerMode === 'focus' ? 'Deep Work Block' : 'Break'} •{' '}
                <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {timerFormatted}
                </span>{' '}
                remaining
              </div>
            </div>
          </div>

          <Button
            variant="accent"
            size="sm"
            onClick={() => navigate('/app/focus')}
          >
            Return to focus room
          </Button>
        </Card>
      )}

      {/* Onboarding Welcome Card for Clean Deployment */}
      {isFreshWorkspace && (
        <Card
          variant="glass"
          style={{
            padding: '28px 32px',
            borderRadius: 'var(--radius-lg)',
            borderLeft: '4px solid var(--accent)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.08em' }}>
                Welcome to your workspace
              </span>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Your workspace is pristine and ready for your best work.
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              TRACE organizes your work across spatial dimensions. Create your first project to activate 3D orbit visualization, or schedule action items to trace daily momentum.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button
              variant="accent"
              size="md"
              icon={<FolderGit2 size={16} />}
              onClick={() => setIsProjectModalOpen(true)}
            >
              Create first project
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={<Compass size={16} />}
              onClick={() => navigate('/app/spatial')}
            >
              Explore 3D view
            </Button>
          </div>
        </Card>
      )}

      {/* Top Level Metric Cards */}
      <QuickStatsWidget />

      {/* Progress & Weekly Pulse Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        <ProgressWidget />
        <WeeklyActivityWidget />
      </div>

      {/* Project Overview Portfolio */}
      <ProjectsWidget />

      {/* Today's Tasks */}
      <TodayTasksWidget />

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />

      {/* Create Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectToEdit={null}
      />
    </div>
  )
}
