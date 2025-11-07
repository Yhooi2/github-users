import { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';

type SectionProps = {
  /**
   * Section title/heading
   */
  title?: string;
  /**
   * Optional description below title
   */
  description?: string;
  /**
   * Content to render inside the section
   */
  children: ReactNode;
  /**
   * Show separator line below header
   */
  showSeparator?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
};

/**
 * Section component wraps content with an optional title and description
 *
 * @example
 * ```tsx
 * <Section title="User Statistics" description="Overview of user activity">
 *   <UserStats />
 * </Section>
 * ```
 */
export function Section({
  title,
  description,
  children,
  showSeparator = true,
  className = '',
}: SectionProps) {
  const hasHeader = title || description;

  return (
    <section className={`space-y-4 ${className}`.trim()}>
      {hasHeader && (
        <div className="space-y-1">
          {title && <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          {showSeparator && <Separator className="mt-2" />}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}
