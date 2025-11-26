import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getLanguageColor } from "@/lib/constants";

export interface LanguageItem {
  name: string;
  percent: number;
}

export interface LanguagesInlineProps {
  /** Language statistics */
  languages: LanguageItem[];
  /** Maximum languages to show inline (default: 4) */
  maxItems?: number;
}

/**
 * LanguagesInline - Compact inline display of programming languages
 *
 * Shows languages as "TypeScript 56% • HTML 22% • ..." with colored dots.
 * Hover shows tooltip with full breakdown.
 *
 * @example
 * ```tsx
 * <LanguagesInline
 *   languages={[
 *     { name: "TypeScript", percent: 56 },
 *     { name: "HTML", percent: 22 },
 *   ]}
 * />
 * ```
 */
export function LanguagesInline({
  languages,
  maxItems = 4,
}: LanguagesInlineProps) {
  if (!languages || languages.length === 0) {
    return null;
  }

  const visibleLanguages = languages.slice(0, maxItems);
  const hiddenCount = languages.length - maxItems;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground cursor-default"
            role="list"
            aria-label="Programming languages"
          >
            {visibleLanguages.map((lang, index) => (
              <span
                key={lang.name}
                className="flex items-center gap-1.5"
                role="listitem"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getLanguageColor(lang.name) }}
                  aria-hidden="true"
                />
                <span>
                  {lang.name}{" "}
                  <span className="text-foreground font-medium">
                    {Math.round(lang.percent)}%
                  </span>
                </span>
                {index < visibleLanguages.length - 1 && (
                  <span className="text-muted-foreground/50 ml-1">•</span>
                )}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="text-muted-foreground/70">+{hiddenCount}</span>
            )}
          </div>
        </TooltipTrigger>

        <TooltipContent side="bottom" align="start" className="max-w-xs">
          <div className="space-y-1.5 py-1">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              All Languages
            </div>
            {languages.map((lang) => (
              <div
                key={lang.name}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getLanguageColor(lang.name) }}
                  />
                  <span className="text-sm">{lang.name}</span>
                </div>
                <span className="text-sm font-medium">
                  {lang.percent.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
