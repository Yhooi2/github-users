import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
};

const meta: Meta<typeof ChartContainer> = {
  title: "UI/Chart",
  component: ChartContainer,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A chart container component built on Recharts for data visualization.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChartContainer>;

// Story 1: Bar Chart
export const BarChartExample: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-[500px]">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

// Story 2: Line Chart
export const LineChartExample: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-[500px]">
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="desktop"
          type="monotone"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="mobile"
          type="monotone"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  ),
};

// Story 3: Area Chart
export const AreaChartExample: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-[500px]">
      <AreaChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="desktop"
          type="monotone"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
        />
        <Area
          dataKey="mobile"
          type="monotone"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
          stroke="var(--color-mobile)"
        />
      </AreaChart>
    </ChartContainer>
  ),
};

// Story 4: Single Bar Chart
export const SingleBarChart: Story = {
  render: () => {
    const config = {
      value: {
        label: "Value",
        color: "#2563eb",
      },
    };

    const data = [
      { name: "Jan", value: 400 },
      { name: "Feb", value: 300 },
      { name: "Mar", value: 600 },
      { name: "Apr", value: 800 },
      { name: "May", value: 500 },
    ];

    return (
      <ChartContainer config={config} className="min-h-[200px] w-[400px]">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>
    );
  },
};

// Story 5: Commits Chart (GitHub use case)
export const CommitsChart: Story = {
  render: () => {
    const config = {
      commits: {
        label: "Commits",
        color: "#22c55e",
      },
    };

    const data = [
      { year: "2021", commits: 245 },
      { year: "2022", commits: 378 },
      { year: "2023", commits: 512 },
      { year: "2024", commits: 689 },
    ];

    return (
      <ChartContainer config={config} className="min-h-[200px] w-[400px]">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="commits" fill="var(--color-commits)" radius={4} />
        </BarChart>
      </ChartContainer>
    );
  },
};

// Story 6: Activity Line Chart
export const ActivityLineChart: Story = {
  render: () => {
    const config = {
      activity: {
        label: "Activity",
        color: "#8b5cf6",
      },
    };

    const data = [
      { week: "W1", activity: 12 },
      { week: "W2", activity: 19 },
      { week: "W3", activity: 15 },
      { week: "W4", activity: 25 },
      { week: "W5", activity: 22 },
      { week: "W6", activity: 30 },
    ];

    return (
      <ChartContainer config={config} className="min-h-[200px] w-[400px]">
        <LineChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="week" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            dataKey="activity"
            type="monotone"
            stroke="var(--color-activity)"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ChartContainer>
    );
  },
};

// Story 7: Empty Chart
export const EmptyChart: Story = {
  render: () => {
    const config = {
      value: {
        label: "Value",
        color: "#2563eb",
      },
    };

    return (
      <ChartContainer config={config} className="min-h-[200px] w-[400px]">
        <BarChart data={[]}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>
    );
  },
};
