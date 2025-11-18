import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ActivityTimeline } from './ActivityTimeline'
import { createMockTimeline, createMockYearData } from './__tests__/fixtures'

describe('ActivityTimeline', () => {
  it('renders timeline with years', () => {
    const mockTimeline = createMockTimeline()
    render(<ActivityTimeline timeline={mockTimeline} />)

    expect(screen.getByText('📊 Activity Timeline')).toBeInTheDocument()
    expect(screen.getByText('2025')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
  })

  it('displays loading state', () => {
    render(<ActivityTimeline timeline={[]} loading />)

    expect(screen.getByLabelText('Loading activity timeline')).toBeInTheDocument()
  })

  it('displays empty state when no timeline data', () => {
    render(<ActivityTimeline timeline={[]} />)

    expect(screen.getByText('📊 Activity Timeline')).toBeInTheDocument()
    expect(screen.getByText('No activity data available')).toBeInTheDocument()
  })

  it('calculates max commits correctly', () => {
    const mockTimeline = createMockTimeline()
    render(<ActivityTimeline timeline={mockTimeline} />)

    // The component should calculate maxCommits as 450 (from 2025)
    // TimelineYear components receive this value
    expect(screen.getByText('450 commits')).toBeInTheDocument()
    expect(screen.getByText('320 commits')).toBeInTheDocument()
  })

  it('renders correct number of year rows', () => {
    const mockTimeline = createMockTimeline()
    const { container } = render(<ActivityTimeline timeline={mockTimeline} />)

    // Each year is rendered in a button element
    const yearButtons = container.querySelectorAll('button[aria-expanded]')
    expect(yearButtons).toHaveLength(2)
  })

  it('renders timeline with proper ARIA label', () => {
    const mockTimeline = createMockTimeline()
    render(<ActivityTimeline timeline={mockTimeline} />)

    expect(screen.getByRole('region', { name: 'Activity Timeline' })).toBeInTheDocument()
  })

  it('renders single year correctly', () => {
    const singleYear = [createMockYearData()]
    render(<ActivityTimeline timeline={singleYear} />)

    expect(screen.getByText('2025')).toBeInTheDocument()
    expect(screen.queryByText('2024')).not.toBeInTheDocument()
  })

  it('handles zero commits gracefully', () => {
    const zeroCommitTimeline = [
      createMockYearData({
        year: 2020,
        totalCommits: 0,
        totalIssues: 0,
        totalPRs: 0,
        totalReviews: 0,
        ownedRepos: [],
        contributions: [],
      }),
    ]

    render(<ActivityTimeline timeline={zeroCommitTimeline} />)

    expect(screen.getByText('0 commits')).toBeInTheDocument()
  })
})
