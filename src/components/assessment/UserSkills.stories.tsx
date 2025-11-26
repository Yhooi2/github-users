import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserSkills } from "./UserSkills";

const meta: Meta<typeof UserSkills> = {
  title: "Assessment/UserSkills",
  component: UserSkills,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserSkills>;

// Multiple languages
export const MultipleLanguages: Story = {
  args: {
    languages: [
      { name: "TypeScript", percent: 68 },
      { name: "JavaScript", percent: 15 },
      { name: "CSS", percent: 10 },
      { name: "HTML", percent: 5 },
      { name: "Shell", percent: 2 },
    ],
  },
};

// Many languages (with overflow)
export const ManyLanguages: Story = {
  args: {
    languages: [
      { name: "TypeScript", percent: 45 },
      { name: "JavaScript", percent: 20 },
      { name: "Python", percent: 12 },
      { name: "Go", percent: 8 },
      { name: "Rust", percent: 5 },
      { name: "Shell", percent: 4 },
      { name: "CSS", percent: 3 },
      { name: "HTML", percent: 2 },
      { name: "Dockerfile", percent: 1 },
    ],
    maxItems: 5,
  },
};

// Three languages
export const ThreeLanguages: Story = {
  args: {
    languages: [
      { name: "Python", percent: 60 },
      { name: "JavaScript", percent: 25 },
      { name: "Shell", percent: 15 },
    ],
  },
};

// Single language
export const SingleLanguage: Story = {
  args: {
    languages: [{ name: "TypeScript", percent: 100 }],
  },
};

// Two languages
export const TwoLanguages: Story = {
  args: {
    languages: [
      { name: "Go", percent: 70 },
      { name: "Python", percent: 30 },
    ],
  },
};

// Empty state
export const Empty: Story = {
  args: {
    languages: [],
  },
};

// Loading state
export const Loading: Story = {
  args: {
    languages: [],
    loading: true,
  },
};

// Custom max items
export const CustomMaxItems: Story = {
  args: {
    languages: [
      { name: "TypeScript", percent: 40 },
      { name: "JavaScript", percent: 20 },
      { name: "Python", percent: 15 },
      { name: "Go", percent: 10 },
      { name: "Rust", percent: 8 },
      { name: "Ruby", percent: 5 },
      { name: "Shell", percent: 2 },
    ],
    maxItems: 3,
  },
};

// Languages with small percentages
export const SmallPercentages: Story = {
  args: {
    languages: [
      { name: "TypeScript", percent: 98.5 },
      { name: "JavaScript", percent: 0.8 },
      { name: "CSS", percent: 0.5 },
      { name: "HTML", percent: 0.2 },
    ],
  },
};

// Unknown languages (use default color)
export const UnknownLanguages: Story = {
  args: {
    languages: [
      { name: "TypeScript", percent: 50 },
      { name: "UnknownLang", percent: 30 },
      { name: "AnotherUnknown", percent: 20 },
    ],
  },
};

// Full width in narrow container
export const NarrowContainer: Story = {
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
  args: {
    languages: [
      { name: "TypeScript", percent: 68 },
      { name: "JavaScript", percent: 15 },
      { name: "CSS", percent: 10 },
      { name: "HTML", percent: 5 },
      { name: "Shell", percent: 2 },
    ],
  },
};

// Mobile viewport
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    languages: [
      { name: "TypeScript", percent: 68 },
      { name: "JavaScript", percent: 15 },
      { name: "Python", percent: 10 },
      { name: "Go", percent: 5 },
      { name: "Rust", percent: 2 },
    ],
  },
};
