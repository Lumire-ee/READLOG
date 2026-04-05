import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  BookDetailFormContent,
  BookDetailFormFullRow,
  BookDetailFormLabel,
  BookDetailFormRow,
} from "@/features/books/detail/components/BookDetailFormLayout";
import DemoBookCover from "@/features/landing/components/DemoBookCover";
import {
  DEMO_DETAIL_PAGE_COUNT,
  DEMO_DETAIL_START_DATE,
} from "@/features/landing/lib/heroSearchFlowConstants";
import type {
  DemoSearchBook,
  DetailPhase,
} from "@/features/landing/lib/heroSearchFlowTypes";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  CalendarCheck2,
  CalendarPlus,
  ChevronDown,
  Hash,
  Star,
  Tag,
} from "lucide-react";

type Props = {
  selectedBook: DemoSearchBook;
  detailPhase: DetailPhase;
  detailCurrentPageText: string;
  detailRating: number | null;
  detailNotes: string;
};

function getDetailScrollY(phase: DetailPhase): string {
  if (phase === "scrolling" || phase === "typingNotes") return "-24%";
  return "0%";
}

export default function DetailFlowScene({
  selectedBook,
  detailPhase,
  detailCurrentPageText,
  detailRating,
  detailNotes,
}: Props) {
  const ratingValue = detailRating ?? 0;
  const detailScrollY = getDetailScrollY(detailPhase);
  const displayProgress =
    detailPhase === "prefilled" || detailPhase === "typingPage" ? 0 : 31;

  return (
    <div className="h-full w-full overflow-hidden">
      <motion.div
        animate={{ y: detailScrollY }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.35, 1] }}
        className="w-full"
      >
        <div className="bg-bg-elevated border-border-skeleton mx-auto w-full max-w-[640px] rounded-xl border p-4 sm:p-5">
          <div className="w-full min-w-0 space-y-4">
            <div className="flex gap-4 px-3 sm:gap-10">
              <DemoBookCover
                bookId={selectedBook.id}
                className="h-20 w-14 rounded-sm object-cover"
              />

              <div className="flex min-w-0 flex-col justify-between py-1">
                <div>
                  <p className="typo-heading-md text-text-primary truncate">
                    {selectedBook.title}
                  </p>
                </div>
                <div>
                  <p className="typo-label-sm text-text-secondary truncate">
                    {selectedBook.author}
                  </p>
                  <p className="typo-label-sm text-text-secondary truncate">
                    {selectedBook.publisher}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <BookDetailFormRow>
                  <BookDetailFormLabel className="inline-flex items-center gap-1.5">
                    <Tag className="size-3.5" aria-hidden="true" />
                    상태
                  </BookDetailFormLabel>
                  <BookDetailFormContent>
                    <div className="bg-bg-surface flex h-10 w-full items-center justify-between rounded-md px-3">
                      <Badge variant="reading">
                        <BookOpen />
                        읽는 중
                      </Badge>
                      <ChevronDown
                        className="text-text-secondary size-4"
                        aria-hidden="true"
                      />
                    </div>
                  </BookDetailFormContent>
                </BookDetailFormRow>

                <BookDetailFormRow>
                  <BookDetailFormLabel
                    htmlFor="demo-current-page"
                    className="inline-flex items-center gap-1.5"
                  >
                    <Hash className="size-3.5" aria-hidden="true" />
                    읽은 페이지
                  </BookDetailFormLabel>
                  <BookDetailFormContent>
                    <div className="bg-bg-surface h-10 w-full rounded-md px-3">
                      <span className="typo-label-sm text-text-primary inline-flex h-full items-center">
                        {detailCurrentPageText}
                      </span>
                    </div>
                  </BookDetailFormContent>
                </BookDetailFormRow>

                <BookDetailFormRow>
                  <BookDetailFormLabel
                    htmlFor="demo-total-page"
                    className="inline-flex items-center gap-1.5"
                  >
                    <Hash className="size-3.5" aria-hidden="true" />총 페이지
                  </BookDetailFormLabel>
                  <BookDetailFormContent>
                    <div className="bg-bg-surface h-10 w-full rounded-md px-3">
                      <span className="typo-label-sm text-text-primary inline-flex h-full items-center">
                        {DEMO_DETAIL_PAGE_COUNT}
                      </span>
                    </div>
                  </BookDetailFormContent>
                </BookDetailFormRow>

                <BookDetailFormRow>
                  <BookDetailFormLabel className="inline-flex items-center gap-1.5">
                    <Activity className="size-3.5" aria-hidden="true" />
                    진행률
                  </BookDetailFormLabel>
                  <BookDetailFormContent className="flex h-10 items-center">
                    <span className="typo-label-sm text-text-primary w-10 shrink-0 pl-3">
                      {displayProgress}%
                    </span>
                    <Progress
                      value={displayProgress}
                      className="bg-bg-surface-subtitle mx-2 h-2 flex-1"
                    />
                  </BookDetailFormContent>
                </BookDetailFormRow>

                <BookDetailFormRow>
                  <BookDetailFormLabel className="inline-flex items-center gap-1.5">
                    <Star className="size-3.5" aria-hidden="true" />
                    평점
                  </BookDetailFormLabel>
                  <BookDetailFormContent className="flex h-10 items-center gap-1 pl-1">
                    {Array.from({ length: 5 }, (_, index) => {
                      const active = index + 1 <= ratingValue;
                      return (
                        <span
                          key={index}
                          className="inline-flex h-7 w-7 items-center justify-center lg:h-8 lg:w-8"
                        >
                          <Star
                            className={cn(
                              "h-4 w-4 lg:h-5 lg:w-5",
                              active
                                ? "fill-accent-yellow text-accent-yellow"
                                : "text-text-tertiary",
                            )}
                          />
                        </span>
                      );
                    })}
                  </BookDetailFormContent>
                </BookDetailFormRow>

                <BookDetailFormRow>
                  <BookDetailFormLabel className="inline-flex items-center gap-1.5">
                    <CalendarPlus className="size-3.5" aria-hidden="true" />
                    시작일
                  </BookDetailFormLabel>
                  <BookDetailFormContent>
                    <div className="bg-bg-surface h-10 w-full rounded-md px-3">
                      <span className="typo-label-sm text-text-primary inline-flex h-full items-center">
                        {DEMO_DETAIL_START_DATE}
                      </span>
                    </div>
                  </BookDetailFormContent>
                </BookDetailFormRow>

                <BookDetailFormRow>
                  <BookDetailFormLabel className="inline-flex items-center gap-1.5">
                    <CalendarCheck2 className="size-3.5" aria-hidden="true" />
                    종료일
                  </BookDetailFormLabel>
                  <BookDetailFormContent>
                    <div className="bg-bg-surface h-10 w-full rounded-md px-3">
                      <span className="typo-label-sm text-text-secondary inline-flex h-full items-center">
                        비어 있음
                      </span>
                    </div>
                  </BookDetailFormContent>
                </BookDetailFormRow>

                <BookDetailFormRow>
                  <BookDetailFormFullRow>
                    <Separator className="mb-5" />
                    <Textarea
                      className="max-h-48 min-h-24 resize-none overflow-hidden"
                      readOnly
                      value={detailNotes}
                    />
                  </BookDetailFormFullRow>
                </BookDetailFormRow>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
