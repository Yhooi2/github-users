// ============================================
// ТИПЫ
// ============================================

export type YearBadgeType =
  | 'peak'        // 🔥 Самый продуктивный
  | 'growth'      // 📈 Рост
  | 'stable'      // 📊 Стабильный
  | 'start'       // 🌱 Начало пути
  | 'decline'     // 📉 Спад
  | 'inactive';   // ⚫ Неактивный

export interface YearBadge {
  type: YearBadgeType;
  emoji: string;
  label: string;
  labelRu: string;
  color: string;        // Tailwind class (CSS variable)
  description: string;  // Tooltip text
}

export interface YearInsight {
  text: string;
  textRu: string;
  highlight?: string;   // Ключевое число для выделения
}

export interface YearAnalysis {
  badge: YearBadge;
  insight: YearInsight | null;
  percentOfTotal: number;      // % от всех коммитов
  percentOfPeak: number;       // % от пикового года
  yoyChange: number | null;    // YoY изменение в %
  rank: number;                // 1 = лучший год
}

export interface YearMetrics {
  commits: number;
  prs: number;
  repos: number;
}

export interface CareerSummary {
  totalCommits: number;
  totalPRs: number;
  yearsActive: number;
  totalYears: number;
  startYear: number;
  uniqueRepos: number;
}

export interface YearDataForSummary {
  year: number;
  totalCommits: number;
  totalPRs: number;
  ownedRepos: Array<{ repository: { url: string } }>;
  contributions: Array<{ repository: { url: string } }>;
}

// ============================================
// КОНСТАНТЫ
// ============================================

// ВАЖНО: Использовать CSS переменные из index.css, НЕ hardcoded цвета!
const BADGES: Record<YearBadgeType, Omit<YearBadge, 'type'>> = {
  peak: {
    emoji: '🔥',
    label: 'Peak Year',
    labelRu: 'Самый продуктивный',
    color: 'text-warning',  // CSS переменная --warning
    description: 'Год с максимальным количеством коммитов'
  },
  growth: {
    emoji: '📈',
    label: 'Growth',
    labelRu: 'Рост',
    color: 'text-success',  // CSS переменная --success
    description: 'Рост активности более 20% по сравнению с прошлым годом'
  },
  stable: {
    emoji: '📊',
    label: 'Stable',
    labelRu: 'Стабильный',
    color: 'text-primary',  // CSS переменная --primary
    description: 'Стабильная активность (±20% от прошлого года)'
  },
  start: {
    emoji: '🌱',
    label: 'Beginning',
    labelRu: 'Начало пути',
    color: 'text-success',  // CSS переменная --success
    description: 'Первый год активности на GitHub'
  },
  decline: {
    emoji: '📉',
    label: 'Decline',
    labelRu: 'Спад',
    color: 'text-muted-foreground',  // Приглушённый для спада
    description: 'Снижение активности более 20% по сравнению с прошлым годом'
  },
  inactive: {
    emoji: '⚫',
    label: 'Inactive',
    labelRu: 'Низкая активность',
    color: 'text-muted-foreground',
    description: 'Менее 100 коммитов за год'
  }
};

// Пороги
const THRESHOLDS = {
  INACTIVE_COMMITS: 100,     // < 100 = неактивный
  GROWTH_PERCENT: 20,        // > 20% = рост
  DECLINE_PERCENT: -20,      // < -20% = спад
};

// ============================================
// ОСНОВНАЯ ФУНКЦИЯ
// ============================================

/**
 * Анализирует конкретный год и определяет его бейдж и инсайты
 * @param year - Анализируемый год
 * @param commits - Количество коммитов в этом году
 * @param allYears - Все годы активности пользователя
 * @returns Полный анализ года с бейджем, инсайтами и метриками
 */
