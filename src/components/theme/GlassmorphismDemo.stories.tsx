import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

/**
 * Glassmorphism Demo Component
 * Showcases the alternative glassmorphism theme
 */
const GlassmorphismDemo = () => {
  return (
    <div className="space-y-8">
      {/* Glass Cards */}
      <section>
        <h2 className="glass-text-primary mb-4 text-xl font-semibold">
          Glass Cards
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Subtle Card */}
          <div className="glass-card-subtle p-6">
            <h3 className="glass-text-primary mb-2 font-medium">Subtle Card</h3>
            <p className="glass-text-secondary text-sm">
              10% opacity, 8px blur. Best for background elements.
            </p>
          </div>

          {/* Standard Card */}
          <div className="glass-card p-6">
            <h3 className="glass-text-primary mb-2 font-medium">
              Standard Card
            </h3>
            <p className="glass-text-secondary text-sm">
              20% opacity, 16px blur. Default for most UI elements.
            </p>
          </div>

          {/* Prominent Card */}
          <div className="glass-card-prominent p-6">
            <h3 className="glass-text-primary mb-2 font-medium">
              Prominent Card
            </h3>
            <p className="glass-text-secondary text-sm">
              30% opacity, 24px blur. For modals and important content.
            </p>
          </div>
        </div>
      </section>

      {/* Glow Effects */}
      <section>
        <h2 className="glass-text-primary mb-4 text-xl font-semibold">
          Glow Effects (Hover)
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="glass-card glass-glow-primary cursor-pointer p-4">
            <span className="glass-text-primary">Primary Glow</span>
          </div>
          <div className="glass-card glass-glow-success cursor-pointer p-4">
            <span className="glass-text-primary">Success Glow</span>
          </div>
          <div className="glass-card glass-glow-warning cursor-pointer p-4">
            <span className="glass-text-primary">Warning Glow</span>
          </div>
          <div className="glass-card glass-glow-danger cursor-pointer p-4">
            <span className="glass-text-primary">Danger Glow</span>
          </div>
        </div>
      </section>

      {/* Pulse Animations */}
      <section>
        <h2 className="glass-text-primary mb-4 text-xl font-semibold">
          Pulse Animations (Notifications)
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="glass-card glass-pulse p-4">
            <span className="glass-text-primary">Primary Pulse</span>
          </div>
          <div className="glass-card glass-pulse-success p-4">
            <span className="glass-text-primary">Success Pulse</span>
          </div>
        </div>
      </section>

      {/* Score with Glow */}
      <section>
        <h2 className="glass-text-primary mb-4 text-xl font-semibold">
          Metric Score with Glow
        </h2>
        <div className="flex gap-4">
          <div className="glass-card glass-score-high p-6 text-center">
            <div className="text-3xl font-bold" style={{ color: "var(--glass-accent-success)" }}>
              85%
            </div>
            <div className="glass-text-muted text-sm">Activity Score</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold" style={{ color: "var(--glass-accent-warning)" }}>
              62%
            </div>
            <div className="glass-text-muted text-sm">Quality Score</div>
          </div>
        </div>
      </section>

      {/* Text Hierarchy */}
      <section>
        <h2 className="glass-text-primary mb-4 text-xl font-semibold">
          Text Hierarchy
        </h2>
        <div className="glass-card p-6 space-y-2">
          <p className="glass-text-primary text-lg font-semibold">
            Primary Text - High contrast (14.2:1)
          </p>
          <p className="glass-text-secondary">
            Secondary Text - Medium contrast (6.8:1)
          </p>
          <p className="glass-text-muted text-sm">
            Muted Text - Minimum WCAG AA contrast (4.5:1)
          </p>
        </div>
      </section>

      {/* Combined Example */}
      <section>
        <h2 className="glass-text-primary mb-4 text-xl font-semibold">
          Combined Example: User Card
        </h2>
        <div className="glass-card glass-glow-primary w-[400px] p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
            <div>
              <h3 className="glass-text-primary text-lg font-semibold">
                octocat
              </h3>
              <p className="glass-text-secondary text-sm">GitHub User</p>
            </div>
            <Badge className="ml-auto" variant="secondary">
              Active
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="glass-text-primary font-bold">1,234</div>
              <div className="glass-text-muted text-xs">Commits</div>
            </div>
            <div className="text-center">
              <div className="glass-text-primary font-bold">56</div>
              <div className="glass-text-muted text-xs">Repos</div>
            </div>
            <div className="text-center">
              <div className="glass-text-primary font-bold">89</div>
              <div className="glass-text-muted text-xs">Stars</div>
            </div>
          </div>
          <Button className="w-full" variant="outline">
            View Profile
          </Button>
        </div>
      </section>
    </div>
  );
};

