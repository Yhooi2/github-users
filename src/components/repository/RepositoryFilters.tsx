import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { RepositoryFilter } from '@/types/filters';
import { X, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Props = {
  /**
   * Current filter state
   */
  filters: RepositoryFilter;
  /**
   * Callback when a filter changes
   */
  onFilterChange: <K extends keyof RepositoryFilter>(
    key: K,
    value: RepositoryFilter[K]
  ) => void;
  /**
   * Callback to clear all filters
   */
  onClearFilters: () => void;
  /**
   * Available languages for the language filter dropdown
   * @default []
   */
  availableLanguages?: string[];
  /**
   * Whether filters are currently active
   */
  hasActiveFilters?: boolean;
  /**
   * Number of active filters (for badge display)
   */
  activeFilterCount?: number;
  /**
   * Compact mode (hide card wrapper)
   * @default false
   */
  compact?: boolean;
};

/**
 * Repository filters component
 *
 * Provides UI for filtering repositories by various criteria:
 * - Search query (name/description)
 * - Primary language
 * - Original/forked repositories
 * - Archived repositories
 * - Minimum stars
 * - Repositories with topics/license
 *
 * @example
 * ```tsx
 * const { filters, updateFilter, clearFilters, hasActiveFilters } = useRepositoryFilters(repos);
 *
 * <RepositoryFilters
 *   filters={filters}
 *   onFilterChange={updateFilter}
 *   onClearFilters={clearFilters}
 *   hasActiveFilters={hasActiveFilters}
 *   availableLanguages={['TypeScript', 'JavaScript', 'Python']}
 * />
 * ```
 */
export function RepositoryFilters({
  filters,
  onFilterChange,
  onClearFilters,
  availableLanguages = [],
  hasActiveFilters = false,
  activeFilterCount = 0,
  compact = false,
}: Props) {
  const content = (
    <div className="space-y-4">
      {/* Search Query */}
      <div className="space-y-2">
        <Label htmlFor="search-query">Search</Label>
        <Input
          id="search-query"
          type="text"
          placeholder="Search repositories..."
          value={filters.searchQuery || ''}
          onChange={(e) => onFilterChange('searchQuery', e.target.value || undefined)}
        />
      </div>

      {/* Language Filter */}
      {availableLanguages.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="language-filter">Language</Label>
          <Select
            value={filters.language || 'all'}
            onValueChange={(value) =>
              onFilterChange('language', value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger id="language-filter" className="w-full">
              <SelectValue placeholder="All languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All languages</SelectItem>
              {availableLanguages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Minimum Stars */}
      <div className="space-y-2">
        <Label htmlFor="min-stars">Minimum Stars</Label>
        <Input
          id="min-stars"
          type="number"
          min="0"
          placeholder="0"
          value={filters.minStars || ''}
          onChange={(e) => {
            const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
            onFilterChange('minStars', value);
          }}
        />
      </div>

      {/* Boolean Filters */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="original-only"
            checked={filters.originalOnly || false}
            onCheckedChange={(checked) =>
              onFilterChange('originalOnly', checked === true ? true : undefined)
            }
          />
          <Label htmlFor="original-only" className="cursor-pointer">
            Original repositories only
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="forks-only"
            checked={filters.forksOnly || false}
            onCheckedChange={(checked) =>
              onFilterChange('forksOnly', checked === true ? true : undefined)
            }
          />
          <Label htmlFor="forks-only" className="cursor-pointer">
            Forked repositories only
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="hide-archived"
            checked={filters.hideArchived || false}
            onCheckedChange={(checked) =>
              onFilterChange('hideArchived', checked === true ? true : undefined)
            }
          />
          <Label htmlFor="hide-archived" className="cursor-pointer">
            Hide archived
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="has-topics"
            checked={filters.hasTopics || false}
            onCheckedChange={(checked) =>
              onFilterChange('hasTopics', checked === true ? true : undefined)
            }
          />
          <Label htmlFor="has-topics" className="cursor-pointer">
            Has topics
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="has-license"
            checked={filters.hasLicense || false}
            onCheckedChange={(checked) =>
              onFilterChange('hasLicense', checked === true ? true : undefined)
            }
          />
          <Label htmlFor="has-license" className="cursor-pointer">
            Has license
          </Label>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="w-full"
          aria-label="Clear all filters"
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  if (compact) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" aria-label={`${activeFilterCount} active filters`}>
              {activeFilterCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
