import { render, screen } from '@testing-library/react';
import { TopRepositories } from './TopRepositories';
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
    totalCommitContributions: 500,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 200 },
        repository: { name: 'repo1', isFork: false }
      },
      {
        contributions: { totalCount: 150 },
        repository: { name: 'repo2', isFork: false }
      },
      {
        contributions: { totalCount: 100 },
        repository: { name: 'repo3', isFork: true }
      }
    ]
  },
  repositories: {
    totalCount: 10,
    pageInfo: {
      endCursor: 'cursor1',
      hasNextPage: false
    },
    nodes: [
      {
        name: 'repo1',
        id: '1',
        description: 'Repository 1',
        forkCount: 5,
        stargazerCount: 10,
        url: 'https://github.com/testuser/repo1',
        isFork: false,
        defaultBranchRef: null,
        primaryLanguage: { name: 'JavaScript' },
        languages: {
          totalSize: 10000,
          edges: [
            { size: 8000, node: { name: 'JavaScript' } },
            { size: 2000, node: { name: 'HTML' } }
          ]
        }
      },
      {
        name: 'repo2',
        id: '2',
        description: 'Repository 2',
        forkCount: 2,
        stargazerCount: 5,
        url: 'https://github.com/testuser/repo2',
        isFork: false,
        defaultBranchRef: null,
        primaryLanguage: { name: 'TypeScript' },
        languages: {
          totalSize: 5000,
          edges: [
            { size: 4000, node: { name: 'TypeScript' } },
            { size: 1000, node: { name: 'CSS' } }
          ]
        }
      },
      {
        name: 'repo3',
        id: '3',
        description: 'Repository 3',
        forkCount: 0,
        stargazerCount: 20,
        url: 'https://github.com/testuser/repo3',
        isFork: true, // This is a fork
        defaultBranchRef: null,
        primaryLanguage: { name: 'Python' },
        languages: {
          totalSize: 15000,
          edges: [
            { size: 12000, node: { name: 'Python' } },
            { size: 3000, node: { name: 'Shell' } }
          ]
        }
      },
      {
        name: 'repo4',
        id: '4',
        description: 'Repository 4',
        forkCount: 1,
        stargazerCount: 1,
        url: 'https://github.com/testuser/repo4',
        isFork: true, // This is a fork with no contributions
        defaultBranchRef: null,
        primaryLanguage: { name: 'Go' },
        languages: {
          totalSize: 2000,
          edges: [
            { size: 2000, node: { name: 'Go' } }
          ]
        }
      }
    ]
  }
};

describe('TopRepositories', () => {
  it('renders correctly with mock data', () => {
    render(<TopRepositories user={mockUser} />);
    
    // Check that the component renders
    expect(screen.getByText('Top Repositories')).toBeInTheDocument();
    
    // Check that repositories are displayed
    expect(screen.getByText('repo1')).toBeInTheDocument();
    expect(screen.getByText('repo2')).toBeInTheDocument();
    expect(screen.getByText('repo3')).toBeInTheDocument();
    
    // Check that fork without contributions is not displayed
    expect(screen.queryByText('repo4')).not.toBeInTheDocument();
    
    // Check commit counts
    expect(screen.getByText('200')).toBeInTheDocument(); // repo1 commits
    expect(screen.getByText('150')).toBeInTheDocument(); // repo2 commits
    expect(screen.getByText('100')).toBeInTheDocument(); // repo3 commits
  });

  it('filters out forks without contributions', () => {
    render(<TopRepositories user={mockUser} />);
    
    // repo4 is a fork without contributions, so it should not be displayed
    const repoItems = screen.queryAllByText(/repo\d/);
    expect(repoItems).toHaveLength(3);
    expect(repoItems.some(item => item.textContent === 'repo4')).toBeFalsy();
  });

  it('displays correct commit counts from contributions', () => {
    render(<TopRepositories user={mockUser} />);
    
    // Check that commit counts match contributions data
    expect(screen.getByText('200')).toBeInTheDocument(); // repo1
    expect(screen.getByText('150')).toBeInTheDocument(); // repo2
    expect(screen.getByText('100')).toBeInTheDocument(); // repo3
  });

  it('handles empty repositories', () => {
    const emptyUser: GitHubUser = {
      ...mockUser,
      repositories: {
        totalCount: 0,
        pageInfo: {
          endCursor: '',
          hasNextPage: false
        },
        nodes: []
      },
      contributionsCollection: {
        totalCommitContributions: 0,
        commitContributionsByRepository: []
      }
    };
    
    render(<TopRepositories user={emptyUser} />);
    
    expect(screen.getByText('No repository data available')).toBeInTheDocument();
  });
});