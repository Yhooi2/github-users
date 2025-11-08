import { useState } from 'react';
import SearchForm from './components/SearchForm';
import UserProfile from './components/UserProfile';
import { MainTabs } from './components/layout/MainTabs';
import { ThemeToggle } from './components/layout/ThemeToggle';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { RepositoryList } from './components/repository/RepositoryList';
import { RepositoryTable } from './components/repository/RepositoryTable';
import { RepositoryFilters } from './components/repository/RepositoryFilters';
import { RepositorySorting } from './components/repository/RepositorySorting';
import { RepositoryPagination } from './components/repository/RepositoryPagination';
import { StatsOverview } from './components/statistics/StatsOverview';
import { useRepositoryFilters } from './hooks/useRepositoryFilters';
import { useRepositorySorting } from './hooks/useRepositorySorting';
import useQueryUser from './apollo/useQueryUser';
import { Button } from './components/ui/button';
import { List, Table2 } from 'lucide-react';
import {
  calculateYearlyCommitStats,
  calculateLanguageStatistics,
  calculateCommitActivity,
} from './lib/statistics';
import type { RepositoryFilter, SortBy } from './types/filters';

function App() {
  const [userName, setUserName] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Fetch user data
  const { data, loading, error } = useQueryUser(userName);

  // Extract repositories
  const repositories = data?.user?.repositories?.nodes || [];

  // Apply filters and sorting
  const { filteredRepositories, filters, updateFilter, clearFilters, hasActiveFilters } =
    useRepositoryFilters(repositories);
  const { sortedRepositories, sorting, setSortBy, setSortDirection, toggleDirection } =
    useRepositorySorting(filteredRepositories);

  // Pagination
  const totalPages = Math.ceil(sortedRepositories.length / pageSize);
  const paginatedRepositories = sortedRepositories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset pagination when filters/sorting change
  const handleFilterChange = <K extends keyof RepositoryFilter>(
    key: K,
    value: RepositoryFilter[K]
  ) => {
    updateFilter(key, value);
    setCurrentPage(1);
  };

  const handleSortChange = (field: SortBy) => {
    setSortBy(field);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
  };

  // Calculate statistics data
  const yearlyStats = data?.user
    ? calculateYearlyCommitStats({
        year1: data.user.year1,
        year2: data.user.year2,
        year3: data.user.year3,
      })
    : [];

  const languageStats = calculateLanguageStatistics(repositories);

  const activityStats = data?.user
    ? calculateCommitActivity(
        data.user.contributionsCollection?.totalCommitContributions || 0,
        365 // Default to 365 days (last year)
      )
    : { total: 0, perDay: 0, perWeek: 0, perMonth: 0 };

  const tabs = [
    {
      value: 'profile',
      label: 'Profile',
      icon: '👤',
      content: <UserProfile userName={userName} />,
    },
    {
      value: 'repositories',
      label: 'Repositories',
      icon: '📦',
      content: (
        <div className="space-y-6">
          {/* Controls Row */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Filters */}
            <div className="w-full lg:w-96">
              <RepositoryFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
                availableLanguages={Array.from(
                  new Set(
                    repositories
                      .map((r) => r.primaryLanguage?.name)
                      .filter((lang): lang is string => Boolean(lang))
                  )
                ).sort()}
              />
            </div>

            {/* Sorting and View Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              <RepositorySorting
                sortBy={sorting.field}
                sortDirection={sorting.direction}
                onSortByChange={handleSortChange}
                onSortDirectionChange={setSortDirection}
                onToggleDirection={toggleDirection}
              />

              {/* View Mode Toggle */}
              <div className="flex gap-1 rounded-lg border bg-background p-1">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  aria-label="Table view"
                >
                  <Table2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Repository Display */}
          {viewMode === 'list' ? (
            <RepositoryList repositories={paginatedRepositories} loading={loading} />
          ) : (
            <RepositoryTable repositories={paginatedRepositories} loading={loading} />
          )}

          {/* Pagination */}
          {sortedRepositories.length > 0 && (
            <RepositoryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={sortedRepositories.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          )}
        </div>
      ),
    },
    {
      value: 'statistics',
      label: 'Statistics',
      icon: '📊',
      content: (
        <ErrorBoundary>
          <StatsOverview
            yearlyCommits={yearlyStats}
            languages={languageStats}
            activity={activityStats}
            loading={loading}
          />
        </ErrorBoundary>
      ),
    },
  ];

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 sm:right-6 lg:right-8">
        <ThemeToggle />
      </div>

      {/* Search Form */}
      <div className="mb-8">
        <SearchForm userName={userName} setUserName={setUserName} />
      </div>

      {/* Main Content - Show tabs only when user is loaded */}
      {userName && data && !loading && !error && (
        <MainTabs tabs={tabs} defaultValue="profile" />
      )}

      {/* Show UserProfile directly when loading or error (maintains existing behavior) */}
      {userName && (loading || error) && <UserProfile userName={userName} />}
    </main>
  );
}

export default App;
