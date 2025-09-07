import { render, screen } from '@testing-library/react';
import { UserStats } from './UserStats';
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
          totalSize: 20000,
          edges: [
            { size: 16000, node: { name: 'JavaScript' } },
            { size: 4000, node: { name: 'HTML' } }
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
          totalSize: 15000,
          edges: [
            { size: 12000, node: { name: 'TypeScript' } },
            { size: 3000, node: { name: 'CSS' } }
          ]
        }
      }
    ]
  }
};

describe('UserStats', () => {
  it('renders correctly with mock data', () => {
    render(<UserStats user={mockUser} />);
    
    // Check that stats are displayed
    expect(screen.getByText('15')).toBeInTheDocument(); // Repositories
    expect(screen.getByText('1,250')).toBeInTheDocument(); // Commits
    expect(screen.getByText('100')).toBeInTheDocument(); // Followers
    expect(screen.getByText('50')).toBeInTheDocument(); // Following
    expect(screen.getByText('8.8K')).toBeInTheDocument(); // Lines of code (35000 bytes / 4 = 8750 lines ≈ 8.8K)
  });

  it('displays correct commit count from contributions collection', () => {
    render(<UserStats user={mockUser} />);
    
    // Check that commit count matches contributionsCollection.totalCommitContributions
    expect(screen.getByText('1,250')).toBeInTheDocument();
  });

  it('calculates lines of code correctly', () => {
    render(<UserStats user={mockUser} />);
    
    // Check that lines of code are calculated correctly
    // repo1: 20000 bytes / 4 = 5000 lines
    // repo2: 15000 bytes / 4 = 3750 lines
    // Total: 8750 lines ≈ 8.8K
    expect(screen.getByText('8.8K')).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
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
      followers: { totalCount: 0 },
      following: { totalCount: 0 },
      gists: { totalCount: 0 },
      contributionsCollection: {
        totalCommitContributions: 0,
        commitContributionsByRepository: []
      }
    };
    
    render(<UserStats user={emptyUser} />);
    
    // Check that zero values are displayed correctly
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(5); // Repositories, Commits, Followers, Following, Lines of code
  });
});