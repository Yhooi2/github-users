import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import type { YearData } from './hooks/useUserAnalytics';

// Mock useUserAnalytics hook
const mockUseUserAnalytics = vi.fn();
vi.mock('./hooks/useUserAnalytics', () => ({
  useUserAnalytics: () => mockUseUserAnalytics(),
}));

// Mock child components
vi.mock('./components/layout/SearchHeader', () => ({
  SearchHeader: ({ userName, onSearch }: { userName: string; onSearch: (name: string) => void }) => (
    <div data-testid="search-header">
      <input
        data-testid="search-input"
        value={userName}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search GitHub User..."
      />
      <button data-testid="search-button" onClick={() => onSearch(userName)}>
        Search
      </button>
    </div>
  ),
}));

vi.mock('./components/UserProfile', () => ({
  default: () => <div data-testid="user-profile">User Profile</div>,
}));

vi.mock('./components/assessment/QuickAssessment', () => ({
  QuickAssessment: () => <div data-testid="quick-assessment">Quick Assessment</div>,
}));

vi.mock('./components/timeline/ActivityTimeline', () => ({
  ActivityTimeline: () => <div data-testid="activity-timeline">Activity Timeline</div>,
}));

vi.mock('./components/projects/ProjectSection', () => ({
  ProjectSection: () => <div data-testid="project-section">Project Section</div>,
}));

vi.mock('./components/layout/RateLimitBanner', () => ({
  RateLimitBanner: () => <div data-testid="rate-limit-banner">Rate Limit Banner</div>,
}));

vi.mock('./components/auth/AuthRequiredModal', () => ({
  AuthRequiredModal: () => <div data-testid="auth-modal">Auth Modal</div>,
}));

vi.mock('./components/layout/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
  Toaster: () => null,
}));

