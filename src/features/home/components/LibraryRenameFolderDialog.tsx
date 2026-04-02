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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LibraryRenameFolderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName: string;
  isPending: boolean;
  onConfirm: (name: string) => Promise<boolean> | boolean;
};

export default function LibraryRenameFolderDialog({
  open,
  onOpenChange,
  initialName,
  isPending,
  onConfirm,
}: LibraryRenameFolderDialogProps) {
  const [folderName, setFolderName] = useState(initialName);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setFolderName("");
    }
    onOpenChange(nextOpen);
  }

  async function handleConfirm() {
    const trimmedName = folderName.trim();
    if (!trimmedName) return;

    const isSuccess = await onConfirm(trimmedName);
    if (isSuccess) {
      setFolderName("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-bg-elevated sm:max-w-[460px]">
        <DialogHeader className="items-center text-center sm:text-center">
          <DialogTitle>폴더 이름 변경</DialogTitle>
          <DialogDescription>폴더 이름을 새로 입력해주세요.</DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5 text-center">
          <Label htmlFor="rename-folder-name">폴더 이름</Label>
          <Input
            id="rename-folder-name"
            variant="interactiveRow"
            type="text"
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            maxLength={30}
            placeholder="ex) 해리포터 시리즈, 좋아하는 책"
          />
        </div>

        <DialogFooter className="flex-row justify-center sm:justify-center">
          <Button
            type="button"
            variant="dialogCancel"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="dialogPositive"
            disabled={isPending || !folderName.trim()}
            onClick={handleConfirm}
          >
            변경
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
