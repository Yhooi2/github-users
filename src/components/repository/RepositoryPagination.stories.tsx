import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { RepositoryPagination } from "./RepositoryPagination";

// Wrapper component to manage pagination state
function RepositoryPaginationWrapper(props: {
  initialPage?: number;
  totalPages?: number;
  initialPageSize?: number;
  totalItems?: number;
  compact?: boolean;
  disabled?: boolean;
  showPageSizeSelector?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(props.initialPage || 1);
  const [pageSize, setPageSize] = useState(props.initialPageSize || 20);
  const totalItems = props.totalItems || 200;
  const totalPages = props.totalPages || Math.ceil(totalItems / pageSize);

  return (
    <RepositoryPagination
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      totalItems={totalItems}
      onPageChange={setCurrentPage}
      onPageSizeChange={
        props.showPageSizeSelector !== false ? setPageSize : undefined
      }
      compact={props.compact}
      disabled={props.disabled}
    />
  );
}

const meta = {
  title: "Components/Repository/RepositoryPagination",
  component: RepositoryPaginationWrapper,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RepositoryPaginationWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default pagination on first page
 */
export const Default: Story = {
  args: {},
};

/**
 * Pagination on a middle page
 */
export const MiddlePage: Story = {
  args: {
    initialPage: 5,
    totalPages: 10,
  },
};

/**
 * Pagination on last page
 */
export const LastPage: Story = {
  args: {
    initialPage: 10,
    totalPages: 10,
  },
};

/**
 * Pagination with single page
 */
export const SinglePage: Story = {
  args: {
    totalItems: 15,
    initialPageSize: 20,
  },
};

/**
 * Pagination with no items
 */
export const NoItems: Story = {
  args: {
    totalItems: 0,
    totalPages: 0,
  },
};

/**
 * Pagination with many items (large dataset)
 */
export const ManyItems: Story = {
  args: {
    totalItems: 1000,
    initialPageSize: 20,
  },
};

/**
 * Pagination with different page sizes
 */
export const PageSize10: Story = {
  args: {
    initialPageSize: 10,
    totalItems: 100,
  },
};

export const PageSize50: Story = {
  args: {
    initialPageSize: 50,
    totalItems: 500,
  },
};

export const PageSize100: Story = {
  args: {
    initialPageSize: 100,
    totalItems: 500,
  },
};

/**
 * Compact mode (smaller buttons, less info)
 */
export const CompactMode: Story = {
  args: {
    compact: true,
  },
};

/**
 * Compact mode on middle page
 */
export const CompactMiddlePage: Story = {
  args: {
    compact: true,
    initialPage: 5,
    totalPages: 10,
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * Disabled on middle page
 */
export const DisabledMiddlePage: Story = {
  args: {
    disabled: true,
    initialPage: 5,
    totalPages: 10,
  },
};

/**
 * Without page size selector
 */
export const WithoutPageSizeSelector: Story = {
  args: {
    showPageSizeSelector: false,
  },
};

/**
 * Few items (less than one page)
 */
export const FewItems: Story = {
  args: {
    totalItems: 5,
    initialPageSize: 20,
  },
};

/**
 * Exactly one page worth of items
 */
export const ExactlyOnePage: Story = {
  args: {
    totalItems: 20,
    initialPageSize: 20,
  },
};

/**
 * Two pages
 */
export const TwoPages: Story = {
  args: {
    totalItems: 40,
    initialPageSize: 20,
  },
};

/**
 * Many pages
 */
export const ManyPages: Story = {
  args: {
    totalItems: 2000,
    initialPageSize: 20,
  },
};
