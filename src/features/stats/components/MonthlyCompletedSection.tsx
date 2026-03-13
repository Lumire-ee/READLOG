import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MonthlyCompletedPoint } from "@/features/stats/lib/types";

type MonthlyCompletedSectionProps = {
  monthlyCompleted: MonthlyCompletedPoint[];
};

export default function MonthlyCompletedSection({
  monthlyCompleted,
}: MonthlyCompletedSectionProps) {
  return (
    <article className="border-border-default bg-bg-surface rounded-xl border p-6">
      <h2 className="typo-heading-sm text-text-primary">월별 완독 권수</h2>
      <p className="typo-caption text-text-secondary mt-1">
        전체 기간 기준, end_date 월별 집계
      </p>
      {monthlyCompleted.length === 0 ? (
        <div className="typo-body-sm text-text-secondary flex h-72 items-center justify-center">
          월별 완독 데이터가 없어 추이를 표시할 수 없습니다.
        </div>
      ) : (
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyCompleted}
              margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="monthLabel"
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{ stroke: "var(--color-border-default)" }} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="var(--color-accent-blue)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}
