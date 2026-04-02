interface SearchDropdownSkeletonProps {
  rows?: number;
}

export default function SearchDropdownSkeleton({
  rows = 5,
}: SearchDropdownSkeletonProps) {
  return (
    <>
      <div className="flex w-full min-w-0 flex-col gap-2 md:w-[55%] md:pr-2">
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={`search-skeleton-${index}`}
            className="flex items-center gap-4 rounded-md px-2 py-3"
          >
            <div className="bg-bg-surface-subtitle h-16 w-12 shrink-0 animate-pulse rounded-md" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="bg-bg-surface-subtitle h-4 w-3/4 animate-pulse rounded" />
              <div className="bg-bg-surface-subtitle h-3 w-2/3 animate-pulse rounded" />
            </div>
            <div className="bg-bg-surface-subtitle size-8 animate-pulse rounded-md" />
          </div>
        ))}
      </div>

      <div className="hidden w-[45%] md:block">
        <div className="flex h-full flex-col gap-4">
          <div className="bg-bg-surface-subtitle h-64 w-full animate-pulse rounded-lg" />
          <div className="space-y-2">
            <div className="bg-bg-surface-subtitle h-5 w-3/4 animate-pulse rounded" />
            <div className="bg-bg-surface-subtitle h-4 w-1/2 animate-pulse rounded" />
            <div className="bg-bg-surface-subtitle h-4 w-1/3 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </>
  );
}
