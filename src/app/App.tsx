import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { WorkspaceProvider } from '@/context/WorkspaceContext'
import { router } from './router'

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <RouterProvider router={router} />
      </WorkspaceProvider>
    </ThemeProvider>
  )
}

export default App
