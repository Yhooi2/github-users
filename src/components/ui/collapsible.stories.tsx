import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';
import { Button } from './button';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

const meta: Meta<typeof Collapsible> = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A collapsible component for showing and hiding content. Built on Radix UI with smooth animations.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

// Story 1: Default
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px]">
        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className="size-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2 px-4 py-2">
          <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/primitives</div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/colors</div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

// Story 2: Default open
export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-[350px]">
      <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
        <h4 className="text-sm font-semibold">Starred Repositories</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown className="size-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2 px-4 py-2">
        <div className="rounded-md border px-4 py-2 text-sm">facebook/react</div>
        <div className="rounded-md border px-4 py-2 text-sm">vercel/next.js</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

// Story 3: GitHub repository details
export const RepositoryDetails: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[400px]">
        <div className="rounded-lg border">
          <div className="flex items-center justify-between p-4">
            <div>
              <h4 className="text-sm font-semibold">facebook/react</h4>
              <p className="text-muted-foreground text-xs">A declarative JavaScript library</p>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? 'Hide' : 'Show'} details
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="border-t p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stars:</span>
                <span className="font-medium">234k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Forks:</span>
                <span className="font-medium">48k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Language:</span>
                <span className="font-medium">JavaScript</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">License:</span>
                <span className="font-medium">MIT</span>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  },
};

// Story 4: Simple text trigger
export const SimpleTextTrigger: Story = {
  render: () => (
    <Collapsible className="w-[350px] space-y-2">
      <div className="rounded-lg border p-4">
        <CollapsibleTrigger className="flex w-full items-center justify-between font-medium hover:underline">
          Show more information
          <ChevronDown className="size-4" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="rounded-lg border p-4 text-sm">
        <p>
          This is additional information that can be shown or hidden using the collapsible
          component. It supports any React content.
        </p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

// Story 5: Multiple collapsibles
export const MultipleCollapsibles: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <Collapsible className="rounded-lg border">
        <div className="flex items-center justify-between p-4">
          <h4 className="text-sm font-semibold">Section 1</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              Toggle
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="border-t p-4 text-sm">
          Content for section 1
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="rounded-lg border">
        <div className="flex items-center justify-between p-4">
          <h4 className="text-sm font-semibold">Section 2</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              Toggle
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="border-t p-4 text-sm">
          Content for section 2
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

// Story 6: Disabled
export const Disabled: Story = {
  render: () => (
    <Collapsible disabled className="w-[350px]">
      <div className="flex items-center justify-between space-x-4 rounded-lg border p-4 opacity-50">
        <h4 className="text-sm font-semibold">Disabled Collapsible</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" disabled>
            <ChevronDown className="size-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2 px-4 py-2">
        <div className="rounded-md border px-4 py-2 text-sm">Hidden content</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
