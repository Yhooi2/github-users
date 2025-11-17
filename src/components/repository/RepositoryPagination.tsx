import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

type Props = {
  /**
   * Current page number (1-indexed)
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Number of items per page
   */
  pageSize: number;
  /**
   * Total number of items across all pages
   */
  totalItems: number;
  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;
  /**
   * Callback when page size changes
   */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * Available page size options
   * @default [10, 20, 50, 100]
   */
  pageSizeOptions?: number[];
  /**
   * Compact mode (smaller buttons, less info)
   * @default false
   */
  compact?: boolean;
  /**
   * Disable all pagination controls
   * @default false
   */
  disabled?: boolean;
};

/**
 * Repository pagination component
 *
 * Provides pagination controls with:
 * - First/Previous/Next/Last page navigation
 * - Current page indicator
 * - Page size selector
 * - Total items count
 *
 * Supports compact mode for smaller layouts.
 *
 * @example
 * ```tsx
 * const [page, setPage] = useState(1);
 * const [pageSize, setPageSize] = useState(20);
 *
 * <RepositoryPagination
 *   currentPage={page}
 *   totalPages={10}
 *   pageSize={pageSize}
 *   totalItems={200}
 *   onPageChange={setPage}
 *   onPageSizeChange={setPageSize}
 * />
 * ```
 */
export function RepositoryPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  compact = false,
  disabled = false,
}: Props) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  const handleFirstPage = () => {
    if (!isFirstPage && !disabled) {
      onPageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (!isFirstPage && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (!isLastPage && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (!isLastPage && !disabled && totalPages > 0) {
      onPageChange(totalPages);
    }
  };

  const handlePageSizeChange = (value: string) => {
    if (onPageSizeChange && !disabled) {
      const newPageSize = parseInt(value, 10);
      onPageSizeChange(newPageSize);
      // Reset to first page when changing page size
      onPageChange(1);
    }
  };

  // Calculate display range
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={`flex items-center justify-between ${compact ? 'gap-2' : 'gap-4'} flex-wrap`}
      role="navigation"
      aria-label="Pagination"
    >
      {/* Items info */}
      {!compact && (
        <div className="text-muted-foreground text-sm">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> repositories
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size={compact ? 'sm' : 'default'}
          onClick={handleFirstPage}
          disabled={isFirstPage || disabled}
          aria-label="Go to first page"
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
          {!compact && <span className="ml-1">First</span>}
        </Button>

        <Button
          variant="outline"
          size={compact ? 'sm' : 'default'}
          onClick={handlePreviousPage}
          disabled={isFirstPage || disabled}
          aria-label="Go to previous page"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          {!compact && <span className="ml-1">Previous</span>}
        </Button>

        <div
          className={`flex items-center ${compact ? 'px-2' : 'px-4'} text-sm font-medium`}
          aria-current="page"
        >
          Page {currentPage} of {totalPages || 1}
        </div>

        <Button
          variant="outline"
          size={compact ? 'sm' : 'default'}
          onClick={handleNextPage}
          disabled={isLastPage || disabled}
          aria-label="Go to next page"
          title="Next page"
        >
          {!compact && <span className="mr-1">Next</span>}
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size={compact ? 'sm' : 'default'}
          onClick={handleLastPage}
          disabled={isLastPage || disabled}
          aria-label="Go to last page"
          title="Last page"
        >
          {!compact && <span className="mr-1">Last</span>}
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Page size selector */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Items per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
            disabled={disabled}
          >
            <SelectTrigger size={compact ? 'sm' : 'default'} className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
