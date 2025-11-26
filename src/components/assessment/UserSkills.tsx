import { Card, CardContent } from "@/components/ui/card";
import { getLanguageColor } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Code2 } from "lucide-react";

export interface LanguageSkill {
  /** Language name */
  name: string;
  /** Percentage of codebase (0-100) */
  percent: number;
}

export interface UserSkillsProps {
  /** List of languages with percentages */
  languages: LanguageSkill[];
  /** Maximum number of languages to display */
  maxItems?: number;
  /** Loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * UserSkills - Displays user's top programming languages
 *
 * Shows language skills as colored chips with percentages.
 * Languages beyond maxItems are shown as "+N more".
 *
 * @example
 * ```tsx
 * <UserSkills
 *   languages={[
 *     { name: "TypeScript", percent: 68 },
 *     { name: "JavaScript", percent: 15 },
 *     { name: "CSS", percent: 10 },
 *   ]}
 *   maxItems={5}
 * />
 * ```
 */
export function UserSkills({
  languages,
  maxItems = 5,
  loading = false,
  className,
}: UserSkillsProps) {
  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="h-5 w-5 rounded bg-muted" />
          <div className="flex flex-1 flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-20 rounded-full bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!languages || languages.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center gap-3 p-4">
          <Code2
            className="h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="text-sm text-muted-foreground">
            No languages detected
          </span>
        </CardContent>
      </Card>
    );
  }

  // Sort by percentage descending and take top maxItems
  const sortedLanguages = [...languages]
    .sort((a, b) => b.percent - a.percent)
    .slice(0, maxItems);

  const remainingCount = languages.length - maxItems;

  return (
    <Card className={className}>
      <CardContent className="flex items-center gap-3 p-4">
        {/* Icon */}
        <Code2
          className="h-5 w-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />

        {/* Title */}
        <span className="shrink-0 text-sm font-medium text-muted-foreground">
          Top Skills
        </span>

        {/* Language chips */}
        <div
          className="flex flex-1 flex-wrap items-center gap-2"
          role="list"
          aria-label="Programming languages"
        >
          {sortedLanguages.map((lang) => (
            <LanguageChip key={lang.name} language={lang} />
          ))}

          {remainingCount > 0 && (
            <span
              className="text-xs text-muted-foreground"
              aria-label={`and ${remainingCount} more languages`}
            >
              +{remainingCount}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface LanguageChipProps {
  language: LanguageSkill;
}

function LanguageChip({ language }: LanguageChipProps) {
  const color = getLanguageColor(language.name);

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-2.5 py-1"
      role="listitem"
    >
      {/* Color dot */}
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      {/* Language name */}
      <span className="text-xs font-medium text-foreground">
        {language.name}
      </span>

      {/* Percentage */}
      <span className="text-xs tabular-nums text-muted-foreground">
        {Math.round(language.percent)}%
      </span>
    </div>
  );
}
