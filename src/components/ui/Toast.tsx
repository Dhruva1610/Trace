import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useWorkspace } from '@/context/WorkspaceContext'

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useWorkspace()

  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />,
          error: <AlertCircle size={18} style={{ color: 'var(--color-coral)', flexShrink: 0 }} />,
          warning: <AlertCircle size={18} style={{ color: 'var(--color-amber)', flexShrink: 0 }} />,
          info: <Info size={18} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />,
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              boxShadow: 'var(--shadow-lg)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {icons[toast.type || 'info']}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {toast.title}
              </div>
              {toast.description && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {toast.description}
                </div>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
