import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBookDetailModalStore } from "@/features/books/detail/store/useBookDetailModalStore";
import BookDetailModalContent from "./BookDetailModalContent";

export default function BookDetailModalHost() {
  const { isOpen, selectedUserBookId, close } = useBookDetailModalStore();

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) close();
      }}
    >
      <DialogContent className="bg-bg-elevated min-h-80 sm:max-w-[420px]">
        {/* 접근성 경고 대응용 title, description */}
        <DialogTitle className="sr-only">책 상세 정보</DialogTitle>
        <DialogDescription className="sr-only">
          선택한 책의 상태와 메모를 확인하거나 수정합니다.
        </DialogDescription>

        {selectedUserBookId ? (
          <BookDetailModalContent userBookId={selectedUserBookId} />
        ) : (
          <p className="typo-label-sm text-text-secondary">
            선택된 책이 없습니다.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

