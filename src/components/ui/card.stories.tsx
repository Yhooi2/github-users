import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible card component with header, content, and footer sections. Perfect for displaying grouped content.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      description: "Additional CSS classes",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// Story 1: Default card with all sections
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
};

// Story 2: Simple card without footer
export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
        <CardDescription>No footer on this card</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content without a footer section.</p>
      </CardContent>
    </Card>
  ),
};

// Story 3: Card with action button in header
export const WithHeaderAction: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card with Action</CardTitle>
        <CardDescription>Action button in the header</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>The action button appears in the top-right corner of the header.</p>
      </CardContent>
    </Card>
  ),
};

// Story 4: Card with list content
export const WithList: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Repository Stats</CardTitle>
        <CardDescription>Overview of repository metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span className="text-muted-foreground">Stars</span>
            <span className="font-semibold">1,234</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Forks</span>
            <span className="font-semibold">567</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Commits</span>
            <span className="font-semibold">8,901</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  ),
};

// Story 5: Minimal card (header only)
export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Simple Header</CardTitle>
        <CardDescription>Card with only a header</CardDescription>
      </CardHeader>
    </Card>
  ),
};

// Story 6: Card with form elements
export const WithForm: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>User Settings</CardTitle>
        <CardDescription>Update your account preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          Cancel
        </Button>
        <Button className="flex-1">Save</Button>
      </CardFooter>
    </Card>
  ),
};

// Story 7: Wide card
export const Wide: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Wide Card</CardTitle>
        <CardDescription>This card spans a larger width</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Wide cards are useful for displaying content that requires more
          horizontal space, such as tables, charts, or detailed information.
        </p>
      </CardContent>
    </Card>
  ),
};

// Story 8: Card with long content
export const LongContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Article Preview</CardTitle>
        <CardDescription>Published 2 days ago</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="p-0">
          Read more →
        </Button>
      </CardFooter>
    </Card>
  ),
};

// Story 9: Multiple cards in a grid
export const Grid: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2" style={{ width: "720px" }}>
      <Card>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
          <CardDescription>First card in grid</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for card 1</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
          <CardDescription>Second card in grid</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for card 2</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
          <CardDescription>Third card in grid</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for card 3</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Card 4</CardTitle>
          <CardDescription>Fourth card in grid</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Content for card 4</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// Story 10: Empty state card
export const EmptyState: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6 text-center">
        <div className="mb-2 text-muted-foreground">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="mb-1 font-semibold">No data available</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Get started by adding some content
        </p>
        <Button>Add Content</Button>
      </CardContent>
    </Card>
  ),
};
