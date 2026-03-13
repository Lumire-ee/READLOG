export type ReadingStatsSummary = {
  totalReadPages: number;
  completedCount: number;
  averageRating: number | null;
  ratedCount: number;
  averageCompletionDays: number | null;
  completionDaysCount: number;
};

export type RatingDistributionPoint = {
  label: string;
  count: number;
};

export type MonthlyCompletedPoint = {
  monthKey: string;
  monthLabel: string;
  count: number;
};

export type ReadingStats = {
  summary: ReadingStatsSummary;
  ratingDistribution: RatingDistributionPoint[];
  monthlyCompleted: MonthlyCompletedPoint[];
};
