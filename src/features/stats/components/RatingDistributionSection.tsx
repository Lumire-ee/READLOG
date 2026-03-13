import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RatingDistributionPoint } from "@/features/stats/lib/types";

type RatingDistributionSectionProps = {
  ratingDistribution: RatingDistributionPoint[];
  hasBooks: boolean;
};

export default function RatingDistributionSection({
  ratingDistribution,
  hasBooks,
}: RatingDistributionSectionProps) {
  return (
    <article className="border-border-default bg-bg-surface rounded-xl border p-6">
      <h2 className="typo-heading-sm text-text-primary">평점 분포</h2>
      <p className="typo-caption text-text-secondary mt-1">
        전체 기간 기준, 별점 없음/1점~5점 분포
      </p>
      {!hasBooks ? (
        <div className="typo-body-sm text-text-secondary flex h-72 items-center justify-center">
          등록된 책이 없어 분포를 표시할 수 없습니다.
        </div>
      ) : (
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ratingDistribution}
              layout="vertical"
              margin={{ top: 4, right: 12, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="label"
                width={64}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar
                dataKey="count"
                fill="var(--color-accent-indigo)"
                radius={4}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}
