import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { TraceLogo } from '@/components/brand/TraceLogo'

describe('UI Primitives and Accessibility', () => {
  it('renders Button with variants and handles click events', () => {
    const handleClick = vi.fn()
    render(
      <Button variant="accent" onClick={handleClick}>
        Enter Workspace
      </Button>
    )

    const btn = screen.getByRole('button', { name: /enter workspace/i })
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders ProgressBar with accessibility attributes', () => {
    render(<ProgressBar percentage={75} showLabel />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '75')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('renders StatusBadge and PriorityBadge correctly', () => {
    render(
      <div>
        <StatusBadge status="active" />
        <PriorityBadge priority="high" />
      </div>
    )
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('renders TRACE Brand Logo with wordmark', () => {
    render(<TraceLogo size="md" />)
    expect(screen.getByLabelText('TRACE')).toBeInTheDocument()
    expect(screen.getByText('TRACE')).toBeInTheDocument()
  })
})
