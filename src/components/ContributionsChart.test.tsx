import { render, screen } from '@testing-library/react';
import { ContributionsChart } from './ContributionsChart';
import { type GitHubUser } from '@/apollo/github-api.types';

// Mock data for testing
const mockUser: GitHubUser = {
  id: '1',
  login: 'testuser',
  name: 'Test User',
  avatarUrl: 'https://example.com/avatar.jpg',
  bio: 'Test bio',
  url: 'https://github.com/testuser',
  location: 'Test Location',
  createdAt: '2020-01-01T00:00:00Z',
  followers: { totalCount: 100 },
  following: { totalCount: 50 },
  gists: { totalCount: 10 },
  contributionsCollection: {
    totalCommitContributions: 1250,
    commitContributionsByRepository: []
  },
  repositories: {
    totalCount: 15,
    pageInfo: {
      endCursor: 'cursor1',
      hasNextPage: false
    },
    nodes: []
  },
  contrib2020: {
    totalCommitContributions: 500,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 300 },
        repository: { name: 'repo1', isFork: false }
      },
      {
        contributions: { totalCount: 200 },
        repository: { name: 'repo2', isFork: false }
      }
    ]
  },
  contrib2021: {
    totalCommitContributions: 750,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 400 },
        repository: { name: 'repo1', isFork: false }
      },
      {
        contributions: { totalCount: 350 },
        repository: { name: 'repo3', isFork: false }
      }
    ]
  }
};

// Mock data with forked repositories
const mockUserWithForks: GitHubUser = {
  ...mockUser,
  contrib2020: {
    totalCommitContributions: 600,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 300 },
        repository: { name: 'repo1', isFork: false }
      },
      {
        contributions: { totalCount: 200 },
        repository: { name: 'repo2', isFork: true } // Forked repo
      },
      {
        contributions: { totalCount: 100 },
        repository: { name: 'repo3', isFork: false }
      }
    ]
  }
};

describe('ContributionsChart', () => {
  it('renders correctly with mock data', () => {
    render(<ContributionsChart user={mockUser} />);
    
    // Check that years are displayed
    expect(screen.getByText('2021')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
    
    // Check that commit counts are displayed
    expect(screen.getByText('750')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    
    // Check that total commits are displayed
    expect(screen.getByText('Total commits: 1,250')).toBeInTheDocument();
  });

  it('aggregates commits correctly by year', () => {
    render(<ContributionsChart user={mockUser} />);
    
    // Check that commit counts match the aggregated values
    expect(screen.getByText('750')).toBeInTheDocument(); // 400 + 350 for 2021
    expect(screen.getByText('500')).toBeInTheDocument(); // 300 + 200 for 2020
  });

  it('filters out forked repositories correctly', () => {
    render(<ContributionsChart user={mockUserWithForks} />);
    
    // With forks: 300 + 200 + 100 = 600
    // Without forks: 300 + 100 = 400
    // The component should show 400 for 2020
    
    // Find all elements with text '2020'
    const year2020Elements = screen.getAllByText('2020');
    expect(year2020Elements.length).toBeGreaterThan(0);
    
    // Find the parent container of the first '2020' element
    const year2020Container = year2020Elements[0].closest('.flex.items-center');
    expect(year2020Container).toBeInTheDocument();
    
    // Check if the commit count for 2020 is 400 (not 600)
    const commitCountElement = year2020Container?.querySelector('.text-right.font-bold');
    expect(commitCountElement).toBeInTheDocument();
    expect(commitCountElement?.textContent).toBe('400');
  });

  it('handles empty contributions correctly', () => {
    const emptyUser: any = {
      ...mockUser,
      contrib2020: undefined,
      contrib2021: undefined
    };
    
    render(<ContributionsChart user={emptyUser} />);
    
    // Check that no years are displayed when there are no contributions
    // Since our component skips years with 0 commits, we shouldn't see any year elements
    const yearElements = screen.queryAllByText(/202[0-1]/);
    expect(yearElements).toHaveLength(0);
    
    // Check that total commits are 0
    expect(screen.getByText('Total commits: 0')).toBeInTheDocument();
  });
});