describe('App Integration Tests - Phase 5 Single Page Layout', () => {
  const mockProfile = {
    id: '1',
    login: 'testuser',
    name: 'Test User',
    avatarUrl: 'https://avatar.url',
    bio: 'Test bio',
    url: 'https://github.com/testuser',
    location: 'Test Location',
    createdAt: '2020-01-01T00:00:00Z',
    followers: { totalCount: 100 },
    following: { totalCount: 50 },
    gists: { totalCount: 10 },
  };

  const mockTimeline: YearData[] = [
    {
      year: 2024,
      totalCommits: 250,
      totalIssues: 30,
      totalPRs: 40,
      totalReviews: 20,
      ownedRepos: [],
      contributions: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render search header on initial load', () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: false,
        error: undefined,
      });

      render(<App />);

      expect(screen.getByTestId('search-header')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('should not show content sections before search', () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: false,
        error: undefined,
      });

      render(<App />);

      expect(screen.queryByTestId('user-profile')).not.toBeInTheDocument();
      expect(screen.queryByTestId('quick-assessment')).not.toBeInTheDocument();
      expect(screen.queryByTestId('activity-timeline')).not.toBeInTheDocument();
      expect(screen.queryByTestId('project-section')).not.toBeInTheDocument();
    });

    it('should render rate limit banner', () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: false,
        error: undefined,
      });

      render(<App />);

      expect(screen.getByTestId('rate-limit-banner')).toBeInTheDocument();
    });

    it('should render auth modal', () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: false,
        error: undefined,
      });

      render(<App />);

      expect(screen.getByTestId('auth-modal')).toBeInTheDocument();
    });
  });

  describe('Search Flow', () => {
    it('should show all sections after successful user search', async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: mockTimeline,
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId('search-input');
      await user.type(input, 'testuser');

      // Wait for all sections to appear
      await waitFor(() => {
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
        expect(screen.getByTestId('quick-assessment')).toBeInTheDocument();
        expect(screen.getByTestId('activity-timeline')).toBeInTheDocument();
        expect(screen.getByTestId('project-section')).toBeInTheDocument();
      });
    });

    it('should display loading state during search', async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: true,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId('search-input');
      await user.type(input, 'testuser');

      // Should show UserProfile for loading indication
      await waitFor(() => {
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      });

      // Should not show other sections while loading
      expect(screen.queryByTestId('quick-assessment')).not.toBeInTheDocument();
    });

    it('should handle search errors gracefully', async () => {
      const error = {
        message: 'User not found',
        graphQLErrors: [],
        clientErrors: [],
        networkError: null,
        extraInfo: undefined,
        name: 'ApolloError',
      };

      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: false,
        error,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId('search-input');
      await user.type(input, 'invaliduser');

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/error.*user not found/i)).toBeInTheDocument();
      });

      // Should not show content sections
      expect(screen.queryByTestId('quick-assessment')).not.toBeInTheDocument();
    });
  });

  describe('Single Page Layout', () => {
    it('should render all sections in vertical order', async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: mockTimeline,
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId('search-input');
      await user.type(input, 'testuser');

      await waitFor(() => {
        const sections = [
          screen.getByTestId('user-profile'),
          screen.getByTestId('quick-assessment'),
          screen.getByTestId('activity-timeline'),
          screen.getByTestId('project-section'),
        ];

        // All sections should be visible (no tabs)
        sections.forEach((section) => {
          expect(section).toBeVisible();
        });
      });
    });

    it('should not have tab navigation', () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: mockTimeline,
        loading: false,
        error: undefined,
      });

      render(<App />);

      // Old tab-based navigation should not exist
      expect(screen.queryByRole('tab', { name: /profile/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: /repositories/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: /statistics/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });

    it('should show QuickAssessment when metrics are available', async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: mockTimeline,
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId('search-input');
      await user.type(input, 'testuser');

      await waitFor(() => {
        expect(screen.getByTestId('quick-assessment')).toBeInTheDocument();
      });
    });

    it('should not show QuickAssessment when no timeline data', async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: [],
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId('search-input');
      await user.type(input, 'testuser');

      // User profile should be shown
      await waitFor(() => {
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      });

      // QuickAssessment should not be shown without timeline data
      expect(screen.queryByTestId('quick-assessment')).not.toBeInTheDocument();
    });
  });

  describe('Progressive Disclosure', () => {
    it('should show UserProfile first when data loads', async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: mockTimeline,
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId('search-input');
      await user.type(input, 'testuser');

      await waitFor(() => {
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      });
    });

    it('should show all sections when profile and timeline are loaded', async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: mockTimeline,
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId('search-input');
      await user.type(input, 'testuser');

      await waitFor(() => {
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
        expect(screen.getByTestId('quick-assessment')).toBeInTheDocument();
        expect(screen.getByTestId('activity-timeline')).toBeInTheDocument();
        expect(screen.getByTestId('project-section')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle user with empty timeline', async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: mockProfile,
        timeline: [],
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId('search-input');
      await user.type(input, 'testuser');

      await waitFor(() => {
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
        expect(screen.getByTestId('activity-timeline')).toBeInTheDocument();
        expect(screen.getByTestId('project-section')).toBeInTheDocument();
      });

      // QuickAssessment should not show without timeline data
      expect(screen.queryByTestId('quick-assessment')).not.toBeInTheDocument();
    });

    it('should handle clearing username', async () => {
      mockUseUserAnalytics.mockReturnValue({
        profile: null,
        timeline: [],
        loading: false,
        error: undefined,
      });

      const user = userEvent.setup();
      render(<App />);

      const input = screen.getByTestId('search-input') as HTMLInputElement;

      // Type username
      await user.type(input, 'testuser');
      expect(input.value).toBe('testuser');

      // Clear username
      await user.clear(input);
      expect(input.value).toBe('');

      // Content sections should not be visible
      expect(screen.queryByTestId('user-profile')).not.toBeInTheDocument();
    });
  });
});
