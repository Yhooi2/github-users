import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickAssessment } from './QuickAssessment';

describe('QuickAssessment', () => {
  const mockMetrics = {
    activity: {
      score: 85,
      level: 'High' as const,
      breakdown: { recentCommits: 30, consistency: 25, diversity: 30 },
      details: { last3MonthsCommits: 150, activeMonths: 10, uniqueRepos: 12 }
    },
    impact: {
      score: 72,
      level: 'Strong' as const,
      breakdown: { stars: 28, forks: 15, contributors: 12, reach: 12, engagement: 5 },
      details: { totalStars: 400, totalForks: 150, totalWatchers: 80, totalPRs: 50, totalIssues: 100 }
    },
    quality: {
      score: 90,
      level: 'Excellent' as const,
      breakdown: { originality: 28, documentation: 23, ownership: 18, maturity: 13, stack: 8 },
      details: { totalRepos: 20, originalRepos: 18, docsQuality: 0.9, avgAge: 2.5, uniqueLanguages: 8 }
    },
    growth: {
      score: 45,
      level: 'Growing' as const,
      breakdown: { commitGrowth: 20, repoGrowth: 15, impactGrowth: 10 },
      details: { commitChange: 0.3, repoChange: 0.2, impactChange: 0.15 }
    },
  };

  it('renders section title', () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    expect(screen.getByText('🎯 Quick Assessment')).toBeInTheDocument();
  });

  it('renders all four metric cards', () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('Impact')).toBeInTheDocument();
    expect(screen.getByText('Quality')).toBeInTheDocument();
    expect(screen.getByText('Growth')).toBeInTheDocument();
  });

  it('renders metric scores correctly', () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('72%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('renders metric levels correctly', () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Strong')).toBeInTheDocument();
    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByText('Growing')).toBeInTheDocument();
  });

  it('applies responsive grid layout', () => {
    const { container } = render(<QuickAssessment metrics={mockMetrics} />);

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-4');
  });

  it('passes loading state to all metric cards', () => {
    const { container } = render(<QuickAssessment metrics={mockMetrics} loading />);

    const loadingCards = container.querySelectorAll('.animate-pulse');
    expect(loadingCards).toHaveLength(4);
  });

  it('opens modal when explain button clicked', () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    // Click explain button for Activity (first info button)
    const explainButtons = screen.getAllByLabelText(/Explain .* score/);
    expect(explainButtons).toHaveLength(4);

    fireEvent.click(explainButtons[0]); // Activity

    // Modal should be visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Activity Score: 85%')).toBeInTheDocument();
  });

  it('renders explain buttons for all metrics', () => {
    render(<QuickAssessment metrics={mockMetrics} />);

    const explainButtons = screen.getAllByLabelText(/Explain .* score/);
    expect(explainButtons).toHaveLength(4);
  });

  it('renders with different metric values', () => {
    const differentMetrics = {
      activity: {
        score: 20,
        level: 'Low' as const,
        breakdown: { recentCommits: 5, consistency: 5, diversity: 10 },
        details: { last3MonthsCommits: 25, activeMonths: 2, uniqueRepos: 3 }
      },
      impact: {
        score: 15,
        level: 'Minimal' as const,
        breakdown: { stars: 3, forks: 2, contributors: 2, reach: 5, engagement: 3 },
        details: { totalStars: 10, totalForks: 5, totalWatchers: 8, totalPRs: 5, totalIssues: 15 }
      },
      quality: {
        score: 30,
        level: 'Fair' as const,
        breakdown: { originality: 10, documentation: 8, ownership: 5, maturity: 4, stack: 3 },
        details: { totalRepos: 5, originalRepos: 3, docsQuality: 0.4, avgAge: 0.5, uniqueLanguages: 3 }
      },
      growth: {
        score: 10,
        level: 'Stable' as const,
        breakdown: { commitGrowth: 5, repoGrowth: 3, impactGrowth: 2 },
        details: { commitChange: 0.05, repoChange: 0.03, impactChange: 0.02 }
      },
    };

    render(<QuickAssessment metrics={differentMetrics} />);

    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();

    // Check levels
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('Minimal')).toBeInTheDocument();
    expect(screen.getByText('Fair')).toBeInTheDocument();
    expect(screen.getByText('Stable')).toBeInTheDocument();
  });
});
