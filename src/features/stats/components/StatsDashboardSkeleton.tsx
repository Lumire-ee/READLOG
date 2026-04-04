export default function StatsDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border border-border-skeleton bg-bg-surface rounded-xl p-5"
          >
            <div className="bg-bg-surface-hover h-3 w-24 animate-pulse rounded" />
            <div className="bg-bg-surface-hover mt-4 h-8 w-20 animate-pulse rounded" />
            <div className="bg-bg-surface-hover mt-2 h-3 w-28 animate-pulse rounded" />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="border border-border-skeleton bg-bg-surface rounded-xl p-6"
          >
            <div className="bg-bg-surface-hover mb-4 h-5 w-36 animate-pulse rounded" />
            <div className="bg-bg-surface-hover h-72 w-full animate-pulse rounded" />
          </div>
        ))}
      </section>
    </div>
  );
}