export function analyzeYear(
  year: number,
  commits: number,
  allYears: Array<{ year: number; commits: number }>
): YearAnalysis {
  // Сортировка по году (от старого к новому)
  const sorted = [...allYears].sort((a, b) => a.year - b.year);

  // Базовые расчёты
  const totalCommits = sorted.reduce((sum, y) => sum + y.commits, 0);
  const maxCommits = Math.max(...sorted.map(y => y.commits));
  const minYear = Math.min(...sorted.map(y => y.year));

  // Ранжирование (1 = лучший)
  const ranked = [...sorted].sort((a, b) => b.commits - a.commits);
  const rank = ranked.findIndex(y => y.year === year) + 1;

  // YoY изменение
  const prevYearData = sorted.find(y => y.year === year - 1);
  const yoyChange = prevYearData && prevYearData.commits > 0
    ? ((commits - prevYearData.commits) / prevYearData.commits) * 100
    : null;

  // Проценты
  const percentOfTotal = totalCommits > 0
    ? Math.round((commits / totalCommits) * 100)
    : 0;
  const percentOfPeak = maxCommits > 0
    ? Math.round((commits / maxCommits) * 100)
    : 0;

  // Определение бейджа
  const badgeType = determineBadgeType(year, commits, yoyChange, maxCommits, minYear);

  // Генерация инсайта
  const insight = generateInsight(year, commits, yoyChange, rank, sorted.length);

  return {
    badge: { type: badgeType, ...BADGES[badgeType] },
    insight,
    percentOfTotal,
    percentOfPeak,
    yoyChange,
    rank
  };
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function determineBadgeType(
  year: number,
  commits: number,
  yoyChange: number | null,
  maxCommits: number,
  minYear: number
): YearBadgeType {
  // Приоритет 1: Неактивный год
  if (commits < THRESHOLDS.INACTIVE_COMMITS) {
    return 'inactive';
  }

  // Приоритет 2: Пиковый год
  if (commits === maxCommits) {
    return 'peak';
  }

  // Приоритет 3: Первый год
  if (year === minYear) {
    return 'start';
  }

  // Приоритет 4: Рост/Спад/Стабильность
  if (yoyChange !== null) {
    if (yoyChange > THRESHOLDS.GROWTH_PERCENT) {
      return 'growth';
    }
    if (yoyChange < THRESHOLDS.DECLINE_PERCENT) {
      return 'decline';
    }
  }

  return 'stable';
}

function generateInsight(
  _year: number,
  commits: number,
  yoyChange: number | null,
  rank: number,
  totalYears: number
): YearInsight | null {
  // Пиковый год
  if (rank === 1) {
    return {
      text: `Best year with ${commits.toLocaleString()} commits`,
      textRu: `Лучший год: ${commits.toLocaleString()} коммитов`,
      highlight: commits.toLocaleString()
    };
  }

  // Значительный рост
  if (yoyChange && yoyChange > 50) {
    return {
      text: `+${Math.round(yoyChange)}% growth from previous year`,
      textRu: `+${Math.round(yoyChange)}% рост к прошлому году`,
      highlight: `+${Math.round(yoyChange)}%`
    };
  }

  // Топ-2 год
  if (rank === 2 && totalYears > 2) {
    return {
      text: `Second most productive year`,
      textRu: `Второй по продуктивности год`,
    };
  }

  return null;
}

// ============================================
// АГРЕГАТНЫЕ ФУНКЦИИ
// ============================================

/**
 * Анализирует все годы в таймлайне
 * @param timeline - Массив годовых данных с коммитами
 * @returns Map с анализом каждого года
 */
export function analyzeAllYears(
  timeline: Array<{ year: number; totalCommits: number }>
): Map<number, YearAnalysis> {
  const simplified = timeline.map(y => ({
    year: y.year,
    commits: y.totalCommits
  }));

  const result = new Map<number, YearAnalysis>();

  for (const { year, commits } of simplified) {
    result.set(year, analyzeYear(year, commits, simplified));
  }

  return result;
}

/**
 * Вычисляет общую статистику карьеры пользователя
 * @param timeline - Полные данные по всем годам
 * @returns Агрегированная статистика карьеры
 */
export function getCareerSummary(
  timeline: YearDataForSummary[]
): CareerSummary {
  const totalCommits = timeline.reduce((sum, y) => sum + y.totalCommits, 0);
  const totalPRs = timeline.reduce((sum, y) => sum + y.totalPRs, 0);
  const yearsActive = timeline.filter(y => y.totalCommits >= THRESHOLDS.INACTIVE_COMMITS).length;
  const startYear = Math.min(...timeline.map(y => y.year));

  // Подсчёт уникальных репозиториев
  const allRepoUrls = new Set<string>();
  timeline.forEach(year => {
    year.ownedRepos.forEach(r => allRepoUrls.add(r.repository.url));
    year.contributions.forEach(r => allRepoUrls.add(r.repository.url));
  });
  const uniqueRepos = allRepoUrls.size;

  return {
    totalCommits,
    totalPRs,
    yearsActive,
    totalYears: timeline.length,
    startYear,
    uniqueRepos
  };
}

/**
 * Получить метрики для конкретного года (для YearCard)
 * @param year - Данные года
 * @returns Метрики года: commits, PRs, repos
 */
export function getYearMetrics(year: YearDataForSummary): YearMetrics {
  const repoUrls = new Set<string>();
  year.ownedRepos.forEach(r => repoUrls.add(r.repository.url));
  year.contributions.forEach(r => repoUrls.add(r.repository.url));

  return {
    commits: year.totalCommits,
    prs: year.totalPRs,
    repos: repoUrls.size
  };
}
