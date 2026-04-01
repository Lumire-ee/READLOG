import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LibraryDeleteBooksDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  selectedBookTitle: string;
  isPending: boolean;
  onConfirm: () => Promise<void> | void;
};

export default function LibraryDeleteBooksDialog({
  open,
  onOpenChange,
  selectedCount,
  selectedBookTitle,
  isPending,
  onConfirm,
}: LibraryDeleteBooksDialogProps) {
  async function handleConfirm() {
    await onConfirm();
  }

  const baseTitle = selectedBookTitle.trim() || "선택한 책";
  const selectedLabel =
    selectedCount <= 0
      ? "선택한 책"
      : selectedCount === 1
        ? baseTitle
        : `${baseTitle} 외 ${selectedCount - 1}권`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-bg-elevated">
        <DialogHeader className="items-center text-center sm:text-center">
          <AlertTriangle
            aria-hidden="true"
            className="text-accent-red/80 mb-1 size-9"
          />
          <DialogTitle>선택한 책을 삭제할까요?</DialogTitle>
          <div className="mb-3 flex items-center justify-center gap-2">
            <span
              aria-hidden
              className="bg-accent-indigo h-4 w-0.5 shrink-0 rounded-full"
            />
            <span className="text-text-primary block truncate font-semibold">
              {selectedLabel}
            </span>
          </div>
          <DialogDescription>
            목록에서 삭제하면 기록하신 독서 활동 데이터가 함께 삭제되고,
            <br />
            다시 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-center sm:justify-center">
          <Button
            type="button"
            variant="dialogCancel"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="dialogDanger"
            disabled={isPending}
            onClick={handleConfirm}
          >
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
