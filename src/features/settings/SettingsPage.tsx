import React, { useState, useRef } from 'react'
import {
  Sun,
  Moon,
  Monitor,
  RotateCcw,
  Download,
  Upload,
  Sparkles,
  Sliders,
  Database,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useTheme } from '@/context/ThemeContext'
import { useWorkspace } from '@/context/WorkspaceContext'
import type { ThemePreference } from '@/types'

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const {
    settings,
    updateSettings,
    clearWorkspaceData,
    importWorkspaceData,
    projects,
    tasks,
    focusSessions,
    showToast,
  } = useWorkspace()

  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Export local state as JSON file
  const handleExportData = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projects,
      tasks,
      focusSessions,
      settings,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trace-workspace-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast({ title: 'Workspace exported', description: 'JSON backup downloaded', type: 'success' })
  }

  // Import local state from JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        if (parsed && (Array.isArray(parsed.projects) || Array.isArray(parsed.tasks))) {
          importWorkspaceData(parsed)
        } else {
          showToast({ title: 'Import failed', description: 'Invalid TRACE backup format', type: 'error' })
        }
      } catch (err) {
        showToast({ title: 'Import failed', description: 'Could not parse JSON file', type: 'error' })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleClear = () => {
    clearWorkspaceData()
    setConfirmClearOpen(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '840px' }}>
      {/* Header */}
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
          Workspace Settings
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Configure appearance, focus intervals, motion constraints, and local persistence.
        </p>
      </div>

      {/* Section 1: Appearance & Theme */}
      <Card variant="elevated" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Sparkles size={18} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Appearance & Theme</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px' }}>
              Color Theme
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              {[
                { id: 'dark', label: 'Dark Charcoal', icon: <Moon size={16} /> },
                { id: 'light', label: 'Warm Ivory', icon: <Sun size={16} /> },
                { id: 'system', label: 'System Default', icon: <Monitor size={16} /> },
              ].map((item) => {
                const isSelected = theme === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id as ThemePreference)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--bg-hover)' : 'var(--bg-surface)',
                      border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border-subtle)'}`,
                      color: 'var(--text-primary)',
                      fontWeight: isSelected ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {item.icon}
                    <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Reduced Motion Mode
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Halts continuous 3D rotations, camera drift, and particle confetti
              </div>
            </div>

            <button
              onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
              aria-label="Toggle reduced motion"
              style={{
                width: 44,
                height: 24,
                borderRadius: 'var(--radius-pill)',
                background: settings.reducedMotion ? 'var(--accent)' : 'var(--bg-hover)',
                border: '1px solid var(--border-subtle)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: settings.reducedMotion ? 22 : 2,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: settings.reducedMotion ? 'var(--accent-contrast)' : 'var(--text-muted)',
                  transition: 'left var(--transition-fast)',
                }}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Section 2: Focus Session Durations */}
      <Card variant="elevated" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Sliders size={18} style={{ color: 'var(--accent-secondary)' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Focus & Break Durations</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              Focus Duration (Minutes)
            </label>
            <input
              type="number"
              min={5}
              max={180}
              value={settings.focusDuration}
              onChange={(e) => updateSettings({ focusDuration: Number(e.target.value) || 60 })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.9375rem',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              Short Break (Minutes)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={settings.shortBreakDuration}
              onChange={(e) => updateSettings({ shortBreakDuration: Number(e.target.value) || 10 })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.9375rem',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              Long Break (Minutes)
            </label>
            <input
              type="number"
              min={5}
              max={90}
              value={settings.longBreakDuration}
              onChange={(e) => updateSettings({ longBreakDuration: Number(e.target.value) || 30 })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.9375rem',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Audio Notification Chime Toggle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Acoustic Chime
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Plays a subtle resonant frequency chime upon interval completion
            </div>
          </div>

          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            aria-label="Toggle chime sound"
            style={{
              width: 44,
              height: 24,
              borderRadius: 'var(--radius-pill)',
              background: settings.soundEnabled ? 'var(--accent)' : 'var(--bg-hover)',
              border: '1px solid var(--border-subtle)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background var(--transition-fast)',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 2,
                left: settings.soundEnabled ? 22 : 2,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: settings.soundEnabled ? 'var(--accent-contrast)' : 'var(--text-muted)',
                transition: 'left var(--transition-fast)',
              }}
            />
          </button>
        </div>
      </Card>

      {/* Section 3: Data Management */}
      <Card variant="elevated" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Database size={18} style={{ color: '#38BDF8' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Data Persistence & Backups</h3>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
          TRACE operates on a high-speed client persistence layer. Your initiatives, tasks, and focus history are safely stored in your browser's persistent storage sandbox. You can export or import backups at any time.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            size="md"
            icon={<Download size={15} />}
            onClick={handleExportData}
          >
            Export JSON Backup
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json,application/json"
            style={{ display: 'none' }}
          />

          <Button
            variant="secondary"
            size="md"
            icon={<Upload size={15} />}
            onClick={() => fileInputRef.current?.click()}
          >
            Import JSON Backup
          </Button>

          <Button
            variant="danger"
            size="md"
            icon={<RotateCcw size={15} />}
            onClick={() => setConfirmClearOpen(true)}
          >
            Clear Workspace
          </Button>
        </div>
      </Card>

      {/* Confirmation Modal for Clear */}
      <Modal
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        title="Clear Workspace Data?"
        subtitle="This action will clear all current projects, tasks, and focus logs."
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          All recorded tasks and initiatives will be removed from this browser. Your theme and timing preferences will remain intact. This action cannot be undone.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="secondary" onClick={() => setConfirmClearOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClear}>
            Confirm Clear
          </Button>
        </div>
      </Modal>
    </div>
  )
}
