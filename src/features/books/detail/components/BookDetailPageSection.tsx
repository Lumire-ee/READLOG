import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  BookDetailFormContent,
  BookDetailFormLabel,
  BookDetailFormRow,
} from "@/features/books/detail/components/BookDetailFormLayout";
import { Activity, Hash } from "lucide-react";

type Props = {
  currentPageText: string;
  pageCountText: string;
  pageCountError: string | null;
  progressValue: number;
  onCurrentPageTextChange: (text: string) => void;
  onCurrentPageBlur: (text: string) => void;
  onPageCountTextChange: (text: string) => void;
  onPageCountBlur: (text: string) => void;
};

export default function BookDetailPageSection({
  currentPageText,
  pageCountText,
  pageCountError,
  progressValue,
  onCurrentPageTextChange,
  onCurrentPageBlur,
  onPageCountTextChange,
  onPageCountBlur,
}: Props) {
  return (
    <>
      <BookDetailFormRow>
        <BookDetailFormLabel
          htmlFor="current-page"
          className="inline-flex items-center gap-1.5"
        >
          <Hash className="size-3.5" aria-hidden="true" />
          읽은 페이지
        </BookDetailFormLabel>
        <BookDetailFormContent>
          <Input
            id="current-page"
            variant="interactiveRow"
            type="text"
            inputMode="numeric"
            className="h-10 px-3"
            value={currentPageText}
            placeholder="비어 있음"
            onChange={(e) => onCurrentPageTextChange(e.target.value)}
            onBlur={(e) => onCurrentPageBlur(e.target.value)}
          />
        </BookDetailFormContent>
      </BookDetailFormRow>

      <BookDetailFormRow>
        <BookDetailFormLabel
          htmlFor="page-count"
          className="inline-flex items-center gap-1.5"
        >
          <Hash className="size-3.5" aria-hidden="true" />
          총 페이지
        </BookDetailFormLabel>
        <BookDetailFormContent>
          <Input
            id="page-count"
            variant="interactiveRow"
            type="text"
            inputMode="numeric"
            className="h-10 px-3"
            value={pageCountText}
            placeholder="비어 있음"
            aria-invalid={Boolean(pageCountError)}
            aria-describedby={pageCountError ? "page-count-error" : undefined}
            onChange={(e) => onPageCountTextChange(e.target.value)}
            onBlur={(e) => onPageCountBlur(e.target.value)}
          />
        </BookDetailFormContent>
      </BookDetailFormRow>

      {pageCountError ? (
        <BookDetailFormRow className="mt-1">
          <div aria-hidden />
          <p id="page-count-error" className="typo-label-sm text-status-danger px-1">
            {pageCountError}
          </p>
        </BookDetailFormRow>
      ) : null}

      <BookDetailFormRow>
        <BookDetailFormLabel
          htmlFor="progress"
          className="inline-flex items-center gap-1.5"
        >
          <Activity className="size-3.5" aria-hidden="true" />
          진행도
        </BookDetailFormLabel>
        <BookDetailFormContent className="flex h-10 items-center">
          <span className="typo-label-sm text-text-primary w-10 shrink-0 pl-3">
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
