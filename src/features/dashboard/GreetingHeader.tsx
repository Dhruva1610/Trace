import React from 'react'
import { Plus, Timer, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { getGreeting } from '@/lib/calculations'

interface GreetingHeaderProps {
  onNewTaskClick: () => void
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({ onNewTaskClick }) => {
  const navigate = useNavigate()
  const { greeting, subtext } = getGreeting()

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '28px',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '8px',
          }}
        >
          <Calendar size={14} style={{ color: 'var(--accent)' }} />
          <span>{todayFormatted}</span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '6px',
          }}
        >
          {greeting}
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          {subtext}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Button
          variant="secondary"
          size="md"
          icon={<Timer size={16} />}
          onClick={() => navigate('/app/focus')}
        >
          Focus session
        </Button>
        <Button
          variant="accent"
          size="md"
          icon={<Plus size={16} />}
          onClick={onNewTaskClick}
        >
          New task
        </Button>
      </div>
    </div>
  )
}
