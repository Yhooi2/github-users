import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { YearBadge as YearBadgeType } from '@/lib/year-badges';

interface YearBadgeProps {
  badge: YearBadgeType;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function YearBadge({ badge, showLabel = false, size = 'md' }: YearBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'inline-flex items-center gap-1 cursor-help',
            badge.color,
            sizeClasses[size]
          )}
        >
          <span>{badge.emoji}</span>
          {showLabel && (
            <span className="font-medium">{badge.labelRu}</span>
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{badge.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
