import type { CommitActivity } from "@/lib/statistics";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActivityChart } from "./ActivityChart";

// Mock data generators
const typicalActivity: CommitActivity = {
  total: 1250,
  perDay: 3.4,
  perWeek: 24.0,
  perMonth: 104.2,
};

const highActivity: CommitActivity = {
  total: 5000,
  perDay: 13.7,
  perWeek: 95.9,
  perMonth: 416.7,
};

const lowActivity: CommitActivity = {
  total: 50,
  perDay: 0.1,
  perWeek: 1.0,
  perMonth: 4.2,
};

const moderateActivity: CommitActivity = {
  total: 500,
  perDay: 1.4,
  perWeek: 9.6,
  perMonth: 41.7,
};

const veryHighActivity: CommitActivity = {
  total: 10000,
  perDay: 27.4,
  perWeek: 191.8,
  perMonth: 833.3,
};

const minimalActivity: CommitActivity = {
  total: 10,
  perDay: 0.0,
  perWeek: 0.2,
  perMonth: 0.8,
};

const consistentActivity: CommitActivity = {
  total: 365,
  perDay: 1.0,
  perWeek: 7.0,
  perMonth: 30.4,
};

const meta = {
  title: "Components/Statistics/ActivityChart",
  component: ActivityChart,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ActivityChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default activity chart with typical commit rates
 */
export const Default: Story = {
  args: {
    data: typicalActivity,
  },
};

/**
 * High activity user (prolific contributor)
 */
export const HighActivity: Story = {
  args: {
    data: highActivity,
  },
};

/**
 * Low activity user (occasional contributor)
 */
export const LowActivity: Story = {
  args: {
    data: lowActivity,
  },
};

/**
 * Moderate activity user
 */
export const ModerateActivity: Story = {
  args: {
    data: moderateActivity,
  },
};

/**
 * Very high activity (enterprise developer)
 */
export const VeryHighActivity: Story = {
  args: {
    data: veryHighActivity,
  },
};

/**
 * Minimal activity (just started)
 */
export const MinimalActivity: Story = {
  args: {
    data: minimalActivity,
  },
};

/**
 * Consistent daily committer (1 commit/day)
 */
export const ConsistentDaily: Story = {
  args: {
    data: consistentActivity,
  },
};

/**
 * Hide total commits count
 */
export const WithoutTotal: Story = {
  args: {
    data: typicalActivity,
    showTotal: false,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    data: null,
    loading: true,
  },
};

/**
 * Loading state with custom message
 */
export const LoadingWithMessage: Story = {
  args: {
    data: null,
    loading: true,
    loadingMessage: "Analyzing commit patterns...",
  },
};

/**
 * Error state
 */
export const Error: Story = {
  args: {
    data: null,
    error: new Error("Failed to calculate activity"),
  },
};

/**
 * Error state with custom messages
 */
export const CustomError: Story = {
  args: {
    data: null,
    error: new Error("Insufficient data"),
    errorTitle: "Calculation Error",
    errorDescription: "Not enough data to calculate activity statistics.",
  },
};

/**
 * Empty state (no data)
 */
export const Empty: Story = {
  args: {
    data: null,
  },
};

/**
 * Empty state with custom messages
 */
export const CustomEmpty: Story = {
  args: {
    data: null,
    emptyTitle: "No Commits Yet",
    emptyDescription: "Start contributing to see your activity statistics.",
  },
};

/**
 * Custom height (taller chart)
 */
export const CustomHeight: Story = {
  args: {
    data: typicalActivity,
    height: 400,
  },
};

/**
 * Activity comparison across different levels
 */
export const ActivityComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Minimal Activity</h3>
        <ActivityChart data={minimalActivity} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Low Activity</h3>
        <ActivityChart data={lowActivity} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Moderate Activity</h3>
        <ActivityChart data={moderateActivity} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">High Activity</h3>
        <ActivityChart data={highActivity} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Very High Activity</h3>
        <ActivityChart data={veryHighActivity} />
      </div>
    </div>
  ),
};

/**
 * All states comparison (for visual testing)
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Normal State</h3>
        <ActivityChart data={typicalActivity} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Without Total</h3>
        <ActivityChart data={typicalActivity} showTotal={false} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Loading State</h3>
        <ActivityChart data={null} loading={true} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Error State</h3>
        <ActivityChart data={null} error={new Error("Test error")} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Empty State</h3>
        <ActivityChart data={null} />
      </div>
    </div>
  ),
};
