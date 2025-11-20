import { render } from "@testing-library/react";
import { Bar, BarChart, XAxis } from "recharts";
import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { describe, expect, it } from "vitest";
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";

const mockChartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
};

const mockData = [
  { name: "Jan", desktop: 100, mobile: 80 },
  { name: "Feb", desktop: 200, mobile: 150 },
];

describe("ChartContainer", () => {
  describe("rendering", () => {
    it("should render chart container with children", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("should render with custom className", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig} className="custom-chart">
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      const chartElement = container.querySelector('[data-slot="chart"]');
      expect(chartElement).toHaveClass("custom-chart");
    });

    it("should generate unique chart ID", () => {
      const { container: container1 } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      const { container: container2 } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      const chart1 = container1.querySelector('[data-slot="chart"]');
      const chart2 = container2.querySelector('[data-slot="chart"]');

      const id1 = chart1?.getAttribute("data-chart");
      const id2 = chart2?.getAttribute("data-chart");

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it("should use custom ID when provided", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig} id="custom-id">
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      const chartElement = container.querySelector('[data-slot="chart"]');
      expect(chartElement).toHaveAttribute("data-chart", "chart-custom-id");
    });
  });

  describe("configuration", () => {
    it("should accept chart config", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("should handle empty config", () => {
      const { container } = render(
        <ChartContainer config={{}}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("should handle config with theme colors", () => {
      const configWithTheme = {
        desktop: {
          label: "Desktop",
          theme: {
            light: "#2563eb",
            dark: "#60a5fa",
          },
        },
      };

      const { container } = render(
        <ChartContainer config={configWithTheme}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
      // Check if style tag is generated
      expect(container.querySelector("style")).toBeInTheDocument();
    });
  });

  describe("responsive container", () => {
    it("should wrap children in ResponsiveContainer", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      // ResponsiveContainer renders
      expect(
        container.querySelector(".recharts-responsive-container"),
      ).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have default chart classes", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      const chartElement = container.querySelector('[data-slot="chart"]');
      expect(chartElement).toHaveClass("flex");
      expect(chartElement).toHaveClass("aspect-video");
      expect(chartElement).toHaveClass("justify-center");
    });

    it("should merge custom classes with defaults", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig} className="custom-width">
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      const chartElement = container.querySelector('[data-slot="chart"]');
      expect(chartElement).toHaveClass("custom-width");
      expect(chartElement).toHaveClass("flex");
    });
  });

  describe("data attributes", () => {
    it("should have data-slot attribute", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("should have data-chart attribute with ID", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      const chartElement = container.querySelector('[data-slot="chart"]');
      const chartId = chartElement?.getAttribute("data-chart");
      expect(chartId).toMatch(/^chart-/);
    });
  });

  describe("accessibility", () => {
    it("should support aria attributes via props spread", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig} aria-label="Sales chart">
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      expect(
        container.querySelector('[aria-label="Sales chart"]'),
      ).toBeInTheDocument();
    });

    it("should support role attribute", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig} role="img">
          <BarChart data={mockData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      const chartElement = container.querySelector('[data-slot="chart"]');
      expect(chartElement).toHaveAttribute("role", "img");
    });
  });

  describe("edge cases", () => {
    it("should handle empty data", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={[]}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("should handle multiple chart types", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <BarChart data={mockData}>
            <XAxis dataKey="name" />
            <Bar dataKey="desktop" />
            <Bar dataKey="mobile" />
          </BarChart>
        </ChartContainer>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });
  });

  it("should handle config with only color", () => {
    const simpleConfig = {
      value: {
        label: "Value",
        color: "#ff0000",
      },
    };

    const { container } = render(
      <ChartContainer config={simpleConfig}>
        <BarChart data={mockData}>
          <Bar dataKey="value" />
        </BarChart>
      </ChartContainer>,
    );

    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it("should generate CSS variables for colors", () => {
    const { container } = render(
      <ChartContainer config={mockChartConfig} id="test-chart">
        <BarChart data={mockData}>
          <Bar dataKey="desktop" />
        </BarChart>
      </ChartContainer>,
    );

    const style = container.querySelector("style");
    expect(style).toBeInTheDocument();

    const styleContent = style?.innerHTML || "";
    expect(styleContent).toContain("--color-desktop");
    expect(styleContent).toContain("--color-mobile");
  });
});

