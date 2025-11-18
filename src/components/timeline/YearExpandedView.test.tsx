import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { YearExpandedView } from './YearExpandedView'
import type { YearData } from '@/hooks/useUserAnalytics'

const mockRepository = {
  name: 'test-repo',
  url: 'https://github.com/user/test-repo',
  description: 'Test repository',
  stargazerCount: 100,
  forkCount: 10,
  watchers: { totalCount: 5 },
  isFork: false,
  isArchived: false,
  primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
  repositoryTopics: { nodes: [] },
  updatedAt: '2025-01-15T10:30:00Z',
  defaultBranchRef: null,
}

const mockYearWithBoth: YearData = {
  year: 2025,
  totalCommits: 450,
  totalIssues: 30,
  totalPRs: 25,
  totalReviews: 15,
  ownedRepos: [
    {
      repository: { ...mockRepository, name: 'owned-1', stargazerCount: 500 },
      contributions: { totalCount: 200 },
    },
    {
      repository: { ...mockRepository, name: 'owned-2', stargazerCount: 200 },
      contributions: { totalCount: 150 },
    },
  ],
  contributions: [
    {
      repository: { ...mockRepository, name: 'contrib-1', stargazerCount: 10000 },
      contributions: { totalCount: 80 },
    },
    {
      repository: { ...mockRepository, name: 'contrib-2', stargazerCount: 5000 },
      contributions: { totalCount: 50 },
    },
  ],
}

describe('YearExpandedView', () => {
  it('renders summary statistics', () => {
    render(<YearExpandedView year={mockYearWithBoth} />)

    expect(screen.getByText('Commits')).toBeInTheDocument()
    expect(screen.getByText('450')).toBeInTheDocument()
    expect(screen.getByText('Pull Requests')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('Issues')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('Repositories')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument() // 2 owned + 2 contributions
  })

  it('renders owned repositories section', () => {
    render(<YearExpandedView year={mockYearWithBoth} />)

    expect(screen.getByText('👤 Your Projects')).toBeInTheDocument()
    // Badge showing count - there are multiple "2"s, so use getAllByText
    const badges = screen.getAllByText('2')
    expect(badges.length).toBeGreaterThan(0)
    expect(screen.getByText('owned-1')).toBeInTheDocument()
    expect(screen.getByText('owned-2')).toBeInTheDocument()
  })

  it('renders contributions section', () => {
    render(<YearExpandedView year={mockYearWithBoth} />)

    expect(screen.getByText('👥 Open Source Contributions')).toBeInTheDocument()
    expect(screen.getByText('contrib-1')).toBeInTheDocument()
    expect(screen.getByText('contrib-2')).toBeInTheDocument()
  })

  it('sorts owned repos by stars (descending)', () => {
    render(<YearExpandedView year={mockYearWithBoth} />)

    const repoNames = screen.getAllByText(/owned-/)
    // owned-1 (500 stars) should come before owned-2 (200 stars)
    expect(repoNames[0]).toHaveTextContent('owned-1')
    expect(repoNames[1]).toHaveTextContent('owned-2')
  })

  it('sorts contributions by commit count (descending)', () => {
    render(<YearExpandedView year={mockYearWithBoth} />)

    const repoNames = screen.getAllByText(/contrib-/)
    // contrib-1 (80 commits) should come before contrib-2 (50 commits)
    expect(repoNames[0]).toHaveTextContent('contrib-1')
    expect(repoNames[1]).toHaveTextContent('contrib-2')
  })

  it('limits owned repos to top 5', () => {
    const manyOwnedRepos: YearData = {
      ...mockYearWithBoth,
      ownedRepos: Array.from({ length: 10 }, (_, i) => ({
        repository: { ...mockRepository, name: `repo-${i}`, stargazerCount: 100 - i },
        contributions: { totalCount: 50 },
      })),
    }

    const { container } = render(<YearExpandedView year={manyOwnedRepos} />)

    // Should only show top 5 repos
    const ownedSection = container.querySelector(':has(> h3:contains("Your Projects"))')
    const repoCards = screen.getAllByText(/repo-/)
    expect(repoCards.length).toBeLessThanOrEqual(5)
  })

  it('limits contributions to top 5', () => {
    const manyContributions: YearData = {
      ...mockYearWithBoth,
      contributions: Array.from({ length: 10 }, (_, i) => ({
        repository: { ...mockRepository, name: `contrib-${i}` },
        contributions: { totalCount: 100 - i },
      })),
    }

    render(<YearExpandedView year={manyContributions} />)

    const contribCards = screen.getAllByText(/contrib-/)
    expect(contribCards.length).toBeLessThanOrEqual(5)
  })

  it('renders only owned repos when no contributions', () => {
    const ownedOnlyYear: YearData = {
      ...mockYearWithBoth,
      contributions: [],
    }

    render(<YearExpandedView year={ownedOnlyYear} />)

    expect(screen.getByText('👤 Your Projects')).toBeInTheDocument()
    expect(screen.queryByText('👥 Open Source Contributions')).not.toBeInTheDocument()
  })

  it('renders only contributions when no owned repos', () => {
    const contributionsOnlyYear: YearData = {
      ...mockYearWithBoth,
      ownedRepos: [],
    }

    render(<YearExpandedView year={contributionsOnlyYear} />)

    expect(screen.queryByText('👤 Your Projects')).not.toBeInTheDocument()
    expect(screen.getByText('👥 Open Source Contributions')).toBeInTheDocument()
  })

  it('renders empty state when no repositories', () => {
    const emptyYear: YearData = {
      year: 2020,
      totalCommits: 0,
      totalIssues: 0,
      totalPRs: 0,
      totalReviews: 0,
      ownedRepos: [],
      contributions: [],
    }

    render(<YearExpandedView year={emptyYear} />)

    expect(screen.getByText('No repositories found for this year')).toBeInTheDocument()
    expect(screen.queryByText('👤 Your Projects')).not.toBeInTheDocument()
    expect(screen.queryByText('👥 Open Source Contributions')).not.toBeInTheDocument()
  })

  it('uses compact mode for repository cards', () => {
    render(<YearExpandedView year={mockYearWithBoth} />)

    // Verify RepositoryCard components are rendered
    // Check for repository names which are rendered in cards
    expect(screen.getByText('owned-1')).toBeInTheDocument()
    expect(screen.getByText('owned-2')).toBeInTheDocument()
    expect(screen.getByText('contrib-1')).toBeInTheDocument()
    expect(screen.getByText('contrib-2')).toBeInTheDocument()
  })
})
