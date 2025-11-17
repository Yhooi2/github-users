import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An accordion component for displaying collapsible content panels. Supports single and multiple expansion modes.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// Story 1: Default (single mode)
export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[450px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern and uses semantic HTML.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that can be easily customized.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It includes smooth animations for opening and closing content.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// Story 2: Multiple mode (multiple panels can be open)
export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[450px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Features</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-4 space-y-1">
            <li>Fully accessible with keyboard navigation</li>
            <li>Smooth animations</li>
            <li>Customizable styling</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Technologies</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-4 space-y-1">
            <li>React 19</li>
            <li>TypeScript</li>
            <li>Radix UI</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Styling</AccordionTrigger>
        <AccordionContent>
          Uses Tailwind CSS for styling with class-variance-authority for variants.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// Story 3: GitHub repository FAQ
export const RepositoryFAQ: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[500px]">
      <AccordionItem value="contributing">
        <AccordionTrigger>How do I contribute?</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2">To contribute to this project:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Fork the repository</li>
            <li>Create a feature branch</li>
            <li>Make your changes</li>
            <li>Submit a pull request</li>
          </ol>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="issues">
        <AccordionTrigger>How do I report issues?</AccordionTrigger>
        <AccordionContent>
          Visit the Issues tab and create a new issue with a clear description of the problem,
          steps to reproduce, and your environment details.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="license">
        <AccordionTrigger>What license is this under?</AccordionTrigger>
        <AccordionContent>
          This project is licensed under the MIT License. See the LICENSE file for details.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>Where can I get support?</AccordionTrigger>
        <AccordionContent>
          For support, please use GitHub Discussions or join our Discord community.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// Story 4: Default open item
export const DefaultOpen: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-2" className="w-[450px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Installation</AccordionTrigger>
        <AccordionContent>Run npm install to install dependencies.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Getting Started</AccordionTrigger>
        <AccordionContent>
          This panel is open by default. Start by running npm run dev to launch the development
          server.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Deployment</AccordionTrigger>
        <AccordionContent>Build the project with npm run build.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// Story 5: With rich content
export const RichContent: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[500px]">
      <AccordionItem value="code">
        <AccordionTrigger>Code Example</AccordionTrigger>
        <AccordionContent>
          <pre className="rounded bg-muted p-3 text-xs">
            <code>{`import { Accordion } from '@/components/ui/accordion'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Title</AccordionTrigger>
    <AccordionContent>Content</AccordionContent>
  </AccordionItem>
</Accordion>`}</code>
          </pre>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="table">
        <AccordionTrigger>Data Table</AccordionTrigger>
        <AccordionContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Property</th>
                <th className="text-left py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">type</td>
                <td className="py-2">single | multiple</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">collapsible</td>
                <td className="py-2">boolean</td>
              </tr>
            </tbody>
          </table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// Story 6: API documentation (GitHub use case)
export const APIDocumentation: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[550px]">
      <AccordionItem value="endpoints">
        <AccordionTrigger>API Endpoints</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <div>
              <code className="rounded bg-muted px-2 py-1 text-xs">GET /api/users</code>
              <p className="mt-1 text-xs text-muted-foreground">Fetch all users</p>
            </div>
            <div>
              <code className="rounded bg-muted px-2 py-1 text-xs">GET /api/users/:id</code>
              <p className="mt-1 text-xs text-muted-foreground">Fetch user by ID</p>
            </div>
            <div>
              <code className="rounded bg-muted px-2 py-1 text-xs">POST /api/users</code>
              <p className="mt-1 text-xs text-muted-foreground">Create new user</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="authentication">
        <AccordionTrigger>Authentication</AccordionTrigger>
        <AccordionContent>
          All API requests require authentication via Bearer token in the Authorization header.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="rate-limits">
        <AccordionTrigger>Rate Limits</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-4 space-y-1 text-sm">
            <li>Unauthenticated: 60 requests per hour</li>
            <li>Authenticated: 5000 requests per hour</li>
            <li>GraphQL: 5000 points per hour</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="errors">
        <AccordionTrigger>Error Handling</AccordionTrigger>
        <AccordionContent>
          API returns standard HTTP status codes with JSON error objects containing message and
          error code.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// Story 7: Disabled item
export const DisabledItem: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[450px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Available Feature</AccordionTrigger>
        <AccordionContent>This feature is available and working.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Coming Soon</AccordionTrigger>
        <AccordionContent>This feature is not yet available.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Another Feature</AccordionTrigger>
        <AccordionContent>Another available feature.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// Story 8: Compact style
export const Compact: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger className="py-2">Quick Start</AccordionTrigger>
        <AccordionContent className="pb-2">npm install && npm run dev</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="py-2">Build</AccordionTrigger>
        <AccordionContent className="pb-2">npm run build</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="py-2">Test</AccordionTrigger>
        <AccordionContent className="pb-2">npm test</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// Story 9: Nested content
export const NestedContent: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[500px]">
      <AccordionItem value="frontend">
        <AccordionTrigger>Frontend Technologies</AccordionTrigger>
        <AccordionContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="react">
              <AccordionTrigger className="text-sm">React</AccordionTrigger>
              <AccordionContent className="text-sm">
                Component-based UI library for building user interfaces.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="typescript">
              <AccordionTrigger className="text-sm">TypeScript</AccordionTrigger>
              <AccordionContent className="text-sm">
                Typed superset of JavaScript for better developer experience.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="backend">
        <AccordionTrigger>Backend Technologies</AccordionTrigger>
        <AccordionContent>Node.js, Express, and GraphQL for server-side logic.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
