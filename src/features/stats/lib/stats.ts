import type { UserBookWithInfo } from "@/shared/types/db";
import type {
  MonthlyCompletedPoint,
  RatingDistributionPoint,
  ReadingStats,
} from "@/features/stats/lib/types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function parseDateOnly(value: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toMonthKey(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function parseMonthKey(monthKey: string): Date {
  const [yearText, monthText] = monthKey.split("-");
  return new Date(Number(yearText), Number(monthText) - 1, 1);
}

function addOneMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function formatMonthLabel(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}.${month}`;
}

function computeRatingDistribution(
  userBooks: UserBookWithInfo[],
): RatingDistributionPoint[] {
  const buckets: RatingDistributionPoint[] = [
    { label: "없음", count: 0 },
    { label: "1점", count: 0 },
    { label: "2점", count: 0 },
    { label: "3점", count: 0 },
    { label: "4점", count: 0 },
    { label: "5점", count: 0 },
  ];

  for (const item of userBooks) {
    const rating = item.rating;
    if (
      rating === null ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      buckets[0].count += 1;
      continue;
    }

    buckets[rating].count += 1;
  }

  return buckets;
}

function computeMonthlyCompleted(
  userBooks: UserBookWithInfo[],
): MonthlyCompletedPoint[] {
  const monthlyCount = new Map<string, number>();

  for (const item of userBooks) {
    if (item.status !== "completed") continue;
    const endDate = parseDateOnly(item.end_date);
    if (!endDate) continue;

    const monthKey = toMonthKey(endDate);
    monthlyCount.set(monthKey, (monthlyCount.get(monthKey) ?? 0) + 1);
  }

  const sortedKeys = [...monthlyCount.keys()].sort();
  if (sortedKeys.length === 0) return [];

  const firstMonth = parseMonthKey(sortedKeys[0]);
  const lastMonth = parseMonthKey(sortedKeys[sortedKeys.length - 1]);

  const points: MonthlyCompletedPoint[] = [];
  let cursor = firstMonth;

  while (cursor <= lastMonth) {
    const monthKey = toMonthKey(cursor);
    points.push({
      monthKey,
      monthLabel: formatMonthLabel(cursor),
      count: monthlyCount.get(monthKey) ?? 0,
    });
    cursor = addOneMonth(cursor);
  }

  return points;
}

export function computeReadingStats(
  userBooks: UserBookWithInfo[],
): ReadingStats {
  const totalReadPages = userBooks.reduce(
    (sum, item) => sum + (item.current_page ?? 0),
    0,
  );

  const completedCount = userBooks.filter(
    (item) => item.status === "completed",
  ).length;

  const ratings = userBooks
    .map((item) => item.rating)
    .filter((rating): rating is number => rating !== null);

  const averageRating =
    ratings.length > 0
      ? roundToOneDecimal(
          ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
        )
      : null;

  const completionDaysList: number[] = [];
  for (const item of userBooks) {
    if (item.status !== "completed") continue;

    const startDate = parseDateOnly(item.start_date);
    const endDate = parseDateOnly(item.end_date);

    if (!startDate || !endDate) continue;
    if (endDate < startDate) continue;

    const dayDiff = Math.floor(
      (endDate.getTime() - startDate.getTime()) / MS_PER_DAY,
    );
    completionDaysList.push(dayDiff);
  }

  const averageCompletionDays =
    completionDaysList.length > 0
      ? roundToOneDecimal(
          completionDaysList.reduce((sum, days) => sum + days, 0) /
            completionDaysList.length,
        )
      : null;

  return {
    summary: {
      totalReadPages,
      completedCount,
      averageRating,
      ratedCount: ratings.length,
      averageCompletionDays,
      completionDaysCount: completionDaysList.length,
    },
    ratingDistribution: computeRatingDistribution(userBooks),
    monthlyCompleted: computeMonthlyCompleted(userBooks),
  };
}
