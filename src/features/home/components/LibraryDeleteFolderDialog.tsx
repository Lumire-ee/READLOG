import { useState } from "react";
import type { LibraryFolder } from "@/shared/types/db";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  onConfirm: (deleteBooks: boolean) => Promise<boolean> | boolean;
};

export default function LibraryDeleteFolderDialog({
  open,
  onOpenChange,
  targetFolder,
  isPending,
  onConfirm,
}: LibraryDeleteFolderDialogProps) {
  const [isDeleteBooksConfirmOpen, setIsDeleteBooksConfirmOpen] =
    useState(false);

  function handleMainDialogOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setIsDeleteBooksConfirmOpen(false);
    }
    onOpenChange(nextOpen);
  }

  async function handleDeleteFolderOnly() {
    await onConfirm(false);
  }

  async function handleDeleteFolderWithBooks() {
    const isSuccess = await onConfirm(true);
    if (isSuccess) {
      setIsDeleteBooksConfirmOpen(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleMainDialogOpenChange}>
        <DialogContent className="bg-bg-elevated sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>폴더를 삭제할까요?</DialogTitle>
            <DialogDescription>
              <span className="mb-1 flex items-center gap-2">
                <span
                  aria-hidden
                  className="bg-accent-indigo h-4 w-0.5 shrink-0 rounded-full"
                />
                <span className="text-text-primary block truncate font-semibold">
                  {targetFolder?.name}
                </span>
              </span>
              폴더만 삭제하거나, 폴더와 책을 함께 삭제할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={handleDeleteFolderOnly}
            >
              폴더만 삭제
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                handleMainDialogOpenChange(false);
                setIsDeleteBooksConfirmOpen(true);
              }}
            >
              폴더와 책 삭제
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={() => handleMainDialogOpenChange(false)}
            >
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteBooksConfirmOpen}
        onOpenChange={setIsDeleteBooksConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>폴더와 책을 함께 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={handleDeleteFolderWithBooks}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
