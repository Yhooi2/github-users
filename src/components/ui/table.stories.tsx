import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A responsive table component for displaying tabular data.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

// Story 1: Basic table
export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// Story 2: Table with footer
export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Product A</TableCell>
          <TableCell className="text-right">5</TableCell>
          <TableCell className="text-right">$50.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Product B</TableCell>
          <TableCell className="text-right">3</TableCell>
          <TableCell className="text-right">$30.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">$80.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// Story 3: Repository table (GitHub use case)
export const RepositoryTable: Story = {
  render: () => (
    <Table>
      <TableCaption>Your GitHub repositories</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Repository</TableHead>
          <TableHead>Language</TableHead>
          <TableHead className="text-right">Stars</TableHead>
          <TableHead className="text-right">Forks</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">awesome-project</TableCell>
          <TableCell>TypeScript</TableCell>
          <TableCell className="text-right">1,234</TableCell>
          <TableCell className="text-right">567</TableCell>
          <TableCell>2 days ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">cool-app</TableCell>
          <TableCell>JavaScript</TableCell>
          <TableCell className="text-right">890</TableCell>
          <TableCell className="text-right">234</TableCell>
          <TableCell>5 days ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">data-viz</TableCell>
          <TableCell>Python</TableCell>
          <TableCell className="text-right">456</TableCell>
          <TableCell className="text-right">123</TableCell>
          <TableCell>1 week ago</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">api-server</TableCell>
          <TableCell>Go</TableCell>
          <TableCell className="text-right">789</TableCell>
          <TableCell className="text-right">345</TableCell>
          <TableCell>3 weeks ago</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// Story 4: Compact table
export const Compact: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// Story 5: Empty table
export const Empty: Story = {
  render: () => (
    <Table>
      <TableCaption>No data available</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Column 1</TableHead>
          <TableHead>Column 2</TableHead>
          <TableHead>Column 3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// Story 6: Wide table (many columns)
export const WideTable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>City</TableHead>
          <TableHead>ZIP</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>001</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>USA</TableCell>
          <TableCell>New York</TableCell>
          <TableCell>10001</TableCell>
          <TableCell>Active</TableCell>
          <TableCell className="text-right">
            <button className="text-primary text-sm hover:underline">Edit</button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>002</TableCell>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>UK</TableCell>
          <TableCell>London</TableCell>
          <TableCell>SW1A</TableCell>
          <TableCell>Inactive</TableCell>
          <TableCell className="text-right">
            <button className="text-primary text-sm hover:underline">Edit</button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// Story 7: Selectable rows
export const SelectableRows: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <input type="checkbox" aria-label="Select all" />
          </TableHead>
          <TableHead>Task</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <input type="checkbox" aria-label="Select row" />
          </TableCell>
          <TableCell>Implement feature A</TableCell>
          <TableCell>In Progress</TableCell>
          <TableCell>High</TableCell>
        </TableRow>
        <TableRow data-state="selected">
          <TableCell>
            <input type="checkbox" checked aria-label="Select row" />
          </TableCell>
          <TableCell>Fix bug B</TableCell>
          <TableCell>Done</TableCell>
          <TableCell>Medium</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <input type="checkbox" aria-label="Select row" />
          </TableCell>
          <TableCell>Write tests</TableCell>
          <TableCell>Todo</TableCell>
          <TableCell>Low</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