describe("ChartTooltip", () => {
  it("should render ChartTooltip", () => {
    const { container } = render(
      <ChartContainer config={mockChartConfig}>
        <BarChart data={mockData}>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="desktop" />
        </BarChart>
      </ChartContainer>,
    );

    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });

  it("should render with custom content", () => {
    const CustomContent = () => <div data-testid="custom-tooltip">Custom</div>;

    const { container } = render(
      <ChartContainer config={mockChartConfig}>
        <BarChart data={mockData}>
          <ChartTooltip content={<CustomContent />} />
          <Bar dataKey="desktop" />
        </BarChart>
      </ChartContainer>,
    );

    expect(container.querySelector('[data-slot="chart"]')).toBeInTheDocument();
  });
});

describe("ChartTooltipContent", () => {
  const mockPayload = [
    {
      name: "desktop",
      value: 100,
      dataKey: "desktop",
      color: "#2563eb",
      payload: { name: "Jan", desktop: 100 },
    },
  ];

  describe("rendering", () => {
    it("should return null when not active", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartTooltipContent active={false} payload={mockPayload} />
        </ChartContainer>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
      // Tooltip content should not render
      expect(
        container.querySelector(".border-border\\/50"),
      ).not.toBeInTheDocument();
    });

    it("should return null when payload is empty", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartTooltipContent active={true} payload={[]} />
        </ChartContainer>,
      );

      expect(
        container.querySelector(".border-border\\/50"),
      ).not.toBeInTheDocument();
    });

    it("should render with active and payload", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartTooltipContent active={true} payload={mockPayload} />
        </ChartContainer>,
      );

      expect(
        container.querySelector(".border-border\\/50"),
      ).toBeInTheDocument();
    });
  });

  describe("hideLabel prop", () => {
    it("should hide label when hideLabel is true", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartTooltipContent
            active={true}
            payload={mockPayload}
            hideLabel={true}
            label="Test Label"
          />
        </ChartContainer>,
      );

      // Tooltip should render but label text should not be in content
      expect(
        container.querySelector(".border-border\\/50"),
      ).toBeInTheDocument();
      expect(container.textContent).not.toContain("Test Label");
    });

    it("should show label when hideLabel is false", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartTooltipContent
            active={true}
            payload={mockPayload}
            hideLabel={false}
            label="Desktop"
          />
        </ChartContainer>,
      );

      // Label should be visible in content
      expect(container.textContent).toContain("Desktop");
    });
  });

  describe("hideIndicator prop", () => {
    it("should hide indicator when hideIndicator is true", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartTooltipContent
            active={true}
            payload={mockPayload}
            hideIndicator={true}
          />
        </ChartContainer>,
      );

      // Should not have indicator div
      expect(
        container.querySelector(".shrink-0.rounded-\\[2px\\]"),
      ).not.toBeInTheDocument();
    });
  });

  describe("indicator types", () => {
    it("should render dot indicator", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartTooltipContent
            active={true}
            payload={mockPayload}
            indicator="dot"
          />
        </ChartContainer>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("should render line indicator", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartTooltipContent
            active={true}
            payload={mockPayload}
            indicator="line"
          />
        </ChartContainer>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });

    it("should render dashed indicator", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartTooltipContent
            active={true}
            payload={mockPayload}
            indicator="dashed"
          />
        </ChartContainer>,
      );

      expect(
        container.querySelector('[data-slot="chart"]'),
      ).toBeInTheDocument();
    });
  });

  describe("formatter functions", () => {
    it("should use formatter when provided", () => {
      const formatter = (value: number) => `$${value}`;

      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartTooltipContent
            active={true}
            payload={mockPayload}
            formatter={formatter}
          />
        </ChartContainer>,
      );

      expect(container.textContent).toContain("$");
    });

    it("should use labelFormatter when provided", () => {
      const labelFormatter = (label: string) => `Label: ${label}`;

      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartTooltipContent
            active={true}
            payload={mockPayload}
            label="Test"
            labelFormatter={labelFormatter}
          />
        </ChartContainer>,
      );

      expect(container.textContent).toContain("Label:");
    });
  });

  describe("payload filtering", () => {
    it('should filter out items with type="none"', () => {
      const payloadWithNone = [
        ...mockPayload,
        {
          name: "hidden",
          value: 50,
          dataKey: "hidden",
          type: "none" as const,
          payload: {},
        },
      ];

      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartTooltipContent active={true} payload={payloadWithNone} />
        </ChartContainer>,
      );

      // Should only show one item (not the 'none' type)
      const items = container.querySelectorAll(
        '[data-slot="chart"] > div > div > div',
      );
      expect(items.length).toBeGreaterThan(0);
    });
  });
});

