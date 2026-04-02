import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  statsChartAxisTickStyle,
  statsChartTooltipContentStyle,
  statsChartTooltipItemStyle,
  statsChartTooltipLabelStyle,
} from "@/features/stats/lib/chartStyles";
import type { RatingDistributionPoint } from "@/features/stats/lib/types";

type RatingDistributionSectionProps = {
  ratingDistribution: RatingDistributionPoint[];
  hasBooks: boolean;
  countAxisMax: number;
};

export default function RatingDistributionSection({
  ratingDistribution,
  hasBooks,
  countAxisMax,
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
              margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
            >
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={statsChartAxisTickStyle}
              />
              <YAxis
                allowDecimals={false}
                domain={[0, countAxisMax]}
                tick={statsChartAxisTickStyle}
              />
              <Tooltip
                cursor={{
                  fill: "var(--color-bg-surface-hover)",
                  fillOpacity: 0.8,
                }}
                contentStyle={statsChartTooltipContentStyle}
                labelStyle={statsChartTooltipLabelStyle}
                itemStyle={statsChartTooltipItemStyle}
              />
              <Bar
                dataKey="count"
                name="권 수"
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
