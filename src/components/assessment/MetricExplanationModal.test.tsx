import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MetricExplanationModal } from './MetricExplanationModal';

describe('MetricExplanationModal', () => {
  const mockOnClose = vi.fn();

  afterEach(() => {
    mockOnClose.mockClear();
  });

  it('renders when open', () => {
    render(
      <MetricExplanationModal
        isOpen={true}
        onClose={mockOnClose}
        metric="activity"
        score={85}
        breakdown={{ recentCommits: 40, consistency: 30, diversity: 15 }}
      />
    );

    expect(screen.getByText('Activity Score: 85%')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <MetricExplanationModal
        isOpen={false}
        onClose={mockOnClose}
        metric="activity"
        score={85}
        breakdown={{ recentCommits: 40, consistency: 30, diversity: 15 }}
      />
    );

    expect(screen.queryByText('Activity Score: 85%')).not.toBeInTheDocument();
  });

  it('displays activity metric details', () => {
    render(
      <MetricExplanationModal
        isOpen={true}
        onClose={mockOnClose}
        metric="activity"
        score={85}
        breakdown={{ recentCommits: 40, consistency: 30, diversity: 15 }}
      />
    );

    expect(screen.getByText('Activity Score: 85%')).toBeInTheDocument();
    expect(screen.getByText('Measures recent coding activity, consistency, and project diversity')).toBeInTheDocument();
    expect(screen.getByText('40 pts')).toBeInTheDocument();
    expect(screen.getByText('30 pts')).toBeInTheDocument();
    expect(screen.getByText('15 pts')).toBeInTheDocument();
  });

  it('displays impact metric details', () => {
    render(
      <MetricExplanationModal
        isOpen={true}
        onClose={mockOnClose}
        metric="impact"
        score={72}
        breakdown={{ stars: 30, forks: 18, contributors: 12, reach: 10, engagement: 2 }}
      />
    );

    expect(screen.getByText('Impact Score: 72%')).toBeInTheDocument();
    expect(screen.getByText('Measures community reach and engagement')).toBeInTheDocument();
    expect(screen.getByText('30 pts')).toBeInTheDocument();
    expect(screen.getByText('18 pts')).toBeInTheDocument();
    expect(screen.getByText('12 pts')).toBeInTheDocument();
    expect(screen.getByText('10 pts')).toBeInTheDocument();
    expect(screen.getByText('2 pts')).toBeInTheDocument();
  });

  it('displays quality metric details', () => {
    render(
      <MetricExplanationModal
        isOpen={true}
        onClose={mockOnClose}
        metric="quality"
        score={90}
        breakdown={{ originality: 30, documentation: 22, ownership: 18, maturity: 12, stack: 8 }}
      />
    );

    expect(screen.getByText('Quality Score: 90%')).toBeInTheDocument();
    expect(screen.getByText('Evaluates code quality, documentation, and maturity')).toBeInTheDocument();
    expect(screen.getByText('30 pts')).toBeInTheDocument();
    expect(screen.getByText('22 pts')).toBeInTheDocument();
    expect(screen.getByText('18 pts')).toBeInTheDocument();
    expect(screen.getByText('12 pts')).toBeInTheDocument();
    expect(screen.getByText('8 pts')).toBeInTheDocument();
  });

  it('displays growth metric details', () => {
    render(
      <MetricExplanationModal
        isOpen={true}
        onClose={mockOnClose}
        metric="growth"
        score={45}
        breakdown={{ commitGrowth: 20, repoGrowth: 15, impactGrowth: 10 }}
      />
    );

    expect(screen.getByText('Growth Score: 45%')).toBeInTheDocument();
    expect(screen.getByText('Tracks year-over-year improvement in contributions')).toBeInTheDocument();
    expect(screen.getByText('20 pts')).toBeInTheDocument();
    expect(screen.getByText('15 pts')).toBeInTheDocument();
    expect(screen.getByText('10 pts')).toBeInTheDocument();
  });

  it('calls onClose when dialog is dismissed', () => {
    render(
      <MetricExplanationModal
        isOpen={true}
        onClose={mockOnClose}
        metric="activity"
        score={85}
        breakdown={{ recentCommits: 40, consistency: 30, diversity: 15 }}
      />
    );

    // Find and click the close button (usually an X button in the dialog)
    // The Dialog component from shadcn has a built-in close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('displays score breakdown section', () => {
    render(
      <MetricExplanationModal
        isOpen={true}
        onClose={mockOnClose}
        metric="activity"
        score={85}
        breakdown={{ recentCommits: 40, consistency: 30, diversity: 15 }}
      />
    );

    expect(screen.getByText('Score Breakdown:')).toBeInTheDocument();
  });

  it('handles unknown breakdown keys gracefully', () => {
    render(
      <MetricExplanationModal
        isOpen={true}
        onClose={mockOnClose}
        metric="activity"
        score={85}
        breakdown={{ unknownKey: 10, recentCommits: 40 }}
      />
    );

    // Should display the unknown key as-is
    expect(screen.getByText('unknownKey')).toBeInTheDocument();
    expect(screen.getByText('10 pts')).toBeInTheDocument();
  });
});