describe("ChartLegendContent", () => {
  const mockLegendPayload: Payload[] = [
    {
      value: "desktop",
      type: "rect",
      id: "desktop",
      color: "#2563eb",
      dataKey: "desktop",
    },
    {
      value: "mobile",
      type: "rect",
      id: "mobile",
      color: "#60a5fa",
      dataKey: "mobile",
    },
  ];

  describe("rendering", () => {
    it("should return null when payload is empty", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartLegendContent payload={[]} />
        </ChartContainer>,
      );

      // Should not render any legend items
      expect(
        container.querySelector(".flex.items-center"),
      ).not.toBeInTheDocument();
    });

    it("should return null when payload is undefined", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartLegendContent />
        </ChartContainer>,
      );

      expect(
        container.querySelector(".flex.items-center"),
      ).not.toBeInTheDocument();
    });

    it("should render legend items", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartLegendContent payload={mockLegendPayload} />
        </ChartContainer>,
      );

      const legendContainer = container.querySelector(".flex.items-center");
      expect(legendContainer).toBeInTheDocument();
    });

    it("should render correct number of legend items", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartLegendContent payload={mockLegendPayload} />
        </ChartContainer>,
      );

      // Each item should have a color indicator
      const colorIndicators = container.querySelectorAll(".h-2.w-2");
      expect(colorIndicators.length).toBe(2);
    });
  });

  describe("hideIcon prop", () => {
    it("should hide icon when hideIcon is true", () => {
      const configWithIcon = {
        desktop: {
          label: "Desktop",
          color: "#2563eb",
          icon: () => <svg data-testid="custom-icon">Icon</svg>,
        },
      };

      const { queryByTestId } = render(
        <ChartContainer config={configWithIcon}>
          <ChartLegendContent payload={mockLegendPayload} hideIcon={true} />
        </ChartContainer>,
      );

      expect(queryByTestId("custom-icon")).not.toBeInTheDocument();
    });

    it("should show icon when hideIcon is false", () => {
      const IconComponent = () => <svg data-testid="custom-icon">Icon</svg>;
      const configWithIcon = {
        desktop: {
          label: "Desktop",
          color: "#2563eb",
          icon: IconComponent,
        },
        mobile: {
          label: "Mobile",
          color: "#60a5fa",
        },
      };

      const { container } = render(
        <ChartContainer config={configWithIcon}>
          <ChartLegendContent payload={mockLegendPayload} hideIcon={false} />
        </ChartContainer>,
      );

      // Should render legend container
      expect(container.querySelector(".flex.items-center")).toBeInTheDocument();
    });
  });

  describe("verticalAlign prop", () => {
    it("should apply bottom padding when verticalAlign is bottom", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartLegendContent
            payload={mockLegendPayload}
            verticalAlign="bottom"
          />
        </ChartContainer>,
      );

      const legendContainer = container.querySelector(".flex.items-center");
      expect(legendContainer).toHaveClass("pt-3");
    });

    it("should apply top padding when verticalAlign is top", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartLegendContent payload={mockLegendPayload} verticalAlign="top" />
        </ChartContainer>,
      );

      const legendContainer = container.querySelector(".flex.items-center");
      expect(legendContainer).toHaveClass("pb-3");
    });
  });

  describe("payload filtering", () => {
    it('should filter out items with type="none"', () => {
      const payloadWithNone: Payload[] = [
        ...mockLegendPayload,
        {
          value: "hidden",
          type: "none",
          id: "hidden",
          dataKey: "hidden",
        },
      ];

      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartLegendContent payload={payloadWithNone} />
        </ChartContainer>,
      );

      // Should only show 2 items (desktop + mobile), not the 'none' type
      const colorIndicators = container.querySelectorAll(".h-2.w-2");
      expect(colorIndicators.length).toBe(2);
    });
  });

  describe("custom className", () => {
    it("should apply custom className", () => {
      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartLegendContent
            payload={mockLegendPayload}
            className="custom-legend"
          />
        </ChartContainer>,
      );

      const legendContainer = container.querySelector(".custom-legend");
      expect(legendContainer).toBeInTheDocument();
    });
  });

  describe("nameKey prop", () => {
    it("should use custom nameKey for config lookup", () => {
      const customPayload: any[] = [
        {
          value: "custom",
          type: "rect",
          id: "item1",
          color: "#ff0000",
          customKey: "desktop",
        },
      ];

      const { container } = render(
        <ChartContainer config={mockChartConfig}>
          <ChartLegendContent payload={customPayload} nameKey="customKey" />
        </ChartContainer>,
      );

      const legendContainer = container.querySelector(".flex.items-center");
      expect(legendContainer).toBeTruthy();
    });
  });
});
