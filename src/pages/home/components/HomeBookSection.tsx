import BookListRow from "@/features/books/components/BookListRow";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculateProgressValue } from "@/features/books/detail/lib/bookDetailFormRules";
import { toProxiedThumbnailSrc } from "@/features/books/lib/thumbnailProxy";
import { updateUserBook } from "@/features/books/detail/api/userBookApi";
import { THUMB_SIZES } from "@/shared/constants/thumbnail";
import type { UserBookWithInfo } from "@/shared/types/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Slash } from "lucide-react";
import type { ReactNode } from "react";

type HomeBookSectionProps = {
  title: string;
  loading: boolean;
  isError: boolean;
  items: UserBookWithInfo[];
  emptyText: string;
  onOpenBook: (userBookId: string) => void;
  renderRight?: (item: UserBookWithInfo) => ReactNode;
  layout?: "row" | "card";
  showQuickActions?: boolean;
};

export default function HomeBookSection({
  title,
  loading,
  isError,
  items,
  emptyText,
  onOpenBook,
  renderRight,
  layout = "row",
  showQuickActions = false,
}: HomeBookSectionProps) {
  const isCardLayout = layout === "card";
  const qc = useQueryClient();

  const {
    mutate: updateStatus,
    variables: pendingVariables,
    isPending: isUpdatingStatus,
  } = useMutation({
    mutationFn: async ({
      userBookId,
      status,
    }: {
      userBookId: string;
      status: "completed" | "quit";
    }) => updateUserBook(userBookId, { status }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["userBooks"] });
      qc.invalidateQueries({
        queryKey: ["userBookDetail", variables.userBookId],
      });
    },
  });

  return (
    <div>
      <h2 className="typo-heading-sm text-text-primary">{title}</h2>
      <div className="mt-4">
        {loading ? (
          <>
            {isCardLayout ? (
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
            ) : (
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
            )}
          </>
        ) : isError ? (
          <p className="typo-label-sm text-status-danger">
            책 목록을 불러오지 못했습니다.
          </p>
        ) : items.length === 0 ? (
          <p className="typo-label-sm text-text-secondary">{emptyText}</p>
        ) : (
          <>
            {isCardLayout ? (
              <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                  const totalPageCount =
                    item.page_count_override ?? item.book.page_count;
                  const currentPage = item.current_page ?? 0;
                  const hasPageInfo =
                    item.current_page !== null &&
                    totalPageCount !== null &&
                    totalPageCount > 0;
                  const progressValue = calculateProgressValue(
                    item.current_page,
                    totalPageCount,
                  );

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
                            src={toProxiedThumbnailSrc(
                              item.book.thumbnail,
                              THUMB_SIZES.LARGE,
                            )}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
                          />
                          <img
                            src={toProxiedThumbnailSrc(
                              item.book.thumbnail,
                              THUMB_SIZES.LARGE,
                            )}
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
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                data-quick-action="true"
                                className="hover:bg-bg-surface-hover bg-transparent"
                                disabled={
                                  isUpdatingStatus &&
                                  pendingVariables?.userBookId === item.id
                                }
                                onClick={(event) => {
                                  event.stopPropagation();
                                  updateStatus({
                                    userBookId: item.id,
                                    status: "completed",
                                  });
                                }}
                              >
                                <Check className="size-3.5" />
                                완독
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                data-quick-action="true"
                                className="hover:bg-bg-surface-hover bg-transparent"
                                disabled={
                                  isUpdatingStatus &&
                                  pendingVariables?.userBookId === item.id
                                }
                                onClick={(event) => {
                                  event.stopPropagation();
                                  updateStatus({
                                    userBookId: item.id,
                                    status: "quit",
                                  });
                                }}
                              >
                                <Slash className="size-3.5" />
                                중단
                              </Button>
                            </div>
                          ) : null}

                          {hasPageInfo ? (
                            <div className="mt-auto space-y-1">
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
                    </Button>
                  );
                })}
              </div>
            ) : (
              <div className="grid w-full min-w-0 gap-2 md:grid-cols-2">
                {items.map((item) => (
                  <BookListRow
                    key={item.id}
                    thumbnail={item.book.thumbnail!}
                    title={item.book.title}
                    author={item.book.author}
                    onClick={() => onOpenBook(item.id)}
                    right={renderRight?.(item)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

