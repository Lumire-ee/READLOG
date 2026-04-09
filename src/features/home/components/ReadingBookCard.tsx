import { Progress } from "@/components/ui/progress";
import { calculateProgressValue } from "@/features/books/detail/lib/bookDetailFormRules";
import { toProxiedThumbnailSrc } from "@/features/books/lib/thumbnailProxy";
import { THUMB_SIZES } from "@/shared/constants/thumbnail";
import type { UserBookWithInfo } from "@/shared/types/db";
import BookItemMenu from "./BookItemMenu";
import ReadingQuickActions from "./ReadingQuickActions";

type ReadingBookCardProps = {
  item: UserBookWithInfo;
  onOpenBook: (userBookId: string) => void;
  showQuickActions: boolean;
  isUpdatingStatus: boolean;
  pendingUserBookId: string | undefined;
  onComplete: (userBookId: string) => void;
  onQuit: (userBookId: string) => void;
  onDelete: (userBookId: string) => void;
  isDeleting: boolean;
  deletingUserBookId: string | undefined;
};

export default function ReadingBookCard({
  item,
  onOpenBook,
  showQuickActions,
  isUpdatingStatus,
  pendingUserBookId,
  onComplete,
  onQuit,
  onDelete,
  isDeleting,
  deletingUserBookId,
}: ReadingBookCardProps) {
  const totalPageCount = item.page_count_override ?? item.book.page_count;
  const currentPage = item.current_page ?? 0;
  const hasPageInfo =
    item.current_page !== null && totalPageCount !== null && totalPageCount > 0;
  const progressValue = calculateProgressValue(
    item.current_page,
    totalPageCount,
  );
  const isDeletingCurrent = isDeleting && deletingUserBookId === item.id;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenBook(item.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenBook(item.id);
        }
      }}
      className="group border-border-default bg-bg-elevated hover:bg-bg-surface-hover has-[button[data-quick-action='true']:hover]:bg-bg-elevated has-[button[data-item-menu='true']:hover]:bg-bg-elevated focus-visible:ring-ring h-100 w-full cursor-pointer overflow-hidden rounded-xl border p-0 text-left whitespace-normal outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      <div className="grid h-full w-full grid-rows-5">
        <div className="bg-bg-surface-subtitle relative row-span-3 w-full overflow-hidden">
          <div className="absolute top-2 right-2 z-20 pointer-events-auto opacity-100 transition-opacity sm:pointer-events-none sm:opacity-0 sm:group-focus-within:pointer-events-auto sm:group-focus-within:opacity-100 sm:group-hover:pointer-events-auto sm:group-hover:opacity-100">
            <BookItemMenu
              bookTitle={item.book.title}
              onEdit={() => onOpenBook(item.id)}
              onDelete={() => onDelete(item.id)}
              isDeleting={isDeletingCurrent}
            />
          </div>

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
          <div className="h-15 min-w-0 shrink-0 overflow-hidden">
            <p className="typo-label-md text-text-primary line-clamp-2">
              {item.book.title}
            </p>
            <p className="typo-label-sm text-text-secondary mt-0.5 truncate">
              {item.book.author}
            </p>
          </div>

          <div className="h-8 shrink-0">
            {showQuickActions ? (
              <ReadingQuickActions
                disabled={isUpdatingStatus && pendingUserBookId === item.id}
                onComplete={() => onComplete(item.id)}
                onQuit={() => onQuit(item.id)}
              />
            ) : null}
          </div>

          {hasPageInfo ? (
            <div className="mt-auto shrink-0 space-y-1">
              <p className="typo-label-sm text-text-secondary">
                {currentPage} / {totalPageCount} 페이지
              </p>
              <Progress
                value={progressValue}
                className="bg-bg-surface-subtitle h-2"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

