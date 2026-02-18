import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  BookDetailFormContent,
  BookDetailFormLabel,
  BookDetailFormRow,
} from "@/features/books/detail/components/BookDetailFormLayout";

type Props = {
  currentPageText: string;
  pageCountText: string;
  progressValue: number;
  onCurrentPageTextChange: (text: string) => void;
  onPageCountTextChange: (text: string) => void;
};

export default function BookDetailPageSection({
  currentPageText,
  pageCountText,
  progressValue,
  onCurrentPageTextChange,
  onPageCountTextChange,
}: Props) {
  return (
    <>
      <BookDetailFormRow>
        <BookDetailFormLabel>읽은 페이지</BookDetailFormLabel>
        <BookDetailFormContent>
          <Input
            variant="detailModal"
            type="text"
            inputMode="numeric"
            className="h-10 px-3"
            value={currentPageText}
            placeholder="비어 있음"
            onChange={(e) => onCurrentPageTextChange(e.target.value)}
          />
        </BookDetailFormContent>
      </BookDetailFormRow>

      <BookDetailFormRow>
        <BookDetailFormLabel>총 페이지</BookDetailFormLabel>
        <BookDetailFormContent>
          <Input
            variant="detailModal"
            type="text"
            inputMode="numeric"
            className="h-10 px-3"
            value={pageCountText}
            placeholder="비어 있음"
            onChange={(e) => onPageCountTextChange(e.target.value)}
          />
        </BookDetailFormContent>
      </BookDetailFormRow>

      <BookDetailFormRow>
        <BookDetailFormLabel>진행도</BookDetailFormLabel>
        <BookDetailFormContent className="flex h-10 items-center">
          <span className="typo-label-sm text-text-secondary w-10 shrink-0 pl-3">
            {progressValue}%
          </span>
          <Progress
            value={progressValue}
            className="bg-bg-surface-subtitle mx-2 h-2 flex-1"
          />
        </BookDetailFormContent>
      </BookDetailFormRow>
    </>
  );
}