const meta: Meta<typeof GlassmorphismDemo> = {
  title: "Theme/Glassmorphism",
  component: GlassmorphismDemo,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "glass-light",
      values: [
        {
          name: "glass-light",
          value: "linear-gradient(135deg, oklch(0.92 0.03 280) 0%, oklch(0.90 0.04 250) 50%, oklch(0.93 0.03 220) 100%)",
        },
        {
          name: "glass-dark",
          value: "linear-gradient(135deg, oklch(0.20 0.03 260) 0%, oklch(0.25 0.04 280) 50%, oklch(0.22 0.03 240) 100%)",
        },
      ],
    },
    docs: {
      description: {
        component: `
# Glassmorphism Theme

Alternative theme with frosted glass effect. Activate by adding \`.glass\` class to \`<html>\`.

## Features
- **Glass surfaces**: 6 opacity levels (5%-70%)
- **Blur effects**: 4 levels (8px-40px)
- **Glow effects**: For hover states on interactive elements
- **Pulse animations**: For notifications and alerts
- **WCAG AA compliant**: All text colors verified

## Usage
\`\`\`html
<html class="glass">
  <!-- Your app -->
</html>
\`\`\`

## CSS Classes
- \`.glass-card\` - Standard glass card
- \`.glass-card-subtle\` - Lighter glass effect
- \`.glass-card-prominent\` - Heavier glass effect
- \`.glass-glow-primary\` - Blue glow on hover
- \`.glass-glow-success\` - Green glow on hover
- \`.glass-pulse\` - Pulsing animation
- \`.glass-text-primary\` - High contrast text
- \`.glass-text-secondary\` - Medium contrast text
- \`.glass-text-muted\` - Low contrast text
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="glass min-h-screen p-8" style={{
        background: "linear-gradient(135deg, oklch(0.92 0.03 280) 0%, oklch(0.90 0.04 250) 50%, oklch(0.93 0.03 220) 100%)",
      }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlassmorphismDemo>;

export const LightMode: Story = {
  name: "Light Mode",
};

export const DarkMode: Story = {
  name: "Dark Mode",
  decorators: [
    (Story) => (
      <div className="glass dark min-h-screen p-8" style={{
        background: "linear-gradient(135deg, oklch(0.20 0.03 260) 0%, oklch(0.25 0.04 280) 50%, oklch(0.22 0.03 240) 100%)",
      }}>
        <Story />
      </div>
    ),
  ],
};

// Individual component stories
export const GlassCards: Story = {
  name: "Glass Cards (Light)",
  render: () => (
    <div className="glass p-8" style={{
      background: "linear-gradient(135deg, oklch(0.92 0.03 280) 0%, oklch(0.90 0.04 250) 50%, oklch(0.93 0.03 220) 100%)",
    }}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card-subtle p-6">
          <h3 className="glass-text-primary mb-2 font-medium">Subtle</h3>
          <p className="glass-text-secondary text-sm">Light frost</p>
        </div>
        <div className="glass-card p-6">
          <h3 className="glass-text-primary mb-2 font-medium">Standard</h3>
          <p className="glass-text-secondary text-sm">Default card</p>
        </div>
        <div className="glass-card-prominent p-6">
          <h3 className="glass-text-primary mb-2 font-medium">Prominent</h3>
          <p className="glass-text-secondary text-sm">Heavy frost</p>
        </div>
      </div>
    </div>
  ),
};

export const GlassCardsDark: Story = {
  name: "Glass Cards (Dark)",
  render: () => (
    <div className="glass dark p-8" style={{
      background: "linear-gradient(135deg, oklch(0.20 0.03 260) 0%, oklch(0.25 0.04 280) 50%, oklch(0.22 0.03 240) 100%)",
    }}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card-subtle p-6">
          <h3 className="glass-text-primary mb-2 font-medium">Subtle</h3>
          <p className="glass-text-secondary text-sm">Dark frost</p>
        </div>
        <div className="glass-card p-6">
          <h3 className="glass-text-primary mb-2 font-medium">Standard</h3>
          <p className="glass-text-secondary text-sm">Default card</p>
        </div>
        <div className="glass-card-prominent p-6">
          <h3 className="glass-text-primary mb-2 font-medium">Prominent</h3>
          <p className="glass-text-secondary text-sm">Heavy frost</p>
        </div>
      </div>
    </div>
  ),
};

export const GlowEffects: Story = {
  name: "Glow Effects",
  render: () => (
    <div className="glass p-8" style={{
      background: "linear-gradient(135deg, oklch(0.92 0.03 280) 0%, oklch(0.90 0.04 250) 50%, oklch(0.93 0.03 220) 100%)",
    }}>
      <p className="glass-text-muted mb-4 text-sm">Hover over cards to see glow effects</p>
      <div className="flex flex-wrap gap-4">
        <div className="glass-card glass-glow-primary cursor-pointer p-4 transition-all">
          <span className="glass-text-primary">Primary</span>
        </div>
        <div className="glass-card glass-glow-success cursor-pointer p-4 transition-all">
          <span className="glass-text-primary">Success</span>
        </div>
        <div className="glass-card glass-glow-warning cursor-pointer p-4 transition-all">
          <span className="glass-text-primary">Warning</span>
        </div>
        <div className="glass-card glass-glow-danger cursor-pointer p-4 transition-all">
          <span className="glass-text-primary">Danger</span>
        </div>
      </div>
    </div>
  ),
};

export const PulseAnimations: Story = {
  name: "Pulse Animations",
  render: () => (
    <div className="glass p-8" style={{
      background: "linear-gradient(135deg, oklch(0.92 0.03 280) 0%, oklch(0.90 0.04 250) 50%, oklch(0.93 0.03 220) 100%)",
    }}>
      <p className="glass-text-muted mb-4 text-sm">Use sparingly - only for notifications</p>
      <div className="flex gap-4">
        <div className="glass-card glass-pulse p-4">
          <span className="glass-text-primary">New notification</span>
        </div>
        <div className="glass-card glass-pulse-success p-4">
          <span className="glass-text-primary">Success alert</span>
        </div>
      </div>
    </div>
  ),
};
