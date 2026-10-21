import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LandingPage } from '@/features/landing/LandingPage'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ProjectsPage } from '@/features/projects/ProjectsPage'
import { SpatialWorkspacePage } from '@/features/spatial/SpatialWorkspacePage'
import { TasksPage } from '@/features/tasks/TasksPage'
import { FocusPage } from '@/features/focus/FocusPage'
import { InsightsPage } from '@/features/insights/InsightsPage'
import { SettingsPage } from '@/features/settings/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'spatial',
        element: <SpatialWorkspacePage />,
      },
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'focus',
        element: <FocusPage />,
      },
      {
        path: 'insights',
        element: <InsightsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
