import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowLeft,
  CheckCircle2,
  Coffee,
  Brain,
  Sparkles,
  Save,
} from 'lucide-react'
import { TraceOrb } from '@/three/TraceOrb'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useWorkspace } from '@/context/WorkspaceContext'
import type { FocusModeType } from '@/types'

export const FocusPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    tasks,
    settings,
    timerActive,
    timerMode,
    secondsRemaining,
    totalSeconds,
    timerTaskId,
    timerSoundEnabled,
    elapsedFocusSeconds,
    toggleTimer,
    resetTimer,
    switchTimerMode,
    setTimerTaskId,
    setTimerSoundEnabled,
    finishFocusEarly,
    toggleTaskComplete,
  } = useWorkspace()

  // Format digital clock string: HH:MM:SS when session is 1 hour or greater, MM:SS for breaks
  const hours = Math.floor(secondsRemaining / 3600)
  const minutes = Math.floor((secondsRemaining % 3600) / 60)
  const seconds = secondsRemaining % 60

  const formattedTime = totalSeconds >= 3600
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(Math.floor(secondsRemaining / 60)).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const progressPercentage = Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100)

  const activeTask = tasks.find((t) => t.id === timerTaskId)
  const pendingTasks = tasks.filter((t) => t.status === 'pending')

  const elapsedMins = Math.floor(elapsedFocusSeconds / 60)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 160px)',
        position: 'relative',
        padding: 'clamp(20px, 4vw, 40px) 0',
      }}
    >
      {/* Top Bar with Exit and Sound */}
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/app')}
        >
          Exit to overview
        </Button>

        <button
          onClick={() => setTimerSoundEnabled(!timerSoundEnabled)}
          aria-label={timerSoundEnabled ? 'Mute sound' : 'Unmute sound'}
          style={{
            background: 'var(--bg-hover)',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
          title={timerSoundEnabled ? 'Chime sound enabled' : 'Chime sound muted'}
        >
          {timerSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-pill)',
          padding: '4px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '32px',
        }}
      >
        {[
          {
            id: 'focus',
            label: (settings.focusDuration || 60) === 60 ? 'Focus (1h)' : `Focus (${settings.focusDuration || 60}m)`,
            icon: <Brain size={15} />,
          },
          {
            id: 'short_break',
            label: `Short Break (${settings.shortBreakDuration || 10}m)`,
            icon: <Coffee size={15} />,
          },
          {
            id: 'long_break',
            label: `Long Break (${settings.longBreakDuration || 30}m)`,
            icon: <Sparkles size={15} />,
          },
        ].map((tab) => {
          const isSelected = timerMode === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => switchTimerMode(tab.id as FocusModeType)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.85rem',
                fontWeight: isSelected ? 600 : 500,
                background: isSelected ? 'var(--text-primary)' : 'transparent',
                color: isSelected ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Centerpiece: Animated 3D TRACE Orb */}
      <div
        style={{
          width: 'clamp(260px, 40vw, 360px)',
          height: 'clamp(260px, 40vw, 360px)',
          position: 'relative',
          marginBottom: '20px',
        }}
      >
        <TraceOrb height="100%" />
      </div>

      {/* Large Digital Clock Display */}
      <div
        className="font-mono"
        style={{
          fontSize: 'clamp(3.75rem, 8vw, 6rem)',
          fontWeight: 800,
          letterSpacing: '0.04em',
          color: 'var(--text-primary)',
          lineHeight: 1,
          marginBottom: '16px',
        }}
      >
        {formattedTime}
      </div>

      {/* Progress Bar & Subtext */}
      <div style={{ width: '100%', maxWidth: '380px', marginBottom: '28px' }}>
        <ProgressBar
          percentage={progressPercentage}
          color={timerMode === 'focus' ? 'var(--accent)' : 'var(--accent-secondary)'}
          height={6}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '6px',
          }}
        >
          <span>{timerMode === 'focus' ? 'Deep Work Block' : 'Regenerative Break'}</span>
          <span>
            {timerActive ? 'Active' : secondsRemaining < totalSeconds ? 'Paused' : 'Ready'} • {progressPercentage}% elapsed
          </span>
        </div>
      </div>

      {/* Timer Primary Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Button
          variant="secondary"
          size="lg"
          icon={<RotateCcw size={18} />}
          onClick={resetTimer}
          aria-label="Reset timer"
        >
          Reset
        </Button>

        <Button
          variant="accent"
          size="lg"
          icon={timerActive ? <Pause size={20} /> : <Play size={20} />}
          onClick={toggleTimer}
          style={{ paddingLeft: '32px', paddingRight: '32px' }}
        >
          {timerActive ? 'Pause' : secondsRemaining < totalSeconds ? 'Resume' : 'Begin Focus'}
        </Button>
      </div>

      {/* Early Session Logging Option */}
      {timerMode === 'focus' && elapsedMins >= 1 && (
        <div style={{ marginBottom: '28px' }}>
          <Button
            variant="ghost"
            size="sm"
            icon={<Save size={15} />}
            onClick={finishFocusEarly}
            style={{ color: 'var(--accent)', border: '1px dashed var(--accent)' }}
          >
            Log & save {elapsedMins}m focus time early
          </Button>
        </div>
      )}

      {/* Task Attachment Card */}
      {timerMode === 'focus' && (
        <Card
          variant="elevated"
          style={{
            width: '100%',
            maxWidth: '460px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Linked Focus Objective
            </span>
            {activeTask && (
              <button
                onClick={() => toggleTaskComplete(activeTask.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <CheckCircle2 size={13} />
                Mark complete
              </button>
            )}
          </div>

          {activeTask ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {activeTask.title}
              </div>
              <button
                onClick={() => setTimerTaskId('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Change
              </button>
            </div>
          ) : (
            <select
              value={timerTaskId}
              onChange={(e) => setTimerTaskId(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">No task linked (Distraction-Free Freeform)</option>
              {pendingTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          )}
        </Card>
      )}
    </div>
  )
}
