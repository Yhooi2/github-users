import { createContributionsLookup } from './TopRepositories';
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
    totalCommitContributions: 500,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 200 },
        repository: { name: 'repo1' }
      },
      {
        contributions: { totalCount: 150 },
        repository: { name: 'repo2' }
      },
      {
        contributions: { totalCount: 100 },
        repository: { name: 'repo3' }
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
      }
    ]
  },
  contrib2020: {
    totalCommitContributions: 300,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 100 },
        repository: { name: 'repo1' }
      },
      {
        contributions: { totalCount: 150 },
        repository: { name: 'repo2' }
      },
      {
        contributions: { totalCount: 50 },
        repository: { name: 'repo4' }
      }
    ]
  },
  contrib2021: {
    totalCommitContributions: 200,
    commitContributionsByRepository: [
      {
        contributions: { totalCount: 100 },
        repository: { name: 'repo1' }
      },
      {
        contributions: { totalCount: 50 },
        repository: { name: 'repo3' }
      },
      {
        contributions: { totalCount: 50 },
        repository: { name: 'repo5' }
      }
    ]
  }
};

describe('TopRepositories helpers', () => {
  describe('createContributionsLookup', () => {
    it('creates correct lookup object from contributions data', () => {
      const contributions = createContributionsLookup(mockUser);
      
      // Check that contributions are correctly aggregated
      expect(contributions['repo1']).toBe(400); // 200 (overall) + 100 (2020) + 100 (2021)
      expect(contributions['repo2']).toBe(300); // 150 (overall) + 150 (2020)
      expect(contributions['repo3']).toBe(150); // 100 (overall) + 50 (2021)
      expect(contributions['repo4']).toBe(50);  // 50 (2020)
      expect(contributions['repo5']).toBe(50);  // 50 (2021)
    });

    it('handles empty contributions data', () => {
      const emptyUser: any = {
        ...mockUser,
        contributionsCollection: {
          totalCommitContributions: 0,
          commitContributionsByRepository: []
        },
        contrib2020: undefined,
        contrib2021: undefined
      };
      
      const contributions = createContributionsLookup(emptyUser);
      expect(contributions).toEqual({});
    });

    it('handles user without yearly contributions', () => {
      const userWithoutYearly: any = {
        ...mockUser,
        contrib2020: undefined,
        contrib2021: undefined
      };
      
      const contributions = createContributionsLookup(userWithoutYearly);
      
      // Should only include overall contributions
      expect(contributions['repo1']).toBe(200);
      expect(contributions['repo2']).toBe(150);
      expect(contributions['repo3']).toBe(100);
      expect(contributions['repo4']).toBeUndefined();
      expect(contributions['repo5']).toBeUndefined();
    });
  });
});