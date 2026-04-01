import { AlertTriangle } from "lucide-react";
import type { LibraryFolder } from "@/shared/types/db";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LibraryDeleteFolderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetFolder: LibraryFolder | null;
  isPending: boolean;
  onConfirm: () => Promise<boolean> | boolean;
};

export default function LibraryDeleteFolderDialog({
  open,
  onOpenChange,
  targetFolder,
  isPending,
  onConfirm,
}: LibraryDeleteFolderDialogProps) {
  async function handleConfirm() {
    await onConfirm();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-bg-elevated sm:max-w-[440px]">
        <DialogHeader className="items-center text-center sm:text-center">
          <AlertTriangle
            aria-hidden="true"
            className="text-accent-red/80 mb-1 size-9"
          />
          <DialogTitle>폴더와 책을 삭제할까요?</DialogTitle>
          <DialogDescription>
            <span className="mb-1 flex items-center justify-center gap-2">
              <span
                aria-hidden
                className="bg-accent-indigo h-4 w-0.5 shrink-0 rounded-full"
              />
              <span className="text-text-primary block truncate font-semibold">
                {targetFolder?.name}
              </span>
            </span>
            폴더를 삭제하면 폴더 안의 책도 함께 삭제되며, 복구할 수 없습니다.
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
