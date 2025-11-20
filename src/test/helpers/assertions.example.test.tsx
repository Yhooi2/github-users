/**
 * Custom Assertions Usage Examples
 *
 * This file demonstrates how to use the custom assertion helpers
 * to write cleaner, more readable tests.
 *
 * Week 2 P1: Quality improvements for test suite
 */

import { describe, it } from 'vitest'
import { render } from '@testing-library/react'
import {
  expectMetricValue,
  expectBreakdownMetric,
  expectStructure,
  expectARIA,
  expectLoadingState,
  expectProgressBar,
  expectClasses,
  expectOrder,
  expectIcons,
  expectGridLayout,
} from './assertions'

// Mock component for demonstration
function MockMetricCard({
  score,
  loading,
}: {
  score: number
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="metric-card">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="metric-card hover:shadow-lg hover:-translate-y-0.5">
      <div className="metric-value" aria-label={`Activity score`}>
        {score}%
      </div>
      <div className="progress-bar" style={{ width: `${score}%` }} />
      <div className="breakdown">
        <div>
          <span>Recent commits</span>
          <span>40/40</span>
        </div>
        <div>
          <span>Consistency</span>
          <span>30/30</span>
        </div>
      </div>
      <svg>
        <circle />
      </svg>
    </div>
  )
}

function MockStatsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div data-slot="card">
        <div data-slot="card-title">Repositories</div>
        <div>42</div>
      </div>
      <div data-slot="card">
        <div data-slot="card-title">Followers</div>
        <div>1234</div>
      </div>
      <div data-slot="card">
        <div data-slot="card-title">Following</div>
        <div>89</div>
      </div>
      <div data-slot="card">
        <div data-slot="card-title">Gists</div>
        <div>15</div>
      </div>
    </div>
  )
}

describe('Custom Assertions Examples', () => {
  describe('expectMetricValue', () => {
    it('should validate percentage metrics with ARIA labels', () => {
      const { container } = render(<MockMetricCard score={85} />)

      // ✅ Clean, semantic assertion
      expectMetricValue(85, {
        format: 'percentage',
        ariaLabel: 'Activity score',
        container,
      })

      // vs OLD way:
      // expect(screen.getByText('85%')).toBeInTheDocument()
      // expect(screen.getByLabelText('Activity score')).toBeInTheDocument()
    })

    it('should validate number metrics', () => {
      const { container } = render(<MockStatsGrid />)

      // ✅ Simple number validation
      expectMetricValue(42, { container })
      expectMetricValue(1234, { container })
      expectMetricValue(89, { container })
    })
  })

  describe('expectBreakdownMetric', () => {
    it('should validate breakdown metrics', () => {
      const { container } = render(<MockMetricCard score={85} />)

      // ✅ Single assertion for label + value/max
      expectBreakdownMetric('Recent commits', 40, 40, container)
      expectBreakdownMetric('Consistency', 30, 30, container)

      // vs OLD way:
      // expect(screen.getByText('Recent commits')).toBeInTheDocument()
      // expect(screen.getByText('40/40')).toBeInTheDocument()
      // expect(screen.getByText('Consistency')).toBeInTheDocument()
      // expect(screen.getByText('30/30')).toBeInTheDocument()
    })
  })

  describe('expectStructure', () => {
    it('should validate component DOM structure', () => {
      const { container } = render(<MockStatsGrid />)

      // ✅ Declarative structure validation
      expectStructure(container, [
        { selector: '[data-slot="card"]', count: 4 },
        {
          selector: '[data-slot="card"]',
          required: true,
          children: [
            { selector: '[data-slot="card-title"]', required: true },
          ],
        },
      ])

      // vs OLD way:
      // const cards = container.querySelectorAll('[data-slot="card"]')
      // expect(cards).toHaveLength(4)
      // const titles = container.querySelectorAll('[data-slot="card-title"]')
      // expect(titles.length).toBeGreaterThan(0)
    })
  })

  describe('expectARIA', () => {
    it('should validate ARIA attributes', () => {
      const { container } = render(<MockMetricCard score={85} />)
      const metricValue = container.querySelector('.metric-value')!

      // ✅ Clean ARIA validation
      expectARIA(metricValue, {
        'aria-label': 'Activity score',
      })

      // vs OLD way:
      // expect(metricValue.getAttribute('aria-label')).toBe('Activity score')
    })
  })

  describe('expectLoadingState', () => {
    it('should validate loading state', () => {
      const { container } = render(<MockMetricCard score={0} loading />)

      // ✅ Single assertion for loading state
      expectLoadingState(container, true)

      // vs OLD way:
      // const pulseElements = container.querySelectorAll('.animate-pulse')
      // expect(pulseElements.length).toBeGreaterThan(0)
    })

    it('should validate NOT loading state', () => {
      const { container } = render(<MockMetricCard score={85} />)

      // ✅ Single assertion for NOT loading
      expectLoadingState(container, false)
    })
  })

  describe('expectProgressBar', () => {
    it('should validate progress bar width', () => {
      const { container } = render(<MockMetricCard score={75} />)

      // ✅ Clean progress bar validation
      expectProgressBar(container, 75)

      // vs OLD way:
      // const progressBar = container.querySelector('[style*="width: 75%"]')
      // expect(progressBar).toBeInTheDocument()
    })
  })

  describe('expectClasses', () => {
    it('should validate CSS classes', () => {
      const { container } = render(<MockMetricCard score={85} />)
      const card = container.querySelector('.metric-card')!

      // ✅ Single assertion for multiple classes
      expectClasses(card, ['hover:shadow-lg', 'hover:-translate-y-0.5'])

      // vs OLD way:
      // expect(card).toHaveClass('hover:shadow-lg')
      // expect(card).toHaveClass('hover:-translate-y-0.5')
    })
  })

  describe('expectOrder', () => {
    it('should validate element order', () => {
      const { container } = render(<MockStatsGrid />)

      // ✅ Single assertion for order validation
      expectOrder(container, '[data-slot="card-title"]', [
        'Repositories',
        'Followers',
        'Following',
        'Gists',
      ])

      // vs OLD way:
      // const titles = container.querySelectorAll('[data-slot="card-title"]')
      // expect(titles[0]).toHaveTextContent('Repositories')
      // expect(titles[1]).toHaveTextContent('Followers')
      // expect(titles[2]).toHaveTextContent('Following')
      // expect(titles[3]).toHaveTextContent('Gists')
    })
  })

  describe('expectIcons', () => {
    it('should validate icon presence', () => {
      const { container } = render(<MockMetricCard score={85} />)

      // ✅ Simple icon validation
      expectIcons(container)

      // vs OLD way:
      // const icons = container.querySelectorAll('svg')
      // expect(icons.length).toBeGreaterThan(0)
    })
  })

  describe('expectGridLayout', () => {
    it('should validate responsive grid layout', () => {
      const { container } = render(<MockStatsGrid />)
      const grid = container.firstChild as HTMLElement

      // ✅ Single assertion for grid layout
      expectGridLayout(grid, ['grid', 'grid-cols-2', 'md:grid-cols-4'])

      // vs OLD way:
      // expect(grid).toHaveClass('grid')
      // expect(grid).toHaveClass('grid-cols-2')
      // expect(grid).toHaveClass('md:grid-cols-4')
    })
  })
})
