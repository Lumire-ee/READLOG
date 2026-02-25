type HomeBookSectionSkeletonProps = {
  layout: "row" | "card";
};

export default function HomeBookSectionSkeleton({
  layout,
}: HomeBookSectionSkeletonProps) {
  if (layout === "card") {
    return (
      <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={`card-skeleton-${index}`}
            className="border-border-default bg-bg-elevated h-88 overflow-hidden rounded-xl border"
          >
            <div className="bg-bg-surface-subtitle h-3/5 animate-pulse" />
            <div className="space-y-2 p-3">
              <div className="bg-bg-surface-subtitle h-4 w-5/6 animate-pulse rounded" />
              <div className="bg-bg-surface-subtitle h-4 w-1/2 animate-pulse rounded" />
              <div className="bg-bg-surface-subtitle mt-2 h-8 w-full animate-pulse rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid w-full min-w-0 gap-2 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={`row-skeleton-${index}`}
          className="border-border-default bg-bg-elevated flex items-center gap-4 rounded-md border px-2 py-3"
        >
          <div className="bg-bg-surface-subtitle h-16 w-12 animate-pulse rounded-md" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="bg-bg-surface-subtitle h-4 w-4/5 animate-pulse rounded" />
            <div className="bg-bg-surface-subtitle h-4 w-2/5 animate-pulse rounded" />
          </div>
          <div className="bg-bg-surface-subtitle h-7 w-16 animate-pulse rounded-md" />
        </div>
      ))}
    </div>
  );
}

