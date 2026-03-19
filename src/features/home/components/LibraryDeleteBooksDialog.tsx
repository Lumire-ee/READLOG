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

type LibraryDeleteBooksDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  isPending: boolean;
  onConfirm: () => Promise<void> | void;
};

export default function LibraryDeleteBooksDialog({
  open,
  onOpenChange,
  selectedCount,
  isPending,
  onConfirm,
}: LibraryDeleteBooksDialogProps) {
  async function handleConfirm() {
    await onConfirm();
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>선택한 책을 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            선택한 책 {selectedCount}권의 기록이 삭제되며 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleConfirm}>
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
