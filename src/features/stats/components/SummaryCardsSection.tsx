import type { ReadingStatsSummary } from "@/features/stats/lib/types";

const numberFormatter = new Intl.NumberFormat("ko-KR");

type SummaryCardsSectionProps = {
  summary: ReadingStatsSummary;
};

type SummaryCardProps = {
  title: string;
  value: string;
  description?: string;
};

function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <article className="border-border-default bg-bg-surface rounded-xl border p-5">
      <p className="typo-label-sm text-text-secondary">{title}</p>
      <p className="typo-heading-md text-text-primary mt-2">{value}</p>
      <p className="typo-caption text-text-secondary mt-1">{description}</p>
    </article>
  );
}

function formatCount(value: number, unit: string): string {
  return `${numberFormatter.format(value)}${unit}`;
}

function formatAverage(value: number | null, unit: string): string {
  if (value === null) return "-";
  return `${value.toFixed(1)}${unit}`;
}

export default function SummaryCardsSection({
  summary,
}: SummaryCardsSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <SummaryCard
        title="총 읽은 페이지 수"
        value={formatCount(summary.totalReadPages, "p")}
        description="등록된 페이지 합계"
      />
      <SummaryCard
        title="총 완독 책 수"
        value={formatCount(summary.completedCount, "권")}
        description="완독 상태의 책 수"
      />
      <SummaryCard
        title="평균 평점"
        value={formatAverage(summary.averageRating, " / 5")}
        description={
          summary.ratedCount > 0
            ? `평점 입력된 ${numberFormatter.format(summary.ratedCount)}권 기준`
            : "평점 입력 데이터 없음"
        }
      />
      <SummaryCard
        title="평균 완독 기간"
        value={formatAverage(summary.averageCompletionDays, "일")}
        description={
          summary.completionDaysCount > 0
            ? `완독 책 ${numberFormatter.format(summary.completionDaysCount)}권 기준`
            : "유효 완독 기간 데이터 없음"
        }
      />
    </section>
  );
}
