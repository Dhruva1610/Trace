import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ThemePreference } from '@/types'
import { storage } from '@/lib/storage'

interface ThemeContextType {
  theme: ThemePreference
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: ThemePreference) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    return storage.getSettings().theme || 'dark'
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    function calculateResolvedTheme(pref: ThemePreference): 'light' | 'dark' {
      if (pref === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        return isDark ? 'dark' : 'light'
      }
      return pref
    }

    const currentResolved = calculateResolvedTheme(theme)
    setResolvedTheme(currentResolved)
    document.documentElement.setAttribute('data-theme', currentResolved)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        const newResolved = mediaQuery.matches ? 'dark' : 'light'
        setResolvedTheme(newResolved)
        document.documentElement.setAttribute('data-theme', newResolved)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = (newTheme: ThemePreference) => {
    setThemeState(newTheme)
    const currentSettings = storage.getSettings()
    storage.saveSettings({ ...currentSettings, theme: newTheme })
  }

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
