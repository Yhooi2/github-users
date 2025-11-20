import { Button } from "@/components/ui/button";
import {
  Database,
  FileQuestion,
  FolderOpen,
  Inbox,
  Search,
  User,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type EmptyStateProps = {
  /**
   * Title/heading for empty state
   */
  title: string;
  /**
   * Description/message
   */
  description: string;
  /**
   * Icon variant to display
   * - 'search': Search icon
   * - 'question': Question mark icon
   * - 'inbox': Inbox icon
   * - 'folder': Folder icon
   * - 'database': Database icon
   * - 'user': User icon
   */
  icon?: "search" | "question" | "inbox" | "folder" | "database" | "user";
  /**
   * Optional action button callback
   */
  onAction?: () => void;
  /**
   * Action button text
   */
  actionText?: string;
  /**
   * Optional secondary action callback
   */
  onSecondaryAction?: () => void;
  /**
   * Secondary action button text
   */
  secondaryActionText?: string;
};

const iconMap: Record<
  NonNullable<EmptyStateProps["icon"]>,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  search: Search,
  question: FileQuestion,
  inbox: Inbox,
  folder: FolderOpen,
  database: Database,
  user: User,
};

/**
 * EmptyState component displays a friendly message when no data is available
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No repositories found"
 *   description="Try adjusting your filters or search criteria"
 *   icon="search"
 *   onAction={() => clearFilters()}
 *   actionText="Clear Filters"
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  icon = "inbox",
  onAction,
  actionText = "Take Action",
  onSecondaryAction,
  secondaryActionText = "Learn More",
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-12 text-center"
      role="status"
      aria-label="Empty state"
    >
      <div className="mb-4 rounded-full bg-muted p-6">
        <Icon className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      </div>

      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {(onAction || onSecondaryAction) && (
        <div className="flex gap-3">
          {onAction && (
            <Button onClick={onAction} aria-label="Primary action">
              {actionText}
            </Button>
          )}
          {onSecondaryAction && (
            <Button
              variant="outline"
              onClick={onSecondaryAction}
              aria-label="Secondary action"
            >
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
