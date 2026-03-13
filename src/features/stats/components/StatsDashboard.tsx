import { Button } from "@/components/ui/button";
import type { ReadingStats } from "@/features/stats/lib/types";
import MonthlyCompletedSection from "@/features/stats/components/MonthlyCompletedSection";
import RatingDistributionSection from "@/features/stats/components/RatingDistributionSection";
import StatsDashboardSkeleton from "@/features/stats/components/StatsDashboardSkeleton";
import SummaryCardsSection from "@/features/stats/components/SummaryCardsSection";

type StatsDashboardProps = {
  stats: ReadingStats;
  hasBooks: boolean;
  loading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export default function StatsDashboard({
  stats,
  hasBooks,
  loading,
  isError,
  onRetry,
}: StatsDashboardProps) {
  if (loading) {
    return <StatsDashboardSkeleton />;
  }

  if (isError) {
    return (
      <section className="border-border-default bg-bg-surface rounded-xl border p-8 text-center">
        <p className="typo-body-md text-text-primary">
          독서 통계를 불러오지 못했습니다.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={onRetry}
        >
          다시 시도
        </Button>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <SummaryCardsSection summary={stats.summary} />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RatingDistributionSection
          ratingDistribution={stats.ratingDistribution}
          hasBooks={hasBooks}
        />
        <MonthlyCompletedSection monthlyCompleted={stats.monthlyCompleted} />
      </section>
    </div>
  );
}
