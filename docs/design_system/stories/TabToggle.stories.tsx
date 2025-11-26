import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { TabToggle } from "../TabToggle";
import { ThemeProvider } from "../../context/ThemeContext";
import { Background } from "../Background";

const meta: Meta<typeof TabToggle> = {
  title: "Design System/Desktop/TabToggle",
  component: TabToggle,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="glass">
        <Background>
          <div className="p-8">
            <Story />
          </div>
        </Background>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A glassmorphism-styled tab toggle for switching between options. Generic type support for tab values.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const repoTabs = [
  { value: "your", label: "Your" },
  { value: "contrib", label: "Contrib" },
] as const;

const viewTabs = [
  { value: "list", label: "List" },
  { value: "grid", label: "Grid" },
  { value: "timeline", label: "Timeline" },
] as const;

const periodTabs = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
  { value: "all", label: "All Time" },
] as const;

// Interactive wrapper
function InteractiveTabToggle<T extends string>({
  tabs,
  defaultTab,
}: {
  tabs: readonly { value: T; label: string }[];
  defaultTab?: T;
}) {
  const [active, setActive] = useState<T>(defaultTab || tabs[0].value);
  return <TabToggle tabs={tabs} activeTab={active} onChange={setActive} />;
}

export const RepoTabs: Story = {
  render: () => <InteractiveTabToggle tabs={repoTabs} />,
};

export const ViewTabs: Story = {
  render: () => <InteractiveTabToggle tabs={viewTabs} />,
};

export const PeriodTabs: Story = {
  render: () => <InteractiveTabToggle tabs={periodTabs} />,
};

export const SecondTabActive: Story = {
  render: () => <InteractiveTabToggle tabs={repoTabs} defaultTab="contrib" />,
};

export const AllExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-white/70 text-sm mb-2">Repository Filter</p>
        <InteractiveTabToggle tabs={repoTabs} />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-2">View Mode</p>
        <InteractiveTabToggle tabs={viewTabs} />
      </div>
      <div>
        <p className="text-white/70 text-sm mb-2">Time Period</p>
        <InteractiveTabToggle tabs={periodTabs} />
      </div>
    </div>
  ),
};

export const WithOtherControls: Story = {
  render: () => {
    const [tab, setTab] = useState<"your" | "contrib">("your");
    return (
      <div className="flex items-center gap-3">
        <select
          className="rounded-lg border px-2 py-1.5 text-sm"
          style={{
            background: "rgba(255,255,255,0.1)",
            borderColor: "rgba(255,255,255,0.2)",
            color: "white",
          }}
        >
          <option>Sort: Commits ↓</option>
        </select>
        <TabToggle tabs={repoTabs} activeTab={tab} onChange={setTab} />
      </div>
    );
  },
};
