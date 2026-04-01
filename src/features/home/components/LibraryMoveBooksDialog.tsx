import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UNFILED_VALUE } from "@/features/home/lib/librarySectionConstants";
import type { FolderOption } from "@/features/home/lib/types";

type LibraryMoveBooksDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  folderOptions: FolderOption[];
  isPending: boolean;
  onConfirm: (targetFolderId: string | null) => Promise<boolean> | boolean;
};

export default function LibraryMoveBooksDialog({
  open,
  onOpenChange,
  selectedCount,
  folderOptions,
  isPending,
  onConfirm,
}: LibraryMoveBooksDialogProps) {
  const [moveTarget, setMoveTarget] = useState(UNFILED_VALUE);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setMoveTarget(UNFILED_VALUE);
    }
    onOpenChange(nextOpen);
  }

  async function handleConfirm() {
    const isSuccess = await onConfirm(
      moveTarget === UNFILED_VALUE ? null : moveTarget,
    );
    if (isSuccess) {
      setMoveTarget(UNFILED_VALUE);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-bg-elevated sm:max-w-[420px]">
        <DialogHeader className="items-center text-center sm:text-center">
          <DialogTitle>폴더로 이동</DialogTitle>
          <DialogDescription>
            선택한 {selectedCount}권을 이동할 폴더를 선택하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-center">
          <Label htmlFor="move-target">이동할 위치</Label>
          <Select value={moveTarget} onValueChange={setMoveTarget}>
            <SelectTrigger id="move-target" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNFILED_VALUE}>미분류</SelectItem>
              {folderOptions.map((folder) => (
                <SelectItem key={folder.id} value={folder.id}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="flex-row justify-center sm:justify-center">
          <Button
            type="button"
            variant="dialogCancel"
            onClick={() => handleOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="dialogPositive"
            onClick={handleConfirm}
            disabled={isPending || selectedCount === 0}
          >
            이동
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
