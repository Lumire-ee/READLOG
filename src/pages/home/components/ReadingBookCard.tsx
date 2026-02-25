import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculateProgressValue } from "@/features/books/detail/lib/bookDetailFormRules";
import { toProxiedThumbnailSrc } from "@/features/books/lib/thumbnailProxy";
import { THUMB_SIZES } from "@/shared/constants/thumbnail";
import type { UserBookWithInfo } from "@/shared/types/db";
import ReadingQuickActions from "./ReadingQuickActions";

type ReadingBookCardProps = {
  item: UserBookWithInfo;
  onOpenBook: (userBookId: string) => void;
  showQuickActions: boolean;
  isUpdatingStatus: boolean;
  pendingUserBookId: string | undefined;
  onComplete: (userBookId: string) => void;
  onQuit: (userBookId: string) => void;
};

export default function ReadingBookCard({
  item,
  onOpenBook,
  showQuickActions,
  isUpdatingStatus,
  pendingUserBookId,
  onComplete,
  onQuit,
}: ReadingBookCardProps) {
  const totalPageCount = item.page_count_override ?? item.book.page_count;
  const currentPage = item.current_page ?? 0;
  const hasPageInfo =
    item.current_page !== null && totalPageCount !== null && totalPageCount > 0;
  const progressValue = calculateProgressValue(item.current_page, totalPageCount);

  return (
    <Button
      key={item.id}
      type="button"
      variant="ghost"
      onClick={() => onOpenBook(item.id)}
      className="border-border-default bg-bg-elevated hover:bg-bg-surface-hover has-[button[data-quick-action='true']:hover]:bg-bg-elevated h-88 w-full items-stretch justify-stretch gap-0 overflow-hidden rounded-xl border p-0 text-left whitespace-normal"
    >
      <div className="grid h-full w-full grid-rows-5">
        <div className="bg-bg-surface-subtitle relative row-span-3 w-full overflow-hidden">
          <img
            src={toProxiedThumbnailSrc(item.book.thumbnail, THUMB_SIZES.LARGE)}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
          />
          <img
            src={toProxiedThumbnailSrc(item.book.thumbnail, THUMB_SIZES.LARGE)}
            alt={item.book.title}
            className="relative z-10 h-full w-full object-contain"
          />
        </div>

        <div className="row-span-2 flex min-h-0 flex-col gap-2 p-3">
          <div className="min-w-0">
            <p className="typo-label-md text-text-primary line-clamp-2">
              {item.book.title}
            </p>
            <p className="typo-label-sm text-text-secondary mt-0.5 truncate">
              {item.book.author}
            </p>
          </div>

          {showQuickActions ? (
            <ReadingQuickActions
              disabled={isUpdatingStatus && pendingUserBookId === item.id}
              onComplete={() => onComplete(item.id)}
              onQuit={() => onQuit(item.id)}
            />
          ) : null}

          {hasPageInfo ? (
            <div className="mt-auto space-y-1">
              <p className="typo-label-sm text-text-secondary">
                {currentPage} / {totalPageCount} 페이지
              </p>
              <Progress value={progressValue} className="bg-bg-surface-subtitle h-2" />
            </div>
          ) : null}
        </div>
      </div>
    </Button>
  );
}

