import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A separator component for dividing content visually, supports horizontal and vertical orientations.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Separator>;

// Story 1: Default (horizontal)
export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

// Story 2: Horizontal separator
export const Horizontal: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div>Content above separator</div>
      <Separator />
      <div>Content below separator</div>
    </div>
  ),
};

// Story 3: Vertical separator
export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center space-x-4">
      <div>Left</div>
      <Separator orientation="vertical" />
      <div>Middle</div>
      <Separator orientation="vertical" />
      <div>Right</div>
    </div>
  ),
};

// Story 4: In navigation
export const InNavigation: Story = {
  render: () => (
    <div className="space-y-4">
      <nav className="flex items-center space-x-4 text-sm font-medium">
        <a href="#" className="transition-colors hover:text-primary">
          Home
        </a>
        <Separator orientation="vertical" className="h-4" />
        <a href="#" className="transition-colors hover:text-primary">
          About
        </a>
        <Separator orientation="vertical" className="h-4" />
        <a href="#" className="transition-colors hover:text-primary">
          Contact
        </a>
      </nav>
    </div>
  ),
};

// Story 5: In card sections
export const InCardSections: Story = {
  render: () => (
    <div className="w-[350px] rounded-lg border p-4">
      <div>
        <h3 className="font-semibold">User Profile</h3>
        <p className="text-sm text-muted-foreground">Manage your profile settings</p>
      </div>
      <Separator className="my-4" />
      <div>
        <h4 className="text-sm font-medium">Personal Information</h4>
        <p className="text-xs text-muted-foreground">Update your personal details</p>
      </div>
      <Separator className="my-4" />
      <div>
        <h4 className="text-sm font-medium">Security</h4>
        <p className="text-xs text-muted-foreground">Manage your security settings</p>
      </div>
    </div>
  ),
};

// Story 6: GitHub repository stats (use case)
export const RepositoryStats: Story = {
  render: () => (
    <div className="w-[500px] rounded-lg border p-4">
      <h3 className="text-lg font-bold">facebook/react</h3>
      <p className="text-sm text-muted-foreground">
        The library for web and native user interfaces
      </p>
      <Separator className="my-3" />
      <div className="flex items-center justify-around text-center">
        <div>
          <div className="text-2xl font-bold">234k</div>
          <div className="text-xs text-muted-foreground">Stars</div>
        </div>
        <Separator orientation="vertical" className="h-12" />
        <div>
          <div className="text-2xl font-bold">48k</div>
          <div className="text-xs text-muted-foreground">Forks</div>
        </div>
        <Separator orientation="vertical" className="h-12" />
        <div>
          <div className="text-2xl font-bold">1.8k</div>
          <div className="text-xs text-muted-foreground">Issues</div>
        </div>
      </div>
    </div>
  ),
};

// Story 7: Different spacings
export const DifferentSpacings: Story = {
  render: () => (
    <div className="w-[400px] space-y-8">
      <div>
        <div>Small spacing (my-2)</div>
        <Separator className="my-2" />
        <div>Content</div>
      </div>
      <div>
        <div>Medium spacing (my-4)</div>
        <Separator className="my-4" />
        <div>Content</div>
      </div>
      <div>
        <div>Large spacing (my-6)</div>
        <Separator className="my-6" />
        <div>Content</div>
      </div>
    </div>
  ),
};

// Story 8: Custom colors
export const CustomColors: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div>
        <div>Default color</div>
        <Separator className="my-2" />
      </div>
      <div>
        <div>Blue separator</div>
        <Separator className="my-2 bg-blue-500" />
      </div>
      <div>
        <div>Red separator</div>
        <Separator className="my-2 bg-red-500" />
      </div>
      <div>
        <div>Green separator</div>
        <Separator className="my-2 bg-green-500" />
      </div>
    </div>
  ),
};

// Story 9: Thicker separators
export const ThickerSeparators: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div>
        <div>1px (default)</div>
        <Separator className="my-2" />
      </div>
      <div>
        <div>2px thick</div>
        <Separator className="my-2 h-0.5" />
      </div>
      <div>
        <div>4px thick</div>
        <Separator className="my-2 h-1" />
      </div>
      <div>
        <div>8px thick</div>
        <Separator className="my-2 h-2" />
      </div>
    </div>
  ),
};

// Story 10: Non-decorative (semantic)
export const Semantic: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Section 1</h4>
        <p className="text-sm text-muted-foreground">First section content</p>
      </div>
      <Separator decorative={false} className="my-4" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Section 2</h4>
        <p className="text-sm text-muted-foreground">Second section content</p>
      </div>
    </div>
  ),
};

// Story 11: User profile header (GitHub use case)
export const UserProfileHeader: Story = {
  render: () => (
    <div className="w-[600px] space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted">
          <span className="text-2xl">LT</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Linus Torvalds</h2>
          <p className="text-muted-foreground">@torvalds</p>
        </div>
      </div>
      <Separator />
      <div className="flex gap-8">
        <div>
          <div className="text-sm text-muted-foreground">Followers</div>
          <div className="text-xl font-bold">142k</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Following</div>
          <div className="text-xl font-bold">0</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Repositories</div>
          <div className="text-xl font-bold">8</div>
        </div>
      </div>
    </div>
  ),
};
