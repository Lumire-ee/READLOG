import { useMemo, useState } from "react";
import type { UserBookWithInfo } from "@/shared/types/db";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resolveCoverUserBookId } from "@/features/home/lib/librarySectionSelectors";

type LibraryCreateFolderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBooks: UserBookWithInfo[];
  selectedCount: number;
  isPending: boolean;
  onConfirm: (args: {
    name: string;
    coverUserBookId: string;
  }) => Promise<boolean> | boolean;
};

export default function LibraryCreateFolderDialog({
  open,
  onOpenChange,
  selectedBooks,
  selectedCount,
  isPending,
  onConfirm,
}: LibraryCreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("");
  const [coverUserBookId, setCoverUserBookId] = useState("");

  function resetForm() {
    setFolderName("");
    setCoverUserBookId("");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  }

  const effectiveCoverUserBookId = useMemo(
    () => resolveCoverUserBookId(coverUserBookId, selectedBooks),
    [coverUserBookId, selectedBooks],
  );

  async function handleConfirm() {
    const trimmedName = folderName.trim();
    if (!trimmedName || !effectiveCoverUserBookId) return;

    const isSuccess = await onConfirm({
      name: trimmedName,
      coverUserBookId: effectiveCoverUserBookId,
    });
    if (isSuccess) {
      resetForm();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-bg-elevated sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>폴더 만들기</DialogTitle>
          <DialogDescription>
            선택한 책 중 대표 책을 고르면 폴더 이미지로 사용됩니다.
          </DialogDescription>
        </DialogHeader>

        {/* TODO: Input Style 조정 */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="folder-name">폴더 이름</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(event) => setFolderName(event.target.value)}
              maxLength={30}
              placeholder="예: 이번 달 완독"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cover-book">대표 책</Label>
            <Select
              value={effectiveCoverUserBookId}
              onValueChange={setCoverUserBookId}
            >
              <SelectTrigger id="cover-book" className="w-full">
                <SelectValue placeholder="대표 책을 선택하세요." />
              </SelectTrigger>
              <SelectContent>
                {selectedBooks.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.book.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={
              isPending ||
              selectedCount === 0 ||
              !folderName.trim() ||
              !effectiveCoverUserBookId
            }
          >
            생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
