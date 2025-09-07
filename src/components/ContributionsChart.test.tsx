import { render, screen } from '@testing-library/react';
import { ContributionsChart } from './ContributionsChart';
import { type GitHubUser } from '@/apollo/github-api.types';
import '@testing-library/jest-dom';

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
  repositories: {
    totalCount: 4,
    pageInfo: {
      endCursor: 'cursor1',
      hasNextPage: false
    },
    nodes: [
      {
        id: '1',
        name: 'repo1',
        description: 'Test repo 1',
        forkCount: 0,
        stargazerCount: 10,
        url: 'https://github.com/testuser/repo1',
        isFork: false,
        defaultBranchRef: null,
        primaryLanguage: null,
        languages: { totalSize: 0, edges: [] }
      },
      {
        id: '2',
        name: 'repo2',
        description: 'Test repo 2',
        forkCount: 5,
        stargazerCount: 5,
        url: 'https://github.com/testuser/repo2',
        isFork: true,
        defaultBranchRef: null,
        primaryLanguage: null,
        languages: { totalSize: 0, edges: [] }
      },
      {
        id: '3',
        name: 'repo3',
        description: 'Test repo 3',
        forkCount: 0,
        stargazerCount: 20,
        url: 'https://github.com/testuser/repo3',
        isFork: false,
        defaultBranchRef: null,
        primaryLanguage: null,
        languages: { totalSize: 0, edges: [] }
      },
      {
        id: '4',
        name: 'repo4',
        description: 'Test forked repo 4',
        forkCount: 3,
        stargazerCount: 0,
        url: 'https://github.com/testuser/repo4',
        isFork: true,
        defaultBranchRef: null,
        primaryLanguage: null,
        languages: { totalSize: 0, edges: [] }
      }
    ]
  },
  contrib2020: {
    totalCommitContributions: 600,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 300 },
        repository: { name: 'repo1', isFork: false }
      },
      {
        contributions: { totalCount: 200 },
        repository: { name: 'repo2', isFork: true } // Forked repo with contributions
      },
      {
        contributions: { totalCount: 100 },
        repository: { name: 'repo3', isFork: false }
      }
    ]
  },
  contributionsCollection: {
    totalCommitContributions: 600,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 300 },
        repository: { name: 'repo1', isFork: false }
      },
      {
        contributions: { totalCount: 200 },
        repository: { name: 'repo2', isFork: true }
      },
      {
        contributions: { totalCount: 100 },
        repository: { name: 'repo3', isFork: false }
      }
    ]
  }
};

// Mock data with forked repository without user contributions
const mockUserWithForkWithoutContributions: GitHubUser = {
  ...mockUser,
  repositories: {
    totalCount: 4,
    pageInfo: {
      endCursor: 'cursor1',
      hasNextPage: false
    },
    nodes: [
      {
        id: '1',
        name: 'repo1',
        description: 'Test repo 1',
        forkCount: 0,
        stargazerCount: 10,
        url: 'https://github.com/testuser/repo1',
        isFork: false,
        defaultBranchRef: null,
        primaryLanguage: null,
        languages: { totalSize: 0, edges: [] }
      },
      {
        id: '2',
        name: 'repo2',
        description: 'Test repo 2',
        forkCount: 5,
        stargazerCount: 5,
        url: 'https://github.com/testuser/repo2',
        isFork: true,
        defaultBranchRef: null,
        primaryLanguage: null,
        languages: { totalSize: 0, edges: [] }
      },
      {
        id: '3',
        name: 'repo3',
        description: 'Test repo 3',
        forkCount: 0,
        stargazerCount: 20,
        url: 'https://github.com/testuser/repo3',
        isFork: false,
        defaultBranchRef: null,
        primaryLanguage: null,
        languages: { totalSize: 0, edges: [] }
      },
      {
        id: '4',
        name: 'repo4',
        description: 'Test forked repo 4',
        forkCount: 3,
        stargazerCount: 0,
        url: 'https://github.com/testuser/repo4',
        isFork: true,
        defaultBranchRef: null,
        primaryLanguage: null,
        languages: { totalSize: 0, edges: [] }
      }
    ]
  },
  contrib2020: {
    totalCommitContributions: 400,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 300 },
        repository: { name: 'repo1', isFork: false }
      },
      {
        contributions: { totalCount: 100 },
        repository: { name: 'repo3', isFork: false }
      }
      // Note: repo4 (forked) has no contributions
    ]
  },
  contributionsCollection: {
    totalCommitContributions: 400,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 300 },
        repository: { name: 'repo1', isFork: false }
      },
      {
        contributions: { totalCount: 100 },
        repository: { name: 'repo3', isFork: false }
      }
      // Note: repo4 (forked) has no contributions
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

  it('filters out forked repositories with user contributions correctly', () => {
    render(<ContributionsChart user={mockUserWithForks} />);
    
    // With forks: 300 + 200 + 100 = 600
    // All repositories should be included since repo2 is a fork with contributions
    // The component should show 600 for 2020
    
    // Find all elements with text '2020'
    const year2020Elements = screen.getAllByText('2020');
    expect(year2020Elements.length).toBeGreaterThan(0);
    
    // Find the parent container of the first '2020' element
    const year2020Container = year2020Elements[0].closest('.flex.items-center');
    expect(year2020Container).toBeInTheDocument();
    
    // Check if the commit count for 2020 is 600
    const commitCountElement = year2020Container?.querySelector('.text-right.font-bold');
    expect(commitCountElement).toBeInTheDocument();
    expect(commitCountElement?.textContent).toBe('600');
  });

  it('filters out forked repositories without user contributions correctly', () => {
    render(<ContributionsChart user={mockUserWithForkWithoutContributions} />);
    
    // With forks: 300 + 100 = 400 (repo4 is a fork without contributions and should be filtered out)
    // The component should show 400 for 2020
    
    // Find all elements with text '2020'
    const year2020Elements = screen.getAllByText('2020');
    expect(year2020Elements.length).toBeGreaterThan(0);
    
    // Find the parent container of the first '2020' element
    const year2020Container = year2020Elements[0].closest('.flex.items-center');
    expect(year2020Container).toBeInTheDocument();
    
    // Check if the commit count for 2020 is 400
    const commitCountElement = year2020Container?.querySelector('.text-right.font-bold');
    expect(commitCountElement).toBeInTheDocument();
    expect(commitCountElement?.textContent).toBe('400');
  });

  it('handles empty contributions correctly', () => {
    const emptyUser: GitHubUser = {
      ...mockUser,
      contrib2020: undefined,
      contrib2021: undefined
    } as unknown as GitHubUser;
    
    render(<ContributionsChart user={emptyUser} />);
    
    // Check that no years are displayed when there are no contributions
    // Since our component skips years with 0 commits, we shouldn't see any year elements
    const yearElements = screen.queryAllByText(/202[0-1]/);
    expect(yearElements).toHaveLength(0);
    
    // Check that total commits are 0
    expect(screen.getByText('Total commits: 0')).toBeInTheDocument();
  });
});