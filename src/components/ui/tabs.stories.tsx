import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A tabs component for organizing content into separate views, built on Radix UI Tabs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      description: 'The value of the tab to be selected by default',
      control: 'text',
    },
    orientation: {
      description: 'The orientation of the tabs',
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// Story 1: Default tabs
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm">Content for Tab 1</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm">Content for Tab 2</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm">Content for Tab 3</p>
      </TabsContent>
    </Tabs>
  ),
};

// Story 2: Tabs with cards
export const WithCards: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>General information and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This is the overview tab showing general information about the user.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Detailed analytics and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Charts and graphs showing user activity.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure your preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">User settings and preferences.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

// Story 3: Tabs with icons
export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="home" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="home">
          <svg
            className="mr-2 size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Home
        </TabsTrigger>
        <TabsTrigger value="profile">
          <svg
            className="mr-2 size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Profile
        </TabsTrigger>
        <TabsTrigger value="messages">
          <svg
            className="mr-2 size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Messages
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        <p className="text-sm">Home page content</p>
      </TabsContent>
      <TabsContent value="profile">
        <p className="text-sm">Profile page content</p>
      </TabsContent>
      <TabsContent value="messages">
        <p className="text-sm">Messages page content</p>
      </TabsContent>
    </Tabs>
  ),
};

// Story 4: Two tabs only
export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="code" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="code">
        <div className="bg-muted rounded-md p-4">
          <code className="text-sm">const hello = 'world';</code>
        </div>
      </TabsContent>
      <TabsContent value="preview">
        <div className="rounded-md border p-4">
          <p className="text-sm">Preview of the rendered output</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// Story 5: Many tabs
export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[600px]">
      <TabsList>
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Repositories</TabsTrigger>
        <TabsTrigger value="tab3">Activity</TabsTrigger>
        <TabsTrigger value="tab4">Analytics</TabsTrigger>
        <TabsTrigger value="tab5">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm">Overview content</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm">Repositories content</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm">Activity content</p>
      </TabsContent>
      <TabsContent value="tab4">
        <p className="text-sm">Analytics content</p>
      </TabsContent>
      <TabsContent value="tab5">
        <p className="text-sm">Settings content</p>
      </TabsContent>
    </Tabs>
  ),
};

// Story 6: Tabs with form
export const WithForm: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Make changes to your account here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                defaultValue="Pedro Duarte"
                className="border-input placeholder:text-muted-foreground flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                defaultValue="@peduarte"
                className="border-input placeholder:text-muted-foreground flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
              />
            </div>
            <Button className="mt-2">Save changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <label htmlFor="current" className="text-sm font-medium">
                Current password
              </label>
              <input
                id="current"
                type="password"
                className="border-input placeholder:text-muted-foreground flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="new" className="text-sm font-medium">
                New password
              </label>
              <input
                id="new"
                type="password"
                className="border-input placeholder:text-muted-foreground flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
              />
            </div>
            <Button className="mt-2">Save password</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

// Story 7: Disabled tab
export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="available" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="available">Available</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
      </TabsList>
      <TabsContent value="available">
        <p className="text-sm">This tab is available and can be selected.</p>
      </TabsContent>
      <TabsContent value="disabled">
        <p className="text-sm">This content will not be shown.</p>
      </TabsContent>
      <TabsContent value="active">
        <p className="text-sm">Another active tab.</p>
      </TabsContent>
    </Tabs>
  ),
};

// Story 8: Full width tabs
export const FullWidth: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm">Full width tab content 1</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="tab2">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm">Full width tab content 2</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="tab3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm">Full width tab content 3</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

// Story 9: Rich content
export const RichContent: Story = {
  render: () => (
    <Tabs defaultValue="stats" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="stats">Statistics</TabsTrigger>
        <TabsTrigger value="chart">Chart</TabsTrigger>
        <TabsTrigger value="table">Table</TabsTrigger>
      </TabsList>
      <TabsContent value="stats">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Total Users</p>
                <p className="text-2xl font-bold">10,234</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Active Users</p>
                <p className="text-2xl font-bold">8,567</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">New This Week</p>
                <p className="text-2xl font-bold">234</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Churn Rate</p>
                <p className="text-2xl font-bold">2.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="chart">
        <Card>
          <CardContent className="pt-6">
            <div className="bg-muted flex h-[200px] items-center justify-center rounded-md">
              <p className="text-muted-foreground">Chart visualization placeholder</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="table">
        <Card>
          <CardContent className="pt-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left">Name</th>
                  <th className="pb-2 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Metric 1</td>
                  <td className="py-2 text-right">100</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Metric 2</td>
                  <td className="py-2 text-right">200</td>
                </tr>
                <tr>
                  <td className="py-2">Metric 3</td>
                  <td className="py-2 text-right">300</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};
