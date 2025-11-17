import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SortBy, SortDirection } from '@/types/filters';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

type Props = {
  /**
   * Current sort field
   */
  sortBy: SortBy;
  /**
   * Current sort direction
   */
  sortDirection: SortDirection;
  /**
   * Callback when sort field changes
   */
  onSortByChange: (field: SortBy) => void;
  /**
   * Callback when sort direction changes
   */
  onSortDirectionChange: (direction: SortDirection) => void;
  /**
   * Callback to toggle sort direction
   */
  onToggleDirection?: () => void;
  /**
   * Compact mode (smaller buttons)
   * @default false
   */
  compact?: boolean;
};

/**
 * Repository sorting controls component
 *
 * Provides UI for sorting repositories by various fields:
 * - Stars, Forks, Watchers
 * - Commits, Size
 * - Updated, Created dates
 * - Name (alphabetical)
 *
 * Supports both ascending and descending order.
 *
 * @example
 * ```tsx
 * const { sorting, setSortBy, toggleDirection } = useRepositorySorting(repos);
 *
 * <RepositorySorting
 *   sortBy={sorting.field}
 *   sortDirection={sorting.direction}
 *   onSortByChange={setSortBy}
 *   onSortDirectionChange={setSortDirection}
 *   onToggleDirection={toggleDirection}
 * />
 * ```
 */
export function RepositorySorting({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
  onToggleDirection,
  compact = false,
}: Props) {
  const sortOptions: { value: SortBy; label: string }[] = [
    { value: 'stars', label: 'Stars' },
    { value: 'forks', label: 'Forks' },
    { value: 'watchers', label: 'Watchers' },
    { value: 'commits', label: 'Commits' },
    { value: 'size', label: 'Size' },
    { value: 'updated', label: 'Last Updated' },
    { value: 'created', label: 'Created Date' },
    { value: 'name', label: 'Name' },
  ];

  const handleToggleDirection = () => {
    if (onToggleDirection) {
      onToggleDirection();
    } else {
      // Fallback if onToggleDirection not provided
      onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground text-sm">Sort by:</span>

      <Select value={sortBy} onValueChange={(value) => onSortByChange(value as SortBy)}>
        <SelectTrigger size={compact ? 'sm' : 'default'} className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1">
        <Button
          variant={sortDirection === 'asc' ? 'default' : 'outline'}
          size={compact ? 'sm' : 'default'}
          onClick={() => onSortDirectionChange('asc')}
          aria-label="Sort ascending"
          aria-pressed={sortDirection === 'asc'}
        >
          <ArrowUp className="h-4 w-4" />
          {!compact && <span className="ml-1">Asc</span>}
        </Button>

        <Button
          variant={sortDirection === 'desc' ? 'default' : 'outline'}
          size={compact ? 'sm' : 'default'}
          onClick={() => onSortDirectionChange('desc')}
          aria-label="Sort descending"
          aria-pressed={sortDirection === 'desc'}
        >
          <ArrowDown className="h-4 w-4" />
          {!compact && <span className="ml-1">Desc</span>}
        </Button>

        <Button
          variant="ghost"
          size={compact ? 'sm' : 'default'}
          onClick={handleToggleDirection}
          aria-label="Toggle sort direction"
          title="Toggle sort direction"
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
