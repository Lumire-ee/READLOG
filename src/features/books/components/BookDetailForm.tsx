import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { EditableUserBookFields } from "@/features/books/lib/types";
import type { UserBookWithInfo } from "@/shared/types/db";
import { Star } from "lucide-react";
import { useBookDetailForm } from "@/features/books/hooks/useBookDetailForm";
import { useUpdateUserBook } from "@/features/books/hooks/useUpdateUserBook";
import { Progress } from "@/components/ui/progress";
import { useBookDetailModalStore } from "@/features/books/store/useBookDetailModalStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const currentPage = Math.max(form.current_page ?? 0, 0);
  const safeTotalPageCount = totalPageCount ?? 0;
  const boundedCurrentPage =
    safeTotalPageCount > 0 ? Math.min(currentPage, safeTotalPageCount) : 0;
  const progressValue =
    safeTotalPageCount > 0
      ? Math.round((boundedCurrentPage / safeTotalPageCount) * 100)
      : 0;
  const todayKST = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(new Date());

  const rowLabelClassName =
    "typo-label-sm text-text-secondary w-24 shrink-0 pt-2 sm:w-28";
  const rowContentClassName = "min-w-0 flex-1";

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Label className={rowLabelClassName}>상태</Label>
          <div className={rowContentClassName}>
            <Select
              value={form.status}
              onValueChange={(value) =>
                onStatusChange(value as EditableUserBookFields["status"])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="to_read">읽기 전</SelectItem>
                <SelectItem value="reading">읽는 중</SelectItem>
                <SelectItem value="completed">완독</SelectItem>
                <SelectItem value="quit">중단</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Label className={rowLabelClassName}>읽은 페이지</Label>
          <div className={rowContentClassName}>
            <Input
              type="text"
              inputMode="numeric"
              value={currentPageText}
              placeholder="-"
              onChange={(e) => onCurrentPageTextChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Label className={rowLabelClassName}>총 페이지</Label>
          <div className={rowContentClassName}>
            <Input
              type="number"
              value={pageCountText}
              placeholder="-"
              onChange={(e) => onPageCountTextChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Label className={`${rowLabelClassName} pt-0`}>진행도</Label>
          <div className={`${rowContentClassName} flex items-center gap-2`}>
            <span className="typo-label-sm text-text-secondary w-10 shrink-0">
              {progressValue}%
            </span>
            <Progress
              value={progressValue}
              className="bg-bg-surface-subtitle h-2 flex-1"
            />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Label className={rowLabelClassName}>평점</Label>
          <div className={`${rowContentClassName} flex items-center gap-1`}>
            {Array.from({ length: 5 }, (_, i) => {
              const value = i + 1;
              const active = form.rating !== null && form.rating >= value;

              return (
                <Button
                  key={value}
                  type="button"
                  variant="iconGhost"
                  size="icon-sm"
                  onClick={() => onRatingToggle(value)}
                >
                  <Star
                    className={`h-5 w-5 transition ${
                      active
                        ? "fill-accent-yellow text-accent-yellow"
                        : "text-text-tertiary"
                    }`}
                  />
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Label className={rowLabelClassName}>시작일</Label>
          <div className={rowContentClassName}>
            <Input
              type="date"
              value={form.start_date ?? ""}
              max={todayKST}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Label className={rowLabelClassName}>종료일</Label>
          <div className={rowContentClassName}>
            <Input
              type="date"
              value={form.end_date ?? ""}
              min={form.start_date ?? undefined}
              max={todayKST}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className={rowContentClassName}>
            <Separator className="mb-3" />
            <textarea
              className="border-border-default bg-bg-surface typo-body-sm text-text-primary min-h-24 w-full resize-none rounded-md border px-3 py-2"
              value={form.notes_md ?? ""}
              placeholder="읽으면서 남기고 싶은 메모를 작성해보세요."
              onChange={(e) => onNotesChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
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
