import type { Meta, StoryObj } from "@storybook/react";
import { CombinedLanguageActivityBar } from "./CombinedLanguageActivityBar";

const meta: Meta<typeof CombinedLanguageActivityBar> = {
  title: "Shared/CombinedLanguageActivityBar",
  component: CombinedLanguageActivityBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    commitCount: {
      control: { type: "number", min: 0, max: 2000 },
    },
    maxCommits: {
      control: { type: "number", min: 1, max: 2000 },
    },
    isSelected: {
      control: "boolean",
    },
    compact: {
      control: "boolean",
    },
    barHeight: {
      control: "select",
      options: ["h-1", "h-1.5", "h-2", "h-2.5", "h-3"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CombinedLanguageActivityBar>;

const mockLanguages = [
  { name: "TypeScript", percent: 45 },
  { name: "JavaScript", percent: 25 },
  { name: "Python", percent: 15 },
  { name: "CSS", percent: 10 },
  { name: "HTML", percent: 5 },
];

const twoLanguages = [
  { name: "TypeScript", percent: 68 },
  { name: "JavaScript", percent: 32 },
];

const singleLanguage = [{ name: "TypeScript", percent: 100 }];

const manyLanguages = [
  { name: "TypeScript", percent: 35 },
  { name: "JavaScript", percent: 20 },
  { name: "Python", percent: 15 },
  { name: "Go", percent: 10 },
  { name: "Rust", percent: 8 },
  { name: "Shell", percent: 5 },
  { name: "CSS", percent: 4 },
  { name: "HTML", percent: 3 },
];

/**
 * Default state with high activity (85% of max)
 */
export const Default: Story = {
  args: {
    commitCount: 850,
    maxCommits: 1000,
    languages: mockLanguages,
  },
};

/**
 * Low activity (15% of max) - narrow bar
 */
export const LowActivity: Story = {
  args: {
    commitCount: 150,
    maxCommits: 1000,
    languages: mockLanguages,
  },
};

/**
 * Medium activity (50% of max)
 */
export const MediumActivity: Story = {
  args: {
    commitCount: 500,
    maxCommits: 1000,
    languages: mockLanguages,
  },
};

/**
 * High activity (98% of max) - almost full bar
 */
export const HighActivity: Story = {
  args: {
    commitCount: 980,
    maxCommits: 1000,
    languages: mockLanguages,
  },
};

/**
 * Maximum activity (100%)
 */
export const MaxActivity: Story = {
  args: {
    commitCount: 1000,
    maxCommits: 1000,
    languages: mockLanguages,
  },
};

/**
 * Very low activity (shows minimum 2% width)
 */
export const MinimalActivity: Story = {
  args: {
    commitCount: 5,
    maxCommits: 1000,
    languages: mockLanguages,
  },
};

/**
 * Selected state with glow effect
 */
export const Selected: Story = {
  args: {
    commitCount: 750,
    maxCommits: 1000,
    languages: mockLanguages,
    isSelected: true,
  },
};

/**
 * Single language project
 */
export const SingleLanguage: Story = {
  args: {
    commitCount: 600,
    maxCommits: 1000,
    languages: singleLanguage,
  },
};

/**
 * Two languages
 */
export const TwoLanguages: Story = {
  args: {
    commitCount: 700,
    maxCommits: 1000,
    languages: twoLanguages,
  },
};

/**
 * Many languages (tooltip shows +N more)
 */
export const ManyLanguages: Story = {
  args: {
    commitCount: 800,
    maxCommits: 1000,
    languages: manyLanguages,
  },
};

/**
 * Compact mode for mobile/tight spaces
 */
export const Compact: Story = {
  args: {
    commitCount: 500,
    maxCommits: 1000,
    languages: mockLanguages,
    compact: true,
  },
};

/**
 * Zero commits (empty bar)
 */
export const ZeroCommits: Story = {
  args: {
    commitCount: 0,
    maxCommits: 1000,
    languages: mockLanguages,
  },
};

/**
 * No languages (edge case)
 */
export const NoLanguages: Story = {
  args: {
    commitCount: 500,
    maxCommits: 1000,
    languages: [],
  },
};

/**
 * Comparison of different activity levels
 */
export const ActivityComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          High Activity (850/1000)
        </div>
        <CombinedLanguageActivityBar
          commitCount={850}
          maxCommits={1000}
          languages={twoLanguages}
        />
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Medium Activity (500/1000)
        </div>
        <CombinedLanguageActivityBar
          commitCount={500}
          maxCommits={1000}
          languages={twoLanguages}
        />
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Low Activity (200/1000)
        </div>
        <CombinedLanguageActivityBar
          commitCount={200}
          maxCommits={1000}
          languages={twoLanguages}
        />
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Minimal Activity (50/1000)
        </div>
        <CombinedLanguageActivityBar
          commitCount={50}
          maxCommits={1000}
          languages={twoLanguages}
        />
      </div>
    </div>
  ),
};

/**
 * In a card container (common use case)
 */
export const InCard: Story = {
  decorators: [
    (Story) => (
      <div className="w-[400px] rounded-lg border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">react-dashboard</span>
          <span className="text-xs text-muted-foreground">347 commits</span>
        </div>
        <Story />
      </div>
    ),
  ],
  args: {
    commitCount: 347,
    maxCommits: 500,
    languages: twoLanguages,
  },
};

/**
 * Multiple bars in a list (simulating year cards)
 */
export const InYearCardList: Story = {
  render: () => (
    <div className="w-[300px] space-y-3 rounded-lg border bg-card p-3">
      <div className="text-sm font-medium">Activity by Year</div>
      {[
        { year: 2025, commits: 180, max: 500 },
        { year: 2024, commits: 450, max: 500 },
        { year: 2023, commits: 320, max: 500 },
      ].map((item) => (
        <div key={item.year} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>{item.year}</span>
            <span className="text-muted-foreground">{item.commits} commits</span>
          </div>
          <CombinedLanguageActivityBar
            commitCount={item.commits}
            maxCommits={item.max}
            languages={twoLanguages}
            isSelected={item.year === 2024}
          />
        </div>
      ))}
    </div>
  ),
};

/**
 * Dark mode preview (use Storybook theme toggle)
 */
export const DarkModePreview: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-background p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    commitCount: 700,
    maxCommits: 1000,
    languages: mockLanguages,
  },
};
