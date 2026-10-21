import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'
import { AppTopBar } from './AppTopBar'
import { MobileBottomNav } from './MobileBottomNav'
import { ToastContainer } from '@/components/ui/Toast'
import { TaskModal } from '@/features/tasks/TaskModal'
import { SearchModal } from '@/components/ui/SearchModal'

export const AppShell: React.FC = () => {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Global Keyboard Shortcuts (⌘K for search, C for quick task creation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      } else if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setIsNewTaskOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Desktop Collapsible Sidebar */}
      <AppSidebar />

      {/* Main Workspace Column */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          paddingBottom: 'clamp(64px, 8vh, 0px)', // space for mobile bottom nav on mobile
        }}
      >
        <AppTopBar
          onOpenNewTaskModal={() => setIsNewTaskOpen(true)}
          onOpenSearchModal={() => setIsSearchOpen(true)}
        />

        <main style={{ flex: 1, padding: 'clamp(16px, 3.5vw, 36px)', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileBottomNav />

      {/* Global Task Creation Modal */}
      <TaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
      />

      {/* Global Search / Command Palette */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  )
}
