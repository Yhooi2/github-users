import type { Meta, StoryObj } from "@storybook/react";
import { HorizontalLanguageBar } from "./HorizontalLanguageBar";

const meta: Meta<typeof HorizontalLanguageBar> = {
  title: "Shared/HorizontalLanguageBar",
  component: HorizontalLanguageBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    barHeight: {
      control: "select",
      options: ["h-1", "h-1.5", "h-2", "h-2.5", "h-3", "h-4"],
    },
    showLegend: {
      control: "boolean",
    },
    maxLegendItems: {
      control: { type: "number", min: 1, max: 10 },
    },
    showPercentages: {
      control: "boolean",
    },
    compact: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof HorizontalLanguageBar>;

const multiLanguage = [
  { name: "TypeScript", percent: 68 },
  { name: "JavaScript", percent: 15 },
  { name: "CSS", percent: 10 },
  { name: "HTML", percent: 5 },
  { name: "Shell", percent: 2 },
];

const twoLanguages = [
  { name: "Python", percent: 75 },
  { name: "Jupyter Notebook", percent: 25 },
];

const singleLanguage = [{ name: "Rust", percent: 100 }];

const manyLanguages = [
  { name: "TypeScript", percent: 45 },
  { name: "JavaScript", percent: 20 },
  { name: "Python", percent: 12 },
  { name: "Go", percent: 8 },
  { name: "Rust", percent: 5 },
  { name: "Shell", percent: 4 },
  { name: "CSS", percent: 3 },
  { name: "HTML", percent: 2 },
  { name: "Dockerfile", percent: 1 },
];

/**
 * Default language bar with multiple languages and legend
 */
export const Default: Story = {
  args: {
    languages: multiLanguage,
    showLegend: true,
    barHeight: "h-2",
  },
};

/**
 * Compact version for tight spaces
 */
export const Compact: Story = {
  args: {
    languages: multiLanguage,
    showLegend: true,
    compact: true,
    barHeight: "h-1.5",
    maxLegendItems: 3,
    showPercentages: false,
  },
};

/**
 * Bar only without legend
 */
export const BarOnly: Story = {
  args: {
    languages: multiLanguage,
    showLegend: false,
    barHeight: "h-2",
  },
};

/**
 * Single language project
 */
export const SingleLanguage: Story = {
  args: {
    languages: singleLanguage,
    showLegend: true,
  },
};

/**
 * Two languages
 */
export const TwoLanguages: Story = {
  args: {
    languages: twoLanguages,
    showLegend: true,
  },
};

/**
 * Many languages with "Other" grouping
 */
export const ManyLanguages: Story = {
  args: {
    languages: manyLanguages,
    showLegend: true,
    maxLegendItems: 5,
  },
};

/**
 * Thin bar style
 */
export const ThinBar: Story = {
  args: {
    languages: multiLanguage,
    showLegend: true,
    barHeight: "h-1",
  },
};

/**
 * Thick bar style
 */
export const ThickBar: Story = {
  args: {
    languages: multiLanguage,
    showLegend: true,
    barHeight: "h-4",
  },
};

/**
 * Without percentages in legend
 */
export const NoPercentages: Story = {
  args: {
    languages: multiLanguage,
    showLegend: true,
    showPercentages: false,
  },
};

/**
 * Empty state (no languages)
 */
export const Empty: Story = {
  args: {
    languages: [],
    showLegend: true,
  },
};

/**
 * In a card container (common use case)
 */
export const InCard: Story = {
  decorators: [
    (Story) => (
      <div className="w-[400px] rounded-lg border bg-card p-4">
        <div className="mb-2 text-sm font-medium">Language Breakdown</div>
        <Story />
      </div>
    ),
  ],
  args: {
    languages: multiLanguage,
    showLegend: true,
    barHeight: "h-2",
  },
};
