import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TimelineYear } from './TimelineYear'
import { createMockRepository } from '@/test/mocks/github-data'
import type { YearData } from '@/hooks/useUserAnalytics'

// Use centralized mock factory (Week 4 P3: Mock data consolidation)
const mockRepository = createMockRepository({
  name: 'test-repo',
  url: 'https://github.com/user/test-repo',
  description: 'Test repository',
  stargazerCount: 100,
  forkCount: 10,
  watchers: { totalCount: 5 },
  primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
  repositoryTopics: { nodes: [] },
  updatedAt: '2025-01-15T10:30:00Z',
  defaultBranchRef: null,
})

const mockYear: YearData = {
  year: 2025,
  totalCommits: 450,
  totalIssues: 30,
  totalPRs: 25,
  totalReviews: 15,
  ownedRepos: [
    {
      repository: mockRepository,
      contributions: { totalCount: 200 },
    },
  ],
  contributions: [
    {
      repository: { ...mockRepository, name: 'contrib-repo' },
      contributions: { totalCount: 50 },
    },
  ],
}

describe('TimelineYear', () => {
  it('renders year and statistics', () => {
    render(<TimelineYear year={mockYear} maxCommits={500} />)

    expect(screen.getByText('2025')).toBeInTheDocument()
    expect(screen.getByText('450 commits')).toBeInTheDocument()
    expect(screen.getByText('25 PRs')).toBeInTheDocument()
    expect(screen.getByText('2 repos')).toBeInTheDocument()
  })

  it('calculates progress bar width correctly', () => {
    const { container } = render(<TimelineYear year={mockYear} maxCommits={500} />)

    // 450/500 = 90%
    const progressBar = container.querySelector('.bg-primary')
    expect(progressBar).toHaveStyle({ width: '90%' })
  })

  it('handles 100% progress bar', () => {
    const { container } = render(<TimelineYear year={mockYear} maxCommits={450} />)

    const progressBar = container.querySelector('.bg-primary')
    expect(progressBar).toHaveStyle({ width: '100%' })
  })

  it('handles zero commits gracefully', () => {
    const zeroYear: YearData = {
      year: 2020,
      totalCommits: 0,
      totalIssues: 0,
      totalPRs: 0,
      totalReviews: 0,
      ownedRepos: [],
      contributions: [],
    }

    const { container } = render(<TimelineYear year={zeroYear} maxCommits={500} />)

    expect(screen.getByText('0 commits')).toBeInTheDocument()
    const progressBar = container.querySelector('.bg-primary')
    expect(progressBar).toHaveStyle({ width: '0%' })
  })

  it('toggles expanded state on click', () => {
    render(<TimelineYear year={mockYear} maxCommits={500} />)

    const button = screen.getByLabelText('Toggle 2025 details')

    // Initially collapsed
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Your Projects')).not.toBeInTheDocument()

    // Click to expand
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('👤 Your Projects')).toBeInTheDocument()

    // Click to collapse
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows chevron icons correctly', () => {
    const { container } = render(<TimelineYear year={mockYear} maxCommits={500} />)

    // Initially shows ChevronDown
    expect(container.querySelector('.lucide-chevron-down')).toBeInTheDocument()
    expect(container.querySelector('.lucide-chevron-up')).not.toBeInTheDocument()

    // After click, shows ChevronUp
    const button = screen.getByLabelText('Toggle 2025 details')
    fireEvent.click(button)

    expect(container.querySelector('.lucide-chevron-up')).toBeInTheDocument()
    expect(container.querySelector('.lucide-chevron-down')).not.toBeInTheDocument()
  })

  it('renders expanded view when expanded', () => {
    render(<TimelineYear year={mockYear} maxCommits={500} />)

    const button = screen.getByLabelText('Toggle 2025 details')
    fireEvent.click(button)

    // YearExpandedView should be rendered
    expect(screen.getByText('Commits')).toBeInTheDocument()
    expect(screen.getByText('Pull Requests')).toBeInTheDocument()
  })

  it('counts total repositories correctly', () => {
    render(<TimelineYear year={mockYear} maxCommits={500} />)

    // 1 owned + 1 contribution = 2 total
    expect(screen.getByText('2 repos')).toBeInTheDocument()
  })

  it('handles only owned repos', () => {
    const ownedOnlyYear: YearData = {
      ...mockYear,
      ownedRepos: [
        { repository: mockRepository, contributions: { totalCount: 100 } },
        { repository: { ...mockRepository, name: 'repo2' }, contributions: { totalCount: 50 } },
      ],
      contributions: [],
    }

    render(<TimelineYear year={ownedOnlyYear} maxCommits={500} />)

    expect(screen.getByText('2 repos')).toBeInTheDocument()
  })

  it('handles only contributions', () => {
    const contributionsOnlyYear: YearData = {
      ...mockYear,
      ownedRepos: [],
      contributions: [
        { repository: mockRepository, contributions: { totalCount: 100 } },
      ],
    }

    render(<TimelineYear year={contributionsOnlyYear} maxCommits={500} />)

    expect(screen.getByText('1 repos')).toBeInTheDocument()
  })
})
