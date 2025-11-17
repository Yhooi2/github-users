import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './chart';
import { BarChart, Bar, XAxis } from 'recharts';

const mockChartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
};

const mockData = [
  { name: 'Jan', desktop: 100, mobile: 80 },
  { name: 'Feb', desktop: 200, mobile: 150 },
];

describe('ChartContainer', () => {
  describe('rendering', () => {
    it('should render chart container with children', () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig} className="custom-chart">
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      const chartElement = container.querySelector('[data-slot="chart"]');
      expect(chartElement).toHaveClass('custom-chart');
    });

    it('should generate unique chart ID', () => {
      const { container: container1 } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      const { container: container2 } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      const chart1 = container1.querySelector('[data-slot="chart"]');
      const chart2 = container2.querySelector('[data-slot="chart"]');

      const id1 = chart1?.getAttribute('data-chart');
      const id2 = chart2?.getAttribute('data-chart');

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('should use custom ID when provided', () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig} id="custom-id">
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      const chartElement = container.querySelector('[data-slot="chart"]');
      expect(chartElement).toHaveAttribute('data-chart', 'chart-custom-id');
    });
  });

  describe('configuration', () => {
    it('should accept chart config', () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    });

    it('should handle empty config', () => {
      const { container } = render(
        <ChartContainer config={{}}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    });

    it('should handle config with theme colors', () => {
      const configWithTheme = {
        desktop: {
          label: 'Desktop',
          theme: {
            light: '#2563eb',
            dark: '#60a5fa',
          },
        },
      };

      const { container } = render(
        <ChartContainer config={configWithTheme}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
      // Check if style tag is generated
      expect(container.querySelector('style')).toBeInTheDocument();
    });
  });

  describe('responsive container', () => {
    it('should wrap children in ResponsiveContainer', () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      // ResponsiveContainer renders
      expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have default chart classes', () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      const chartElement = container.querySelector('[data-slot="chart"]');
      expect(chartElement).toHaveClass('flex');
      expect(chartElement).toHaveClass('aspect-video');
      expect(chartElement).toHaveClass('justify-center');
    });

    it('should merge custom classes with defaults', () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig} className="custom-width">
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      const chartElement = container.querySelector('[data-slot="chart"]');
      expect(chartElement).toHaveClass('custom-width');
      expect(chartElement).toHaveClass('flex');
    });
  });

  describe('data attributes', () => {
    it('should have data-slot attribute', () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    });

    it('should have data-chart attribute with ID', () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      const chartElement = container.querySelector('[data-slot="chart"]');
      const chartId = chartElement?.getAttribute('data-chart');
      expect(chartId).toMatch(/^chart-/);
    });
  });

  describe('accessibility', () => {
    it('should support aria attributes via props spread', () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig} aria-label="Sales chart">
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      expect(container.querySelector('[aria-label="Sales chart"]')).toBeInTheDocument();
    });

    it('should support role attribute', () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig} role="img">
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      const chartElement = container.querySelector('[data-slot="chart"]');
      expect(chartElement).toHaveAttribute('role', 'img');
    });
  });

  describe('edge cases', () => {
    it('should handle empty data', () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={[]}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>
      );

      expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    });

    it('should handle multiple chart types', () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <XAxis dataKey="name" />
            <Bar dataKey="desktop" />
            <Bar dataKey="mobile" />
          </BarChart>
        </ChartContainer>
      );

      expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
    });
  });

  it('should handle config with only color', () => {
    const simpleConfig = {
      value: {
        label: 'Value',
        color: '#ff0000',
      },
    };

    const { container } = render(
      <ChartContainer config={simpleConfig}>
        <BarChart data={mockData}>
          <Bar dataKey="value" />
        </BarChart>
      </ChartContainer>
    );

    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('should generate CSS variables for colors', () => {
    const { container } = render(
      <ChartContainer config={mockChartConfig} id="test-chart">
        <BarChart data={mockData}>
          <Bar dataKey="desktop" />
        </BarChart>
      </ChartContainer>
    );

    const style = container.querySelector('style');
    expect(style).toBeInTheDocument();

    const styleContent = style?.innerHTML || '';
    expect(styleContent).toContain('--color-desktop');
    expect(styleContent).toContain('--color-mobile');
  });
});

describe('ChartTooltip', () => {
  it('should render ChartTooltip', () => {
    const { container } = render(
      <ChartContainer config={mockChartConfig}>
        <BarChart data={mockData}>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="desktop" />
        </BarChart>
      </ChartContainer>
    );

    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it('should render with custom content', () => {
    const CustomContent = () => <div data-testid="custom-tooltip">Custom</div>;

    const { container } = render(
      <ChartContainer config={mockChartConfig}>
        <BarChart data={mockData}>
          <ChartTooltip content={<CustomContent />} />
          <Bar dataKey="desktop" />
        </BarChart>
      </ChartContainer>
    );

    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});
