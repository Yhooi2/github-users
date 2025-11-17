import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserAuthenticity } from './UserAuthenticity';
import * as useAuthenticityScoreModule from '@/hooks/useAuthenticityScore';
import type { AuthenticityScore } from '@/types/metrics';
import type { Repository } from '@/apollo/github-api.types';

const mockRepositories: Repository[] = [];

const mockHighScore: AuthenticityScore = {
  score: 85,
  category: 'High',
  breakdown: {
    originalityScore: 22,
    activityScore: 20,
    engagementScore: 23,
    codeOwnershipScore: 20,
  },
  flags: [],
  metadata: {
    totalRepos: 10,
    originalRepos: 9,
    forkedRepos: 1,
    archivedRepos: 0,
    templateRepos: 0,
  },
};

const mockMediumScore: AuthenticityScore = {
  score: 62,
  category: 'Medium',
  breakdown: {
    originalityScore: 15,
    activityScore: 18,
    engagementScore: 14,
    codeOwnershipScore: 15,
  },
  flags: [],
  metadata: {
    totalRepos: 8,
    originalRepos: 5,
    forkedRepos: 3,
    archivedRepos: 0,
    templateRepos: 0,
  },
};

const mockLowScore: AuthenticityScore = {
  score: 35,
  category: 'Low',
  breakdown: {
    originalityScore: 8,
    activityScore: 10,
    engagementScore: 7,
    codeOwnershipScore: 10,
  },
  flags: ['Low activity in original repositories', 'High fork-to-original ratio'],
  metadata: {
    totalRepos: 12,
    originalRepos: 3,
    forkedRepos: 7,
    archivedRepos: 2,
    templateRepos: 0,
  },
};

const mockSuspiciousScore: AuthenticityScore = {
  score: 15,
  category: 'Suspicious',
  breakdown: {
    originalityScore: 3,
    activityScore: 5,
    engagementScore: 2,
    codeOwnershipScore: 5,
  },
  flags: ['Majority of repositories are forks', 'Very low engagement', 'Suspicious activity pattern'],
  metadata: {
    totalRepos: 15,
    originalRepos: 1,
    forkedRepos: 12,
    archivedRepos: 2,
    templateRepos: 0,
  },
};

