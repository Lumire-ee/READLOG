import { Button } from "@/components/ui/button";
import type { UserBookWithInfo } from "@/shared/types/db";
import { useBookDetailForm } from "@/features/books/detail/hooks/useBookDetailForm";
import { useBookDetailDateFields } from "@/features/books/detail/hooks/useBookDetailDateFields";
import { useUpdateUserBook } from "@/features/books/detail/hooks/useUpdateUserBook";
import { useBookDetailModalStore } from "@/features/books/detail/store/useBookDetailModalStore";
import { calculateProgressValue } from "@/features/books/detail/lib/bookDetailFormRules";
import BookDetailDateSection from "./BookDetailDateSection";
import BookDetailNotesSection from "./BookDetailNotesSection";
import BookDetailPageSection from "./BookDetailPageSection";
import BookDetailRatingSection from "./BookDetailRatingSection";
import BookDetailStatusSection from "./BookDetailStatusSection";

type Props = {
  userBookId: string;
  data: UserBookWithInfo;
};

export default function BookDetailForm({ userBookId, data }: Props) {
  const closeModal = useBookDetailModalStore((state) => state.close);
  const {
    form,
    currentPageText,
    pageCountText,
    totalPageCount,
    patch,
    isDirty,
    onStatusChange,
    onCurrentPageTextChange,
    onPageCountTextChange,
    onRatingToggle,
    onStartDateChange,
    onEndDateChange,
    onNotesChange,
  } = useBookDetailForm({ data });
  const { mutate, isPending } = useUpdateUserBook(userBookId);

  const progressValue = calculateProgressValue(
    form.current_page,
    totalPageCount,
  );
  const {
    startDate,
    endDate,
    isStartDateOpen,
    isEndDateOpen,
    setIsStartDateOpen,
    setIsEndDateOpen,
    isStartDateDisabled,
    isEndDateDisabled,
  } = useBookDetailDateFields({
    startDateText: form.start_date,
    endDateText: form.end_date,
  });

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <BookDetailStatusSection
          status={form.status}
          onStatusChange={onStatusChange}
        />

        <BookDetailPageSection
          currentPageText={currentPageText}
          pageCountText={pageCountText}
          progressValue={progressValue}
          onCurrentPageTextChange={onCurrentPageTextChange}
          onPageCountTextChange={onPageCountTextChange}
        />

        <BookDetailRatingSection
          rating={form.rating}
          onRatingToggle={onRatingToggle}
        />

        <BookDetailDateSection
          startDate={startDate}
          endDate={endDate}
          isStartDateOpen={isStartDateOpen}
          isEndDateOpen={isEndDateOpen}
          setIsStartDateOpen={setIsStartDateOpen}
          setIsEndDateOpen={setIsEndDateOpen}
          isStartDateDisabled={isStartDateDisabled}
          isEndDateDisabled={isEndDateDisabled}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
        />

        <BookDetailNotesSection
          notes={form.notes_md}
          onNotesChange={onNotesChange}
        />
      </div>

      <div className="shrink-0 space-y-2">
        <Button
          type="button"
          className="w-full"
          disabled={!isDirty || isPending}
          onClick={() =>
            mutate(patch, {
              onSuccess: () => {
                closeModal();
              },
            })
          }
        >
          저장
        </Button>
      </div>
    </div>
  );
}