describe('UserAuthenticity', () => {
  describe('Rendering', () => {
    it('should render title and description', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockHighScore);
      render(<UserAuthenticity repositories={mockRepositories} />);
      expect(screen.getByText('Authenticity Score')).toBeInTheDocument();
      expect(screen.getByText(/Analysis of repository originality/)).toBeInTheDocument();
    });

    it('should render score and category for high score', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockHighScore);
      render(<UserAuthenticity repositories={mockRepositories} />);
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('should render score and category for medium score', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockMediumScore);
      render(<UserAuthenticity repositories={mockRepositories} />);
      expect(screen.getByText('62')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('should render score and category for low score', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockLowScore);
      render(<UserAuthenticity repositories={mockRepositories} />);
      expect(screen.getByText('35')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('should render score and category for suspicious score', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockSuspiciousScore);
      const { container } = render(<UserAuthenticity repositories={mockRepositories} />);
      const scoreElement = container.querySelector('.text-4xl');
      expect(scoreElement).toHaveTextContent('15');
      expect(screen.getAllByText('Suspicious')).toHaveLength(1);
    });
  });

  describe('Score Breakdown', () => {
    it('should render all breakdown components', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockHighScore);
      render(<UserAuthenticity repositories={mockRepositories} />);
      expect(screen.getByText('Originality')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('Engagement')).toBeInTheDocument();
      expect(screen.getByText('Code Ownership')).toBeInTheDocument();
    });

    it('should render breakdown scores', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockHighScore);
      render(<UserAuthenticity repositories={mockRepositories} />);
      expect(screen.getByText('22/25')).toBeInTheDocument(); // Originality
      expect(screen.getAllByText('20/25')).toHaveLength(2); // Activity and Code Ownership
      expect(screen.getByText('23/25')).toBeInTheDocument(); // Engagement
    });

    it('should render progress bars', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockHighScore);
      const { container } = render(<UserAuthenticity repositories={mockRepositories} />);
      const progressBars = container.querySelectorAll('[data-slot="progress-indicator"]');
      expect(progressBars).toHaveLength(4);
    });
  });

  describe('Warning Flags', () => {
    it('should not render flags when array is empty', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockHighScore);
      render(<UserAuthenticity repositories={mockRepositories} />);
      expect(screen.queryByText('Warning Flags:')).not.toBeInTheDocument();
    });

    it('should render flags when present', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockLowScore);
      render(<UserAuthenticity repositories={mockRepositories} />);
      expect(screen.getByText('Warning Flags:')).toBeInTheDocument();
      expect(screen.getByText('Low activity in original repositories')).toBeInTheDocument();
      expect(screen.getByText('High fork-to-original ratio')).toBeInTheDocument();
    });

    it('should render multiple flags for suspicious score', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockSuspiciousScore);
      render(<UserAuthenticity repositories={mockRepositories} />);
      expect(screen.getByText('Majority of repositories are forks')).toBeInTheDocument();
      expect(screen.getByText('Very low engagement')).toBeInTheDocument();
      expect(screen.getByText('Suspicious activity pattern')).toBeInTheDocument();
    });
  });

  describe('Metadata', () => {
    it('should render repository breakdown section', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockHighScore);
      render(<UserAuthenticity repositories={mockRepositories} />);
      expect(screen.getByText('Repository Breakdown')).toBeInTheDocument();
    });

    it('should render all metadata fields', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockHighScore);
      render(<UserAuthenticity repositories={mockRepositories} />);
      expect(screen.getByText('Total:')).toBeInTheDocument();
      expect(screen.getByText('Original:')).toBeInTheDocument();
      expect(screen.getByText('Forked:')).toBeInTheDocument();
      expect(screen.getByText('Archived:')).toBeInTheDocument();
      expect(screen.getByText('Template:')).toBeInTheDocument();
    });

    it('should render correct metadata values', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockHighScore);
      const { container } = render(<UserAuthenticity repositories={mockRepositories} />);
      const metadataSection = container.querySelector('.rounded-lg.border');
      expect(metadataSection).toHaveTextContent('10'); // Total
      expect(metadataSection).toHaveTextContent('9'); // Original
      expect(metadataSection).toHaveTextContent('1'); // Forked
      expect(metadataSection).toHaveTextContent('0'); // Archived & Template
    });
  });

  describe('Category Colors', () => {
    it('should apply green color for high category', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockHighScore);
      const { container } = render(<UserAuthenticity repositories={mockRepositories} />);
      const badge = container.querySelector('.bg-green-500');
      expect(badge).toBeInTheDocument();
    });

    it('should apply yellow color for medium category', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockMediumScore);
      const { container } = render(<UserAuthenticity repositories={mockRepositories} />);
      const badge = container.querySelector('.bg-yellow-500');
      expect(badge).toBeInTheDocument();
    });

    it('should apply orange color for low category', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockLowScore);
      const { container } = render(<UserAuthenticity repositories={mockRepositories} />);
      const badge = container.querySelector('.bg-orange-500');
      expect(badge).toBeInTheDocument();
    });

    it('should apply red color for suspicious category', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockSuspiciousScore);
      const { container } = render(<UserAuthenticity repositories={mockRepositories} />);
      const badge = container.querySelector('.bg-red-500');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-hidden on decorative icons', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockHighScore);
      const { container } = render(<UserAuthenticity repositories={mockRepositories} />);
      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should use semantic card structure', () => {
      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockHighScore);
      const { container } = render(<UserAuthenticity repositories={mockRepositories} />);
      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Hook Integration', () => {
    it('should call useAuthenticityScore with repositories', () => {
      const spy = vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockHighScore);
      const repos: Repository[] = [];
      render(<UserAuthenticity repositories={repos} />);
      expect(spy).toHaveBeenCalledWith(repos);
    });
  });

  describe('Edge Cases', () => {
    it('should handle unknown category gracefully', () => {
      // Create a mock with an unknown category to test default case
      const mockUnknownScore: AuthenticityScore = {
        score: 50,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category: 'Unknown' as any, // Force an unknown category
        breakdown: {
          originalityScore: 12,
          activityScore: 13,
          engagementScore: 13,
          codeOwnershipScore: 12,
        },
        flags: [],
        metadata: {
          totalRepos: 5,
          originalRepos: 3,
          forkedRepos: 2,
          archivedRepos: 0,
          templateRepos: 0,
        },
      };

      vi.spyOn(useAuthenticityScoreModule, 'useAuthenticityScore').mockReturnValue(mockUnknownScore);
      const { container } = render(<UserAuthenticity repositories={mockRepositories} />);

      // Should render the score
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('Unknown')).toBeInTheDocument();

      // Should apply default color (bg-muted)
      const badge = container.querySelector('.bg-muted');
      expect(badge).toBeInTheDocument();
    });
  });
});
